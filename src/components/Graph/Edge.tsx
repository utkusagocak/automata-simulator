import { Geometry } from '../../math';
import { CircleNode } from '../Canvas/Nodes/CircleNode';
import { PathNode } from '../Canvas/Nodes/PathNode';
import { RectNode } from '../Canvas/Nodes/RectNode';
import { TextNode } from '../Canvas/Nodes/TextNode';

const Edge = ({ edge, graph, isActive = false }: { edge: any; graph: any; isActive?: boolean }) => {
  const from = graph.nodes[edge.from];
  const to = graph.nodes[edge.to];

  // TODO
  const radius = from.x === to.x ? 20 : Math.abs(from.x - to.x) / 2;
  const fromX = from.state === to.state ? from.x - 10 : from.x;
  const fromY = from.state === to.state ? from.y + 10 : from.y;
  const toX = from.state === to.state ? to.x - 10 : to.x;
  const toY = from.state === to.state ? to.y - 10 : to.y;

  const point1 = { x: fromX, y: fromY };
  const point2 = { x: toX, y: toY };
  const intersections = Geometry.getIntersectionOf2Circles({ c: point1, r: radius }, { c: point2, r: radius });
  if (intersections === null) throw new Error('getCenterPoint: No circle.');

  const center = intersections[0];
  const midpoint = Geometry.getMidPointOfArc(center, point1, point2);

  const intersectionsDest = Geometry.getIntersectionOf2Circles(
    { c: { x: to.x, y: to.y }, r: 20 },
    { c: center, r: radius },
  );
  if (intersectionsDest === null) throw new Error('getCenterPoint: No circle.');

  const p1 = Geometry.toPolar(point1, center);
  const p2 = Geometry.toPolar(point2, center);
  const p3 = Geometry.toPolar(intersectionsDest[0], center);
  const p4 = Geometry.toPolar(intersectionsDest[1], center);

  const arrowDest = p3.t > p1.t && p3.t < p2.t ? intersectionsDest[0] : intersectionsDest[1];

  return (
    <>
      <PathNode
        d={`M ${fromX} ${fromY} A ${radius} ${radius} ${0} ${1} ${1} ${toX} ${toY}`}
        style={{ stroke: isActive ? 'red' : 'orange', fill: 'transparent' }}
      />
      <TextNode
        x={midpoint.x}
        y={midpoint.y}
        width={20}
        textContent={edge.conditions.join('')}
        style={{
          fill: 'white',
          font: '10px monospace',
          textAlign: 'center',
          textBaseline: 'middle',
          background: '#242424',
        }}
      />
      {/* <RectNode x={arrowDest.x - 2} y={arrowDest.y - 2} width={2} height={2} style={{ fill: 'white' }} /> */}
    </>
  );
};

export default Edge;
