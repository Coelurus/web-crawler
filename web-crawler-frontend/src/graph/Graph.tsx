import { useEffect, useRef, useState } from 'react';
import ForceGraph2D, { LinkObject, NodeObject } from 'react-force-graph-2d';
import CrawledDetail from './CrawledDetail';

type GraphProps = {
  nodes: NodeObject[];
  links: LinkObject[];
  reloadData(): void;
};

export default function Graph({ nodes, links, reloadData }: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <CrawledDetail node={selectedNode} setNode={setSelectedNode} reloadData={reloadData} />

      <ForceGraph2D
        graphData={{ nodes: nodes, links: links }}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="lightblue"
        nodeAutoColorBy={(node) => node.state}
        nodeLabel={(node) => node.url}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label: string = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x! - bckgDimensions[0] / 2,
            node.y! - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (node.state === 'SEARCHED') {
            ctx.fillStyle = node.color;
          } else {
            ctx.fillStyle = 'darkred';
          }
          ctx.fillText(label, node.x!, node.y!);

          node.__bckgDimensions = bckgDimensions;
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          if (bckgDimensions) {
            ctx.fillRect(
              node.x! - bckgDimensions[0] / 2,
              node.y! - bckgDimensions[1] / 2,
              bckgDimensions[0],
              bckgDimensions[1]
            );
          }
        }}
        onNodeClick={(node) => {
          setSelectedNode(node);
        }}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowLength={5}
        linkWidth={3}
      />
    </div>
  );
}
