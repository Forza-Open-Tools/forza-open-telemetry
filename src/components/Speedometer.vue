<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed, reactive } from 'vue';

const props = defineProps<{
  row: TelemetryRow;
}>();

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

const maxRpm = computed(() => Math.round(props.row.engineMaxRpm));

const ticks = computed(() => {
  const marks = [];
  for (let index = 0; index <= maxRpm.value; index += 1000) {
    marks.push(index);
  }
  return marks;
});

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
  <div class="relative">
    <div>{{ Math.round(row.engineMaxRpm) }}</div>
    <div>Start Angle: {{ startAngle }}</div>
    <div>Speed: {{ Math.round(row.speed) }} kph</div>
    <div>RPMs: {{ Math.round(row.currentEngineRpm) }}</div>
    <div class="relative">
      <svg viewBox="0 0 100 70" class="bg-transparent w-full border-black border">
        <circle cx="50" cy="50" r="48" stroke="black" fill="transparent" />
      </svg>
      <div class="needle"></div>
    </div>
  </div>
</template>

<style lang="postcss">
.needle {
  @apply absolute
    w-1
    h-[95px]
    bg-black
    bottom-[52px]
    left-1/2;
}
</style>
