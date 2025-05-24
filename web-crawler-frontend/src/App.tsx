
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { LinkObject, NodeObject  } from 'react-force-graph-2d'
import Graph from './graph/Graph'
import Records from "./table/Records"
import Record from './data-classes/Record'
import RecordDialog from './dialogs/RecordDialog'
import { createRecord, editRecord, fetchCrawls, fetchLinks, fetchRecords, fetchTags } from './data-service'
import CrawledWeb from './data-classes/CrawledWeb'
import { ToggleSwitch } from './utils/ToggleSwitch'
import toast, { Toaster } from 'react-hot-toast'
import './css/CreateDialog.css'
import './css/App.css'


export default function App() {

  const [records, setRecords] = useState<Record[]>([])
  const [activeRecordIds, setActiveRecordIds] = useState<number[]>([])
  const [allCrawls, setAllCrawls] = useState<CrawledWeb[]>([])
  const [allLinks, setAllLinks] = useState<LinkObject[]>([])
  const [change, setChange] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>([])
  const [editingRecord, setEditingRecord] = useState<Record|null>(null)
  const [domainView, setDomainView] = useState<boolean>(false)
  const [selectedNode, setSelectedNode] = useState<NodeObject|null>(null)
  const [liveMode, setLiveMode] = useState<boolean>(false)
  const liveIntervalMs = 5000

  useEffect(() => {
    const fetchAll = async () => {
      
      const [recordsData, linksData, tagsData, crawlsData] = await Promise.all([
        fetchRecords(),
        fetchLinks(),
        fetchTags(),
        fetchCrawls()
      ])


      setRecords(recordsData)
      setAllLinks(linksData)
      setTags(tagsData)
      setAllCrawls(crawlsData)
    }
    fetchAll()
    let interval: number | null = null;

    if (liveMode) {
      interval = window.setInterval(fetchAll, liveIntervalMs);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [change, liveMode]);


  type NodesDomainMapping = {processedNodes: NodeObject[], webToDomain: {[key: number]: string}}

  const {processedNodes, webToDomain}: NodesDomainMapping = useMemo(processNodes, [allCrawls, domainView, change])
  const processedLinks = useMemo(processLinks, [allLinks, domainView, change])
  
  
  
  const handleViewChange = (value: boolean) =>{
    setDomainView(value)
    setChange(prevState => !prevState)
  }
  const handleLiveModeChange = (value: boolean) =>{
    setLiveMode(value)
  }

  function processNodes() : NodesDomainMapping {
    if (allCrawls.length === 0) return {processedNodes: [], webToDomain: {}}
    const activeRecordExecs = getExecutionIds(activeRecordIds)
    const activeCrawls = filterCrawlsByExecutionIds(allCrawls, activeRecordExecs)
    if (!domainView){

      return {
        processedNodes: activeCrawls.map(crawl => ({
          id: crawl.id,
          label: crawl.state != crawl.title ? crawl.title.substring(0, 20) : crawl.url.substring(0, 20),
          title: crawl.state != crawl.title ? crawl.title : null,
          url: crawl.url,
          executionId: crawl.executionId,
          color: 'darkgreen',
          state: crawl.state,
          crawlTime: crawl.crawlTime,
        })),
        webToDomain: {}
      }
    }
    let domains:string[] = []
    const domainRegex:RegExp = /:\/\/([^\/?#]+)/
    let domainNodes:NodeObject[] = []

    let webToDomain:{[key: number]: string} = {}

    activeCrawls.forEach(crawl => {
      const match = crawl.url.match(domainRegex)
      if (!match) return // not a valid url
      const domain = match[1]

      const baseNode: NodeObject = {
        id: domain,
        label: domain,
        url: crawl.url,
        executionId: crawl.executionId,
        color: 'darkgreen',
        state: crawl.state,
        crawlTime: crawl.crawlTime,
      }

      if (!domains.includes(domain)){
        domains.push(domain)
        domainNodes.push(baseNode)
      }
      webToDomain[crawl.id as number] = domain
    })
    return {processedNodes: domainNodes, webToDomain: webToDomain}
  }
  function processLinks() : LinkObject[] {
    const activeRecordExecs = getExecutionIds(activeRecordIds)

    if (!domainView){ 
      const filteredLinks = filterLinksByExecutionIds(allLinks, activeRecordExecs)
      return filteredLinks.filter(link => link.source && link.target)
    }

    const loadedLinks = allLinks
      .filter(link => webToDomain[link.source as number] && webToDomain[link.target as number]) // filter the loaded nodes
    return  filterLinksByExecutionIds(loadedLinks, activeRecordExecs)
      .map<LinkObject>(link => ({
        source: webToDomain[link.source as number],
        target: webToDomain[link.target as number]
      }))
  }
  function filterCrawlsByExecutionIds(crawls: CrawledWeb[], execution_ids: number[]) : NodeObject[] {
    return crawls.filter(crawl => execution_ids.includes(crawl.executionId))
  }
  function filterLinksByExecutionIds(links: LinkObject[], execution_ids: number[]) : LinkObject[] {
    return links.filter(link => execution_ids.includes(allCrawls.find(crawl => crawl.id === link.source)?.executionId as number))
  }
  function getExecutionIds(record_ids: number[]) : number[] {
    const activeRecords : Record[] = records.filter(record => record_ids.includes(record.id))
    return activeRecords.map(record => record.crawledData?.executionId)
  }

  function validateFormData(formData: FormData): boolean {
      return formData.has('label') && formData.get('label')?.toString().length !== 0 &&
      formData.has('url') && formData.get('url')?.toString().length !== 0 &&
      formData.has('boundaryRegExp') && formData.get('boundaryRegExp')?.toString().length !== 0 &&
      formData.has('periodicity') && formData.get('periodicity') !== '0:0:0'
  }

  async function onCreateSubmit(event: FormEvent) {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      const formData = new FormData(form)

      formData.set('tags', JSON.stringify( tags ))
      formData.set('active', 'true')

      if (!validateFormData(formData)){
        toast.error(`Please fill the label, url, boundary RegEx and periodicity`, {duration: 3250})
        return
      }

      try{
        const createPromise = createRecord(formData)
        toast.promise(createPromise, {
          loading: 'Loading...',
          success: 'Record created!',
          error: "Couldn't create a record"
        })
        const addedRecord = await createPromise

        setChange(prevState => !prevState)
        setLiveMode(true)
        setActiveRecordIds(prev => [...prev, addedRecord.id])
          
      } catch (error){
          console.error(error)
      }
  }
  async function onEditSubmit(event: FormEvent) {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      const formData = new FormData(form)

      formData.set('tags', JSON.stringify(tags))
      formData.set('active', 'true')
      if (editingRecord === null){
        throw new Error("Editing record missing")
      }
      formData.set('id', editingRecord.id.toString())

      try {
          const editPromise = editRecord(formData)
          toast.promise(editPromise, {
            loading: 'Loading...',
            success: 'Record edited!',
            error: 'Failed to edit a record'
          })
          await editPromise
          setChange(prevState => !prevState)
          
      } catch (error) {
          console.error(error)
      }

  }
  return(
    <>
      <Toaster />
      <RecordDialog id='create-dialog' 
        buttonLabel='Create a Record' 
        onSubmit={onCreateSubmit} 
      />
      <Records 
        records={records} 
        activeRecordIds={activeRecordIds} 
        setActiveRecordIds={setActiveRecordIds} 
        tags={tags} 
        setEditingRecord={setEditingRecord} 
        setChange={setChange}
      />
      {editingRecord && 
      <RecordDialog id='edit-dialog' 
        onSubmit={onEditSubmit} 
        editingRecord={editingRecord} 
        emptyEditingRecord={() => setEditingRecord(null)}
      />}
      
      <hr />

      <ToggleSwitch switchLabel='Mode' labelOn='Live' labelOff='Static' checked={liveMode} onChange={handleLiveModeChange}/>
    
      <ToggleSwitch switchLabel='View' labelOn='Domain' labelOff='Web' checked={domainView} onChange={handleViewChange} />
      
      <div id='graph'>
        <Graph 
          nodes={processedNodes} 
          links={processedLinks} 
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode} 
        />
      </div>
      <hr />
      </>
  )

}