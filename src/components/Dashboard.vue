<script setup lang="ts">
import { useRaceStore, useSettings } from '../stores';
import StatisticsForLap from './StatisticsForLap.vue';
import TelemetryMoment from './TelemetryMoment.vue';
import FileDragAndDrop from './FileDragAndDrop.vue';
import RaceList from './RaceList.vue';
import SettingsEdit from './SettingsEdit.vue';

const store = useRaceStore();
const settings = useSettings();
</script>

<template>
  <FileDragAndDrop>
    <SettingsEdit />
    <RaceList />



    <template v-if="store.selectedRace?.laps.length">
      <!-- <h2>{{ socket.connected ? 'Connected' : 'Disconnected' }}</h2> -->
      <TelemetryMoment />
      <StatisticsForLap v-if="store.selectedLap && settings.show.telemetryTable" :lap="store.selectedLap" />
      <!-- <Suspension v-if="state.show.suspension" :telemetry="selectedLap.telemetry" /> -->
      <!-- <RawTelemetry v-if="state.show.telemetryTable" :lap="selectedLap" /> -->
    </template>
  </FileDragAndDrop>
</template>

<style>
.wrapper {
  @apply h-screen p-4;
}

.wrapper-dragover {
  @apply bg-yellow-100;
}
</style>
