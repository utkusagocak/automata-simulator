import Circle from '../Svg/Circle';

const Node = ({ node }: { node: any }) => {
  return (
    <g key={node.state}>
      <Circle cx={node.x} cy={node.y} r={25} fill={'orange'}></Circle>
      <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline={'middle'}>
        {node.state}
      </text>
    </g>
  );
};

export default Node;
