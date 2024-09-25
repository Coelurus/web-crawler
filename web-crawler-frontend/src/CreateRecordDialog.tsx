import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react"

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
        console.log(event.currentTarget.parentElement!.textContent)
        setTags(tags.filter(tag => tag !== event.currentTarget.parentElement!.textContent))
        console.log(tags)
        event.currentTarget.parentElement!.remove()
        
    }
    const addTag = () => {
        setTags([...tags, tag])
        setTag('')
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const formData = new FormData((document.getElementById('createForm') as HTMLFormElement))

        formData.append('tags', JSON.stringify({ tags }))
        formData.append('active', 'true')

        try{
            await fetch("./api/websites",{
                method: 'POST',
                body: formData
            })
            setChange(prevState => !prevState)
        } catch (error){
            console.error('Error:', error)
        }
    }
    return(
        <>
            <h2>Create Record</h2>
            <form action="./api/websites" method="POST" id="createForm" onSubmit={handleSubmit}>
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
                            <li className="tag">{tag} 
                                <button type="button" onClick={deleteTag} >X</button></li>
                            
                        </>
                    ))}
                </ul>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </>
    )
}