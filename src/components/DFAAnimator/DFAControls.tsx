import { DFA } from '../../Automata/DFA';
import { observer } from 'mobx-react-lite';

export interface DFAAnimatorProps {
  dfa: DFA;
}

const DFAControls = observer(({ dfa }: DFAAnimatorProps) => {
  return (
    <div
      className={`dfa-controls d-flex flex-column align-items-center gap-1 ${DFA.isDFAValid(dfa) ? '' : 'disabled'}`}
    >
      <div className="d-flex justify-content-center">
        {dfa.states.map((state) => (
          <div key={state.id} style={{ color: state.id === dfa.currentState ? 'orange' : '', paddingRight: '1ch' }}>
            {state.name}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center dfa-controls-input-container">
        <input
          className=""
          placeholder="Enter Input"
          value={dfa.input}
          onChange={(e) => {
            dfa.setInput(e.target.value);
          }}
        ></input>
        {dfa.input.split('').map((l, i) => (
          <div key={i} className="" style={{ color: i === dfa.currentIndex ? 'red' : '' }}>
            {l}
          </div>
        ))}
      </div>

      <div className="d-flex gap-1">
        <button
          className="flex-grow-1"
          onClick={(e) => {
            if (dfa.isEnd()) {
              dfa.currentIndex = -1;
              dfa.currentState = dfa.initialState;
            }
            !dfa.inTransition && dfa.nextAsync();
          }}
          disabled={dfa.inTransition}
        >
          Start
        </button>
        <button
          className="flex-grow-1"
          onClick={(e) => {
            dfa.currentIndex = -1;
            dfa.currentState = dfa.initialState;
          }}
          disabled={dfa.currentIndex === -1}
        >
          Reset
        </button>
        <button
          className="flex-grow-1"
          onClick={(e) => {
            !dfa.inTransition && dfa.nextAsync();
          }}
          disabled={dfa.inTransition || dfa.isEnd()}
        >
          Next Step
        </button>
      </div>
    </div>
  );
});

export default DFAControls;
