<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { Statistics, TelemetryLap } from '../lib';
import LapTableVue from './LapTable.vue';

const props = defineProps<{
  lap: TelemetryLap;
  current: TelemetryRow;
}>();

const svgPadding = 20;

function getPoint(row: TelemetryRow) {
  return {
    x: Math.floor(row.positionX - props.lap.stats.positionX.min) + svgPadding,
    y: Math.floor(row.positionZ - props.lap.stats.positionZ.min) + svgPadding,
  };
}

function getCommand(row: TelemetryRow, command = 'L') {
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

const currentPoint = computed(() => getPoint(props.current));
// const startPoint = computed(() => getPoint(props.lap.telemetry[0]));
const endPoint = computed(() => getPoint(props.lap.telemetry[props.lap.telemetry.length - 1]));

function getDimension(stat: Statistics) {
  const max = Math.abs(props.lap.stats.positionX.max)
}

const viewBox = computed(() => {
  return [
    0,
    0,
    Math.floor(Math.abs(props.lap.stats.positionX.max - props.lap.stats.positionX.min) + svgPadding * 2),
    Math.ceil(Math.abs(props.lap.stats.positionZ.max - props.lap.stats.positionZ.min) + svgPadding * 2),
  ].join(' ');
});

</script>
<template>
  <svg :viewBox="viewBox" style="background-color: transparent; width: 500px; height: 500px;">
    <path :d="path" stroke="gray" fill="transparent" stroke-width="15" />
    <!-- <circle :cx="startPoint.x" :cy="startPoint.y" r="15" fill="black" /> -->
    <circle :cx="endPoint.x" :cy="endPoint.y" r="15" fill="black" />
    <circle
      :cx="currentPoint.x"
      :cy="currentPoint.y"
      r="15"
      fill="blue"
      stroke="black"
      stroke-width="2"
    />
  </svg>
  <!-- <div>
    {{ viewBox }}
    <br />
    PositionX: {{ lap.stats.positionX }}
    <br />
    x size: {{ props.lap.stats.positionX.max - props.lap.stats.positionX.min }}
    <br />
    PositionY: {{ lap.stats.positionZ }}
    <br />
    y size: {{ props.lap.stats.positionZ.max - props.lap.stats.positionZ.min }}
    <br />
  </div>-->
</template>
