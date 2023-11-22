<script setup lang="ts">
import { computed } from 'vue';
import { calcSpeed, formatLapTime } from '../lib/utils';
import { useRaceStore } from '../stores';
import LapStatisticsTable from './LapStatisticsTable.vue';

const store = useRaceStore();

const currentLapMaxSpeed = computed(() => `${calcSpeed(store.selectedLap?.stats.speed.max)} kph`);
const maxSpeedRace = computed(() => `${calcSpeed(store.selectedRace?.stats.speed.max)} kph`);
const maxRpm = computed(() => `${Math.round(store.selectedRace?.car.maxRpm || 0)}`);

function onLapClick(lap: number) {
  store.selectLap(lap - 1);
}

</script>
<template>
  <div>
    <h2>Laps</h2>
    <div v-for="lap in store.selectedRace!.laps" :key="lap.lap" class="flex cursor-pointer items-center"
      :class="{ 'font-bold': (lap.lap - 1) === store.selected.lap }" @click="onLapClick(lap.lap)">
      <div class="w-4 h-4 border border-gray-800" :class="store.lapColorClasses![lap.lap - 1].bg" />
      <div class="w-10 text-center">{{ lap.lap }}</div>
      <div>{{ formatLapTime(lap.time * 1000) }}</div>
    </div>
    <div>
      <h3 class="mt-4">Lap {{ store.selectedLap!.lap }}</h3>
      <LapStatisticsTable />

    </div>
  </div>
</template>
