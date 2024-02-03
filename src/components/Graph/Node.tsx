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
      {node.isAccept && (
        <CircleNode cx={node.x} cy={node.y} r={18} style={{ fill: 'transparent', stroke: 'white', zIndex: 2 }} />
      )}
      <TextNode x={node.x} y={node.y} width={20} textContent={node.state.name} style={{ fill: 'black', zIndex: 3 }} />
    </>
  );
};

export default Node;
