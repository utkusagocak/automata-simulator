import { DFA } from './DFA';
import { observer } from 'mobx-react-lite';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { useEffect } from 'react';
import { LuChevronDown, LuChevronUp, LuChevronsRight, LuPause, LuPlay, LuSquare } from 'react-icons/lu';

export interface DFAAnimatorProps {
  dfa: DFA;
}

const DFAControls = observer(({ dfa }: DFAAnimatorProps) => {
  const frame = useAnimationFrame();

  useEffect(() => {
    frame.set(() => {
      if (dfa.isEnd()) {
        frame.stop();
      } else {
        dfa.nextAsync();
      }
    });
    return () => {
      frame.stop();
    };
  }, []);

  return (
    <div className="panel">
      <div className="panel-title">DFA Controls</div>

      <div
        className={`dfa-controls d-flex flex-column align-items-center gap-1 ${DFA.isDFAValid(dfa) ? '' : 'disabled'}`}
      >
        <div className="d-flex justify-content-center" style={{ position: 'relative', paddingTop: '1rem' }}>
          {dfa.input && (
            <div
              style={
                {
                  display: 'flex',
                  fontSize: '1.25rem',
                  position: 'absolute',
                  '--length': dfa.states.length,
                  '--current-index': dfa.states.findIndex((s) => s.id === dfa.currentState),
                  left: `calc(50% - 0.5ch)`,
                  top: '0px',
                  transform: `translateX(calc(var(--length) * -1ch + var(--current-index) * 2ch))`,
                  transition: 'transform 0.2s linear',
                  color: dfa.acceptStates.has(dfa.currentState) ? 'green' : '',
                } as React.CSSProperties
              }
            >
              <LuChevronDown />
            </div>
          )}

          {dfa.states.map((state) => (
            <div
              key={state.id}
              style={{ color: state.id === dfa.currentState ? 'orange' : '', fontSize: '1.25rem', paddingRight: '1ch' }}
            >
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
            <div
              key={i}
              className="dfa-controls-input-letter"
              style={{
                color: dfa.isEnd() ? (dfa.isInputValid() ? 'green' : 'red') : i === dfa.currentIndex ? 'red' : '',
              }}
            >
              {l}
            </div>
          ))}

          {dfa.input && (
            <div
              style={
                {
                  display: 'flex',
                  position: 'absolute',
                  '--length': dfa.input.length,
                  '--current-index': dfa.currentIndex,
                  left: `calc(50% - 0.5ch)`,
                  bottom: '0px',
                  transform: `translateX(calc(var(--length) * -1ch + var(--current-index) * 2ch))`,
                  transition: 'transform 0.2s linear',
                } as React.CSSProperties
              }
            >
              <LuChevronUp />
            </div>
          )}
        </div>

        <div className="d-flex gap-1 align-items-center justify-content-center">
          <button
            className="icon-btn"
            onClick={(e) => {
              if (frame.isActive) {
                frame.stop();
              } else {
                if (dfa.isEnd()) {
                  dfa.reset();
                }
                frame.start(1000);
              }
            }}
          >
            {frame.isActive ? <LuPause /> : <LuPlay />}
          </button>
          <button
            className="icon-btn"
            onClick={(e) => {
              dfa.reset();
              frame.stop();
            }}
            disabled={dfa.currentIndex === -1}
          >
            <LuSquare />
          </button>
          <button
            className="icon-btn"
            onClick={(e) => {
              !dfa.inTransition && dfa.nextAsync();
            }}
            disabled={dfa.inTransition || dfa.isEnd()}
          >
            <LuChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
});

export default DFAControls;
