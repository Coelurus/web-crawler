import { LinkObject } from "react-force-graph-2d";
import Execution from "./record_components/Execution";
import Record from "./record_components/Record";
import CrawledWeb from "./Graph/CrawledWeb";

//TODO: fetching from server


export async function fetchRecords(): Promise<Record[]>{
    const responseWebsites = await fetch("./api/websites")
    const records:Record[] = await responseWebsites.json()
    records.forEach(async record => {
        if (record.crawledData !== null){
            const responseExec = await fetch("./api/executions/"+record.crawledData.executionId)
            
            const execution:Execution = await responseExec.json()
            record.lastExecution = execution.startTime
            const timeOfExecMilliseconds:number = new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()
            record.timeOfExecution = Math.round(timeOfExecMilliseconds/ (1000 * 60)).toString() + Math.round(timeOfExecMilliseconds/ (1000)).toString()
            console.log(record)
        }

    })
    return records
}
export async function fetchTags(): Promise<string[]>{
    const response = await fetch("./api/tags")

    return response.json()
}

class LinkResponse{
    public id:number
    public from_id:number
    public to_id:number
    public execution_id:number

    public constructor(id:number, from_id:number, to_id:number, execution_id:number){
        this.id = id
        this.from_id = from_id
        this.to_id = to_id
        this.execution_id = execution_id
    }
}

export async function fetchLinks(): Promise<LinkObject[]>{
    const response = await fetch("./api/crawl/link")
    const linkResponses:LinkResponse[] = await response.json()
    return linkResponses.map<LinkObject>(link =>{
        return {source: link.from_id, target: link.to_id}
    })
}

export async function fetchCrawls(): Promise<CrawledWeb[]>{
    const response = await fetch("./api/crawl/data")
    
    return await response.json()
}

export async function deleteRecord(id:number){
    const response = await fetch("./api/websites/"+id,{
        method: 'DELETE'
    })

    if (!response.ok){
        throw new Error('Network resopnse was not ok')
    }
    return response.json()
}