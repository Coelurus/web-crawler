import Record from "./Record"

type Status = 'pending' | 'in_progress' | 'finished' | 'failed'

export default class Execution{
    public id:number
    public website:Record
    public status:Status
    public startTime:Date
    public endTime:Date
    public crawledCount:number

    public constructor(id:number, website:Record, status:Status, startTime:Date, endTime:Date, crawledCount:number){
        this.id = id
        this.website=website
        this.status = status
        this.startTime = startTime
        this.endTime = endTime
        this.crawledCount = crawledCount
    }
}