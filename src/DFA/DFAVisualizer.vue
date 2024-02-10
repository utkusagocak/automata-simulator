<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DFA } from './DFA';
import { DFAGraph, createDFAGraph } from './DFAGraph';
import Canvas from '../Canvas/Canvas.vue';
import GraphNode from './GraphNode.vue';
import GraphEdge from './GraphEdge.vue';

const { dfa } = defineProps<{ dfa: DFA }>();
const graph = ref<DFAGraph>(new DFAGraph());
watch(
  () => dfa,
  (dfa) => {
    graph.value.updateGraph(dfa);
  },
  { deep: true },
);

const canvas = ref<InstanceType<typeof Canvas>>();
defineExpose({ controls: canvas, grap: graph });
</script>

<!-- Graph -->
<template>
  <Canvas ref="canvas" id="dfa-graph-canvas">
    <!-- Graph.Edge -->
    <template>
      <GraphEdge v-for="(edge, key, index) in graph.edges" :key="key" :edge="edge" :graph="graph" />
    </template>
    <!-- Graph.Node -->
    <GraphNode
      v-for="(node, key, index) in graph.nodes"
      :key="key"
      v-model="graph.nodes[key]"
      :graph="graph"
    />
  </Canvas>
</template>

<style scoped></style>
