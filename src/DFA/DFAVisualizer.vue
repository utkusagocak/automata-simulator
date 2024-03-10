<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DFA } from './DFA';
import { DFAGraph } from './DFAGraph';
import Canvas from '../Canvas/Canvas.vue';
import GraphNode from './GraphNode.vue';
import GraphEdge from './GraphEdge.vue';
import { Renderer } from '../Canvas/Renderer';
import Node from '../Canvas/Node.vue';
import { CustomShape } from '../Canvas/Shapes';
import { mat3 } from 'gl-matrix';

const { dfa } = defineProps<{ dfa: DFA }>();
const graph = ref<DFAGraph>(new DFAGraph());

graph.value.updateGraph(dfa);

watch(
  () => dfa,
  (dfa) => {
    graph.value.updateGraph(dfa);
  },
  { deep: true },
);

const canvas = ref<InstanceType<typeof Canvas>>();
defineExpose({ controls: canvas, grap: graph });

function drawGrid(renderer: Renderer) {
  const context = renderer.context;

  const [xEnd, yEnd] = [renderer.width, renderer.height];
  const space = 20 * renderer.transform.scaling[0];
  const [tx, ty] = renderer.transform.transform([0, 0]);
  const xStart = (tx % space) - space;
  const yStart = (ty % space) - space;

  context.save();
  context.resetTransform();
  context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  context.lineWidth = 1;

  context.beginPath();
  for (let x = xStart; x < xEnd; x += space) {
    context.moveTo(x, yStart);
    context.lineTo(x, yEnd);
  }
  for (let y = yStart; y < yEnd; y += space) {
    context.moveTo(xStart, y);
    context.lineTo(xEnd, y);
  }
  context.stroke();
  context.restore();
}
</script>

<!-- Graph -->
<template>
  <Canvas ref="canvas" id="dfa-graph-canvas">
    <!-- Background Grid -->
    <Node :As="CustomShape" :customDraw="drawGrid" :style="{ zIndex: -100 }" />
    <!-- Graph.Edge -->
    <GraphEdge v-for="(edge, key, index) in graph.edges" :key="key" :edge="edge" :graph="graph" />
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
