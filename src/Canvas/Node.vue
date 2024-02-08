<script setup lang="ts">
import { inject, onMounted, onUnmounted, onUpdated, watch } from 'vue';
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

const props = defineProps<Props>();
const { As } = props;

const renderer = inject<Renderer>('renderer');
const draw = inject<() => void>('draw');
const element = new As();

function updatElement() {
  for (const key in props) {
    // @ts-ignore
    if (key !== 'As' || key !== 'style') {
      // @ts-ignore
      element[key] = props[key];
    }
  }
  element.style = {
    fill: 'transparent',
    font: '16px monospace',
    textAlign: 'center',
    textBaseline: 'middle',
    ...props.style,
  };
  draw?.();
}

onUpdated(() => {
  updatElement();
});

watch(() => props, updatElement, { deep: true, immediate: true });

onMounted(() => {
  if (renderer) {
    updatElement();
    renderer.addElement(element);
  }
});

onUnmounted(() => {
  if (renderer) {
    renderer.removeElement(element);
    renderer.draw();
  }
});
</script>

<template></template>

<style scoped></style>
