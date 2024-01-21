import { Geometry } from '../../math';
import { fromPolar, toRadian } from '../../math/Geometry';
import { PathNode } from '../Canvas/Nodes/PathNode';
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
  const angle1 = Geometry.angleBetween(center, intersectionsDest[0]);
  const angle2 = Geometry.angleBetween(center, intersectionsDest[1]);

  const arrowDest = angle1 > p1.t && angle1 < p2.t ? intersectionsDest[0] : intersectionsDest[1];
  const angle = angle1 > p1.t && angle1 < p2.t ? angle1 : angle2;

  const midAngle = Math.max(
    Geometry.angleBetween(center, midpoint),
    2 * Math.PI - Geometry.angleBetween(center, midpoint),
  );
  const d = Geometry.fromPolar({
    r: radius,
    t: angle > midAngle ? angle + toRadian(3 / radius) : angle - toRadian(3 / radius),
  });
  const dt = { x: d.x + center.x, y: d.y + center.y };
  const startAngle = Geometry.angleBetween(arrowDest, dt);

  const arrow2P = fromPolar({ r: 5, t: startAngle - toRadian(30) });
  const arrow2 = { x: arrow2P.x + arrowDest.x, y: arrow2P.y + arrowDest.y };
  const arrow3P = fromPolar({ r: 5, t: startAngle + toRadian(30) });
  const arrow3 = { x: arrow3P.x + arrowDest.x, y: arrow3P.y + arrowDest.y };

  return (
    <>
      <PathNode
        d={`M ${arrowDest.x} ${arrowDest.y} L ${arrow2.x} ${arrow2.y} L ${arrow3.x} ${arrow3.y} z`}
        style={{ fill: isActive ? 'red' : 'orange', stroke: isActive ? 'red' : 'orange', strokeWidth: 0.5 }}
      />
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
      {/* <CircleNode cx={dt.x} cy={dt.y} r={1} style={{ fill: 'red' }} /> */}
    </>
  );
};

export default Edge;
