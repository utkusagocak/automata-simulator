const Edge = ({ edge, graph }: { edge: any; graph: any }) => {
  const from = graph.nodes[edge.from];
  const to = graph.nodes[edge.to];

  // TODO
  const radius = from.x === to.x ? 25 : (Math.abs(from.x - to.x) - 200) / 2;
  const fromX = from.state === to.state ? from.x - 10 : from.x;
  const fromY = from.state === to.state ? from.y + 10 : from.y;
  const toX = from.state === to.state ? from.x + 10 : to.x;
  const toY = from.state === to.state ? from.y + 10 : to.y;

  function getMidPoint() {}

  return (
    <g key={`${from.state}-${to.state}`}>
      <path
        d={`M ${fromX} ${fromY} A ${radius} ${radius} ${0} ${1} ${0} ${toX} ${toY}`}
        fill="transparent"
        stroke={'blue'}
      ></path>
    </g>
  );
};

export default Edge;
