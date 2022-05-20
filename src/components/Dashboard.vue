<script setup lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import TravelPath from './TravelPath.vue';
import SuspensionChart from './SuspensionChart.vue';
import RawTelemetry from './RawTelemetry.vue';
import StatisticsForLap from './StatisticsForLap.vue';
import LapTable from './LapTable.vue';
import TelemetryMoment from './TelemetryMoment.vue';
import { useTelemetry, useTelemetryJsonParser } from '../helpers';
import { useRaceStore } from '../store';

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

async function onToggleCollector() {
  telemetry.toggleCollector();
}

const fileParser = useTelemetryJsonParser();

async function onFileDrop(event: DragEvent) {
  console.log('File dropped');
  state.wrapperClass = '';
  // clear();

  if (event.dataTransfer?.items) {
    for (let index = 0; index < event.dataTransfer.items.length; index++) {
      const file = event.dataTransfer.items[index].getAsFile();
      if (file) {
        const rows = await fileParser.parseFile(file);
        console.log('Recieved', rows.length, 'telemetry lines');
        telemetry.load(rows);
        console.log('Processed', rows.length);
      }
    }
  }
}

function onDragOver() {
  state.wrapperClass = 'wrapper-dragover';
}

function onDragLeave() {
  state.wrapperClass = '';
}
</script>

<template>
  <div class="wrapper" :class="state.wrapperClass" @dragover.prevent="onDragOver" @dragleave="onDragLeave"
    @drop.prevent="onFileDrop">
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
      </label>-->
      <button class="ml-8" type="button" @click="onToggleCollector">{{ streamingButtonText }} Collector</button>

      <div v-if="telemetry.state.streaming">Listening on {{ telemetry.state.address }}:{{ telemetry.state.port }}</div>
      <!-- <div>
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
  </div>
</template>

<style>
.wrapper {
  @apply h-screen p-4;
}

.wrapper-dragover {
  @apply bg-yellow-100;
}
</style>
