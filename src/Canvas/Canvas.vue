<script setup lang="ts">
import { ref, watch, nextTick, provide, shallowRef } from 'vue';
import { Renderer } from './Renderer';
import { useResizeObserver, useDrag } from '../hooks';
import { Geometry } from '../math';

const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const renderer = new Renderer();

renderer.transform.translation = [200, 200];

const size = ref({ width: 0, height: 0 });

let timer = 0;
function draw() {
  clearTimeout(timer);
  setTimeout(() => {
    if (renderer.canvas) {
      renderer.draw();
    }
  }, 1000 / 48);
}

function fitToView(rect?: Geometry.Rectangle) {
  if (!rect) {
    if (!containerRef.value) return;
    const canvasRect = containerRef.value.getBoundingClientRect();
    rect = {
      x: canvasRect.x,
      y: canvasRect.y,
      width: canvasRect.width - 300,
      height: canvasRect.height,
    };
  }
  if (renderer.canvas && rect) {
    renderer.fitContentToView(rect);
  }
  draw();
}

provide('renderer', renderer);
provide('draw', draw);

watch(canvasRef, async (canvas) => {
  if (canvas) {
    canvasRef.value && renderer.setCanvas(canvasRef.value);
  }
});

useResizeObserver<HTMLDivElement>(async (newSize) => {
  size.value = newSize;
  renderer.setSize(newSize.width, newSize.height);
  await nextTick();

  draw();
}, containerRef);

defineExpose({
  fitToView,
});

const dragOffset = ref({ x: 0, y: 0 });
useDrag(containerRef, {
  onStartDrag: (e) => {
    if (containerRef.value) {
      containerRef.value.focus();

      const rect = containerRef.value.getBoundingClientRect();
      const x = e.pageX - rect.x;
      const y = e.pageY - rect.y;
      dragOffset.value = { x, y };
      draw();
    }
  },
  onDrag: (e) => {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect();
      const x = e.pageX - rect.x;
      const y = e.pageY - rect.y;
      renderer.transform.move(x - dragOffset.value.x, y - dragOffset.value.y);
      dragOffset.value = { x, y };
      draw();
    }
  },
});

function onWheel(e: WheelEvent) {
  const clickArea = containerRef.value;
  if (clickArea) {
    // Screen space to canvas space
    const rect = clickArea.getBoundingClientRect();
    const clickAreaX = e.pageX - rect.x;
    const clickAreaY = e.pageY - rect.y;
    const [x, y] = renderer.transform.transformInverse([clickAreaX, clickAreaY]);
    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
    if (renderer.transform.scaling[0] * zoom < 250) {
      renderer.transform.zoomTo([x, y], zoom);
    }
    draw();
  }
}
</script>

<template>
  <div ref="containerRef" tabIndex="0" @wheel="onWheel">
    <canvas v-if="size.width !== 0 && size.height !== 0" ref="canvasRef" v-bind="$attrs">
      <slot> </slot>
    </canvas>
  </div>
</template>

<style scoped>
div {
  width: 100%;
  height: 100%;
  contain: paint;
}

canvas {
  border: 0px;
}
</style>
