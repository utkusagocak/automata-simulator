<script setup lang="ts">
import { DFAGraph, DFANode } from './DFAGraph';
import Node from '../Canvas/Node.vue';
import { Circle, Shape, Style, Text } from '../Canvas/Shapes';
import { computed, inject } from 'vue';
import { Renderer } from '../Canvas/Renderer';

const node = defineModel<DFANode>({ required: true });
const props = defineProps<{ graph: DFAGraph }>();

const renderer = inject<Renderer>('renderer');

function handleStartDrag(e: Event, shape: Shape) {
  e.stopPropagation();
  e.preventDefault();

  if (renderer?.canvas) {
    let offset = renderer.transformScreenCoordinatesToCanvas({
      x: (e as PointerEvent).pageX,
      y: (e as PointerEvent).pageY,
    });

    offset = {
      x: offset.x - node.value.x,
      y: offset.y - node.value.y,
    };

    function handleDrag(e: PointerEvent) {
      e.preventDefault();
      if (renderer?.canvas) {
        const { x, y } = renderer.transformScreenCoordinatesToCanvas({ x: e.pageX, y: e.pageY });
        const newX = Math.round((x - offset.x) / 20) * 20;

        for (const id in props.graph.nodes) {
          const n = props.graph.nodes[id];

          if (n.state.id !== node.value.state.id && Math.hypot(n.x - newX, 0) < 40) {
            return;
          }
        }

        node.value.x = newX;
        // node.value.y = y - offset.y;
      }
    }

    function handleDrop(e: PointerEvent) {
      e.preventDefault();
      document.removeEventListener('pointermove', handleDrag);
      document.removeEventListener('pointerup', handleDrop);
    }

    document.addEventListener('pointermove', handleDrag);
    document.addEventListener('pointerup', handleDrop);
  }
}
</script>

<template>
  <!-- Graph.Node -->
  <Node
    :As="Circle"
    :cx="node.x"
    :cy="node.y"
    :r="20"
    :style="{
      fill: node.isActive ? 'red' : 'orange',
      stroke: 'orange',
      zIndex: 1,
      pointerEvents: 'all',
      cursor: 'move',
    }"
    :onPointerDown="handleStartDrag"
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

<style scoped></style>
