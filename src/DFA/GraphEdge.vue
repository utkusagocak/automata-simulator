<script setup lang="ts">
import { DFAEdge } from './DFAGraph';
import Node from '../Canvas/Node.vue';
import { Path, Text } from '../Canvas/Shapes';

// const { edge } = defineProps<{ edge: DFAEdge }>();
const edge = defineModel<DFAEdge>({ required: true });
</script>

<template>
  <!-- Graph.Edge -->
  <Node
    :As="Path"
    :d="edge.arrow"
    :style="{
      stroke: edge.isActive ? 'red' : 'orange',
      fill: edge.isActive ? 'red' : 'orange',
      strokeWidth: 0.5,
      zIndex: 0,
    }"
  />
  <Node
    :As="Path"
    :d="edge.arc"
    :style="{
      stroke: edge.isActive ? 'red' : 'orange',
      fill: 'transparent',
      zIndex: 0,
      pointerEvents: 'all',
    }"
  />
  <Node
    :As="Text"
    :x="edge.text.x"
    :y="edge.text.y"
    :width="20"
    :textContent="edge.conditions.join('')"
    :style="{
      fill: 'white',
      font: '10px monospace',
      textAlign: 'center',
      textBaseline: 'middle',
      background: '#242424',
      zIndex: 1,
    }"
  />
</template>

<style scoped></style>
