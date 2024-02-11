<script setup lang="ts">
import { DFA } from './DFA';
import Panel from '../components/Panel.vue';

const { dfa } = defineProps<{ dfa: DFA }>();
</script>

<template>
  <Panel header="Definition" :defaultCollapse="true">
    <div class="panel-content dfa-definition">
      <div>Q:</div>
      <div>{{ '{' + dfa.states.map((s) => s.name).join(', ') + '}' }}</div>

      <div>Σ:</div>
      <div>{{ '{' + dfa.alphabet.map((s) => s.char).join(', ') + '}' }}</div>

      <div>s:</div>
      <div>{{ dfa.getStateFromId(dfa.initialState)?.name ?? '' }}</div>

      <div>F:</div>
      <div>
        {{
          '{' +
          [...dfa.acceptStates]
            .map((id) => dfa.getStateFromId(id)?.name ?? '')
            .filter((n) => n)
            .join(', ') +
          '}'
        }}
      </div>
    </div>
  </Panel>
</template>

<style scoped>
.dfa-definition {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: auto;
}

.dfa-definition div {
  padding: 4px 8px;
}
</style>
