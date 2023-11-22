<script setup lang="ts">
import { computed } from 'vue';
import { formatLapTime, formatSpeed } from '../lib/utils';
import { useRaceStore } from '../stores';

const store = useRaceStore();

const averageLapTime = computed(() => store.selectedRace!.laps.reduce((total, l) => total + l.time, 0) / store.selectedRace!.laps.length);

</script>
<template>
  <table class="font-bold mt-8 text-right">
    <tbody>
      <tr>
        <td>Avg Lap Time:</td>
        <td>{{ formatLapTime(averageLapTime * 1000) }}</td>
      </tr>
      <tr>
        <td>Current Race Time:</td>
        <td>{{ formatLapTime(store.currentDataPoint!.raceTime * 1000) }}</td>
      </tr>
      <tr>
        <td>Current Lap Time:</td>
        <td>{{ formatLapTime(store.selectedLap!.time * 1000) }}</td>
      </tr>
      <tr>
        <td>Top Speed This Lap:</td>
        <td>{{ formatSpeed(store.selectedLap!.stats.speed.max) }}</td>
      </tr>
      <tr>
        <td>Min Speed This Lap:</td>
        <td>{{ formatSpeed(store.selectedLap!.stats.speed.min) }}</td>
      </tr>
      <tr>
        <td>Avg Speed This Lap:</td>
        <td>{{ formatSpeed(store.selectedLap!.stats.speed.avg) }}</td>
      </tr>
      <tr>
        <td>Top Speed Overall:</td>
        <td>{{ formatSpeed(store.selectedRace!.stats.speed.max) }}</td>
      </tr>
      <tr>
        <td>Avg Speed Overall:</td>
        <td>{{ formatSpeed(store.selectedRace!.stats.speed.avg) }}</td>
      </tr>
    </tbody>
  </table>
</template>
