
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

import RecordsHeader from './RecordsHeader'
import RecordsTable from './RecordsTable'
import Record from './Record'


export default function Records({records, setChange}:{records:Record[], setChange:Dispatch<SetStateAction<boolean>>}){
    const [url, setUrl] = useState('')
    const [label, setLabel] = useState('')
    const [tags, setTags] = useState(['UNI', 'WIKI'])
    const [sortByUrl, setSortByUrl] = useState<boolean>(true) 
    //TODO: sort by


    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value)
    }
    const handleLableChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
    }
    const handleTagsChange = (newTags: Array<string>) => {
      setTags(newTags)
    }

    const handleSortChange = (e: ChangeEvent<HTMLInputElement>) =>{
      setSortByUrl(e.target.checked)
    }


    return (
      <>
        <h1>Records</h1>
        <RecordsHeader 
          url={url} 
          label={label} 
          tags={tags} 
          sortByUrl={sortByUrl}
          setUrl={handleUrlChange} 
          setLabel={handleLableChange} 
          setTags={handleTagsChange}
          setSortByUrl={handleSortChange}
        />
        <RecordsTable 
          records={records} 
          itemsPerPage={3}
          sortByUrl={sortByUrl} 
          searchLabel={label} 
          searchUrl={url}
          setChange={setChange}
        />

      </>
    )
}
