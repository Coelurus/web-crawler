import { Dispatch, SetStateAction } from 'react'
import ForceGraph2D, { LinkObject, NodeObject, ForceGraphMethods  } from 'react-force-graph-2d'
  
type GraphProps = {
    nodes: NodeObject[], 
    links: LinkObject[], 
    setSelectedNode: Dispatch<SetStateAction<NodeObject|null>>
}

export default function Graph({nodes, links, setSelectedNode}:GraphProps) {
    return <ForceGraph2D 
        graphData={{ nodes: nodes, links: links }}
        width={750}
        backgroundColor='lightblue'
        nodeAutoColorBy={(node) => node.state}
        nodeLabel={(node) => node.url}

        nodeCanvasObject={(node, ctx, globalScale) => {
        const label: string = node.label
        const fontSize = 12 / globalScale
        ctx.font = `${fontSize}px Sans-Serif`
        const textWidth = ctx.measureText(label).width
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1])

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (node.state === 'SEARCHED') {
            ctx.fillStyle = node.color
        }
        else {
            ctx.fillStyle = 'darkred'
        }
        ctx.fillText(label, node.x!, node.y!)

        node.__bckgDimensions = bckgDimensions
        } }
        nodePointerAreaPaint={(node, color, ctx) => {

        ctx.fillStyle = color
        const bckgDimensions = node.__bckgDimensions
        bckgDimensions && ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1])
        } }
        onNodeClick={(node, event) => {
        setSelectedNode(node)
        } }
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowLength={5}
        linkWidth={3} />
}