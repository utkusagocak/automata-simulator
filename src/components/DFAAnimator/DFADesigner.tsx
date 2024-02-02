import { useEffect, useState } from 'react';
import { DFA, DFAState, DFATransitionMatrix } from '../../Automata/DFA';

export const DFADesigner = ({ dfa, onChange }: { dfa: DFA; onChange: (dfa: DFA) => void }) => {
  const [states, setStates] = useState([...dfa.states]);
  const [alphabet, setAlphabet] = useState([...dfa.alphabet.split('')]);
  const [transitions, setTrasition] = useState<DFATransitionMatrix>({ ...dfa.transitionFunction });
  const [initialState, setInitialState] = useState<DFAState>(dfa.initialState);
  const [finalStates, setFinalStates] = useState<DFAState[]>([...dfa.finalState]);

  useEffect(() => {
    const newDfa = new DFA(states, alphabet.join(''), transitions, initialState as DFAState, finalStates);
    if (DFA.isDFAValid(newDfa)) {
      console.log('onChange');
      onChange(newDfa);
    }
  }, [states, alphabet, transitions, initialState, finalStates]);

  return (
    <div
      style={{
        display: 'grid',
        width: '',
        height: '100%',
        gridTemplateColumns: `1.5rem 1.5rem 2rem ${
          alphabet.length > 0 ? `repeat(${alphabet.length}, 4rem)` : ''
        }  2rem`,
        gridTemplateRows: `2rem ${states.length > 0 ? `repeat(${states.length}, 2rem)` : ''} 2rem`,
        alignItems: 'center',
        justifyContent: 'end',
        gap: '2px',
      }}
      tabIndex={-1}
    >
      {states.map((state, index) => (
        <>
          <input
            key={index}
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
            value={state}
            onChange={(e) => {
              const value = e.target.value;
              const state = value.length > 1 ? value[value.length - 1] : value;
              states[index] = state;
              setStates([...states]);
            }}
          ></input>
          <button
            key={index + '-delete'}
            className="d-flex justify-content-center align-center cursor-pointer"
            style={{ gridColumn: `${-2}`, gridRow: `${index + 2}`, width: '100%', height: '100%' }}
            onClick={() => {
              const states2 = states.filter((_, i) => i !== index);
              setStates(states2);
            }}
          >
            -
          </button>
        </>
      ))}

      {states.map((state, index) => (
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
            checked={state === initialState}
            onChange={(e) => {
              if (e.target.checked) setInitialState(state);
            }}
          ></input>
        </div>
      ))}

      {states.map((state, index) => (
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
            checked={finalStates.includes(state)}
            onChange={(e) => {
              if (finalStates.includes(state)) setFinalStates(finalStates.filter((f) => f !== state));
              else setFinalStates([...finalStates, state]);
            }}
          ></input>
        </div>
      ))}

      {alphabet.map((letter, index) => {
        return (
          <>
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
                const value = e.target.value;
                const letter = value.length > 1 ? value[value.length - 1] : value;
                alphabet[index] = letter;
                setAlphabet([...alphabet]);
              }}
            ></input>
            <button
              key={index + '-delete'}
              className="d-flex justify-content-center align-center cursor-pointer"
              style={{ gridColumn: `${index + 4}`, gridRow: `${-2}`, width: '100%', height: '100%' }}
              onClick={() => {
                const alphabet2 = alphabet.filter((_, i) => i !== index);
                setAlphabet(alphabet2);
              }}
            >
              -
            </button>
          </>
        );
      })}

      {states.map((state, stateIndex) =>
        alphabet.map((letter, letterIndex) => (
          <input
            key={`${stateIndex}-${letterIndex}`}
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
              const desState = value.length > 1 ? value[value.length - 1] : value;
              if (!transitions[state]) transitions[state] = {};
              console.log(state);
              transitions[state][letter] = desState;
              setTrasition({ ...transitions });
            }}
            value={transitions?.[state]?.[letter] ?? ''}
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
        className="d-flex justify-content-center align-center cursor-pointer"
        style={{ gridColumn: `${-2}`, gridRow: `${-2}`, width: '100%', height: '100%' }}
        onClick={() => setStates((s) => [...s, ''])}
      >
        +
      </button>

      <button
        key={'add-letter'}
        className="d-flex justify-content-center align-center cursor-pointer"
        style={{ gridColumn: `${-2}`, gridRow: `${1}`, width: '100%', height: '100%' }}
        onClick={() => setAlphabet((a) => [...a, ''])}
      >
        +
      </button>
    </div>
  );
};
