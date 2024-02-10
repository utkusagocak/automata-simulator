<script setup lang="ts">
import { LucideGripVertical, LucidePlus, LucideTrash } from 'lucide-vue-next';
import { DFA } from './DFA';
import { ref } from 'vue';

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
  <div class="panel dfa-designer-panel">
    <div class="panel-title">Designer</div>
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
          v-for="(letter, index) in dfa.alphabet"
          :key="index"
          class="d-flex justify-content-center align-center"
          :style="{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            // borderRadius: '0px',
            border: '1px solid transparent',
          }"
          :value="letter"
          @change="(e) => {
            const alphabet = [...dfa.alphabet];
            const value = (e.target as HTMLInputElement)?.value;
            const letter = value.length > 1 ? value[value.length - 1] : value;
            if (!alphabet.includes(letter)) {
              alphabet[index] = letter;
              dfa.setAlphabet(alphabet);
            }
          }
          "
        />

        <button
          title="Add character"
          class="icon-btn"
          style="{{}}"
          @click="() => dfa.setAlphabet([...dfa.alphabet, ''])"
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

        <!-- <input
          v-for="(letter, letterIndex) in dfa.alphabet"
          :key="state.id + '|' + letterIndex"
          class="d-flex justify-content-center align-center dfa-designer-transition-input"
          :style="{
            width: '100%',
            height: '100%',
            border: '1px solid transparent',
            textAlign: 'center',
          }"
          @input="
          (e) => {
            const value = (e.target as HTMLInputElement)?.value;
            const desState = dfa.states.find((s) => s.name === value);
            if (desState) dfa.addTransition(state, letter, desState);
          }"
          :value="dfa.getStateFromId(dfa.nextState(state.id, letter))?.name ?? ''"
        /> -->
        <select
          v-for="(letter, letterIndex) in dfa.alphabet"
          :key="state.id + '|' + letterIndex"
          class="d-flex justify-content-center align-center dfa-designer-transition-input"
          :style="{
            width: '100%',
            height: '100%',
            border: '1px solid transparent',
            textAlign: 'center',
          }"
          :value="dfa.getStateFromId(dfa.nextState(state.id, letter))?.id ?? ''"
          @input="
            (e) => {
              const value = (e.target as HTMLInputElement)?.value;
               dfa.addTransition(state, letter, value);
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
          v-for="(letter, index) in dfa.alphabet"
          :key="index + '-delete'"
          className="icon-btn btn-danger"
          @click="
            () => {
              const alphabet = [...dfa.alphabet];
              const alphabet2 = alphabet.filter((_, i) => i !== index);
              dfa.setAlphabet(alphabet2);
            }
          "
        >
          <LucideTrash />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  justify-self: center;
}
</style>
