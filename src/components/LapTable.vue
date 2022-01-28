<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
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
      class="flex cursor-pointer"
      @click="onLapClick(lap.lap)"
    >
      <div class="w-10 text-center">{{ lap.lap }}</div>
      <div>{{ formatLapTime(lap.time * 1000) }}</div>
    </div>
  </div>
</template>
