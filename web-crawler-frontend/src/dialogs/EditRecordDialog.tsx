import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import Record from "../data-classes/Record";
import { editRecord } from "../data-service";

export default function EditRecordDialog({ editingRecord, hideDialog, setChange }: { editingRecord: Record, hideDialog: () => void, setChange: Dispatch<SetStateAction<boolean>> }) {
    const [day, setDay] = useState(editingRecord.periodicity.day)
    const [hour, setHour] = useState(editingRecord.periodicity.hour)
    const [minute, setMinute] = useState(editingRecord.periodicity.minute)
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<string[]>(editingRecord.tags.map<string>(tag => tag.name))

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const formData = new FormData((document.getElementById('edit-form') as HTMLFormElement))

        formData.set('tags', JSON.stringify(tags))
        formData.set('active', 'true')
        formData.set('id', editingRecord.id.toString())

        try {
            await editRecord(formData)

            setChange(prevState => !prevState)
            hideDialog()
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
        const tagEl = event.currentTarget.parentNode!.firstChild!
        const tagText = tagEl.textContent
        setTags(tags.filter(tag => tag !== tagText!))
        tagEl.parentNode!.removeChild(tagEl)
        
    }
    const addTag = () => {
        setTags([...tags, tag])
        setTag('')
    }
    return (
        <>
            <div className="dialog-overlay" onClick={() => hideDialog()}></div>
            <div className="dialog">
                <h2>Edit {editingRecord.label} Record Dialog</h2>
                <form id='edit-form' className='dialog' onSubmit={handleSubmit}>
                    <label htmlFor="putLabel">Label:
                        <input type="text" name="label" defaultValue={editingRecord.label} id="putLabel" />
                    </label>
                    <label htmlFor="putUrl">URL:
                        <input type="text" name="url" defaultValue={editingRecord.url} id="putUrl" />
                    </label>
                    <label htmlFor="putBoundaryRegExp">Boundary RegEx:
                        <input type="text" name="boundaryRegExp" id="putBoundaryRegExp" defaultValue={editingRecord.boundaryRegExp} />
                        
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
                                <li key={tag}>
                                    <span className="tag">{tag}</span>
                                    <button type="button" onClick={deleteTag} >X</button>
                                </li>
                        ))}
                    </ul>
                    <br />
                    <button type="submit" value="Submit" >Submit</button>
                    <button type="button" onClick={()=>hideDialog()}>Close</button>
                </form>
            </div>

        </>
    )
}