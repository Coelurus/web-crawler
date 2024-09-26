import CrawledWeb from "../Graph/CrawledWeb";
import PeriodicityTime from "./PeriodicityTime";
import Tag from "./Tag";

export default class Record{
    public id:number;
    public label: string;
    public url: string;
    public boundaryRegExp: string;
    public periodicity: PeriodicityTime;
    public active:boolean
    public tags:Array<Tag>
    public crawledData:CrawledWeb
    public lastExecution:Date|undefined
    public timeOfExecution:string|undefined
    

    public constructor(id:number, label:string, url:string, boundaryRegEx:string, periodicity:PeriodicityTime, active:boolean, tags:Array<Tag>, crawledData:CrawledWeb){
        this.id = id;
        this.label = label;
        this.url = url;
        this.boundaryRegExp = boundaryRegEx;
        this.periodicity = periodicity;
        this.active = active;
        this.tags = tags;
        this.crawledData = crawledData;
    }
}