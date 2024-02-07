<script setup lang="ts">
import { inject, onMounted, onUnmounted, onUpdated } from 'vue';
import { Renderer } from './Renderer';
import { Interactable, Style, Circle, Text, Rectangle, Path } from './Shapes';

interface Props extends Interactable {
  As: typeof Circle | typeof Text | typeof Rectangle | typeof Path;
  style?: Style;

  cx?: number;
  cy?: number;
  r?: number;

  d?: string;

  x?: number;
  y?: number;

  width?: number;
  height?: number;

  textContent?: string;
}

const { As, style = {}, ...props } = defineProps<Props>();

const renderer = inject<Renderer>('renderer');
const draw = inject<() => void>('draw');
const element = new As();

function updatElement() {
  for (const key in props) {
    // @ts-ignore
    element[key] = props[key];
  }
  element.style = {
    fill: 'transparent',
    font: '16px monospace',
    textAlign: 'center',
    textBaseline: 'middle',
    ...style,
  };
  draw?.();
}

onUpdated(() => {
  updatElement();
});

onMounted(() => {
  if (renderer) {
    updatElement();
    renderer.addElement(element);
  }
});

onUnmounted(() => {
  if (renderer) {
    renderer.removeElement(element);
  }
});
</script>

<template></template>

<style scoped></style>
