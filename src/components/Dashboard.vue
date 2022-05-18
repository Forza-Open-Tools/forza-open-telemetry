<template>
  <div
    class="wrapper"
    :class="state.wrapperClass"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onFileDrop"
  >
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
      <button
        class="ml-8"
        type="button"
        @click="onToggleCollector"
      >{{ streamingButtonText }} Collector</button>

      <div v-if="state.connected">Listening on {{ state.address }}:{{ state.port }}</div>
      <!-- <div>
        <label>Throttle:</label>
        <input type="text" v-model="state.throttle" />
      </div>
      <div>Tire slip index: {{ state.slipIndex }}</div>-->
    </div>
    <template v-if="state.laps.length">
      <div class="flex">
        <TravelPath v-if="state.show.travelPath" :laps="state.laps" />
      </div>
      <!-- <h2>{{ socket.connected ? 'Connected' : 'Disconnected' }}</h2> -->
      <TelemetryMoment :lap="selectedLap" :laps="state.laps">
        <LapTable v-model="state.selectedLapIndex" :laps="state.laps" />
      </TelemetryMoment>
      <div class="flex">
        <!-- <StatisticsForLap :lap="selectedLap" /> -->
        <!-- <Suspension v-if="state.show.suspension" :telemetry="selectedLap.telemetry" /> -->
      </div>
      <!-- <RawTelemetry v-if="state.show.telemetryTable" :lap="selectedLap" /> -->
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { AddressInfo } from 'net';
import { TelemetryRow } from 'forza-open-telemetry-server';
import TravelPath from './TravelPath.vue';
import Suspension from './Suspension.vue';
import RawTelemetry from './RawTelemetry.vue';
import useSocket from './useSocket';
import { ITelemetryLap, TelemetryDataRow } from '../lib/types';
import { TelemetryLap } from '../lib';
import { convertTelemetryArray } from '../lib/utils';
import StatisticsForLap from './StatisticsForLap.vue';
import LapTable from './LapTable.vue';
import TelemetryMoment from './TelemetryMoment.vue';
import raceData from '../assets/sampleRaceData.json';
import useIpcClient from '../lib/useIpcClient';
import useTelemetryJsonParser from '../lib/useTelemetryJsonParser';

interface DashboardState {
  throttle: number;
  laps: ITelemetryLap[];
  previousLap: TelemetryLap | null;
  currentLap: TelemetryLap | null;
  selectedLapIndex: number;
  connected: boolean;
  connectedError: string;
  show: {
    travelPath: boolean;
    suspension: boolean;
    telemetryTable: boolean;
  };
  streaming: boolean;
  wrapperClass: string;
  slipIndex: number;
  address: string,
  port: number,
}

export default defineComponent({
  components: { TravelPath, Suspension, RawTelemetry, StatisticsForLap, LapTable, TelemetryMoment },
  setup() {
    const state = reactive<DashboardState>({
      throttle: 0,
      laps: [],
      previousLap: null,
      currentLap: null,
      selectedLapIndex: 0,
      connected: false,
      connectedError: '',
      show: {
        travelPath: false,
        suspension: false,
        telemetryTable: false,
      },
      streaming: false,
      wrapperClass: '',
      slipIndex: -1,
      address: '',
      port: 0,
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
      if (!state.throttle || (throttleCounter % state.throttle === 0)) {
        const row = convertTelemetryArray(data);
        if (!row.isRaceOn) return;
        if (!state.currentLap || row.lap > state.currentLap.lap) {
          createLap(row);
        }
        if (state.currentLap && row.lap < state.currentLap.lap) {
          console.log('Lap # reset to', row.lap);
        }
        if (state.currentLap) {
          state.currentLap?.add(row);
        } else {
          console.error('current lap not available!');
          throw new Error('current lap not available!');
        }
      }
      throttleCounter += 1;
    }

    function clear() {
      state.laps = [];
      state.previousLap = null;
      state.currentLap = null;
      throttleCounter = 0;
    }

    const ipcClient = useIpcClient({
      telemetry: (data) => {
        onTelemetry(data);
        return Promise.resolve();
      },
      collectorClosed: (reason) => {
        console.log('Collector unexpected closed:', reason);
        state.connectedError = reason;
        state.connected = false;
        return Promise.resolve();
      },
    });

    async function onToggleCollector() {
      if (state.connected) {
        const address = await ipcClient.send<AddressInfo>('startCollector');
        state.address = address.address;
        state.port = address.port;
      }
    }

    // const socket = io('http://localhost:5555');
    // const socket = useSocket();

    // socket.on('telemetry', onTelemetry);

    // function onToggleStream() {
    //   if (state.streaming) {
    //     socket.connect();
    //     state.streaming = true;
    //   } else {
    //     socket.disconnect();
    //     state.streaming = false;
    //   }
    // }

    const fileParser = useTelemetryJsonParser();

    function parseDataRows(rows: TelemetryDataRow[]) {
      rows.forEach(onTelemetry);
      const totalRows = state.laps.reduce((acc, lap) => acc + lap.telemetry.length, 0);
      console.log('throttle count', throttleCounter);
      console.log('Processed', totalRows);
    }

    async function onFileDrop(event: DragEvent) {
      console.log('File dropped');
      state.wrapperClass = '';
      clear();

      if (event.dataTransfer?.items) {
        for (let index = 0; index < event.dataTransfer.items.length; index++) {
          const file = event.dataTransfer.items[index].getAsFile();
          if (file) {
            const rows = await fileParser.parseFile(file);
            console.log('Recieved', rows.length, 'telemetry lines');
            parseDataRows(rows);
          }
        }
      }
    }

    function loadSampleData() {
      parseDataRows(raceData);
    }

    onMounted(() => {
      loadSampleData();
    });

    function onDragOver() {
      state.wrapperClass = 'wrapper-dragover';
    }

    function onDragLeave() {
      state.wrapperClass = '';
    }

    return {
      state,
      selectedLap,
      streamingButtonText,
      onToggleCollector,
      onFileDrop,
      onDragOver,
      onDragLeave,
    };
  },
});
</script>

<style lang="postcss">
.wrapper {
  @apply h-screen
    p-4;
}

.wrapper-dragover {
  @apply bg-yellow-100;
}
</style>
