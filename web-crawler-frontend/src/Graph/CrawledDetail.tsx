import { NodeObject } from "react-force-graph-2d";
import '../css/CrawledDetail.css'
import Record from '../data-classes/Record'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchRecordsForCrawl, runRecordExecution } from "../data-service";

export default function CrawledDetail({node, setNode}:{node:NodeObject|null, setNode:Dispatch<SetStateAction<NodeObject|null>>}){
    
    const [recordsList, setRecordsList] = useState<Record[]>([])

    useEffect(() => {
        const fetchRecords = async () => {
            if (node !== null){
                const recordsList = await fetchRecordsForCrawl(node.url)
                setRecordsList(recordsList)
            }
            else{
                setRecordsList([])
            }
        }
        fetchRecords()
    }, [node])

    async function runRecord(recordId: number){
        await runRecordExecution(recordId)
    }

    return(
        <>
            {node && 
            <div id="crawled-detail">
                <h2>Crawl Detail</h2>
                {node.title && <p><b>Title:</b> {node.title} </p>}
                <p><b>URL:</b> <a href={node.url}>{node.url}</a></p>
                {node.crawlTime && <p><b>Crawl time:</b> {node.crawlTime}</p>}
                <p><b>State:</b> {node.state.toLowerCase()}</p>
                <label htmlFor="records-list">
                    <b>Records:</b>
                    <ul id="records-list">
                        {recordsList.map(record => (
                            <li key={'records-list-item-' + record.id}>
                                <span>{record.label}</span>
                                <button type="button" onClick={() => runRecord(record.id)}>Run</button>
                            </li>
                        ))}
                    </ul>
                </label>
                <button onClick={() => setNode(null)}>Close</button>
            </div>}
        </>
    )
}