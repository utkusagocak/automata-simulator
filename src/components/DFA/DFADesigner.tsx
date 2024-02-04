import { LuGripVertical, LuPlus, LuTrash } from 'react-icons/lu';
import { DFA } from './DFA';
import { observer } from 'mobx-react-lite';
import { useStateRef } from '../../hooks/useStateRef';

export const DFADesigner = observer(({ dfa }: { dfa: DFA }) => {
  const [dragRef, setDrag] = useStateRef({ dragging: false, target: '' });
  const drag = dragRef.current;

  function handleDragOver(e: PointerEvent, toIndex: number) {
    e.preventDefault();

    if (dragRef.current.dragging) {
      // setDrag({ ...dragRef.current, to: toIndex });
      const formIndex = dfa.states.findIndex((s) => s.id === dragRef.current.target);
      if (formIndex > -1 && formIndex !== toIndex) {
        dfa.moveState(formIndex, toIndex);
      }
    }
  }

  function handleStartDrag(e: PointerEvent, target: string) {
    e.preventDefault();
    setDrag({ dragging: true, target: target });

    function handleDrop(e: PointerEvent) {
      e.preventDefault();
      setDrag({ dragging: false, target: '' });
      document.removeEventListener('pointerup', handleDrop);
    }

    document.addEventListener('pointerup', handleDrop);
  }

  return (
    <div className="panel">
      <div className="panel-title">DFA Designer</div>
      <div
        className={`dfa-designer ${drag.dragging ? 'dragging' : ''}`}
        style={{
          display: 'grid',
          width: '',
          height: '100%',
          gridTemplateColumns: `2rem 1.5rem 1.5rem 2rem ${
            dfa.alphabet.length > 0 ? ` [transition-start] repeat(${dfa.alphabet.length}, 4rem) [transition-end]` : ''
          }   2rem`,
          gridAutoRows: `2rem`,
          alignItems: 'center',
          justifyContent: 'end',
          gap: '2px',
        }}
      >
        <div
          className="text-truncate"
          style={{
            gridColumn: 'transition-start / transition-end',
            display: dfa.alphabet.length > 0 ? '' : 'none',
          }}
        >
          Transitions
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridTemplateRows: 'subgrid',
            gridColumn: `1 / -1`,
          }}
        >
          <div></div>
          <div
            key={'initial-states-info'}
            className="d-flex justify-content-center align-center"
            style={{
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
              width: '100%',
              height: '100%',
            }}
          >
            S\A
          </div>

          {dfa.alphabet.map((letter, index) => {
            return (
              <input
                key={index}
                className="d-flex justify-content-center align-center"
                style={{
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

          <button
            key={'add-letter'}
            className="icon-btn"
            style={{}}
            onClick={() => dfa.setAlphabet([...dfa.alphabet, ''])}
          >
            <LuPlus />
          </button>
        </div>

        {dfa.states.map((state, index) => (
          <div
            key={state.id}
            className={`state-row ${drag.dragging && drag.target === state.id ? 'dragging' : ''}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'subgrid',
              gridTemplateRows: 'subgrid',
              gridColumn: `1 / -1`,
              borderRadius: '4px',
              cursor: drag.dragging ? 'grabbing' : '',
            }}
            onPointerEnter={(e) => handleDragOver(e.nativeEvent, index)}
          >
            <button
              className="drag-btn icon-btn"
              onPointerDown={(e) => {
                handleStartDrag(e.nativeEvent, state.id);
              }}
            >
              <LuGripVertical />
            </button>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="radio"
                checked={state.id === dfa.initialState}
                onChange={(e) => {
                  if (e.target.checked) dfa.setInitialState(state);
                }}
              ></input>
            </div>
            <div
              style={{
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
            <input
              key={state.id}
              className="d-flex justify-content-center align-center"
              style={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                border: '1px solid transparent',
              }}
              value={state.name}
              onChange={(e) => {
                const value = e.target.value;
                dfa.updateState(state.id, value);
              }}
            ></input>
            {dfa.alphabet.map((letter, letterIndex) => (
              <input
                key={`${state.id}-${letterIndex}`}
                className="d-flex justify-content-center align-center dfa-designer-transition-input"
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid transparent',
                  textAlign: 'center',
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  const desState = dfa.states.find((s) => s.name === value);
                  if (desState) dfa.addTransition(state, letter, desState);
                }}
                defaultValue={dfa.getStateFromId(dfa.nextState(state.id, letter))?.name ?? ''}
              ></input>
            ))}
            <button
              key={state.id + '-delete'}
              className="icon-btn btn-danger"
              onClick={() => {
                dfa.removeState(state);
              }}
            >
              <LuTrash />
            </button>
          </div>
        ))}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridTemplateRows: 'subgrid',
            gridColumn: `1 / -1`,
          }}
        >
          <div></div>
          <div></div>
          <div></div>

          <button key={'add-state'} className="icon-btn" style={{}} onClick={() => dfa.addState('')}>
            <LuPlus />
          </button>

          {dfa.alphabet.map((letter, index) => {
            return (
              <button
                key={index + '-delete'}
                className="icon-btn btn-danger"
                style={{ justifySelf: 'center' }}
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
        </div>
      </div>
    </div>
  );
});
