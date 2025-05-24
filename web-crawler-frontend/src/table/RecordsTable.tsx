import Record from '../data-classes/Record'
import '../css/table.css'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { deleteRecord, editRecord } from '../data-service'
import toast from 'react-hot-toast'

type RecordsTableProps = {
    records:Array<Record>, 
    activeRecordIds: Array<number>,
    setActiveRecordIds: Dispatch<SetStateAction<number[]>>,
    itemsPerPage:number, 
    searchLabel:string, 
    searchUrl:string, 
    searchTags:string[], 
    setEditingRecord:Dispatch<SetStateAction<Record|null>>, 
    setChange:Dispatch<SetStateAction<boolean>>
}

export default function RecordsTable({records, activeRecordIds, setActiveRecordIds, itemsPerPage, searchLabel, searchUrl, searchTags, setEditingRecord, setChange}: RecordsTableProps){
    const [currentPage, setCurrentPage] = useState(1)

    
    const filteredRecords = records.filter(record => 
        record.label.includes(searchLabel) && 
        record.url.includes(searchUrl) && 
        (record.tags.map<string>(tag=>tag.name).some(tag => {
            return searchTags.includes(tag)
        }) || searchTags.length === 0)
    )
    const currentItems = filteredRecords.slice((currentPage-1)*itemsPerPage, currentPage*(itemsPerPage))
    const totalPages = calcPageCount(itemsPerPage, filteredRecords.length)

    useEffect(() => {
        if (currentPage > totalPages) {
        setCurrentPage(1);
        }
    }, [currentPage, totalPages]);
   
    function calcPageCount(itemsPerPage:number, itemsCount:number): number{
        if (itemsCount%itemsPerPage === 0) return itemsCount/itemsPerPage
        return Math.floor(itemsCount/itemsPerPage)+1
    }

    function changeActiveRecord(recordId: number){
        if (inActiveSelection(recordId)) {
            setActiveRecordIds(prev => prev.filter(recordIdItem => recordIdItem !== recordId))
        }
        else { 
            setActiveRecordIds(prev => [...prev, recordId]) 
        }
        setChange(prevState => !prevState)
    }

    async function deleteRecordFromTable(recordId: number){
        try {
            const deletePromise = deleteRecord(recordId)
            toast.promise(deletePromise, {
                loading: 'Loading...',
                success: 'Record deleted!',
                error: 'Failed to delete a record'
            })
            await deletePromise
            setChange(prevState => !prevState)
        }
        catch (error) {
            console.error(error)
        }
    } 

    function inActiveSelection(recordId: number){
        return activeRecordIds.includes(recordId)
    }

    function duration(start: Date, end?: Date): string {
        const startTime = new Date(start);
        const endTime = end ? new Date(end) : new Date();

        const diffMs = endTime.getTime() - startTime.getTime();

        if (diffMs < 0) return "0m 0s"; 

        const minutes = Math.floor(diffMs / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${minutes}m ${seconds}s`;
    }

    async function toggleActive(record: Record, newValue: boolean){
        record.active = newValue
        try{
            const editPromise = editRecord(record)
            toast.promise(editPromise, {
                loading: 'Loading...',
                success: "Record's active status changed!",
                error: 'Failed to change the active status'
            })
            await editPromise
            setChange(prev => !prev)
        }
        catch (error){
            console.error(error)
        }
    }

    return(
        <>
            <table>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Tags</th>
                        <th>Periodicity</th>
                        <th>Execution time</th>
                        <th>Last execution</th>
                        <th>Status</th>
                        <th>View in graph</th>
                        <th>Active</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((record:Record) =>(
                        <tr key={record.id}>
                            <td>{record.label}</td>
                            <td>{record.tags.map(tag => (
                                <span key={tag.id} className='tag'>{tag.name}</span>
                            ))}</td>
                            <td>{record.periodicity.day}d {record.periodicity.hour}h {record.periodicity.minute}m</td>
                            <td>{record.lastExecution?.startTime && duration(record.lastExecution.startTime, record.lastExecution.endTime)}</td>
                            <td>{record.lastExecution && record.lastExecution.startTime.toLocaleString('cs-CZ', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'})}</td>
                            <td>{record.lastExecution && record.lastExecution.status}</td>
                            <td><input type="checkbox" name="" id={'active-select-' + record.id} checked={inActiveSelection(record.id)} onChange={() => changeActiveRecord(record.id)} /></td>
                            <td><input type="checkbox" checked={record.active} onChange={(e) => toggleActive(record, e.target.checked)}/></td>
                            <td><button onClick={() => setEditingRecord(record)}>Edit</button></td>
                            <td><button onClick={() => deleteRecordFromTable(record.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {totalPages !== 0 && <span id='curr-page'>Page {currentPage} out of {totalPages}</span>}
                {totalPages === 0 && <span>No records found</span>}
                <br/>
                {currentPage !== 1 &&
                    <button id="prev-btn" onClick={() => 
                        {
                            if (currentPage > totalPages)
                                {setCurrentPage(1)}
                            else
                                {setCurrentPage(currentPage-1)}
                            
                        }}>Previous</button>
                }
                {currentPage < totalPages &&
                    <button id="next-btn" onClick={() => 
                        {
                        if (currentPage > totalPages)
                            {setCurrentPage(1)}
                        else
                            {setCurrentPage(currentPage+1)}
                        
                        }}>Next</button>
                }<br/>
                
            </div>
        </>
    )
}