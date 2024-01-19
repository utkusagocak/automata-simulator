import { DFA, DFAState } from './DFA';

export function createDFAGraph(dfa: DFA) {
  const nodes: { [key: DFAState]: any } = {};
  const edges: { [key: string]: any } = {};
  if (!DFA.isDFAValid(dfa)) return { nodes, edges };

  const lastY = 0;
  let lastX = 0;
  for (const state of dfa.states) {
    nodes[state] = {
      state: state,
      x: lastX,
      y: lastY,
    };
    lastX += 200;
  }

  for (const state of dfa.states) {
    for (const letter of dfa.alphabet) {
      const nextState = dfa.nextState(state, letter);
      const key = `${state}-${nextState}`;

      if (!edges[key]) {
        edges[key] = { from: state, to: nextState, conditions: [] };
      }

      edges[key].conditions.push(letter);
    }
  }

  return { nodes, edges };
}
