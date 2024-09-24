import Record from "./record_components/Record";

export async function fetchRecords(): Promise<Record[]>{
    const response = await fetch("./api/websites")
    const records = await response.json()

    return records
}