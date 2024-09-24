
import { useState } from 'react'
import './css/App.css'
import Records from "./record_components/Records"
import Record from './record_components/Record'
import ForceGraph, { GraphData, LinkObject, NodeObject } from 'react-force-graph-2d'
import CrawledWeb from './Graph/CrawledWeb'

// import { fetchRecords } from './data-service'
export default function App() {
  
  const recordsDummy = [
    new Record(0, 'webik', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04' ),
    new Record(1, 'Wiki', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
    new Record(2, 'test', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'],new Date('2017-07-21T17:32:28Z'), '362:05:04'),
    new Record(3, 'webik1', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04' ),
    new Record(4, 'Wiki1', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
    new Record(5, 'test1', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
    new Record(6, 'webik2', 'https://webik.ms.mff.cuni.cz', '.*wiki.*', '1:20:00', ['UNI', 'WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04' ),
    new Record(7, 'Wiki2', 'https://cs.wikipedia.org', '*.wiki.*', '00:24:00', ['WIKI'], new Date('2017-07-21T17:32:28Z'), '362:05:04'),
    new Record(8, 'test2', 'https://a.b.cz', '*aaa*', '00:00:30', ['UNI'], new Date('2017-07-21T17:32:28Z'), '362:05:04')
  ]
  const [records] = useState<Record[]>(recordsDummy)
  // useEffect(() => {
    //   // fetchRecords().then(data => {
      //     // setRecords(data)
      
      //     setRecords(records)
      //   })
      // })
      function createNodes():Array<NodeObject>{
        const nodes:NodeObject[] = records.map<NodeObject>(record =>{
          return {
            group: 'record',
            id: record.id,
            label: record.label,
            url: record.url,
            crawlTime: record.timeOfExecution,
            color: 'darkmagenta',
            records: new Array<CrawledWeb>()
          }
        })
        return nodes
      }

      function createLinks():Array<LinkObject>{
        return new Array<LinkObject>({source: 0, target: 1}, {source: 2, target:1})
      }

      function createGraphData():GraphData{
        return {
          nodes: createNodes(),
          links: createLinks()
        }
      }


      return(
        <>
          <Records records={records}/>
          <hr />
          <div>
            <ForceGraph 
              graphData={createGraphData()} 
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
              onNodeClick={(node, event) => {
                
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