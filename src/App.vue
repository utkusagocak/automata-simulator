<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue';
import { DFA } from './DFA/DFA';

import './App.css';
import './Common.css';

import DFADesigner from './DFA/DFADesigner.vue';
import DFAControls from './DFA/DFAControls.vue';
import DFAVisualizer from './DFA/DFAVisualizer.vue';
import { LucideAlertCircle } from 'lucide-vue-next';

const dfa = reactive(new DFA());
const visualizer = ref<InstanceType<typeof DFAVisualizer> | null>(null);

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

dfa.setInitialState(q2);
dfa.addAcceptState(q3);

const dfaError = computed(() => {
  return DFA.isDFAValid(dfa);
});
</script>

<template>
  <div class="main" :class="{ error: dfaError !== true }">
    <div id="visible-area">
      <Transition name="dfa-error">
        <div class="dfa-error" :key="dfaError" v-if="dfaError !== true">
          <LucideAlertCircle />
          <span>
            {{ dfaError }}
          </span>
        </div>
      </Transition>
    </div>
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

<style scoped>
#visible-area {
  padding: 8px;
}

.main {
  transition: box-shadow 0.5s linear;
}
.main.error {
  box-shadow: inset 48px 48px 12px -48px red;
}

.dfa-error {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: red;

  padding: 4px 8px;
  /* background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(9px);
  border-radius: 4px; */
}

.dfa-error-enter-active,
.dfa-error-leave-active {
  transition: 0.5s linear;
}

.dfa-error-enter-from,
.dfa-error-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
