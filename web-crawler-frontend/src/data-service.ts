import { LinkObject } from "react-force-graph-2d";
import Execution from "./record_components/Execution";
import Record from "./record_components/Record";
import CrawledWeb from "./Graph/CrawledWeb";

export async function fetchRecords(): Promise<Record[]> {
    const responseWebsites = await fetch("/api/websites")
    const records: Record[] = await responseWebsites.json()
    records.forEach(record => {
        if (record.crawledData !== null) {
            fetch("/api/executions/" + record.crawledData.executionId).then(response => {

                response.json().then(execution =>{
                    
                    record.lastExecution = execution.startTime
                    const timeOfExecMilliseconds: number = new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()
                    if (execution.status.toLowerCase() === 'failed'){
                        record.timeOfExecution = 'FAILED'
                    }
                    else{
                        record.timeOfExecution = Math.round(timeOfExecMilliseconds / (1000 * 60)).toString() + 'm ' + Math.round((timeOfExecMilliseconds - Math.round(timeOfExecMilliseconds / (1000 * 60))*(1000 * 60)) / (1000)).toString() + 's'
                    }
                })
            })

            // const execution: Execution = await responseExec.json()
        }

    })
    return records
}
export async function fetchTags(): Promise<string[]> {
    const response = await fetch("/api/tags")

    return response.json()
}

class LinkResponse {
    public id: number
    public from: number
    public to: number
    public executionId: number

    public constructor(id: number, from_id: number, to_id: number, execution_id: number) {
        this.id = id
        this.from = from_id
        this.to = to_id
        this.executionId = execution_id
    }
}

export async function fetchLinks(): Promise<LinkObject[]> {
    const response = await fetch("/api/crawl/link")
    const linkResponses: LinkResponse[] = await response.json()
    return linkResponses.map<LinkObject>(linkRes => {
        return {
            source: linkRes.from, 
            target: linkRes.to
        }
    })
}

export async function fetchCrawls(): Promise<CrawledWeb[]> {
    const response = await fetch("/api/crawl/data")

    return await response.json()
}

export async function deleteRecord(id: number) {
    const response = await fetch("/api/websites/" + id, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Network resopnse was not ok')
    }
    return response.json()
}