import { LinkObject } from "react-force-graph-2d";
import Execution from "./data-classes/Execution";
import Record from "./data-classes/Record";
import CrawledWeb from "./data-classes/CrawledWeb";

export async function fetchRecords(): Promise<Record[]> {
    const responseWebsites = await fetch("/api/websites")
    if (!responseWebsites.ok){
        throw new Error("Error occurred while fetching records")
    }
    const records: Record[] = await responseWebsites.json()

    await Promise.all(records.map(async (record) => {
        if (record.crawledData !== null) {
            record.lastExecution = await fetchExecution(record.crawledData.executionId)
        }
    }))
    return records
}

export async function fetchExecution(executionId: number) : Promise<Execution>{
    const response = await fetch("/api/executions/" + executionId)
    if (!response.ok){
        throw new Error("Error occurred while fetching execution")
    }
    const execution: Execution = await response.json()
    execution.startTime = new Date(execution.startTime)
    if (execution.endTime != null) {
        execution.endTime = new Date(execution.endTime);
    }

    return execution
}

export async function fetchTags(): Promise<string[]> {
    const response = await fetch("/api/tags")
    if (!response.ok){
        throw new Error("Error occurred while fetching tags")
    }
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
    if (!response.ok){
        throw new Error("Error occurred while fetching links")
    }
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
    if (!response.ok){
        throw new Error("Error occurred while fetching crawls")
    }
    const result = await response.json()
    return result
}

export async function fetchRecordsForCrawl(url: string){
    const response = await fetch(`/api/websites/url?query=${url}`)
    if (!response.ok){
        throw new Error("Error occurred while fetching records that crawled " + url)
    }
    const result = await response.json()
    return result
}

export async function runRecordExecution(recordId: number){
    const response = await fetch(`/api/execute/${recordId}`, {
        method: 'POST'
    })

    if (!response.ok){
        throw new Error('Error occurred while trying to run record ' + recordId)
    }
}

export async function createRecord(formData: FormData) : Promise<Record>{
    const response = await fetch("./api/websites",{
        method: 'POST',
        body: formData
    })
    if (!response.ok){
        throw new Error("Error occurred while trying to create a record")
    }
    return await response.json()
}

export async function editRecord(editedRecord:Record|FormData){
    const formData: FormData = editedRecord instanceof FormData ? editedRecord : new FormData()
    
    // editedRecord is a Record
    if ('id' in editedRecord){
        formData.set('active', editedRecord.active.toString())
        formData.set('label', editedRecord.label)
        formData.set('url', editedRecord.url)
        formData.set('boundaryRegExp', editedRecord.boundaryRegExp)
        const periodicity = `${editedRecord.periodicity.day}:${editedRecord.periodicity.hour}:${editedRecord.periodicity.minute}`
        formData.set('periodicity', periodicity)
        formData.set('tags', JSON.stringify(editedRecord.tags.map(tag => tag.name)))
        formData.set('crawledData', JSON.stringify(editedRecord.crawledData))
        formData.set('id', editedRecord.id.toString())
        
    }
    
    const response = await fetch("/api/websites/" + formData.get('id'), {
        method: 'PUT',
        body: formData
    })

    if (!response.ok){
        throw new Error("Error occurred while editing record")
    }
}

export async function deleteRecord(id: number) {
    const response = await fetch("/api/websites/" + id, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Error occurred when deleting record')
    }
}