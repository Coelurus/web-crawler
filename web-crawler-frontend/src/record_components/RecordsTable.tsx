import Record from './Record'
import '../css/table.css'
import { useState } from 'react'
export default function RecordsTable({records, itemsPerPage, sortByUrl, searchLabel, searchUrl}: {records:Array<Record>, itemsPerPage:number, sortByUrl:boolean, searchLabel:string, searchUrl:string}){
    const [currentPage, setCurrentPage] = useState(1)

    const searchRecords = records.filter(record => record.label.includes(searchLabel) && record.url.includes(searchUrl))
    const currentItems = searchRecords.slice((currentPage-1)*itemsPerPage, currentPage*(itemsPerPage))

    // sort by url
    if (sortByUrl){
        records.sort((a,b) => a.url.localeCompare(b.url))
    }
    
    function calcPageCount(itemsPerPage:number, itemsCount:number): number{
        if (itemsCount%itemsPerPage === 0) return itemsCount/itemsPerPage
        return Math.floor(itemsCount/itemsPerPage)+1
    }

    function deleteRecord(id:number){

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
                            <td>{record.periodicity}</td>
                            <td>{record.timeOfExecution}</td>
                            <td>{record.lastExecution.toDateString()}</td>
                            <td><input type="checkbox" name="" id={'checkbox-' + record.id} /></td>
                            <td><button>Edit</button></td>
                            <td><button onClick={() => deleteRecord(record.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <span id='curr-page'>page: {currentPage}</span><br/>
                {currentPage !== 1 &&
                    <button id="prev-btn" onClick={() => 
                        {//TODO: změna search nezmění current page => prázdná stránka
                            if (currentPage > calcPageCount(itemsPerPage, searchRecords.length))
                                {setCurrentPage(1)}
                            else
                                {setCurrentPage(currentPage-1)}
                            
                        }}>Previous</button>
                }
                {currentPage !== calcPageCount(itemsPerPage, searchRecords.length) &&
                    <button id="next-btn" onClick={() => 
                        {
                        if (currentPage > calcPageCount(itemsPerPage, searchRecords.length))
                            {setCurrentPage(1)}
                        else
                            {setCurrentPage(currentPage+1)}
                        
                        }}>Next</button>
                }<br/>
                {currentPage > calcPageCount(itemsPerPage, searchRecords.length)}
                page count: <span id="page-count">{calcPageCount(itemsPerPage, searchRecords.length)}</span>
                
            </div>
        </>
    )
}