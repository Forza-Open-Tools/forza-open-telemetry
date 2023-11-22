<script setup lang="ts">
import { computed } from 'vue';
import { RadialGaugeOptions } from 'canvas-gauges';
import VueGauge from './VueGauge.vue';
import { useRaceStore } from '../stores';
import { calcSpeed } from '../lib/utils';

const store = useRaceStore();

const speed = computed(() => calcSpeed(store.currentDataPoint?.engine.speed));

const maxSpeed = computed(() => {
  const max = (calcSpeed(store.selectedRace?.stats.speed.max) || 100) + 20;
  const normalized = max + (10 - max % 10);
  return normalized;
})

function getTickSize(maxSpeed: number) {
  let tickSize = maxSpeed / 10;
  const adjustBy = tickSize % 10;
  if (adjustBy > 0) tickSize += 10 - adjustBy;
  return tickSize;
}

const majorTicks = computed(() => {
  const ticks = [];
  const tickSize = getTickSize(maxSpeed.value);
  for (let index = 0; index <= maxSpeed.value; index += tickSize) {
    ticks.push(index);
  }
  return ticks;
})

const gaugeOptions = computed<Partial<RadialGaugeOptions>>(() => ({
  units: 'kph',
  minValue: 0,
  maxValue: maxSpeed.value,
  majorTicks: majorTicks.value,
  minorTicks: 2,
  strokeTicks: true,
  highlights: [],
}));
</script>
<template>
  <VueGauge :value="speed" :options="gaugeOptions" />
</template>

<style>
.needle {
  @apply absolute w-1 h-[95px] bg-black bottom-[52px] left-1/2;
}
</style>
