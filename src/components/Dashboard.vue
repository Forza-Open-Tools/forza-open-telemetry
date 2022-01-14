<template>
  <div class="flex">
    <TravelPath :telemetry="laps" />
    <div class="border-green-800 p-4 flex-grow">
      <h2>Laps</h2>
      <div
        v-for="lap in laps"
        :key="lap.lap"
        class="flex cursor-pointer"
        @click="onLapClick(lap.lap)"
      >
        <div class="w-10">{{ lap.lap + 1 }}</div>
        <div>{{ lap.time }}</div>
      </div>
      <Suspension :telemetry="selectedLap.telemetry" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { TelemetryRow } from 'forza-open-telemetry-server/dist';
import rawData from '../assets/telemetrycapture-race.json';
import { telemetryArrayToObject } from './sampleData';
import TravelPath from './TravelPath.vue';
import Suspension from './Suspension.vue';
import { TelemetryLap } from '../lib';

const raceData = telemetryArrayToObject(rawData)
  .filter((row) => row.isRaceOn);

export default defineComponent({
  components: { TravelPath, Suspension },
  setup() {
    const selectedLapNum = ref(0);

    const laps = computed(() => {
      const laps: TelemetryLap[] = [];

      let lastRow: TelemetryLap | null = null;
      raceData.forEach((row) => {
        if (row.isRaceOn) {
          if (!laps[row.lap]) {
            if (laps.length > 1) {
              laps[row.lap - 1].time = row.lastLapTime;
            }
            console.log('Adding new lap', row.lap);
            laps.push({
              lap: row.lap,
              time: 0,
              telemetry: [],
            });
          }
          laps[row.lap].time = row.currentLapTime;
          laps[row.lap].telemetry.push(row);
          lastRow = row;
        }
      })
      return laps;
    });

    const selectedLap = computed(() => laps.value[selectedLapNum.value]);

    function onLapClick(lap: number) {
      selectedLapNum.value = lap;
    }

    return {
      telemetry: raceData,
      laps,
      selectedLap,
      onLapClick,
    };
  },
});
</script>
