function delay(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export type DFATransitionMatrix = { [key: string]: { [key: string]: string } };

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

export interface DFAState {
  id: string;
  name: string;
}

export interface DFASymbol {
  id: string;
  char: string;
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
  public alphabet: DFASymbol[] = [];
  public transitions: DFATransitionMatrix = {};
  public initialState: string = '';
  public acceptStates: Set<string> = new Set();

  // Process
  public input: string = '';
  public currentIndex: number = -1;
  public currentState: string = this.initialState;
  public inTransition: boolean = false;

  constructor() {}

  // Update DFA
  getStateFromId(id: string) {
    return this.states.find((s) => s.id === id);
  }

  getSymbolFromId(id: string) {
    return this.alphabet.find((s) => s.id === id);
  }

  addState(name: string) {
    const state = {
      name,
      id: crypto.randomUUID(),
    };
    this.states.push(state);
    return state;
  }

  moveState(from: number, to: number) {
    const state = this.states[from];
    this.states.splice(from, 1);
    this.states.splice(to, 0, state);
  }

  updateState(id: string, name: string) {
    const state = this.states.find((s) => s.id === id);
    if (state) state.name = name;
    this.states = [...this.states];
  }

  removeState(state: DFAState | string) {
    const id = typeof state === 'string' ? state : state.id;
    this.states = this.states.filter((s) => s.id !== id);
  }

  addSymbol(char: string) {
    char = char[0] ?? '';
    const symbol = {
      char,
      id: crypto.randomUUID(),
    };

    this.alphabet.push(symbol);
    return symbol;
  }

  updateSymbol(id: string, char: string) {
    char = char[0] ?? '';
    const symbol = this.getSymbolFromId(id);
    if (symbol) symbol.char = char;
    this.alphabet = [...this.alphabet];
  }

  removeSymbol(id: string) {
    this.alphabet = this.alphabet.filter((s) => s.id !== id);
  }

  addTransition(from: DFAState | string, condition: DFASymbol | string, to: DFAState | string) {
    const fromId = typeof from === 'string' ? from : from.id;
    const toId = typeof to === 'string' ? to : to.id;
    const symbolId = typeof condition === 'string' ? condition : condition.id;

    if (!this.transitions[fromId]) this.transitions[fromId] = {};
    this.transitions[fromId][symbolId] = toId;
  }

  setInitialState(state: DFAState) {
    this.initialState = state.id;
    this.reset();
  }

  addAcceptState(state: DFAState | string) {
    const id = typeof state === 'string' ? state : state.id;
    this.acceptStates.add(id);
    this.reset();
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

  reset() {
    this.currentIndex = -1;
    this.currentState = this.initialState;
  }

  nextInput() {
    this.currentIndex += 1;
    return this.currentIndex;
  }

  nextState(stateId: string, char: string) {
    let nextState = stateId;

    const symbol = this.alphabet.find((s) => s.char === char);
    if (symbol) nextState = this.transitions?.[stateId]?.[symbol.id] ?? stateId;

    return nextState;
  }

  async nextAsync(stepDelay: number = 500) {
    if (!this.isEnd()) {
      this.inTransition = true;
      this.nextInput();

      await delay(stepDelay);

      const nextState = this.nextState(this.currentState, this.input[this.currentIndex]);
      const action = {
        from: this.currentState,
        condition: this.currentIndex,
        to: nextState,
      };

      this.inTransition = false;
      this.currentState = nextState;

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

  isInputValid() {
    if (this.isEnd()) {
      if (this.acceptStates.has(this.currentState)) return true;
      else return false;
    }
  }

  // Validation
  static isDFAValid(dfa: DFA) {
    if (!dfa.states.some((s) => s.id === dfa.initialState)) return 'Define an initial state.';
    if (!dfa.states.some((s) => dfa.acceptStates.has(s.id)))
      return 'Define at least one accept state.';

    if (dfa.states.some((s) => !s.name)) return 'Name all states.';

    for (const symbol of dfa.alphabet) {
      if (!symbol.char) return 'Empty symbol in alphabet.';
      if (dfa.alphabet.some((s) => s.id !== symbol.id && s.char === symbol.char))
        return 'Repeating symbol in alphabet.';
    }

    for (const state of dfa.states) {
      for (const chr of dfa.alphabet) {
        const transition = dfa.nextState(state.id, chr.char);
        if (!dfa.states.some((s) => s.id === transition)) return 'Missing transition.';
      }
    }

    return true;
  }
}
