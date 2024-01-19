import { useState } from 'react';
import { DFA, DFAState } from '../../Automata/DFA';
import { observer } from 'mobx-react-lite';

export interface DFAAnimatorProps {
  dfa: DFA;
}

const DFAAnimator = observer(({ dfa }: DFAAnimatorProps) => {
  return (
    <div className="d-flex flex-column align-items-center p-3">
      <input
        onChange={(e) => {
          dfa.setInput(e.target.value);
        }}
        value={dfa.input}
      ></input>
      <div className="d-flex flex-column p-1">
        <button
          onClick={(e) => {
            !dfa.inTransition && dfa.nextAsync();
          }}
          disabled={dfa.inTransition}
        >
          Next
        </button>
      </div>
      <div>
        <div className="d-flex p-1 justify-content-center">
          {dfa.input.split('').map((l, i) => (
            <div key={i} className="p-1" style={{ color: dfa.inTransition && i === dfa.currentIndex ? 'red' : '' }}>
              {l}
            </div>
          ))}
        </div>
        <div className="d-flex p-1 justify-content-center">
          {dfa.states.map((state) => (
            <div
              key={state}
              className="p-1"
              style={{ color: !dfa.inTransition && state === dfa.currentState ? 'orange' : '' }}
            >
              {state}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DFAAnimator;
