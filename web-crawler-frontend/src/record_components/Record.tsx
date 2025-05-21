import CrawledWeb from "../Graph/CrawledWeb";
import Execution from "./Execution";
import PeriodicityTime from "./PeriodicityTime";
import Tag from "./Tag";

export default class Record{
    id:number;
    label: string;
    url: string;
    boundaryRegExp: string;
    periodicity: PeriodicityTime;
    active:boolean
    tags:Array<Tag>
    crawledData:CrawledWeb
    lastExecution:Execution|undefined
    timeOfExecution:string|undefined
    

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