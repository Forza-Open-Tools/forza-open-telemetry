<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { TelemetryLap } from '../lib';
import LapTableVue from './LapTable.vue';

const props = defineProps<{
  lap: TelemetryLap;
  current: TelemetryRow;
}>();

function getPoint(row: TelemetryRow) {
  return {
    x: Math.floor(row.positionX - props.lap.stats.positionX.min) + 10,
    y: Math.floor(row.positionZ - props.lap.stats.positionZ.min) + 10,
  };
}
function getCommand(row: TelemetryRow, command = 'L') {
  const point = getPoint(row);
  return `${command} ${point.x},${point.y}`;
}

const path = computed(() => {
  // props.lap.stats.positionX
  const commands = [];
  if (props.lap.telemetry.length) {
    commands.push(getCommand(props.lap.telemetry[0], 'M'));

    props.lap.telemetry.forEach((row) => {
      commands.push(getCommand(row));
    });

    commands.push(getCommand(props.lap.telemetry[0]));
  }

  return commands.join('\n');
});

const currentPoint = computed(() => getPoint(props.current));

const viewBox = computed(() => {
  return [
    0,
    0,
    Math.floor(props.lap.stats.positionX.max - props.lap.stats.positionX.min + 20),
    Math.ceil(props.lap.stats.positionZ.max - props.lap.stats.positionZ.min + 20),
  ].join(' ');
});

</script>
<template>
  <svg :viewBox="viewBox" style="background-color: 'transparent'; width: 500px; height: 500px;">
    <path :d="path" stroke="gray" fill="transparent" stroke-width="10" />
    <circle :cx="currentPoint.x" :cy="currentPoint.y" r="25" fill="yellow" />
  </svg>
</template>
