import { DFA, DFATransitions } from './components/DFA/DFA';
import DFAControls from './components/DFA/DFAControls';
import { useLayoutEffect, useState } from 'react';
import DFAVisualizer from './components/DFA/DFAVisualizer';
import { DFADesigner } from './components/DFA/DFADesigner';

import './App.css';
import './Common.css';
/**
 * TODO:
 *  * Animations and cursors for DFAControls
 */
const states = ['1', '2', '3', '4'];
const alphabet = 'ab';
const transitions: DFATransitions = {
  1: {
    a: '2',
    b: '1',
  },
  2: {
    a: '2',
    b: '3',
  },
  3: {
    a: '4',
    b: '1',
  },
  4: {
    a: '4',
    b: '4',
  },
};

function App() {
  const [dfa, setDfa] = useState<DFA>(() => {
    // Initial DFA
    const dfa = new DFA();
    for (const name of states) {
      dfa.addState(name);
    }
    dfa.setAlphabet(alphabet);
    for (const fromName in transitions) {
      const from = dfa.states.find((s) => s.name === fromName);
      if (from) {
        for (const condition in transitions[fromName]) {
          const to = dfa.states.find((s) => s.name === transitions[fromName][condition]);
          if (to) dfa.addTransition(from, condition, to);
        }
      }
    }
    return dfa;
  });

  return (
    <div className="main">
      <div id="visible-graph-area"></div>
      <div className="graph-container">
        <DFAVisualizer dfa={dfa} />
      </div>
      <div className="right-panel">
        <div className="panel description-panel">
          <div className="panel-title">Deterministic Finite State Automata</div>
          <div className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum
          </div>
        </div>
        <DFAControls dfa={dfa} />
        <DFADesigner dfa={dfa} />
      </div>
    </div>
  );
}

export default App;
