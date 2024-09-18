export default class Record{
    public id:number;
    public label: string;
    public url: string;
    public boundaryRegEx: string;
    public periodicity: string;
    public tags:Array<string>

    public constructor(id:number, label:string, url:string, boundaryRegEx:string, periodicity:string, tags:Array<string>){
        this.id = id;
        this.label = label;
        this.url = url;
        this.boundaryRegEx = boundaryRegEx;
        this.periodicity = periodicity;
        this.tags = tags;
    }
}