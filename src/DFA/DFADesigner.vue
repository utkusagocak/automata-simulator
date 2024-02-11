<script setup lang="ts">
import { LucideGripVertical, LucidePlus, LucideTrash } from 'lucide-vue-next';
import { DFA } from './DFA';
import { ref } from 'vue';
import Panel from '../components/Panel.vue';

const { dfa } = defineProps<{ dfa: DFA }>();

const drag = ref({ dragging: false, target: '' });

function handleDragOver(e: PointerEvent, toIndex: number) {
  e.preventDefault();

  if (drag.value.dragging) {
    const formIndex = dfa.states.findIndex((s) => s.id === drag.value.target);
    if (formIndex > -1 && formIndex !== toIndex) {
      dfa.moveState(formIndex, toIndex);
    }
  }
}

function handleStartDrag(e: PointerEvent, target: string) {
  e.preventDefault();
  drag.value = { dragging: true, target: target };

  function handleDrop(e: PointerEvent) {
    e.preventDefault();
    drag.value = { dragging: false, target: '' };
    document.removeEventListener('pointerup', handleDrop);
  }

  document.addEventListener('pointerup', handleDrop);
}
</script>

<template>
  <Panel header="Designer" class="dfa-designer-panel">
    <div
      class="panel-content dfa-designer"
      :class="{ dragging: drag.dragging }"
      :style="{
        display: 'grid',
        width: '',
        height: '100%',
        gridTemplateColumns: `2rem 1.5rem 1.5rem 4rem ${
          dfa.alphabet.length > 0
            ? ` [transition-start] repeat(${dfa.alphabet.length}, 4rem) [transition-end]`
            : ''
        }   2rem`,
        gridAutoRows: `2rem`,
        alignItems: 'center',
        justifyContent: 'end',
        gap: '2px',
      }"
    >
      <div
        class="text-truncate"
        title=""
        :style="{
          gridColumn: 'transition-start / transition-end',
          display: dfa.alphabet.length > 0 ? '' : 'none',
        }"
      >
        Transitions
      </div>

      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: 'subgrid',
          gridTemplateRows: 'subgrid',
          gridColumn: `1 / -1`,
        }"
      >
        <div></div>
        <div
          class="d-flex justify-content-center align-center"
          title="Initial State"
          :style="{
            width: '100%',
            height: '100%',
          }"
        >
          I
        </div>

        <div
          class="d-flex justify-content-center align-center"
          title="Accept States"
          :style="{
            width: '100%',
            height: '100%',
          }"
        >
          A
        </div>

        <div
          class="d-flex justify-content-center align-center"
          title="States\Alphabet"
          :style="{
            width: '100%',
            height: '100%',
          }"
        >
          S\A
        </div>

        <input
          v-for="(symbol, index) in dfa.alphabet"
          :key="index"
          class="d-flex justify-content-center align-center"
          :style="{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            // borderRadius: '0px',
            border: '1px solid transparent',
          }"
          :value="symbol.char"
          @input="
            (e) => {
              const value = (e.target as HTMLInputElement).value;
              const char = value[value.length - 1] ?? '';
              dfa.updateSymbol(symbol.id, char);
            }
          "
        />

        <button
          title="Add character"
          class="icon-btn"
          style="{{}}"
          @click="() => dfa.addSymbol('')"
        >
          <LucidePlus />
        </button>
      </div>

      <div
        v-for="(state, index) in dfa.states"
        :key="state.id"
        :class="`state-row ${drag.dragging && drag.target === state.id ? 'dragging' : ''}`"
        :style="{
          display: 'grid',
          gridTemplateColumns: 'subgrid',
          gridTemplateRows: 'subgrid',
          gridColumn: `1 / -1`,
          borderRadius: '4px',
          cursor: drag.dragging ? 'grabbing' : '',
        }"
        @pointerenter="(e) => handleDragOver(e, index)"
      >
        <button
          class="drag-btn icon-btn"
          @pointerdown="
            (e) => {
              handleStartDrag(e, state.id);
            }
          "
        >
          <LucideGripVertical />
        </button>
        <div
          :style="{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
        >
          <input
            title="Make initial state"
            type="radio"
            :id="state.id"
            :checked="state.id === dfa.initialState"
            @change="(e) => {
            if ((e.target as HTMLInputElement).checked) dfa.setInitialState(state);
          }"
          />
        </div>
        <div
          :style="{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
        >
          <input
            title="Make accept state"
            type="checkbox"
            :checked="dfa.acceptStates.has(state.id)"
            @input="
              (e) => {
                if (dfa.acceptStates.has(state.id)) dfa.removeAcceptState(state);
                else dfa.addAcceptState(state);
              }
            "
          />
        </div>

        <input
          :key="state.id"
          class="d-flex justify-content-center align-center"
          :style="{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            border: '1px solid transparent',
          }"
          v-model="state.name"
        />

        <select
          v-for="(symbol, letterIndex) in dfa.alphabet"
          :key="state.id + '|' + letterIndex"
          class="d-flex justify-content-center align-center dfa-designer-transition-input"
          :style="{
            width: '100%',
            height: '100%',
            border: '1px solid transparent',
            textAlign: 'center',
          }"
          :value="dfa.getStateFromId(dfa.nextState(state.id, symbol.char))?.id ?? ''"
          @input="
            (e) => {
              const value = (e.target as HTMLInputElement)?.value;
               dfa.addTransition(state, symbol.id, value);
            }
          "
        >
          <option v-for="(state, stateIndex) in dfa.states" :value="state.id">
            {{ state.name }}
          </option>
        </select>
        <button
          class="icon-btn btn-danger"
          title="Remove state"
          @click="() => dfa.removeState(state)"
        >
          <LucideTrash />
        </button>
      </div>

      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: 'subgrid',
          gridTemplateRows: 'subgrid',
          gridColumn: `1 / -1`,
        }"
      >
        <div></div>
        <div></div>
        <div></div>

        <button title="Add state" class="icon-btn" @click="() => dfa.addState('')">
          <LucidePlus />
        </button>

        <button
          title="Remove character"
          v-for="(symbol, index) in dfa.alphabet"
          :key="index + '-delete'"
          className="icon-btn btn-danger"
          @click="
            () => {
              dfa.removeSymbol(symbol.id);
            }
          "
        >
          <LucideTrash />
        </button>
      </div>
    </div>
  </Panel>
</template>

<style scoped>
button {
  justify-self: center;
}
</style>
