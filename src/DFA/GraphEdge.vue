<script setup lang="ts">
import { DFAEdge, DFAGraph } from './DFAGraph';
import Node from '../Canvas/Node.vue';
import { Path, Text } from '../Canvas/Shapes';
import { computed } from 'vue';

const { edge, graph } = defineProps<{ edge: DFAEdge; graph: DFAGraph }>();
const layout = computed(() => graph.getEdgeWithLayout(edge));
</script>

<template>
  <!-- Graph.Edge -->
  <Node
    :As="Path"
    :d="layout.arrow"
    :style="{
      stroke: edge.isActive ? 'red' : 'orange',
      fill: edge.isActive ? 'red' : 'orange',
      strokeWidth: 0.5,
      zIndex: 0,
    }"
  />
  <Node
    :As="Path"
    :d="layout.arc"
    :style="{
      stroke: edge.isActive ? 'red' : 'orange',
      fill: 'transparent',
      zIndex: 0,
      pointerEvents: 'all',
    }"
  />
  <Node
    :As="Text"
    :x="layout.text.x"
    :y="layout.text.y"
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
