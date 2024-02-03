import { makeAutoObservable, runInAction } from 'mobx';
import { delay } from '../helpers/usefull';

export type DFATransitionFunction = (currentState: DFAState, input: string) => DFAState;
export type DFATransitionMatrix = { [key: string]: { [key: string]: string } };
export type DFATransitions = DFATransitionMatrix;

export interface DFAAction {
  from: DFAState;
  condition: number;
  to: DFAState;
}

export interface DFAData {
  Q: string[];
  A: string;
  I: DFAState;
  F: DFAState[];
  T: DFATransitionMatrix;
}

type DFAStateId = string;

export interface DFAState {
  id: DFAStateId;
  name: string;
}

/**
 * Deterministic Finite State Automata
 * @property states Q: finit set of state
 * @property alphabet Σ: input alphabet
 * @property transitionFunction δ: transition function
 * @property initialState S: initial state
 * @property acceptStates F: final (accept) states
 */
export class DFA {
  // Definition
  public states: DFAState[] = [];
  public alphabet: string[] = [];
  public transitions: DFATransitionMatrix = {};
  public initialState: DFAStateId = '';
  public acceptStates: Set<DFAStateId> = new Set();

  // Process
  public input: string = '';
  public currentIndex: number = -1;
  public currentState: DFAStateId = this.initialState;
  public inTransition: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Update DFA
  getStateFromId(id: string) {
    return this.states.find((s) => s.id === id);
  }

  addState(name: string) {
    this.states.push({
      name,
      id: crypto.randomUUID(),
    });
  }

  moveState(from: number, to: number) {
    const state = this.states[from];
    this.states.splice(from, 1);
    this.states.splice(to, 0, state);
  }

  updateState(id: string, name: string) {
    const state = this.states.find((s) => s.id === id);
    if (state) state.name = name;
  }

  removeState(state: DFAState | string) {
    const id = typeof state === 'string' ? state : state.id;
    this.states = this.states.filter((s) => s.id !== id);
  }

  setAlphabet(alphabet: string | string[]) {
    this.alphabet = [...new Set([...alphabet])];
  }

  addTransition(from: DFAState | string, condition: string, to: DFAState | string) {
    const fromId = typeof from === 'string' ? from : from.id;
    const toId = typeof to === 'string' ? to : to.id;

    if (!this.transitions[fromId]) this.transitions[fromId] = {};
    this.transitions[fromId][condition] = toId;
  }

  setInitialState(state: DFAState) {
    this.initialState = state.id;
  }

  addAcceptState(state: DFAState | string) {
    const id = typeof state === 'string' ? state : state.id;
    this.acceptStates.add(id);
  }

  removeAcceptState(state: DFAState | string) {
    const id = typeof state === 'string' ? state : state.id;
    this.acceptStates.delete(id);
  }

  // Process Input
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

  nextState(stateId: DFAStateId, letter: string) {
    let nextState = stateId;

    nextState = this.transitions?.[stateId]?.[letter] ?? stateId;

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
        condition: this.currentIndex,
        to: nextState,
      };
      runInAction(() => {
        this.inTransition = false;
        this.currentState = nextState;
      });
      return action;
    }
    return { from: this.currentState, condition: this.currentIndex, to: this.currentState };
  }

  next() {
    if (!this.isEnd()) {
      this.nextInput();

      const nextState = this.nextState(this.currentState, this.input[this.currentIndex]);
      const action = {
        from: this.currentState,
        condition: this.currentIndex,
        to: nextState,
      };
      this.currentState = nextState;

      return action;
    }
    return { from: this.currentState, condition: this.currentIndex, to: this.currentState };
  }

  isStarted() {
    if (this.currentIndex === -1) return false;
    return true;
  }

  isEnd() {
    if (this.currentIndex >= this.input.length - 1) return true;
    return false;
  }

  // Validation
  static isDFAValid(dfa: DFA) {
    if (!dfa.states.some((s) => s.id === dfa.initialState)) return false;
    if (!dfa.states.some((s) => dfa.acceptStates.has(s.id))) return false;

    for (const state of dfa.states) {
      for (const chr of dfa.alphabet) {
        const transition = dfa.nextState(state.id, chr);
        if (!dfa.states.some((s) => s.id === transition)) return false;
      }
    }

    return true;
  }
}
