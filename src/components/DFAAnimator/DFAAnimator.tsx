import { DFA } from '../../Automata/DFA';
import { observer } from 'mobx-react-lite';

export interface DFAAnimatorProps {
  dfa: DFA;
}

const DFAAnimator = observer(({ dfa }: DFAAnimatorProps) => {
  return (
    <div className="d-flex flex-column align-items-center gap-1">
      <div className="d-flex justify-content-center">
        {dfa.states.map((state) => (
          <div
            key={state}
            style={{ color: !dfa.inTransition && state === dfa.currentState ? 'orange' : '', paddingRight: '1ch' }}
          >
            {state}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center dfa-animator-input-container">
        <input
          className=""
          placeholder="Enter Input"
          value={dfa.input}
          onChange={(e) => {
            dfa.setInput(e.target.value);
          }}
        ></input>
        {dfa.input.split('').map((l, i) => (
          <div key={i} className="" style={{ color: dfa.inTransition && i === dfa.currentIndex ? 'red' : '' }}>
            {l}
          </div>
        ))}
      </div>

      <div className="d-flex gap-1">
        <button
          className="flex-grow-1"
          onClick={(e) => {
            !dfa.inTransition && dfa.nextAsync();
          }}
          disabled={dfa.inTransition}
        >
          Start
        </button>
        <button
          className="flex-grow-1"
          onClick={(e) => {
            !dfa.inTransition && dfa.nextAsync();
          }}
          disabled={dfa.inTransition}
        >
          Next Step
        </button>
      </div>
    </div>
  );
});

export default DFAAnimator;
