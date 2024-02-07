<script setup lang="ts">
import { computed, ref } from 'vue';
import { DFA } from './DFA';
import { createDFAGraph } from './DFAGraph';
import Canvas from '../Canvas/Canvas.vue';
import Node from '../Canvas/Node.vue';
import { Circle, Path, Text } from '../Canvas/Shapes';

const { dfa } = defineProps<{ dfa: DFA }>();
const graph = computed(() => {
  return createDFAGraph(dfa);
});

const canvas = ref<InstanceType<typeof Canvas>>();
defineExpose({ controls: canvas, grap: graph });
</script>

<!-- Graph -->
<template>
  <Canvas ref="canvas" id="dfa-graph-canvas">
    <!-- Graph.Edge -->
    <template v-for="(edge, key, index) in graph.edges" :key="edge">
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
    <!-- Graph.Node -->
    <template v-for="(node, key, index) in graph.nodes" :key="node">
      <Node
        :As="Circle"
        :cx="node.x"
        :cy="node.y"
        :r="20"
        :style="{ fill: node.isActive ? 'red' : 'orange', stroke: 'orange', zIndex: 1 }"
      />
      <Node
        :As="Text"
        :x="node.x"
        :y="node.y"
        :width="20"
        :textContent="node.state.name"
        :style="{ fill: 'black', zIndex: 4 }"
      />
      <Node
        :As="Circle"
        :cx="node.x"
        :cy="node.y"
        :r="18"
        :style="{ fill: 'transparent', stroke: node.isAccept ? 'white' : 'transparent', zIndex: 2 }"
      />
    </template>
  </Canvas>
</template>

<style scoped></style>
