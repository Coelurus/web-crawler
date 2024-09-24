
import { ChangeEvent, useState } from 'react'

import RecordsHeader from './RecordsHeader'
import RecordsTable from './RecordsTable'
import Record from './Record'

import { fetchRecords } from '../data-service'

export default function Records(){
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

    const records = [
        new Record(0, 'webik', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'] ),
        new Record(1, 'Wiki', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI']),
        new Record(2, 'test', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI']),
        new Record(3, 'webik1', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'] ),
        new Record(4, 'Wiki1', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI']),
        new Record(5, 'test1', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI']),
        new Record(6, 'webik2', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'] ),
        new Record(7, 'Wiki2', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI']),
        new Record(8, 'test2', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'])
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
        <RecordsTable 
          records={records} 
          sortByUrl={sortByUrl} 
          searchLabel={label} 
          searchUrl={url}
        />

      </>
    )
}
