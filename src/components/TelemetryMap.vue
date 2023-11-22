<script setup lang="ts">
import { computed } from 'vue';
import { getLapColorClass } from '../lib';
import { ITelemetryDataPoint, ITelemetryLap } from '../lib/types';
import { useRaceStore } from '../stores';

const props = defineProps<{
  lap: ITelemetryLap;
  current: ITelemetryDataPoint | null;
}>();

const store = useRaceStore();

const svgPadding = 20;

function getPoint(row: ITelemetryDataPoint) {
  return {
    x: Math.floor(row.position.x),
    y: Math.ceil(row.position.z),
  };
}

function getCommand(row: ITelemetryDataPoint, command = 'L') {
  const point = getPoint(row);
  return `${command} ${point.x},${point.y}`;
}

function commandPointAreEqual(cmd1: string, cmd2: string) {
  return cmd1.slice(2) === cmd2.slice(2);
}

const path = computed(() => {
  const commands = [];
  if (props.lap.telemetry.length) {
    const start = getCommand(props.lap.telemetry[0], 'M')
    commands.push(start);
    let lastTime = 0;
    let lastCommand = start;
    const skipTimeAmount = 300;
    props.lap.telemetry.forEach((row) => {
      const command = getCommand(row);
      // console.log(lastCommand.slice(2), command.slice(2));
      if (row.timestampMS - lastTime >= skipTimeAmount && lastCommand.slice(2) !== command.slice(2)) {
        // console.log('adding command', command);
        commands.push(command);
        lastTime = row.timestampMS;
        lastCommand = command;
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
  class: colorClass.value.stroke,
}));

const viewBox = computed(() => {
  return [
    Math.floor(store.selectedRace!.stats.position.x.min) - svgPadding,
    Math.ceil(store.selectedRace!.stats.position.z.min) - svgPadding,
    Math.floor(Math.abs(store.selectedRace!.stats.position.x.max - store.selectedRace!.stats.position.x.min) + svgPadding * 2),
    Math.ceil(Math.abs(store.selectedRace!.stats.position.z.max - store.selectedRace!.stats.position.z.min) + svgPadding * 2),
  ].join(' ');
});

</script>
<template>
  <svg :viewBox="viewBox" style="background-color: transparent; width: 500px; height: 500px;">
    <path :d="path" :class="stroke.class" fill="transparent" :stroke-width="stroke.width"
      :stroke-opacity="stroke.opacity" />
    <!-- <circle v-for="t in issues" :key="t.timestampMS" :cx="t.x" :cy="t.y" r="3px" :fill="t.color" /> -->
    <!-- <circle :cx="startPoint.x" :cy="startPoint.y" r="15" fill="black" /> -->
    <circle :cx="endPoint.x" :cy="endPoint.y" r="15" fill="black" />
    <circle v-if="currentPoint" :cx="currentPoint.x" :cy="currentPoint.y" r="15" fill="blue" stroke="black"
      stroke-width="2" />
  </svg>
</template>
