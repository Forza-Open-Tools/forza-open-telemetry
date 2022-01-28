<script setup lang="ts">
import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { formatAsPercent } from '../lib/utils';

const props = defineProps<{
  row: TelemetryRow;
  corner: 'FrontLeft' | 'FrontRight' | 'RearLeft' | 'RearRight';
}>();

const name = computed(() => `normalizedSuspensionTravel${props.corner}` as keyof TelemetryRow);
const level = computed(() => props.row[name.value]);

function getColor(value: number) {
  const percent = value * 100;
  if (percent < 20 || percent > 80) return 'bg-red-500';
  return 'bg-blue-300';
}

const spring = computed(() => ({
  style: { height: formatAsPercent(level.value) },
  class: getColor(level.value),
}));
</script>
<template>
  <div class="spring">
    <div class="spring-level" :class="spring.class" :style="spring.style" />
  </div>
</template>

<style>
.spring {
  @apply w-[20px]
    h-[175px]
    border
    border-black
    relative
    mx-4;
}

.spring-level {
  @apply absolute
    bottom-0
    left-0
    w-full
    bg-red-700;
}
</style>
