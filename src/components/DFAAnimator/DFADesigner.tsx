import { LuPlus, LuTrash } from 'react-icons/lu';
import { DFA } from '../../Automata/DFA';
import { observer } from 'mobx-react-lite';

export const DFADesigner = observer(({ dfa }: { dfa: DFA }) => {
  return (
    <div
      style={{
        display: 'grid',
        width: '',
        height: '100%',
        gridTemplateColumns: `1.5rem 1.5rem 2rem ${
          dfa.alphabet.length > 0 ? `repeat(${dfa.alphabet.length}, 4rem)` : ''
        }  2rem`,
        gridTemplateRows: `2rem ${dfa.states.length > 0 ? `repeat(${dfa.states.length}, 2rem)` : ''} 2rem`,
        alignItems: 'center',
        justifyContent: 'end',
        gap: '2px',
      }}
      tabIndex={-1}
    >
      {dfa.states.map((state, index) => (
        <input
          key={state.id}
          className="d-flex justify-content-center align-center"
          style={{
            gridColumn: `${3}`,
            gridRow: `${index + 2}`,
            width: '100%',
            height: '100%',
            textAlign: 'center',
            // borderRadius: '0px',
            border: '1px solid transparent',
          }}
          value={state.name}
          onChange={(e) => {
            const value = e.target.value;
            const stateName = value.length > 1 ? value[value.length - 1] : value;
            dfa.updateState(state.id, stateName);
          }}
        ></input>
      ))}

      {dfa.states.map((state, index) => (
        <button
          key={index + '-delete'}
          className="icon-btn btn-danger"
          style={{ gridColumn: `${-2}`, gridRow: `${index + 2}` }}
          onClick={() => {
            dfa.removeState(state);
          }}
        >
          <LuTrash />
        </button>
      ))}

      {dfa.states.map((state, index) => (
        <div
          key={index}
          style={{
            gridColumn: `${1}`,
            gridRow: `${index + 2}`,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            type="checkbox"
            checked={state.id === dfa.initialState}
            onChange={(e) => {
              if (e.target.checked) dfa.setInitialState(state);
            }}
          ></input>
        </div>
      ))}

      {dfa.states.map((state, index) => (
        <div
          key={index}
          style={{
            gridColumn: `${2}`,
            gridRow: `${index + 2}`,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            type="checkbox"
            checked={dfa.acceptStates.has(state.id)}
            onChange={(e) => {
              if (dfa.acceptStates.has(state.id)) dfa.removeAcceptState(state);
              else dfa.addAcceptState(state);
            }}
          ></input>
        </div>
      ))}

      {dfa.alphabet.map((letter, index) => {
        return (
          <input
            key={index}
            className="d-flex justify-content-center align-center"
            style={{
              gridColumn: `${index + 4}`,
              gridRow: `${1}`,
              width: '100%',
              height: '100%',
              textAlign: 'center',
              // borderRadius: '0px',
              border: '1px solid transparent',
            }}
            value={letter}
            onChange={(e) => {
              const alphabet = [...dfa.alphabet];
              const value = e.target.value;
              const letter = value.length > 1 ? value[value.length - 1] : value;
              if (!alphabet.includes(letter)) {
                alphabet[index] = letter;
                dfa.setAlphabet(alphabet);
              }
            }}
          ></input>
        );
      })}

      {dfa.alphabet.map((letter, index) => {
        return (
          <button
            key={index + '-delete'}
            className="icon-btn btn-danger"
            style={{ gridColumn: `${index + 4}`, gridRow: `${-2}`, justifySelf: 'center' }}
            onClick={() => {
              const alphabet = [...dfa.alphabet];
              const alphabet2 = alphabet.filter((_, i) => i !== index);
              dfa.setAlphabet(alphabet2);
            }}
          >
            <LuTrash />
          </button>
        );
      })}

      {dfa.states.map((state, stateIndex) =>
        dfa.alphabet.map((letter, letterIndex) => (
          <input
            key={`${state.id}-${letterIndex}`}
            className="d-flex justify-content-center align-center"
            style={{
              gridColumn: `${letterIndex + 4}`,
              gridRow: `${stateIndex + 2}`,
              width: '100%',
              height: '100%',
              // borderRadius: '0px',
              border: '1px solid transparent',
              textAlign: 'center',
            }}
            onChange={(e) => {
              const value = e.target.value;
              const desStateName = value.length > 1 ? value[value.length - 1] : value;
              const desState = dfa.states.find((s) => s.name === desStateName);
              if (desState) dfa.addTransition(state, letter, desState);
            }}
            value={dfa.getStateFromId(dfa.nextState(state.id, letter))?.name ?? ''}
          ></input>
        )),
      )}

      <div
        key={'initial-states-info'}
        className="d-flex justify-content-center align-center"
        style={{
          gridColumn: `${1}`,
          gridRow: `${1}`,
          width: '100%',
          height: '100%',
        }}
      >
        I
      </div>

      <div
        key={'final-states-info'}
        className="d-flex justify-content-center align-center"
        style={{
          gridColumn: `${2}`,
          gridRow: `${1}`,
          width: '100%',
          height: '100%',
        }}
      >
        F
      </div>

      <div
        key={'table-info'}
        className="d-flex justify-content-center align-center"
        style={{
          gridColumn: `${3}`,
          gridRow: `${1}`,
          width: '100%',
          height: '100%',
        }}
      >
        S\A
      </div>

      <button
        key={'add-state'}
        className="icon-btn"
        style={{ gridColumn: `${3}`, gridRow: `${-2}` }}
        onClick={() => dfa.addState('')}
      >
        <LuPlus />
      </button>

      <button
        key={'add-letter'}
        className="icon-btn"
        style={{ gridColumn: `${-2}`, gridRow: `${1}` }}
        onClick={() => dfa.setAlphabet([...dfa.alphabet, ''])}
      >
        <LuPlus />
      </button>
    </div>
  );
});
