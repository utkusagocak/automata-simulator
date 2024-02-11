<script setup lang="ts">
import { reactive, onMounted, ref, shallowRef } from 'vue';
import { DFA, DFATransitions } from './DFA/DFA';

import './App.css';
import './Common.css';

import DFADesigner from './DFA/DFADesigner.vue';
import DFAControls from './DFA/DFAControls.vue';
import DFAVisualizer from './DFA/DFAVisualizer.vue';
import { Geometry } from './math';
import DFAVisualizerControls from './DFA/DFAVisualizerControls.vue';

const states = ['q1', 'q2', 'q3', 'q4'];
const alphabet = 'ab';
const transitions: DFATransitions = {
  q1: {
    a: 'q2',
    b: 'q1',
  },
  q2: {
    a: 'q2',
    b: 'q3',
  },
  q3: {
    a: 'q4',
    b: 'q1',
  },
  q4: {
    a: 'q4',
    b: 'q4',
  },
};

const dfa = reactive(new DFA());
const visualizer = ref<InstanceType<typeof DFAVisualizer> | null>(null);

onMounted(() => {
  const q1 = dfa.addState('q1');
  const q2 = dfa.addState('q2');
  const q3 = dfa.addState('q3');

  const a = dfa.addSymbol('a');
  const b = dfa.addSymbol('b');

  dfa.addTransition(q1, a, q3);
  dfa.addTransition(q1, b, q3);

  dfa.addTransition(q2, a, q1);
  dfa.addTransition(q2, b, q3);

  dfa.addTransition(q3, a, q1);
  dfa.addTransition(q3, b, q1);

  dfa.setInitialState(q1);
  dfa.addAcceptState(q3);
});
</script>

<template>
  <div class="main">
    <div className="graph-container">
      <DFAVisualizer ref="visualizer" :dfa="dfa" />
    </div>

    <div class="right-panel">
      <div className="panel description-panel">
        <div className="panel-title">Deterministic Finite State Automata</div>
      </div>

      <DFAControls :dfa="dfa" />
      <!-- <DFAVisualizerControls :visualizer="visualizer" /> -->
      <DFADesigner :dfa="dfa" />
    </div>
  </div>
</template>

<style scoped></style>
./DFA/DFA
