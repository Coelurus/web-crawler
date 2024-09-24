import Record from "./record_components/Record";
import Tag from "./record_components/Tag";

//TODO: fetching from server


export async function fetchRecords(): Promise<Record[]>{
    const responseWebsites = await fetch("./api/websites")
    const records = await responseWebsites.json()
    const responseExecs = await fetch("./api/executions")
    const executions = await responseExecs.json()

    return records
}
export async function fetchTags(): Promise<Tag[]>{
    const response = await fetch("./api/tags")
    const tags = await response.json()

    return tags;
}