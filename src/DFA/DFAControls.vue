<script setup lang="ts">
import {
  LucideChevronDown,
  LucideChevronUp,
  LucideChevronsRight,
  LucidePause,
  LucidePlay,
  LucideSquare,
} from 'lucide-vue-next';
import { DFA } from './DFA';
import { ref } from 'vue';

const { dfa } = defineProps<{ dfa: DFA }>();

const started = ref(false);
let timer = -1;

function handleStart() {
  started.value = true;
  clearInterval(timer);

  const run = async () => {
    clearTimeout(timer);
    await dfa.nextAsync(500);
    if (started.value && !dfa.isEnd()) timer = setTimeout(run, 500);
    else started.value = false;
  };

  run();
}

function handleStop() {
  started.value = false;
  clearTimeout(timer);
}
</script>

<template>
  <div class="panel">
    <div className="panel-title">Controls</div>

    <div
      class="panel-content dfa-controls d-flex flex-column align-items-center gap-1"
      :class="{ disabled: !DFA.isDFAValid(dfa) }"
    >
      <div
        class="d-flex justify-content-center"
        :style="{ position: 'relative', paddingTop: '1rem' }"
      >
        <!-- <div
          class="chevron-pointer"
          :style="{
            top: '0px',
            '--length': dfa.states.length,
            '--current-index': dfa.states.findIndex((s) => s.id === dfa.currentState),
            color: dfa.acceptStates.has(dfa.currentState) ? 'green' : '',
          }"
        >
          <LucideChevronDown />
        </div> -->
        <div
          v-for="(state, index) in dfa.states"
          :key="state.id"
          :style="{
            color: state.id === dfa.currentState ? 'orange' : '',
            fontSize: '1.25rem',
            paddingRight: '1ch',
          }"
        >
          {{ state.name }}
        </div>
      </div>

      <div class="d-flex justify-content-center dfa-controls-input-container">
        <input title="Test input" placeholder="Enter input" v-model="dfa.input" />
        <div
          v-for="(l, i) in dfa.input.split('')"
          :key="i"
          class="dfa-controls-input-letter"
          :style="{
            color: dfa.isEnd()
              ? dfa.isInputValid()
                ? 'green'
                : 'red'
              : i === dfa.currentIndex
              ? 'red'
              : '',
          }"
        >
          {{ l }}
        </div>

        <div
          v-if="dfa.input"
          class="chevron-pointer"
          :style="{
            '--length': dfa.input.length,
            '--current-index': dfa.currentIndex,
            bottom: '0px',
          }"
        >
          <LucideChevronUp />
        </div>
      </div>

      <div class="d-flex gap-1 align-items-center justify-content-center">
        <button
          class="icon-btn"
          title="Start/Stop"
          @click="
            (e) => {
              if (started) {
                handleStop();
              } else {
                if (dfa.isEnd()) {
                  dfa.reset();
                }
                handleStart();
              }
            }
          "
        >
          <LucidePlay v-if="!started" />
          <LucidePause v-if="started" />
        </button>
        <button
          class="icon-btn"
          title="Reset"
          @click="
            (e) => {
              handleStop();
              dfa.reset();
            }
          "
          :disabled="dfa.currentIndex === -1"
        >
          <LucideSquare />
        </button>
        <button
          class="icon-btn"
          title="Next State"
          @click="(e) => !dfa.inTransition && dfa.nextAsync()"
          :disabled="dfa.inTransition || dfa.isEnd() || started"
        >
          <LucideChevronsRight />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chevron-pointer {
  display: flex;
  font-size: 1.25rem;
  position: absolute;
  left: calc(50% - 0.5ch);

  transform: translateX(calc(var(--length) * -1ch + var(--current-index) * 2ch));
  transition: transform 0.2s linear;
}
</style>
../DFA/DFA
