<script setup lang="ts">
import { computed, reactive } from 'vue';
import { IRaceCar, ITelemetryDataPoint } from '../lib/types';
import { RadialGaugeOptions } from 'canvas-gauges';
import VueGauge from './VueGauge.vue';
import { useRaceStore } from '../stores';
import TachometerGauge from './TachometerGauge.vue';
import { calcSpeed } from '../lib/utils';
import SpeedometerGauge from './SpeedometerGauge.vue';
import GearIndicator from './GearIndicator.vue';

const store = useRaceStore();

const circle = reactive({
  radius: 50,
  width: 2,
  offset: 30,
})

const viewBox = computed(() => [
  0,
  0,
  circle.radius * 2 + 2,
  circle.radius * 2 + 2 - 30,
]);

function calcPointOnCircle(angle: number) {
  return {
    x: circle.radius * Math.sin(angle),
    y: circle.radius * Math.cos(angle),
  };
}

const startAngle = computed(() => {
  for (let index = 45; index < 90; index++) {
    const point = calcPointOnCircle(index);
    if (point.y > viewBox.value[3]) {
      console.log('startAngle', index);
      return index;
    }
  }
  return 60;
})

</script>
<template>
  <div>
    <div class="flex items-center">
      <SpeedometerGauge />
      <GearIndicator />
      <TachometerGauge />
      <!-- <div class="relative">
        <svg viewBox="0 0 100 70" class="bg-transparent w-full border-black border">
          <circle cx="50" cy="50" r="48" stroke="black" fill="transparent" />
        </svg>
        <div class="needle"></div>
      </div> -->
    </div>
    <div>Start Angle: {{ startAngle }}</div>
  </div>
</template>

<style>
.needle {
  @apply absolute w-1 h-[95px] bg-black bottom-[52px] left-1/2;
}
</style>
