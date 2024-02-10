<script setup lang="ts">
import { DFANode } from './DFAGraph';
import Node from '../Canvas/Node.vue';
import { Circle, Shape, Style, Text } from '../Canvas/Shapes';
import { computed, inject } from 'vue';
import { Renderer } from '../Canvas/Renderer';

const node = defineModel<DFANode>({ required: true });
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
