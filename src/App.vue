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

const states = ['1', '2', '3', '4'];
const alphabet = 'ab';
const transitions: DFATransitions = {
  1: {
    a: '2',
    b: '1',
  },
  2: {
    a: '2',
    b: '3',
  },
  3: {
    a: '4',
    b: '1',
  },
  4: {
    a: '4',
    b: '4',
  },
};

const dfa = reactive(new DFA());
const visualizer = ref<InstanceType<typeof DFAVisualizer> | null>(null);

onMounted(() => {
  for (const name of states) {
    dfa.addState(name);
  }
  dfa.setAlphabet(alphabet);
  for (const fromName in transitions) {
    const from = dfa.states.find((s) => s.name === fromName);
    if (from) {
      for (const condition in transitions[fromName]) {
        const to = dfa.states.find((s) => s.name === transitions[fromName][condition]);
        if (to) dfa.addTransition(from, condition, to);
      }
    }
  }
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
      <DFAVisualizerControls :visualizer="visualizer" />
      <DFADesigner :dfa="dfa" />
    </div>
  </div>
</template>

<style scoped></style>
./DFA/DFA
