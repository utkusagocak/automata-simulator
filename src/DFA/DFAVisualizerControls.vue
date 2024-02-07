<script setup lang="ts">
import { Ref } from 'vue';
import { DFA } from './DFA';
import DFAVisualizer from './DFAVisualizer.vue';
import { LucideView } from 'lucide-vue-next';

const { visualizer } = defineProps<{
  visualizer: InstanceType<typeof DFAVisualizer> | null;
}>();
</script>

<template>
  <div class="panel">
    <div className="panel-title">DFA Visualizer Controls</div>

    <div class="panel-content">
      <div class="d-flex justify-content-center align-items-center">
        <button
          class="icon-btn"
          @click="
            () => {
              if (visualizer) {
                visualizer.controls?.fitToView();
              }
            }
          "
        >
          <LucideView />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-btn {
  font-size: 1.5rem;
  border-radius: 4px;
}
</style>
