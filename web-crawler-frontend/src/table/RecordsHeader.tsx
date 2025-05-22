import { ChangeEvent } from "react";
import { ToggleSwitch } from "../ToggleSwitch";


type RecordsHeaderProps = {
    url:string, label:string, sortByUrl:boolean, tags:string[], selectedTags:string[],
    onUrlChange:(e: ChangeEvent<HTMLInputElement>) => void, 
    onLabelChange:(e: ChangeEvent<HTMLInputElement>) => void,
    onSelectedTagsChange:(newTags:Array<string>) => void,
    onSortByUrlChange:(value: boolean) => void
}


export default function RecordsHeader({ url, label, sortByUrl, tags, selectedTags, onUrlChange, onLabelChange, onSelectedTagsChange, onSortByUrlChange}: RecordsHeaderProps){
    

    const tagCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checkbox = event.currentTarget
        if (checkbox.checked){
            onSelectedTagsChange([...selectedTags, checkbox.parentElement?.textContent!])
        }
        else{
            onSelectedTagsChange(selectedTags.filter(tag => tag !== checkbox.parentElement?.textContent!))
        }
    }
    return (
        <>
        <div>
            <label htmlFor="url-input">URL: 
                <input type="text" name="url-input" id="url-input" value={url} onChange={onUrlChange}/>
            </label>
            <label htmlFor="label-input">Label: 
                <input type="text" name="label-input" id="label-input" value={label} onChange={onLabelChange}/>
            </label>
            <label htmlFor="tags">Tags: 
                <span id="tags">
                    {tags.map((tag:string) =>(
                        <span key={tag} className="tag">{tag}<input type="checkbox" onChange={tagCheckChange}/></span>
                    ))}
                </span>
            </label>
            
        </div>
        <ToggleSwitch switchLabel='Sort By' labelOff='URL' labelOn="Last Execution" checked={sortByUrl} onChange={onSortByUrlChange}/>
        
        </>
    )
}
