<script setup lang="ts">
import { RadialGaugeOptions } from 'canvas-gauges';
import { useRaceStore } from '../stores';
import { computed } from 'vue';
import VueGauge from './VueGauge.vue';

const store = useRaceStore();

const maxRpm = computed(() => Math.round(store.selectedRace?.car.maxRpm || 6000));

const majorTicks = computed(() => {
  const ticks = [];
  const tickSize = 1000;
  for (let index = 0; index <= (maxRpm.value + 2000); index += tickSize) {
    ticks.push(index / 1000);
  }
  return ticks;
})

const guageValue = computed(() => {
  return store.currentDataPoint!.engine.rpm / 1000;
})

const options = computed<Partial<RadialGaugeOptions>>(() => ({
  units: 'rpm (x1000)',
  width: 200,
  height: 200,
  minValue: 0,
  maxValue: maxRpm.value / 1000 + 2,
  majorTicks: majorTicks.value,
  minorTicks: 2,
  strokeTicks: true,
  highlights: [{ from: maxRpm.value / 1000, to: maxRpm.value / 1000 + 2, color: 'red' }],
}));

</script>
<template>
  <div class="flex flex-col items-center">
    <VueGauge :value="guageValue" :options="options" />
  </div>
</template>
