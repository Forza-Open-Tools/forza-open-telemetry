<script setup lang="ts">
import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { CarCorner } from '../lib/types';
import { formatAsPercent } from '../lib/utils';

const props = defineProps<{
  row: TelemetryRow;
  corner: CarCorner;
}>();

const name = computed(() => `normalizedSuspensionTravel${props.corner}` as keyof TelemetryRow);
const level = computed(() => props.row[name.value]);

function getColor(value: number) {
  const percent = value * 100;
  if (percent < 20 || percent > 80) return 'bg-red-500';
  return 'bg-green-400';
}

const spring = computed(() => ({
  style: { height: formatAsPercent(level.value) },
  class: getColor(level.value),
  label: formatAsPercent(level.value),
}));
</script>
<template>
  <div class="spring-label">{{ spring.label }}</div>
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

.spring-label {
  @apply text-sm
    h-[175px]
    w-10
    flex
    items-center;
}

.spring-level {
  @apply absolute
    bottom-0
    left-0
    w-full
    bg-red-700;
}
</style>
