
import { ChangeEvent, useEffect, useState } from 'react'
import './css/App.css'
import Records from "./record_components/Records"
import Record from './record_components/Record'
import ForceGraph, { LinkObject, NodeObject } from 'react-force-graph-2d'

import { fetchCrawls, fetchLinks, fetchRecords, fetchTags } from './data-service'
import CreateRecordDialog from './CreateRecordDialog'
import EditRecordDialog from './EditRecordDialog'
import CrawledDetail from './Graph/CrawledDetail'


export default function App() {
  
  // const recordsDummy = [
  //   new Record(0, 'webik', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04' ),
  //   new Record(1, 'Wiki', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
  //   new Record(2, 'test', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'],new Date('2017-07-21T17:32:28Z'), '362:05:04'),
  //   new Record(3, 'webik1', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04' ),
  //   new Record(4, 'Wiki1', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
  //   new Record(5, 'test1', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
  //   new Record(6, 'webik2', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04' ),
  //   new Record(7, 'Wiki2', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
  //   new Record(8, 'test2', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'], new Date('2017-07-21T17:32:28Z'), '362:05:04')
  // ]
  // const [records, setRecords] = useState<Record[]>(recordsDummy)
  const [records, setRecords] = useState<Record[]>([])
  const [links, setLinks] = useState<LinkObject[]>([])
  const [nodes, setNodes] = useState<NodeObject[]>([])
  const [change, setChange] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>([])
  const [editingRecord, setEditingRecord] = useState<Record|null>(null)
  const [domainView, setDomainView] = useState<boolean>(true)
  const [selectedNode, setSelectedNode] = useState<NodeObject|null>(null)

  useEffect(() => {
    fetchRecords().then(data => {
      setRecords(data)
    })
    // fetchLinks().then(data =>{
    //   setLinks(data)
    // })
    fetchTags().then(data => {
      setTags(data)
    })
    fetchCrawls().then(data => {
      const allNodes = data.map<NodeObject>(crawl => {
        return{
          id: crawl.id,
          label: crawl.title.substring(0, 20),
          url: crawl.url,
          executionId: crawl.executionId,
          color: 'darkgreen',
          state: crawl.state,
          crawlTime: crawl.crawlTime
        }
      })

      if (domainView){ // get nodes with the same domain to one node
        let domains:string[] = []
        const domainRegex:RegExp = /:\/\/(.[^\/])*\//
        let domainNodes:NodeObject[] = []

        let webToDomainId:{[key: number]: number} = []

        allNodes.forEach(node => {
          const match = node.url.match(domainRegex)
          if (match){
              const domain = match[0].slice(3, match[0].length)
              
              if (!domains.includes(domain)){
                domains.push(domain)
                node.label = domain
                domainNodes.push(node)
                webToDomainId[node.id as number] = node.id as number
              }
              else{
                const foundNode = domainNodes.find(node => {
                  const domainMatch = node.url.match(domainRegex)![0]
                  return domainMatch.slice(3,domainMatch.length) === domain

                })
                webToDomainId[node.id as number] = foundNode!.id as number
              }
          }
          
        })
        fetchLinks().then(data => {
          setLinks(data.map<LinkObject>(link => {
            return { 
              source: webToDomainId[link.source as number], 
              target: webToDomainId[link.target as number]} // change web id to domain id
          }))
        })
        setNodes(domainNodes)
      }else{
        fetchLinks().then(data => {setLinks(data)})
        setNodes(allNodes)  
      }
      
    })
  }, [change])
  const handleViewChange = (event: ChangeEvent<HTMLInputElement>) =>{
    
    setDomainView(event.currentTarget.checked)
    setChange(prevState => !prevState)
  }

  return(
    <>
      <CreateRecordDialog setChange={setChange}/>
      <Records records={records} tags={tags} setEditingRecord={setEditingRecord} setChange={setChange}/>
      {editingRecord && <><EditRecordDialog editingRecord={editingRecord} setChange={setChange}/> <button onClick={() => setEditingRecord(null)}>Close</button></>}
      
      <hr />
      <span>View: </span>
      <label htmlFor="domain-radio">domain
        
      <input type="radio" name='graph-visual' checked={domainView} onChange={handleViewChange} id='domain-radio'/>
      </label>
      <label htmlFor="web-radio">web
        <input type="radio" name='graph-visual' id='web-radio'/>
      </label>
      <div id='graph'>
        {selectedNode && <><CrawledDetail node={selectedNode} setNode={setSelectedNode}/> </>}
        <ForceGraph 
          graphData={{nodes: nodes, links: links}} 
          width={750}
          backgroundColor='lightblue'
          nodeAutoColorBy={(node) => node.state}
          nodeLabel={(node) => node.url}
          
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label:string = node.label;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // ctx.fillStyle = node.color;
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