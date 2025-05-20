
import { ChangeEvent, useEffect, useMemo, useState, useRef } from 'react'
import './css/App.css'
import Records from "./record_components/Records"
import Record from './record_components/Record'
import ForceGraph2D, { LinkObject, NodeObject, ForceGraphMethods  } from 'react-force-graph-2d'

import { fetchCrawls, fetchLinks, fetchRecords, fetchTags } from './data-service'
import CreateRecordDialog from './CreateRecordDialog'
import EditRecordDialog from './EditRecordDialog'
import CrawledDetail from './Graph/CrawledDetail'
import CrawledWeb from './Graph/CrawledWeb'


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
  }, [change])


  type NodesDomainMapping = {processedNodes: NodeObject[], webToDomain: {[key: number]: string}}

  const {processedNodes, webToDomain}: NodesDomainMapping = useMemo(processNodes, [allCrawls, domainView, change])

  const processedLinks = useMemo(processLinks, [allLinks, domainView, change])
  const handleViewChange = (event: ChangeEvent<HTMLInputElement>) =>{
    
    setDomainView(event.currentTarget.checked)
    setChange(prevState => !prevState)
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
      .filter(link => webToDomain[link.source as number] && webToDomain[link.target as number]) // filter the loaded nodes)
    return  filterLinksByExecutionIds(loadedLinks, activeRecordExecs)
      .map<LinkObject>(link => ({
        source: webToDomain[link.source as number],
        target: webToDomain[link.target as number]
      }))
    // return loadedLinks
  }
  function filterCrawlsByExecutionIds(crawls: CrawledWeb[], execution_ids: number[]) : NodeObject[] {
    return crawls.filter(crawl => execution_ids.includes(crawl.executionId))
  }
  function filterLinksByExecutionIds(links: LinkObject[], execution_ids: number[]) : LinkObject[] {
    return links.filter(link => execution_ids.includes(allCrawls.find(crawl => crawl.id === link.source)?.executionId as number))
  }
  function getExecutionIds(record_ids: number[]) : number[] {
    const activeRecords : Record[] = records.filter(record => record_ids.includes(record.id))
    return activeRecords.map(record => record.crawledData.executionId)
  }
  return(
    <>
      <CreateRecordDialog setChange={setChange}/>
      <Records records={records} activeRecordIds={activeRecordIds} setActiveRecordIds={setActiveRecordIds} tags={tags} setEditingRecord={setEditingRecord} setChange={setChange}/>
      {editingRecord && <><EditRecordDialog editingRecord={editingRecord} setChange={setChange}/> <button onClick={() => setEditingRecord(null)}>Close</button></>}
      
      <hr />
      <label htmlFor="domain-checkbox">Domain view
        <input type="checkbox" name='graph-visual' checked={domainView} onChange={handleViewChange} id='domain-checkbox'/>
      </label>
      <div id='graph'>
        {selectedNode && <CrawledDetail node={selectedNode} setNode={setSelectedNode}/> }
        <ForceGraph2D

          graphData={{nodes: processedNodes, links: processedLinks}}
          width={750}
          backgroundColor='lightblue'
          nodeAutoColorBy={(node) => node.state}
          nodeLabel={(node) => node.url}
          
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label:string = node.label;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth,fontSize].map(n => n + fontSize * 0.2);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (node.state === 'SEARCHED'){
              ctx.fillStyle = node.color;
            }
            else{
              ctx.fillStyle = 'darkred'
            }
            ctx.fillText(label, node.x!, node.y!);

            node.__bckgDimensions = bckgDimensions; 
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            
            ctx.fillStyle = color;
            const bckgDimensions = node.__bckgDimensions;
            bckgDimensions && ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
          }}
          onNodeClick={(node, event) => {
            setSelectedNode(node)
          }}
          linkDirectionalArrowRelPos={1}
          linkDirectionalArrowLength={5}
          linkWidth={3}
          
          
        />
      </div>
      <hr />
      </>
  )
}