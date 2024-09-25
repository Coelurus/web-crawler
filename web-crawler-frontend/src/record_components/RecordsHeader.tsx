import { ChangeEvent, useEffect, useState } from "react";
import { fetchTags } from "../data-service";

export default function RecordsHeader({ url, label, sortByUrl, tags, selectedTags, setUrl, setLabel, setSelectedTags, setSortByUrl}: {
    url:string, label:string, sortByUrl:boolean, tags:string[], selectedTags:string[],
    setUrl:(e: ChangeEvent<HTMLInputElement>) => void, 
    setLabel:(e: ChangeEvent<HTMLInputElement>) => void,
    setSelectedTags:(newTags:Array<string>) => void,
    setSortByUrl:(e: ChangeEvent<HTMLInputElement>) => void}){
    

    const tagCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checkbox = event.currentTarget
        if (checkbox.checked){
            setSelectedTags([...selectedTags, checkbox.parentElement!.textContent!])
        }
        else{
            setSelectedTags(selectedTags.filter(tag => tag !== checkbox.parentElement!.textContent!))
        }
    }
    return (
        <>
        <div>
            <label htmlFor="url-input">URL: 
                <input type="text" name="url-input" id="url-input" value={url} onChange={setUrl}/>
            </label>
            <label htmlFor="label-input">Label: 
                <input type="text" name="label-input" id="label-input" value={label} onChange={setLabel}/>
            </label>
            <label htmlFor="tags">Tags: 
                <span id="tags">
                    {tags.map((tag:string) =>(
                        <span key={tag} className="tag">{tag}<input type="checkbox" onChange={tagCheckChange}/></span>
                    ))}
                </span>
            </label>
            
        </div>

        <label htmlFor="sort-by">Sort by: 
                <form id="sort-by" action="#">
                    <label htmlFor="sort-by-url">
                        <input type="radio" name="sort" id="sort-by-url" checked={sortByUrl} onChange={setSortByUrl}/>URL
                    </label>
                    <label htmlFor="sort-by-exec">
                        <input type="radio" name="sort" id="sort-by-exec" />Time of execution
                    </label>
                </form>
        </label>
        </>
    )
}
