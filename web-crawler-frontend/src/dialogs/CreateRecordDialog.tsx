import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react"
import '../css/CreateDialog.css'

type CreateRecordDialogProps = {
    setActiveRecordIds: Dispatch<SetStateAction<number[]>>, 
    setLiveMode: Dispatch<SetStateAction<boolean>>,
    setChange: Dispatch<SetStateAction<boolean>>
}
export default function CreateRecordDialog({setActiveRecordIds, setLiveMode, setChange}:CreateRecordDialogProps){
    const [day, setDay] = useState(0)
    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [currentTag, setCurrentTag] = useState('')
    const [tags, setTags] = useState<string[]>([])

    const handleDayChange = (value: number) => {
        setDay(Number(value))
    }
    const handleHourChange = (value: number) => {
        setHour(Number(value))
    }
    const handleMinuteChange = (value: Number) => {
        setMinute(Number(value))
    }
    const handleTagChange = (value: string) => {
        setCurrentTag(value)
    }
    const deleteTag = (event: React.MouseEvent<HTMLButtonElement>) => {
        const tagEl = event.currentTarget.parentNode!.firstChild!
        const tagText = tagEl.textContent
        setTags(tags.filter(tag => tag !== tagText!))
        tagEl.parentNode!.removeChild(tagEl)
        
    }
    const addTag = () => {
        setTags([...tags, currentTag])
        setCurrentTag('')
    }
    const toggleCreateDialog = () => {
        const dialog = document.getElementById('create-dialog') as HTMLElement
        const button = document.getElementById('toggle-create-dialog') as HTMLButtonElement
        dialog.hidden = !dialog.hidden
        if (dialog.hidden) {
            button.textContent = 'Show Create Record Dialog'
        } else {
            button.textContent = 'Hide Create Record Dialog'
        }
    }
    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const form = document.getElementById('createForm') as HTMLFormElement
        const formData = new FormData(form)

        formData.set('tags', JSON.stringify( tags ))
        formData.set('active', 'true')

        try{
            const response = await fetch("./api/websites",{
                method: 'POST',
                body: formData
            })
            if (!response.ok){
                throw new Error('Server error')
            }
            const addedRecord = await response.json()

            setChange(prevState => !prevState)
            setLiveMode(true)
            setActiveRecordIds(prev => [...prev, addedRecord.id])


            setDay(0)
            setHour(0)
            setMinute(0)
            setCurrentTag('')
            setTags([])
            form.reset()
            toggleCreateDialog()
            
        } catch (error){
            console.error('Error:', error)
        }
    }
    return(
        <>
            <button onClick={toggleCreateDialog} id="toggle-create-dialog">Show Create Record Dialog</button>
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
                        <input type="number" id="postDay" onChange={(e) => handleDayChange(Number(e.currentTarget.value))} min={0}/>
                    </label>
                    <label htmlFor="postHour">Hours:
                        <input type="number" id="postHour" onChange={(e) => handleHourChange(Number(e.currentTarget.value))} min={0} max={23}/>
                    </label>
                    <label htmlFor="postMinute">Minutes:
                        <input type="number" id="postMinute" onChange={(e) => handleMinuteChange(Number(e.currentTarget.value))} min={0} max={59}/>
                    </label>
                    <input type="text" name="periodicity" id="postPeriodicity"  value={day+':'+hour+':'+minute} hidden readOnly/>
                
                    <br />
                    <input type="text" id="tag" value={currentTag} onChange={(e) => handleTagChange(e.currentTarget.value)}/>
                    <button type="button" id="addTag" onClick={addTag} >Add tag</button>
                    <div>
                        {tags.map(tag => (
                                <li key={tag}>
                                    <span className="tag">{tag}</span>
                                    <button type="button" onClick={deleteTag} >X</button>
                                </li>
                        ))}
                    </div>
                    <br />
                    <button type="submit" value="Submit" >Submit</button>
                </form>
            </div>
        </>
    )
}