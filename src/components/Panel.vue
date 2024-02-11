<script setup lang="ts">
import { LucideChevronDown, LucideChevronUp } from 'lucide-vue-next';
import { reactive, onMounted, ref, computed } from 'vue';

const { header } = defineProps<{ header: string }>();
const collapsed = ref(false);
</script>

<template>
  <div class="panel" :class="{ collapse: collapsed }" v-bind="$attrs">
    <div class="panel-title">
      <span></span>
      <span>{{ header }}</span>
      <button class="icon-btn" @click="() => (collapsed = !collapsed)">
        <LucideChevronDown v-if="collapsed" />
        <LucideChevronUp v-if="!collapsed" />
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.panel {
  pointer-events: all;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
  transition: grid-template-rows 0.2s ease;
}

.panel.collapse {
  grid-template-rows: min-content 0fr;
}

.icon-btn {
  margin: -4px;
}

.panel-title span {
  line-height: 1em;
  backdrop-filter: blur(9px);
}

.panel-title {
  justify-content: space-between;
  align-items: center;
}
</style>
