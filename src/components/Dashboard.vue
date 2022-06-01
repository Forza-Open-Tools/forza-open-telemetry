<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useTelemetry } from '../helpers';
import { useRaceStore } from '../store';
import TravelPath from './TravelPath.vue';
import SuspensionChart from './SuspensionChart.vue';
import RawTelemetry from './RawTelemetry.vue';
import StatisticsForLap from './StatisticsForLap.vue';
import LapTable from './LapTable.vue';
import TelemetryMoment from './TelemetryMoment.vue';
import FileDragAndDrop from './FileDragAndDrop.vue';
import RaceList from './RaceList.vue';

const state = reactive({
  wrapperClass: '',
  show: {
    travelPath: false,
    suspension: false,
    telemetryTable: false,
  },
});

const store = useRaceStore();

const telemetry = useTelemetry();

const streamingButtonText = computed(() => telemetry.state.streaming ? 'Stop' : 'Start');
</script>

<template>
  <FileDragAndDrop>
    <RaceList />
    <div class="flex items-center p-2 border-b border-gray-700">
      <!-- <label>
        <input type="checkbox" v-model="state.show.travelPath" />
        Show Travel Path
      </label>
      <label class="ml-8">
        <input type="checkbox" v-model="state.show.suspension" />
        Show Suspension
      </label>
      <label class="ml-8">
        <input type="checkbox" v-model="state.show.telemetryTable" />
        Show Detail Table
      </label>
      <button class="ml-8" type="button" @click="onToggleCollector">{{ streamingButtonText }} Collector</button>

      <div v-if="telemetry.state.streaming">Listening on {{ telemetry.state.address }}:{{ telemetry.state.port }}</div>
      <div>
        <label>Throttle:</label>
        <input type="text" v-model="state.throttle" />
      </div>
      <div>Tire slip index: {{ state.slipIndex }}</div>-->
    </div>
    <template v-if="store.selectedRace?.laps.length">
      <div class="flex">
        <TravelPath v-if="state.show.travelPath" />
      </div>
      <!-- <h2>{{ socket.connected ? 'Connected' : 'Disconnected' }}</h2> -->
      <TelemetryMoment />
      <div class="flex">
        <!-- <StatisticsForLap :lap="selectedLap" /> -->
        <!-- <Suspension v-if="state.show.suspension" :telemetry="selectedLap.telemetry" /> -->
      </div>
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
