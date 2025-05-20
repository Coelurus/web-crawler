import { LinkObject } from "react-force-graph-2d";
import Execution from "./record_components/Execution";
import Record from "./record_components/Record";
import CrawledWeb from "./Graph/CrawledWeb";

export async function fetchRecords(): Promise<Record[]> {
    const responseWebsites = await fetch("/api/websites")
    const records: Record[] = await responseWebsites.json()

    await Promise.all(records.map(async (record) => {
        if (record.crawledData !== null) {
            const response = await fetch("/api/executions/" + record.crawledData.executionId)
            const execution: Execution = await response.json()

            record.lastExecution = execution.startTime

            const timeOfExecMilliseconds: number =
                new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()

            switch (execution.status.toLocaleLowerCase()) {
                case 'failed':
                    record.timeOfExecution = 'FAILED'
                    break;
                case 'pending':
                    record.timeOfExecution = 'PENDING'
                    break;
                case 'in_progress':
                    record.timeOfExecution = 'IN PROGRESS'
                    break;
                case 'finished':
                    const minutes = Math.floor(timeOfExecMilliseconds / (1000 * 60))
                    const seconds = Math.floor((timeOfExecMilliseconds % (1000 * 60)) / 1000)
                    record.timeOfExecution = `${minutes}m ${seconds}s`
                    break;
                default:
                    break;
            }
        }
    }))
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

export async function fetchLinks(execution_id: number|undefined = undefined): Promise<LinkObject[]> {
    const response = execution_id ? await fetch(`/api/crawl/link/${execution_id}`) : await fetch("/api/crawl/link")
    const linkResponses: LinkResponse[] = await response.json()
    return linkResponses.map<LinkObject>(linkRes => {
        return {
            source: linkRes.from, 
            target: linkRes.to
        }
    })
}

export async function fetchCrawls(execution_id: number|undefined = undefined): Promise<CrawledWeb[]> {
    
    const response = execution_id ? await fetch(`/api/crawl/data/${execution_id}`) : await fetch("/api/crawl/data")
    const result = await response.json()
    return result
}

export async function deleteRecord(id: number) {
    const response = await fetch("/api/websites/" + id, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Error occurred when deleting record')
    }
    return response.json()
}