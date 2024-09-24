import Record from './Record'
import '../css/table.css'
import { useState } from 'react'
export default function RecordsTable({records, sortByUrl}: {records:Array<Record>, sortByUrl:boolean}){
    const itemsPerPage = 3
    const [currentPage, setCurrentPage] = useState(1)

    const betterCurrentItems = records.slice((currentPage-1)*itemsPerPage, currentPage*(itemsPerPage))

    // sort by url
    if (sortByUrl){
        records.sort((a,b) => a.url.localeCompare(b.url))
    }
    
    function calcPageCount(itemsPerPage:number, itemsCount:number): number{
        if (itemsCount%itemsPerPage === 0) return itemsCount/itemsPerPage
        return Math.floor(itemsCount/itemsPerPage)+1
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
                    {betterCurrentItems.map((record:Record) =>(
                        <tr key={record.id}>
                            <td>{record.label}</td>
                            <td>{record.tags}</td>
                            <td>{record.periodicity}</td>
                            <td></td>
                            <td></td>
                            <td><input type="checkbox" name="" id="" /></td>
                            <td><button>Edit</button></td>
                            <td><button>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <span id='curr-page'>page: {currentPage}</span><br/>
                {currentPage !== 1 &&
                    <button id="prev-btn" onClick={() => setCurrentPage(currentPage-1)}>Previous</button>
                }
                {currentPage !== calcPageCount(itemsPerPage, records.length) &&
                    <button id="next-btn" onClick={() => setCurrentPage(currentPage+1)}>Next</button>
                }<br/>
                page count: <span id="page-count">{calcPageCount(itemsPerPage, records.length)}</span>
                
            </div>
        </>
    )
}