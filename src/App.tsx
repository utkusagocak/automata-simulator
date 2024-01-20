import { DFA, DFAState, DFATransitionMatrix, DFATransitions } from './Automata/DFA';

import './App.css';
import DFAAnimator from './components/DFAAnimator/DFAAnimator';
import { useState } from 'react';
import DFAVisualizer from './components/DFAAnimator/DFAVisualizer';

const states = [1, 2, 3, 4];
const alphabet = 'ab';
const transitionFunction: DFATransitions = {
  1: {
    a: 2,
    b: 1,
  },
  2: {
    a: 2,
    b: 3,
  },
  3: {
    a: 4,
    b: 1,
  },
  4: {
    a: 4,
    b: 4,
  },
};

const dfaStr = `#Q: 1 2 3 4

#I: 1

#F: 4

#A: a b

#T: 
1 a 2
1 b 1

2 a 2
2 b 3

3 a 4
3 b 1

4 a 4
4 b 4

`;

interface DFAData {
  Q: DFAState[];
  A: string;
  I: DFAState;
  F: DFAState[];
  T: DFATransitionMatrix;
}

function App() {
  const [dfa, setDfa] = useState<DFA>(new DFA(states, alphabet, transitionFunction, 1, [4]));

  const parser = (value: string) => {
    const matches = value.matchAll(/#([a-zA-Z]):([^#]*)/gm);
    const data = [...matches];
    const dfaData: DFAData = {
      Q: [],
      A: '',
      I: '',
      F: [],
      T: {},
    };

    for (const match of data) {
      const key = match[1].trim().toUpperCase() as keyof DFAData;
      const value = match[2].trim();
      switch (key) {
        case 'Q':
          dfaData.Q = value.split(/ |\n|\r/).filter((v) => v !== '');
          break;
        case 'A':
          dfaData.A = value.replace(/ |\n|\r/g, '');
          break;
        case 'I':
          dfaData.I = value.trim();
          break;
        case 'F':
          dfaData.F = value.split(' ').filter((v) => v !== '');
          break;
        case 'T':
          // eslint-disable-next-line no-case-declarations
          const transitions = value.split(/\n|\r/);
          for (const transition of transitions) {
            const [from, letter, to] = transition.split(' ');
            if (from && letter && to) {
              if (!dfaData.T[from]) dfaData.T[from] = {};
              dfaData.T[from][letter] = to;
            }
          }
          break;
        default:
          break;
      }
    }

    const dfa = new DFA(dfaData.Q, dfaData.A, dfaData.T, dfaData.I, dfaData.F);
    if (DFA.isDFAValid(dfa)) {
      setDfa(dfa);
    }
  };

  return (
    <div className="main">
      <div className="graph-container">
        <DFAVisualizer dfa={dfa} />
      </div>
      <div className="dfa-animator">
        <DFAAnimator dfa={dfa} />
      </div>
      <div className="text-editor">
        <textarea
          defaultValue={dfaStr}
          className="p-3"
          rows={10}
          onChange={(e) => {
            parser(e.target.value);
          }}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
