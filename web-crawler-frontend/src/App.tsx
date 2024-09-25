
import { useEffect, useState } from 'react'
import './css/App.css'
import Records from "./record_components/Records"
import Record from './record_components/Record'
import ForceGraph, { LinkObject, NodeObject } from 'react-force-graph-2d'

import { fetchCrawls, fetchLinks, fetchRecords, fetchTags } from './data-service'
import CreateRecordDialog from './CreateRecordDialog'


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

  useEffect(() => {
    fetchRecords().then(data => {
      setRecords(data)
    })
    fetchLinks().then(data =>{
      setLinks(data)
    })
    fetchTags().then(data => {
      setTags(data)
    })
    fetchCrawls().then(data => {
      setNodes(data.map<NodeObject>(crawl => {
        return{
          id: crawl.id,
          label: crawl.title.substring(0, 20),
          url: crawl.url,
          executionId: crawl.executionId,
          color: 'darkgreen'
        }
      }))
    })
  }, [change])
  // function createNodes():Array<NodeObject>{
  //   const nodes:NodeObject[] = records.map<NodeObject>(record =>{
  //     return {
  //       group: 'root',
  //       id: record.crawledData.id,
  //       label: record.label,
  //       url: record.url,
  //       crawlTime: record.timeOfExecution,
  //       color: 'darkmagenta',
  //       records: new Array<CrawledWeb>()
  //     }
  //   })
  //   return nodes
  // }


  return(
    <>
      <CreateRecordDialog setChange={setChange}/>
      <Records records={records} tags={tags} setChange={setChange}/>
      <hr />
      <div>
        <ForceGraph 
          graphData={{nodes: nodes, links: links}} 
          width={750}
          backgroundColor='lightblue'
          nodeAutoColorBy={(node) => node.group}
          nodeLabel={(node) => node.label}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label:string = node.label;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x!, node.y!);

            node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            const bckgDimensions = node.__bckgDimensions;
            bckgDimensions && ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
          }}
          // onNodeClick={(node, event) => {
            
          // }}
          linkDirectionalArrowRelPos={1}
          linkDirectionalArrowLength={5}
          linkWidth={3}
          
          
        />
      </div>
      <hr />
      </>
  )
}