<script setup lang="ts">
import { CarCorner } from '../lib/types';
import { useRaceStore } from '../store';
import { useDocumentEvent } from '../helpers';
import TelemetryCorner from './TelemetryCorner.vue';
import TelemetryMap from './TelemetryMap.vue';
import TelemetryTimeline from './TelemetryTimeline.vue';
import LapTable from './LapTable.vue';
import Speedometer from './Speedometer.vue';

const store = useRaceStore();

const arrowKeys: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

function onArrowKeyPress(e: KeyboardEvent) {
  console.log('document keypress');
  if (e.key in arrowKeys) {
    console.log(e.key);
    e.preventDefault();
    let modifier = arrowKeys[e.key];
    if (e.ctrlKey) modifier *= 10;
    else if (e.shiftKey) modifier *= 30;
    store.setTelemetryIndex(store.selected.moment += modifier);
  }
}

const keydown = useDocumentEvent('keydown', onArrowKeyPress);
keydown.activate();

// const averageLapTime = computed(() => props.laps.reduce((total, l) => total + l.time, 0) / props.laps.length);

// const overallSpeed = computed(() => {
//   const averages = { max: props.lap.stats.speed.max, avg: 0 };

//   props.laps.forEach((lap) => {
//     averages.max = Math.max(averages.max, lap.stats.speed.max);
//     averages.avg = averages.avg + lap.stats.speed.avg;
//   });
//   averages.avg /= props.laps.length;

//   return averages;
// });
</script>
<template>
  <!-- <div>
    <label>Current Point in Time</label>
    <input
      v-model.number="state.currentIndex"
      type="number"
      min="0"
      :max="lap.telemetry.length - 1"
    />
  </div>-->
  <div class="flex w-full mt-8">
    <div class="flex flex-col justify-between">
      <TelemetryCorner :corner="CarCorner.frontLeft" :data="store.currentDataPoint!" />
      <TelemetryCorner :corner="CarCorner.rearLeft" :data="store.currentDataPoint!" />
    </div>
    <div class="w-32 flex items-center">
      <Speedometer :car="store.selectedRace!.car" :row="store.currentDataPoint!" />
    </div>
    <div class="flex flex-col justify-between">
      <TelemetryCorner :corner="CarCorner.frontRight" :data="store.currentDataPoint!" />
      <TelemetryCorner :corner="CarCorner.rearRight" :data="store.currentDataPoint!" />
    </div>
    <div class="w-[300px] mx-4 flex flex-col justify-between">
      <div>
        <LapTable />
        <!-- <table class="font-bold mt-8 text-right">
          <tbody>
            <tr>
              <td>Average Lap Time:</td>
              <td>{{ formatLapTime(averageLapTime * 1000) }}</td>
            </tr>
            <tr>
              <td>Current Race Time:</td>
              <td>{{ formatLapTime(currentRow.currentRaceTime * 1000) }}</td>
            </tr>
            <tr>
              <td>Current Lap Time:</td>
              <td>{{ formatLapTime(currentRow.currentLapTime * 1000) }}</td>
            </tr>
            <tr>
              <td>Top Speed This Lap:</td>
              <td>{{ formatSpeed(lap.stats.speed.max) }}</td>
            </tr>
            <tr>
              <td>Min Speed This Lap:</td>
              <td>{{ formatSpeed(lap.stats.speed.min) }}</td>
            </tr>
            <tr>
              <td>Avg Speed This Lap:</td>
              <td>{{ formatSpeed(lap.stats.speed.avg) }}</td>
            </tr>
            <tr>
              <td>Top Speed Overall:</td>
              <td>{{ formatSpeed(overallSpeed.max) }}</td>
            </tr>
            <tr>
              <td>Avg Speed Overall:</td>
              <td>{{ formatSpeed(overallSpeed.avg) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="text-3xl font-bold mt-10 flex items-center">
          <div class="w-28">Speed:</div>
          <div class="text-right flex-grow">{{ calcSpeed(currentRow.speed).toFixed(1) }}</div>
          <div class="min-w-[75px] text-right">kph</div>
        </div>

        <div class="text-3xl font-bold mt-4 flex items-center">
          <div class="w-28">Tach:</div>
          <div class="text-right flex-grow">{{ round(currentRow.currentEngineRpm, 0) }}</div>
          <div class="min-w-[75px] text-right">rpm</div>
        </div> -->
      </div>
    </div>
    <div class="relative w-[500px] h-[500px]">
      <TelemetryMap v-for="l in store.selectedRace!.laps" :key="l.lap" :lap="l" class="absolute top-0 left-0"
        :class="{ 'z-20': l.lap === store.selectedLap!.lap }"
        :current="l.lap === store.selectedLap!.lap ? store.currentDataPoint : null" />
    </div>
  </div>
  <TelemetryTimeline />
</template>

<style>
.side {
  @apply flex;
}

.timeline {
  @apply w-full h-8 p-3 relative flex items-center;
}

.timeline-line {
  @apply left-0 w-full h-2 bg-black;
}

.marker {
  @apply absolute bg-blue-700 h-8 w-8 rounded-full top-0 z-30;
}
</style>
