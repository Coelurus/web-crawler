import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react"
import Record from "./record_components/Record"
import './css/CreateDialog.css'
// import Execution from "./record_components/Execution"


export default function CreateRecordDialog({setChange}:{setChange:Dispatch<SetStateAction<boolean>>}){
    const [day, setDay] = useState(0)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(10)
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDay(Number(e.target.value))
    }
    const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
        setHour(Number(e.target.value))
    }
    const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMinute(Number(e.target.value))
    }
    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value)
    }
    const deleteTag = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTags(tags.filter(tag => tag !== event.currentTarget.parentElement!.textContent))
        event.currentTarget.parentElement!.remove()
        
    }
    const addTag = () => {
        setTags([...tags, tag])
        setTag('')
    }
    const toggleCreateDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
        
        const dialog:HTMLElement = document.getElementById('create-dialog') as HTMLElement
        dialog.hidden = !dialog.hidden
        if (dialog.hidden){
            event.currentTarget.textContent = 'Show Create Record Dialog'
        }
        else{
            event.currentTarget.textContent = 'Hide Crate Record Dialog'
        }
    }
    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const formData = new FormData((document.getElementById('createForm') as HTMLFormElement))

        formData.append('tags', JSON.stringify( tags ))
        formData.append('active', 'true')

        try{
            const response = await fetch("./api/websites",{
                method: 'POST',
                body: formData
            })
            setChange(prevState => !prevState)
            const record:Record = await response.json()
            // const execResponse = await fetch("./api/execute/"+record.id, {
            //     method: 'POST'
            // })
            // const execution:Execution = await execResponse.json()
            // console.log(execution)
        } catch (error){
            console.error('Error:', error)
        }
    }
    return(
        <>
            <button onClick={toggleCreateDialog}>Show Create Record Dialog</button>
            <div id="create-dialog" hidden>
                <h2>Create Record</h2>
                <form id="createForm" className="dialog" onSubmit={handleSubmit}>
                    <label htmlFor="postLabel">Label:
                        <input type="text" name="label" id="postLabel"/>
                    </label>
                    <label htmlFor="postUrl">URL:
                        <input type="text" name="url" id="postUrl"/>
                    </label>
                    <label htmlFor="postBoundaryRegExp">Boundary RegEx:
                        <input type="text" name="boundaryRegExp" id="postBoundaryRegExp"/>
                    </label>
                    <p>Periodicity:</p>
                    <label htmlFor="postDay">Days:
                        <input type="number" id="postDay" onChange={handleDayChange} min={0}/>
                    </label>
                    <label htmlFor="postHour">Hours:
                        <input type="number" id="postHour" onChange={handleHourChange} min={0} max={23}/>
                    </label>
                    <label htmlFor="postMinute">Minutes:
                        <input type="number" id="postMinute" onChange={handleMinuteChange} min={0} max={59}/>
                    </label>
                    <label htmlFor="postTags"></label>
                    <input type="text" name="periodicity" id="postPeriodicity"  value={day+':'+hour+':'+minute} hidden/>
                
                    <br />
                    <input type="text" id="tag" value={tag} onChange={handleTagChange}/>
                    <button type="button" id="addTag" onClick={addTag} >Add tag</button>
                    <ul>
                        {tags.map(tag => (
                            <>
                                <li key={tag} className="tag">{tag} 
                                    <button type="button" onClick={deleteTag} >X</button></li>
                                
                            </>
                        ))}
                    </ul>
                    <br />
                    <button type="submit" value="Submit" >Submit</button>
                </form>
            </div>
        </>
    )
}