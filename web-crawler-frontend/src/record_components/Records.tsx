
import { ChangeEvent, useState } from 'react'

import RecordsHeader from './RecordsHeader'
import RecordsTable from './RecordsTable'
import Record from './Record'


export default function Records({records}:{records:Record[]}){
    const [url, setUrl] = useState('')
    const [label, setLabel] = useState('')
    const [tags, setTags] = useState(['UNI', 'WIKI'])
    // const [sortByUrl, setSortByUrl] = useState<boolean>(true) 
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
        <RecordsTable 
          records={records} 
          itemsPerPage={3}
          sortByUrl={true} 
          searchLabel={label} 
          searchUrl={url}
        />

      </>
    )
}
