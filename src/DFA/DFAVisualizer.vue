<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DFA } from './DFA';
import { DFAGraph, createDFAGraph } from './DFAGraph';
import Canvas from '../Canvas/Canvas.vue';
import GraphNode from './GraphNode.vue';
import GraphEdge from './GraphEdge.vue';

const { dfa } = defineProps<{ dfa: DFA }>();
// const graph = computed(() => {
//   return createDFAGraph(dfa);
// });

const graph = ref<DFAGraph>({ nodes: {}, edges: {} });
watch(
  () => dfa,
  (dfa) => {
    graph.value = createDFAGraph(dfa);
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
      <GraphEdge v-for="(edge, key, index) in graph.edges" :key="key" v-model="graph.edges[key]" />
    </template>
    <!-- Graph.Node -->
    <GraphNode v-for="(node, key, index) in graph.nodes" :key="key" v-model="graph.nodes[key]" />
  </Canvas>
</template>

<style scoped></style>
