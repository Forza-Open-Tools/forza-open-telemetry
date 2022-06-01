<script setup lang="ts">
import { computed } from 'vue';
import { formatLapTime } from '../lib/utils';
import { useRaceStore } from '../store';

const store = useRaceStore();

const lapClass = computed(() => store.lapColorClasses[store.selected.lap]);

function onLapClick(lap: number) {
  store.selectLap(lap - 1);
}

</script>
<template>
  <div>
    <h2>Laps</h2>
    <div v-for="lap in store.selectedRace!.laps" :key="lap.lap" class="flex cursor-pointer items-center"
      :class="{ 'font-bold': (lap.lap - 1) === store.selected.lap }" @click="onLapClick(lap.lap)">
      <div class="w-4 h-4 border border-gray-800" :class="store.lapColorClasses[lap.lap - 1].bg" />
      <div class="w-10 text-center">{{ lap.lap }}</div>
      <div>{{ formatLapTime(lap.time * 1000) }}</div>
    </div>
  </div>
</template>
