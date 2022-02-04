<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { TelemetryLap } from '../lib';
import { formatLapTime } from '../lib/utils';

const props = defineProps<{
  modelValue: number;
  laps: TelemetryLap[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

function onLapClick(lap: number) {
  emit('update:modelValue', lap - 1);
}

</script>
<template>
  <div>
    <h2>Laps</h2>
    <div
      v-for="lap in laps"
      :key="lap.lap"
      class="flex cursor-pointer items-center"
      :class="{ 'font-bold': (lap.lap - 1) === modelValue }"
      @click="onLapClick(lap.lap)"
    >
      <div class="w-4 h-4 border border-gray-800" :class="lap.colorClasses.bg" />
      <div class="w-10 text-center">{{ lap.lap }}</div>
      <div>{{ formatLapTime(lap.time * 1000) }}</div>
    </div>
  </div>
</template>
