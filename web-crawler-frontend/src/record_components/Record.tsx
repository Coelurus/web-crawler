import Tag from "./Tag";

export default class Record{
    public id:number;
    public label: string;
    public url: string;
    public boundaryRegEx: string;
    public periodicity: string;
    public tags:Array<Tag>
    public lastExecution:Date
    public timeOfExecution:string

    public constructor(id:number, label:string, url:string, boundaryRegEx:string, periodicity:string, tags:Array<Tag>, lastExecution:Date, timeOfExecution:string){
        this.id = id;
        this.label = label;
        this.url = url;
        this.boundaryRegEx = boundaryRegEx;
        this.periodicity = periodicity;
        this.tags = tags;
        this.lastExecution = lastExecution
        this.timeOfExecution = timeOfExecution
    }
}