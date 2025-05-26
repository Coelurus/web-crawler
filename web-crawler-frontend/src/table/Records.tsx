
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react'

import RecordsHeader from './RecordsHeader'
import RecordsTable from './RecordsTable'
import Record from '../data-classes/Record'


type RecordsProps = {
  records:Record[], 
  activeRecordIds: Array<number>,
  setActiveRecordIds: Dispatch<SetStateAction<number[]>>,
  tags:string[], 
  setEditingRecord:Dispatch<SetStateAction<Record|null>>, 
  reloadData(): void
}

export default function Records({records, activeRecordIds, setActiveRecordIds, tags, setEditingRecord, reloadData}: RecordsProps)
{

  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortByUrl, setSortByUrl] = useState<boolean>(false) 
  


  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }
  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
  }
  const handleTagsChange = (newTags: Array<string>) => {
    setSelectedTags(newTags)
  }

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      if (sortByUrl) {
        return a.url.localeCompare(b.url);
      }
      const timeA = (a.lastExecution?.startTime ?? new Date(0)).getTime();
      const timeB = (b.lastExecution?.startTime ?? new Date(0)).getTime();
      return timeB - timeA;
    });
  }, [records, sortByUrl]);
  
  const handleSortChange = (value: boolean) => {
    setSortByUrl(value);
  };

  return (
    <>
      <h1>Records</h1>
      <RecordsHeader 
        url={url} 
        label={label} 
        sortByUrl={sortByUrl}
        tags={tags}
        selectedTags={selectedTags}
        onUrlChange={handleUrlChange} 
        onLabelChange={handleLabelChange} 
        onSelectedTagsChange={handleTagsChange}
        onSortByUrlChange={handleSortChange}
      />
      <RecordsTable 
        records={sortedRecords} 
        activeRecordIds={activeRecordIds}
        setActiveRecordIds={setActiveRecordIds}
        itemsPerPage={3}
        searchLabel={label} 
        searchUrl={url}
        searchTags={selectedTags}
        setEditingRecord={setEditingRecord}
        reloadData={reloadData}
      />

    </>
  )
}
