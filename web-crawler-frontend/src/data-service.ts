import { LinkObject } from "react-force-graph-2d";
import Execution from "./data-classes/Execution";
import Record from "./data-classes/Record";
import CrawledWeb from "./data-classes/CrawledWeb";

export async function fetchRecords(): Promise<Record[]> {
    const responseWebsites = await fetch("/api/websites")
    const records: Record[] = await responseWebsites.json()

    await Promise.all(records.map(async (record) => {
        if (record.crawledData !== null) {
            const response = await fetch("/api/executions/" + record.crawledData.executionId)
            const execution: Execution = await response.json()

            record.lastExecution = execution
        }
    }))
    return records
}
export async function fetchTags(): Promise<string[]> {
    const response = await fetch("/api/tags")

    return await response.json()
}

type LinkResponse = {
    id: number,
    from: number,
    to: number,
    executionId: number
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
}