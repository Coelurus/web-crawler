import { NodeObject } from "react-force-graph-2d";
import '../css/CrawledDetail.css'
import { Dispatch, SetStateAction } from "react";

export default function CrawledDetail({node, setNode}:{node:NodeObject|null, setNode:Dispatch<SetStateAction<NodeObject|null>>}){
    return(
        <>
            {node && 
            <div id="crawled-detail">
                <h2>Crawl Detail</h2>
                <p><b>URL:</b> <a href={node.url}>{node.url}</a></p>
                {node.crawlTime && <p><b>Crawl time:</b> {node.crawlTime}</p>}
                
                <button onClick={() => setNode(null)}>Close</button>
            </div>}
        </>
    )
}