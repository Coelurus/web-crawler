
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

import RecordsHeader from './RecordsHeader'
import RecordsTable from './RecordsTable'
import Record from './Record'


export default function Records({records, tags, setEditingRecord, setChange}:{records:Record[], tags:string[], setEditingRecord:Dispatch<SetStateAction<Record|null>>, setChange:Dispatch<SetStateAction<boolean>>}){
    const [url, setUrl] = useState('')
    const [label, setLabel] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [sortByUrl, setSortByUrl] = useState<boolean>(true) 
    //TODO: sort by
    //TODO: hodit filry do jednoho [filters, setFilters] = useState({url: '', ...})


    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value)
    }
    const handleLableChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
    }
    const handleTagsChange = (newTags: Array<string>) => {
      setSelectedTags(newTags)
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
          sortByUrl={sortByUrl}
          tags={tags}
          selectedTags={selectedTags}
          setUrl={handleUrlChange} 
          setLabel={handleLableChange} 
          setSelectedTags={handleTagsChange}
          setSortByUrl={handleSortChange}
        />
        <RecordsTable 
          records={records} 
          itemsPerPage={3}
          sortByUrl={sortByUrl} 
          searchLabel={label} 
          searchUrl={url}
          searchTags={selectedTags}
          setEditingRecord={setEditingRecord}
          setChange={setChange}
        />

      </>
    )
}
