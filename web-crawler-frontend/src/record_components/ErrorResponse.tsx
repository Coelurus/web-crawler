
class ErrorDetail{
    public code:string
    public scope:string

    public constructor(code:string, scope:string){
        this.code = code
        this.scope = scope
    }
}

export default class ErrorResponse{
    public errors:ErrorDetail[]

    public constructor(errors:ErrorDetail[]){
        this.errors = errors
    }
}