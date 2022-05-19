<script setup lang="ts">
import { computed } from 'vue';
import { getLapColorClass } from '../lib';
import { TelemetryDataPoint, TelemetryLap } from '../lib/data';

const props = defineProps<{
  lap: TelemetryLap;
  current?: TelemetryDataPoint;
}>();

const svgPadding = 20;

function getPoint(row: TelemetryDataPoint) {
  return {
    x: Math.floor(row.position.x - props.lap.stats.position.x.min) + svgPadding,
    y: Math.floor(row.position.z - props.lap.stats.position.z.min) + svgPadding,
  };
}

function getCommand(row: TelemetryDataPoint, command = 'L') {
  const point = getPoint(row);
  return `${command} ${point.x},${point.y}`;
}

const path = computed(() => {
  const commands = [];
  if (props.lap.telemetry.length) {
    commands.push(getCommand(props.lap.telemetry[0], 'M'));
    let lastTime = 0;
    const skipTimeAmount = 300;
    props.lap.telemetry.forEach((row) => {
      if (row.timestampMS - lastTime >= skipTimeAmount) {
        commands.push(getCommand(row));
        lastTime = row.timestampMS;
      }
    });

    commands.push(getCommand(props.lap.telemetry[0]));
  }

  return commands.join(' ');
});

// const issues = computed(() => {
//   if (!props.current) return [];
//   const color = props.lap.colorClasses.bg.includes('red') ? 'yellow' : 'red';
//   return props.lap.issues.map((i) => ({
//     ...getPoint(i),
//     timestampMS: i.timestampMS,
//     color,
//   }));
// })

const currentPoint = computed(() => props.current ? getPoint(props.current) : null);
// const startPoint = computed(() => getPoint(props.lap.telemetry[0]));
const endPoint = computed(() => getPoint(props.lap.telemetry[props.lap.telemetry.length - 1]));

const colorClass = computed(() => getLapColorClass(props.lap.lap));

const stroke = computed(() => ({
  width: props.current ? '7px' : '13px',
  opacity: props.current ? '1' : '0.5',
  class:  colorClass.value.stroke,
}));

const viewBox = computed(() => {
  return [
    0,
    0,
    Math.floor(Math.abs(props.lap.stats.position.x.max - props.lap.stats.position.x.min) + svgPadding * 2),
    Math.ceil(Math.abs(props.lap.stats.position.z.max - props.lap.stats.position.z.min) + svgPadding * 2),
  ].join(' ');
});

</script>
<template>
  <svg :viewBox="viewBox" style="background-color: transparent; width: 500px; height: 500px;">
    <path
      :d="path"
      :class="stroke.class"
      fill="transparent"
      :stroke-width="stroke.width"
      :stroke-opacity="stroke.opacity"
    />
    <!-- <circle v-for="t in issues" :key="t.timestampMS" :cx="t.x" :cy="t.y" r="3px" :fill="t.color" /> -->
    <!-- <circle :cx="startPoint.x" :cy="startPoint.y" r="15" fill="black" /> -->
    <circle :cx="endPoint.x" :cy="endPoint.y" r="15" fill="black" />
    <circle
      v-if="currentPoint"
      :cx="currentPoint.x"
      :cy="currentPoint.y"
      r="15"
      fill="blue"
      stroke="black"
      stroke-width="2"
    />
  </svg>
</template>
