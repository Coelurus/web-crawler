import Record from './Record'
import '../css/table.css'
import { Dispatch, SetStateAction, useState } from 'react'
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

    // sort by url
    if (sortByUrl){
        records.sort((a,b) => a.url.localeCompare(b.url))
    }
    else{// sort by last execution
        records.sort((a,b) => {
            
            if (a.lastExecution !== undefined && b.lastExecution !== undefined){

                return a.lastExecution.getTime() - b.lastExecution.getTime()
            }
            else{
                return Number.MIN_SAFE_INTEGER
            }
        })
    }
    
    function calcPageCount(itemsPerPage:number, itemsCount:number): number{
        if (itemsCount%itemsPerPage === 0) return itemsCount/itemsPerPage
        return Math.floor(itemsCount/itemsPerPage)+1
    }

    function changeActiveRecord(record_id: number){
        if (isActive(record_id)) {
            setActiveRecordIds(prev => prev.filter(record_id_item => record_id_item !== record_id))
        }
        else { 
            setActiveRecordIds(prev => [...prev, record_id]) 
        }
        setChange(prevState => !prevState)
    }

    function isActive(record_id: number){
        return activeRecordIds.includes(record_id)
    }

    return(
        <>
            <table>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Tags</th>
                        <th>Periodicity</th>
                        <th>Time of execution</th>
                        <th>Last execution</th>
                        {/* <th>Status of last execution</th> */}
                        <th>View in graph</th>
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
                            <td>{record.timeOfExecution && record.timeOfExecution}</td>
                            <td>{record.lastExecution && new Date(record.lastExecution).toLocaleString('cs-CZ', {year: 'numeric',month: 'short',day: 'numeric',hour: '2-digit',minute: '2-digit'})}</td>
                            {/* <td>{record.}</td> */}
                            <td><input type="checkbox" name="" id={'checkbox-' + record.id} checked={isActive(record.id)} onChange={() => changeActiveRecord(record.id)} /></td>
                            <td><button onClick={() => setEditingRecord(record)}>Edit</button></td>
                            <td><button onClick={() => {deleteRecord(record.id); setChange(prevState => !prevState)}}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <span id='curr-page'>{currentPage}/{calcPageCount(itemsPerPage, searchRecords.length)}</span><br/>
                {currentPage !== 1 &&
                    <button id="prev-btn" onClick={() => 
                        {//TODO: změna search nezmění current page => prázdná stránka
                            if (currentPage > calcPageCount(itemsPerPage, searchRecords.length))
                                {setCurrentPage(1)}
                            else
                                {setCurrentPage(currentPage-1)}
                            
                        }}>Previous</button>
                }
                {currentPage < calcPageCount(itemsPerPage, searchRecords.length) &&
                    <button id="next-btn" onClick={() => 
                        {
                        if (currentPage > calcPageCount(itemsPerPage, searchRecords.length))
                            {setCurrentPage(1)}
                        else
                            {setCurrentPage(currentPage+1)}
                        
                        }}>Next</button>
                }<br/>
                
            </div>
        </>
    )
}