import { DFA, DFAState } from './DFA';

export function createDFAGraph(dfa: DFA) {
  const nodes: { [key: string]: any } = {};
  const edges: { [key: string]: any } = {};
  // if (!DFA.isDFAValid(dfa)) return { nodes, edges };

  const lastY = 0;
  let lastX = 0;
  for (const state of dfa.states) {
    nodes[state.id] = {
      state: state,
      x: lastX,
      y: lastY,
      isStart: dfa.initialState === state.id,
      isAccept: dfa.acceptStates.has(state.id),
    };
    lastX += 100;
  }

  for (const state of dfa.states) {
    for (const letter of dfa.alphabet) {
      const nextStateId = dfa.nextState(state.id, letter);
      const key = `${state.id}-${nextStateId}`;

      if (nextStateId && nodes[state.id] && nodes[nextStateId]) {
        if (!edges[key]) {
          edges[key] = { from: state.id, to: nextStateId, conditions: [] };
        }

        edges[key].conditions.push(letter);
      }
    }
  }

  return { nodes, edges };
}
