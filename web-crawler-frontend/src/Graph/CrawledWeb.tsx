export default class CrawledWeb{
    public id:number
    public url:string
    public title:string
    public crawlTime:string
    public executionId:number
    public state:string

    public constructor(id:number, url:string, title:string, crawlTime:string, executionId:number, state:string){
        this.id = id;
        this.url = url;
        this.title = title;
        this.crawlTime = crawlTime;
        this.executionId = executionId;
        this.state = state;
    }
}