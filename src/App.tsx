import { DFA, DFATransitions } from './Automata/DFA';
import DFAControls from './components/DFAAnimator/DFAControls';
import { useLayoutEffect, useState } from 'react';
import DFAVisualizer from './components/DFAAnimator/DFAVisualizer';
import { DFADesigner } from './components/DFAAnimator/DFADesigner';

import './App.css';
import './Common.css';
/**
 * TODO:
 *  * DFA Grap is not updating automaticly.
 *  * Automatic animation (start, stop, reset, etc.)
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
      <div className="dfa-controls-container">
        <DFAControls dfa={dfa} />
      </div>
      <div className="dfa-designer-container">
        <DFADesigner dfa={dfa} />
      </div>
    </div>
  );
}

export default App;
