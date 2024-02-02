import { DFA, DFATransitions } from './Automata/DFA';

import './App.css';
import DFAAnimator from './components/DFAAnimator/DFAAnimator';
import { useState } from 'react';
import DFAVisualizer from './components/DFAAnimator/DFAVisualizer';
import { DFADesigner } from './components/DFAAnimator/DFADesigner';

const states = ['1', '2', '3', '4'];
const alphabet = 'ab';
const transitionFunction: DFATransitions = {
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
  const [dfa, setDfa] = useState<DFA>(new DFA(states, alphabet, transitionFunction, '1', ['4']));

  return (
    <div className="main">
      <div id="visible-graph-area"></div>
      <div className="graph-container">
        <DFAVisualizer dfa={dfa} />
      </div>
      <div className="dfa-animator">
        <DFAAnimator dfa={dfa} />
      </div>
      <div className="dfa-designer">
        <DFADesigner dfa={dfa} onChange={(dfa) => setDfa(dfa)} />
      </div>
    </div>
  );
}

export default App;
