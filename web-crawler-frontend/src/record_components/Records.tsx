
import { ChangeEvent, useState } from 'react'
import  RecordsHeader from './RecordsHeader'
import RecordsTable from './RecordsTable'
import Record from './Record'

export default function Records(){
    const [url, setUrl] = useState('')
    const [label, setLabel] = useState('')
    const [tags, setTags] = useState(['UNI', 'WIKI'])
    const [sortByUrl, setSortByUrl] = useState<boolean>(true) 
    //TODO: sort by


    //TODO: pagination
   

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value)
    }
    const handleLableChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
    }
    const handleTagsChange = (newTags: Array<string>) => {
      setTags(newTags)
    }

    const records = [
        new Record(0, 'webik', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'] ),
        new Record(1, 'Wiki', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'])
    ]
    return (
      <>
        <RecordsHeader 
            url={url} 
            label={label} 
            tags={tags} 
            setUrl={handleUrlChange} 
            setLabel={handleLableChange} 
            setTags={handleTagsChange}
        />
        <RecordsTable records={records}/>
      </>
    )
}
