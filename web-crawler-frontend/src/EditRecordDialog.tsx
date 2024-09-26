import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import Record from "./record_components/Record";

export default function EditRecordDialog({ editingRecord, setChange }: { editingRecord: Record, setChange: Dispatch<SetStateAction<boolean>> }) {
    const [day, setDay] = useState(editingRecord.periodicity.day)
    const [hour, setHour] = useState(editingRecord.periodicity.hour)
    const [minute, setMinute] = useState(editingRecord.periodicity.minute)
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<string[]>(editingRecord.tags.map<string>(tag => tag.name))

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const formData = new FormData((document.getElementById('edit-form') as HTMLFormElement))

        formData.append('tags', JSON.stringify(tags))
        formData.append('active', 'true')

        try {
            const response = await fetch("/api/websites/" + editingRecord.id, {
                method: 'PUT',
                body: formData
            })
            setChange(prevState => !prevState)
            const record: Record = await response.json()
            // const execResponse = await fetch("/api/execute/"+record.id, {
            //     method: 'POST'
            // })
            // const execution:Execution = await execResponse.json()
            // console.log(execution)
        } catch (error) {
            console.error('Error:', error)
        }

    }
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
    { console.log(editingRecord) }
    return (
        <>
            <h2>Edit {editingRecord.label} Record Dialog</h2>
            <form id='edit-form' className='dialog' onSubmit={handleSubmit}>
                <input type="text" name="id" id="putId" value={editingRecord.id} hidden readOnly />
                <label htmlFor="putLabel">Label:
                    <input type="text" name="label" defaultValue={editingRecord.label} id="putLabel" />
                </label>
                <label htmlFor="putUrl">URL:
                    <input type="text" name="url" defaultValue={editingRecord.url} id="putUrl" />
                </label>
                <label htmlFor="putBoundaryRegExp">Boundary RegEx:
                    <input type="text" name="boundaryRegExp" defaultValue={editingRecord.boundaryRegEx} id="putBoundaryRegExp" />
                </label>

                <p>Periodicity:</p>
                <label htmlFor="putDay">Days:
                    <input type="number" id="putDay" defaultValue={day} onChange={handleDayChange} min={0} />
                </label>
                <label htmlFor="putHour">Hours:
                    <input type="number" id="putHour" defaultValue={hour} onChange={handleHourChange} min={0} max={23} />
                </label>
                <label htmlFor="putMinute">Minutes:
                    <input type="number" id="putMinute" defaultValue={minute} onChange={handleMinuteChange} min={0} max={59} />
                </label>
                <label htmlFor="putTags"></label>
                <input type="text" name="periodicity" id="putPeriodicity" value={day + ':' + hour + ':' + minute} hidden readOnly />

                <br />
                <input type="text" id="tag" defaultValue={tag} onChange={handleTagChange} />
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
        </>
    )
}