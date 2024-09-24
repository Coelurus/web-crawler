import { NodeObject } from "react-force-graph-2d";
import CrawledWeb from "./CrawledWeb";


export default function CrawledDetail(node:NodeObject){
    return(
        <>
            <div id="other-detail">
                url: {node.url}
                {node.records.map((record:CrawledWeb) => {
                    {record.title}
                    <button>Create Execution</button>
                })}

            </div>
        </>
    )
}