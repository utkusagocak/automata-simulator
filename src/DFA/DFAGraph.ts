import { Geometry } from '../math';
import { DFA, DFAState } from './DFA';

export interface DFANode {
  state: DFAState;
  isStart?: boolean;
  isAccept?: boolean;
  isActive?: boolean;

  // Layout
  x: number;
  y: number;
}

export interface DFAEdge {
  from: string;
  to: string;
  conditions: string[];
  isActive?: boolean;

  // Layout
  arc: string;
  arrow: string;
  text: {
    x: number;
    y: number;
  };
}

export class DFAGraph {
  nodes: {
    [id: string]: DFANode;
  } = {};
  edges: { [key: string]: DFAEdge } = {};

  constructor() {}

  getEdgeWithLayout(edge: DFAEdge) {
    return calculateEdge(this.nodes[edge.from], this.nodes[edge.to]);
  }

  updateGraph(dfa: DFA) {
    // Remove nodes of removed states
    const newNodes: { [id: string]: boolean } = {};
    for (const state of dfa.states) {
      newNodes[state.id] = true;
    }
    for (const id in this.nodes) {
      if (!newNodes[id]) delete this.nodes[id];
    }

    // Add new nodes
    let lastX = 0;
    for (const state of dfa.states) {
      if (!this.nodes[state.id]) {
        this.nodes[state.id] = {
          state: state,
          x: lastX + 100,
          y: 0,
        };
      }

      lastX = this.nodes[state.id].x;
    }

    // Update nodes
    for (const state of dfa.states) {
      this.nodes[state.id].isStart = dfa.initialState === state.id;
      this.nodes[state.id].isAccept = dfa.acceptStates.has(state.id);
      this.nodes[state.id].isActive = dfa.currentState === state.id;
    }

    const newEdges: { [id: string]: boolean } = {};
    for (const id in this.edges) {
      this.edges[id].conditions = [];
    }

    for (const state of dfa.states) {
      for (const symbol of dfa.alphabet) {
        const nextStateId = dfa.nextState(state.id, symbol.char);
        const key = `${state.id}-${nextStateId}`;

        if (nextStateId && this.nodes[state.id] && this.nodes[nextStateId]) {
          if (!this.edges[key]) {
            // @ts-ignore
            this.edges[key] = { from: state.id, to: nextStateId, conditions: [] };
          }

          this.edges[key].conditions.push(symbol.char);
          newEdges[key] = true;
        }
      }
    }

    // Remove edges
    for (const id in this.edges) {
      if (!newEdges[id]) delete this.edges[id];
    }

    for (const key in this.edges) {
      const edge = this.edges[key];
      this.edges[key] = {
        ...edge,
        isActive:
          dfa.inTransition &&
          dfa.currentState === edge.from &&
          edge.conditions.includes(dfa.input[dfa.currentIndex]),
        ...calculateEdge(this.nodes[edge.from], this.nodes[edge.to]),
      };
    }
  }
}

function calculateEdge(from: DFANode, to: DFANode) {
  // TODO
  const radius = from.x === to.x ? 20 : Math.abs(from.x - to.x) / 2;
  const fromX = from.x === to.x ? from.x - 10 : from.x;
  const fromY = from.state === to.state ? from.y + 10 : from.y;
  const toX = from.state === to.state ? to.x - 10 : to.x;
  const toY = from.state === to.state ? to.y - 10 : to.y;

  const point1 = { x: fromX, y: fromY };
  const point2 = { x: toX, y: toY };
  const intersections = Geometry.getIntersectionOf2Circles(
    { c: point1, r: radius },
    { c: point2, r: radius },
  );
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
    t:
      angle > midAngle
        ? angle + Geometry.toRadian(3 / radius)
        : angle - Geometry.toRadian(3 / radius),
  });
  const dt = { x: d.x + center.x, y: d.y + center.y };
  const startAngle = Geometry.angleBetween(arrowDest, dt);

  const arrow2P = Geometry.fromPolar({ r: 5, t: startAngle - Geometry.toRadian(30) });
  const arrow2 = { x: arrow2P.x + arrowDest.x, y: arrow2P.y + arrowDest.y };
  const arrow3P = Geometry.fromPolar({ r: 5, t: startAngle + Geometry.toRadian(30) });
  const arrow3 = { x: arrow3P.x + arrowDest.x, y: arrow3P.y + arrowDest.y };

  return {
    arc: `M ${fromX} ${fromY} A ${radius} ${radius} ${0} ${1} ${1} ${toX} ${toY}`,
    arrow: `M ${arrowDest.x} ${arrowDest.y} L ${arrow2.x} ${arrow2.y} L ${arrow3.x} ${arrow3.y} z`,
    text: {
      x: midpoint.x,
      y: midpoint.y,
    },
  };
}
