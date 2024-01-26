import { makeAutoObservable, runInAction } from 'mobx';
import { delay } from '../helpers/usefull';

export type DFATransitionFunction = (currentState: DFAState, input: string) => DFAState;
export type DFATransitionMatrix = { [key: DFAState]: { [key: string]: DFAState } };
export type DFATransitions = DFATransitionMatrix;

export type DFAState = string;

export interface DFAAction {
  from: DFAState;
  with: number;
  to: DFAState;
}

export interface DFAData {
  Q: DFAState[];
  A: string;
  I: DFAState;
  F: DFAState[];
  T: DFATransitionMatrix;
}

export class DFA {
  public input: string = '';
  public currentIndex: number = -1;
  public currentState: DFAState = this.initialState;

  public inTransition: boolean = false;

  /**
   * Visualizable Deterministic Finite State Automata
   * @param states Q: finit set of state
   * @param alphabet Σ: input alphabet
   * @param transitionFunction δ: transition function
   * @param initialState S: initial state
   * @param finalState F: final (accept) states
   */
  constructor(
    public readonly states: DFAState[],
    public readonly alphabet: string,
    public readonly transitionFunction: DFATransitionMatrix,
    public readonly initialState: DFAState,
    public readonly finalState: DFAState[],
  ) {
    makeAutoObservable(this);
  }

  setInput(input: string) {
    this.input = input;
    this.currentIndex = -1;
    this.currentState = this.initialState;
  }

  start() {
    this.currentIndex = -1;
    this.currentState = this.initialState;
  }

  nextInput() {
    this.currentIndex += 1;
    return this.currentIndex;
  }

  nextState(state: DFAState, letter: string): DFAState {
    let nextState = state;

    nextState = this.transitionFunction?.[state]?.[letter];

    return nextState;
  }

  async nextAsync(stepDelay: number = 500) {
    if (!this.isEnd()) {
      runInAction(() => {
        this.inTransition = true;
        this.nextInput();
      });
      await delay(stepDelay);

      const nextState = this.nextState(this.currentState, this.input[this.currentIndex]);
      const action = {
        from: this.currentState,
        with: this.currentIndex,
        to: nextState,
      };
      runInAction(() => {
        this.inTransition = false;
        this.currentState = nextState;
      });
      return action;
    }
    return { from: this.currentState, with: this.currentIndex, to: this.currentState };
  }

  next() {
    if (!this.isEnd()) {
      this.nextInput();

      const nextState = this.nextState(this.currentState, this.input[this.currentIndex]);
      const action = {
        from: this.currentState,
        with: this.currentIndex,
        to: nextState,
      };
      this.currentState = nextState;

      return action;
    }
    return { from: this.currentState, with: this.currentIndex, to: this.currentState };
  }

  isStarted() {
    if (this.currentIndex === -1) return false;
    return true;
  }

  isEnd() {
    if (this.currentIndex >= this.input.length - 1) return true;
    return false;
  }

  static isDFAValid(dfa: DFA) {
    if (!dfa.states.includes(dfa.initialState)) return false;
    if (dfa.finalState.some((s) => !dfa.states.includes(s))) return false;

    for (const state of dfa.states) {
      for (const chr of dfa.alphabet) {
        const transition = dfa.nextState(state, chr);
        if (!dfa.states.includes(transition)) return false;
      }
    }

    return true;
  }
}
