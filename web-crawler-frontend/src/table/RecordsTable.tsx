import Record from '../data-classes/Record'
import '../css/table.css'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { deleteRecord } from '../data-service'

type RecordsTableProps = {
    records:Array<Record>, 
    activeRecordIds: Array<number>,
    setActiveRecordIds: Dispatch<SetStateAction<number[]>>,
    itemsPerPage:number, 
    sortByUrl:boolean, 
    searchLabel:string, 
    searchUrl:string, 
    searchTags:string[], 
    setEditingRecord:Dispatch<SetStateAction<Record|null>>, 
    setChange:Dispatch<SetStateAction<boolean>>
}

export default function RecordsTable({records, activeRecordIds, setActiveRecordIds, itemsPerPage, sortByUrl, searchLabel, searchUrl, searchTags, setEditingRecord, setChange}: RecordsTableProps){
    const [currentPage, setCurrentPage] = useState(1)

    
    const searchRecords = records.filter(record => 
        record.label.includes(searchLabel) && 
        record.url.includes(searchUrl) && 
        (record.tags.map<string>(tag=>tag.name).some(tag => {
            return searchTags.includes(tag)
        }) || searchTags.length === 0)
    )
    const currentItems = searchRecords.slice((currentPage-1)*itemsPerPage, currentPage*(itemsPerPage))
    const totalPages = calcPageCount(itemsPerPage, searchRecords.length)

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
            setActiveRecordIds(prev => prev.filter(record_id_item => record_id_item !== recordId))
        }
        else { 
            setActiveRecordIds(prev => [...prev, recordId]) 
        }
        setChange(prevState => !prevState)
    }

    async function deleteRecordFromTable(recordId: number){
        await deleteRecord(recordId)
        setChange(prevState => !prevState)
    } 

    function inActiveSelection(recordId: number){
        return activeRecordIds.includes(recordId)
    }

    function getTime(startTime: Date, endTime: Date) : string {
        const timeOfExecMilliseconds: number = endTime.getTime() - startTime.getTime()
        const minutes = Math.floor(timeOfExecMilliseconds / (1000 * 60))
        const seconds = Math.floor((timeOfExecMilliseconds % (1000 * 60)) / 1000)
        return `${minutes}m ${seconds}s`
    }

    async function toggleActive(record: Record, newValue: boolean){
        const formData = new FormData()
        formData.set('active', newValue.toString())
        formData.set('label', record.label)
        formData.set('url', record.url)
        formData.set('boundaryRegExp', record.boundaryRegExp)
        const periodicity = `${record.periodicity.day}:${record.periodicity.hour}:${record.periodicity.minute}`
        formData.set('periodicity', periodicity)
        formData.set('tags', JSON.stringify(record.tags.map(tag => tag.name)))
        formData.set('crawledData', JSON.stringify(record.crawledData))
        

        try{
            await fetch(`/api/websites/${record.id}`, {
                method: 'PUT',
                body: formData
            })

            setChange(prev => !prev)
        }
        catch (error){
            console.error('Failed to update active status', error)
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
                            <td>{record.lastExecution && record.lastExecution.endTime && getTime(new Date(record.lastExecution.startTime), new Date(record.lastExecution.endTime))}</td>
                            <td>{record.lastExecution && new Date(record.lastExecution.startTime).toLocaleString('cs-CZ', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'})}</td>
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
                        {//TODO: změna search nezmění current page => prázdná stránka
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