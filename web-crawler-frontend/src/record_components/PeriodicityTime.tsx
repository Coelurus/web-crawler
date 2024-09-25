export default class PeriodicityTime{
    public id:number
    public minute:number
    public hour:number
    public day:number
    
    public constructor(id:number, minute:number, hour:number, day:number){
        this.id = id
        this.minute = minute
        this.hour = hour
        this.day = day
    }
}