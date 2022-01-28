<template>
  <div
    class="wrapper"
    :class="state.wrapperClass"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onFileDrop"
  >
    <div class="flex items-center p-2 border-b border-gray-700">
      <label>
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
      <button class="ml-8" type="button" @click="onToggleStream">{{ streamingButtonText }} Streaming</button>
      <div>
        <label>Throttle:</label>
        <input type="text" v-model="state.throttle" />
      </div>
    </div>
    <template v-if="state.laps.length">
      <div class="flex">
        <TravelPath v-if="state.show.travelPath" :laps="state.laps" />
      </div>
      <h2>{{ socket.connected ? 'Connected' : 'Disconnected' }}</h2>
      <div class="flex">
        <LapTable v-model="state.selectedLapIndex" :laps="state.laps" />
        <StatisticsForLap :lap="selectedLap" />
        <Suspension v-if="state.show.suspension" :telemetry="selectedLap.telemetry" />
      </div>
      <TelemetryMoment :lap="selectedLap" />
      <RawTelemetry v-if="state.show.telemetryTable" :lap="selectedLap" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import TravelPath from './TravelPath.vue';
import Suspension from './Suspension.vue';
import RawTelemetry from './RawTelemetry.vue';
import useSocket from './useSocket';
import { TelemetryDataRow } from '../lib/types';
import { TelemetryLap } from '../lib';
import { convertTelemetryArray } from '../lib/utils';
import { TelemetryRow } from 'forza-open-telemetry-server';
import StatisticsForLap from './StatisticsForLap.vue';
import LapTable from './LapTable.vue';
import TelemetryMoment from './TelemetryMoment.vue';

interface DashboardState {
  throttle: number;
  laps: TelemetryLap[];
  previousLap: TelemetryLap | null;
  currentLap: TelemetryLap | null;
  selectedLapIndex: number;
  connected: boolean;
  connectedError: boolean;
  show: {
    travelPath: boolean;
    suspension: boolean;
    telemetryTable: boolean;
  };
  streaming: boolean;
  wrapperClass: string;
}

export default defineComponent({
  components: { TravelPath, Suspension, RawTelemetry, StatisticsForLap, LapTable, TelemetryMoment },
  setup() {
    const state = reactive<DashboardState>({
      throttle: 30,
      laps: [],
      previousLap: null,
      currentLap: null,
      selectedLapIndex: 0,
      connected: false,
      connectedError: false,
      show: {
        travelPath: false,
        suspension: false,
        telemetryTable: true,
      },
      streaming: false,
      wrapperClass: '',
    });

    const selectedLap = computed<TelemetryLap>(() => state.laps[state.selectedLapIndex] as TelemetryLap);
    const streamingButtonText = computed(() => state.streaming ? 'Stop' : 'Start');

    function createLap(row: TelemetryRow) {
      const lap = new TelemetryLap(row.lap);
      state.laps.push(lap);
      state.previousLap = state.currentLap;
      state.currentLap = lap;

      if (state.previousLap && row.lastLapTime) {
        state.previousLap.updateTime(row.lastLapTime);
      }
    }

    let throttleCounter = 0;

    function onTelemetry(data: TelemetryDataRow) {
      if (throttleCounter % 10 === 0) {
        const row = convertTelemetryArray(data);
        if (!row.isRaceOn) return;
        if (!state.currentLap || row.lap > state.currentLap.lap) {
          createLap(row);
        }
        state.currentLap?.add(row);
      }
      throttleCounter += 1;
    }

    function clear() {
      state.laps = [];
      state.previousLap = null;
      state.currentLap = null;
    }

    // const socket = io('http://localhost:5555');
    const socket = useSocket();

    socket.on('telemetry', onTelemetry);

    function onToggleStream() {
      if (state.streaming) {
        socket.connect();
        state.streaming = true;
      } else {
        socket.disconnect();
        state.streaming = false;
      }
    }

    function parseFile(file: File): Promise<TelemetryDataRow[]> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result: string = event.target?.result as string || '';
          const lines = result.split(/\r?\n/g);
          const rows: TelemetryDataRow[] = [];
          lines.forEach((line, index) => {
            if (line.trim()) {
              try {
                rows.push(JSON.parse(line) as TelemetryDataRow);
              } catch (error) {
                console.error('Error parsing line', index);
                console.log(line);
              }
            }
          });
          resolve(rows);
        }
        reader.readAsText(file);
      })
    }

    async function onFileDrop(event: DragEvent) {
      console.log('File dropped');
      state.wrapperClass = '';

      if (event.dataTransfer?.items) {
        for (let index = 0; index < event.dataTransfer.items.length; index++) {
          const file = event.dataTransfer.items[index].getAsFile();
          if (file) {
            const rows = await parseFile(file);
            console.log('Recieved', rows.length, 'telemetry lines');
            clear();
            rows.forEach(onTelemetry);
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

    return {
      state,
      selectedLap,
      socket: socket.state,
      streamingButtonText,
      onToggleStream,
      onFileDrop,
      onDragOver,
      onDragLeave,
    };
  },
});
</script>

<style>
.wrapper {
  @apply h-screen
    p-4;
}

.wrapper-dragover {
  @apply bg-yellow-100;
}
</style>
