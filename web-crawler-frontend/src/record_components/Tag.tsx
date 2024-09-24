export default class Tag{
    public id:number;
    public name:string;
    public wr_id:number;


    public constructor(id:number, name:string, wr_id:number){
        this.id = id
        this.name = name
        this.wr_id = wr_id
    }
}