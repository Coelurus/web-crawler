import { FormEvent } from "react";

export default function EditRecordDialog(){
    function handleSubmit(event: FormEvent){
        event.preventDefault()

    }
    return(
        <>
            <form action="./api/websites" method="PUT" onSubmit={handleSubmit}>
            
                
            </form>
        </>
    )
}