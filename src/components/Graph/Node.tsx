import { CircleNode } from '../Canvas/Nodes/CircleNode';
import { TextNode } from '../Canvas/Nodes/TextNode';

const Node = ({ node, isActive }: { node: any; isActive?: boolean }) => {
  return (
    <>
      <CircleNode
        cx={node.x}
        cy={node.y}
        r={20}
        style={{ fill: isActive ? 'red' : 'orange', stroke: 'orange', zIndex: 1 }}
      />
      <TextNode x={node.x} y={node.y} width={20} textContent={node.state} style={{ fill: 'black', zIndex: 2 }} />
    </>
  );
};

export default Node;
