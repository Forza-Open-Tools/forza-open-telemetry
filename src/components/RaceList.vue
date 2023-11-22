<script setup lang="ts">
import { useRaceStore } from '../stores';

const raceStore = useRaceStore();

</script>
<template>
  <div class="border p-2 rounded">
    <p class="text-lg font-bold">Races</p>
    <div
      v-for="(race, index) of raceStore.races"
      class="cursor-pointer"
      :class="{ 'font-bold': index === raceStore.selected.race }"
      @click="raceStore.selectRace(index)"
    >
      {{ race.car.make }}
      {{ race.car.model }}
      {{ race.car.ordinal }} -
      {{ race.laps.length }} laps
    </div>
    <div v-if="raceStore.races.length === 0">
      No Races Loaded
    </div>
  </div>
</template>
