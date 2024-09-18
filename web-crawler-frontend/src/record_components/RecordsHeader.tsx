import { ChangeEvent } from "react";

export default function Filter({ url, label, tags, setUrl, setLabel}: {
    url:string, label:string, tags:Array<string>, 
    setUrl:(e: ChangeEvent<HTMLInputElement>) => void, 
    setLabel:(e: ChangeEvent<HTMLInputElement>) => void,
    setTags:(newTags:Array<string>) => void}){
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
                    {tags && tags.map((tag:string) =>(
                        <span>{tag}, </span>
                    ))}
                </span>
            </label>
            
        </div>

        <label htmlFor="sort-by">Sort by: 
                <form id="sort-by" action="#">
                    <label htmlFor="sort-by-url">
                        <input type="radio" name="sort" id="sort-by-url" defaultChecked />URL
                    </label>
                    <label htmlFor="sort-by-exec">
                        <input type="radio" name="sort" id="sort-by-exec" />
                        Time of execution
                    </label>
                </form>
        </label>
        </>
    )
}
