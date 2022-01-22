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
    </div>
    <template v-if="state.laps.length">
      <div class="flex">
        <TravelPath v-if="state.show.travelPath" :telemetry="state.laps" />
        <div class="border-green-800 p-4 flex-grow">
          <h2>{{ socket.connected ? 'Connected' : 'Disconnected' }}</h2>
          <h2>Laps</h2>
          <div
            v-for="lap in state.laps"
            :key="lap.lap"
            class="flex cursor-pointer"
            @click="onLapClick(lap.lap)"
          >
            <div class="w-10">{{ lap.lap + 1 }}</div>
            <div>{{ lap.time }}</div>
          </div>
          <Suspension v-if="state.show.suspension" :telemetry="selectedLap.telemetry" />
        </div>
      </div>
      <RawTelemetry v-if="state.show.telemetryTable" :lap="selectedLap" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, reactive, ref } from 'vue'
import { io } from 'socket.io-client';
import { TelemetryRow } from 'forza-open-telemetry-server/dist';
import rawData from '../assets/telemetrycapture-race.json';
import { TelemetryLap } from '../lib';
import { telemetryArrayToObject, TelemetryDataRow } from './sampleData';
import TravelPath from './TravelPath.vue';
import Suspension from './Suspension.vue';
import RawTelemetry from './RawTelemetry.vue';
import useSocket from './useSocket';

export default defineComponent({
  components: { TravelPath, Suspension, RawTelemetry },
  setup() {
    const selectedLapNum = ref(0);

    const state = reactive({
      laps: [] as TelemetryLap[],
      selectedLapNum: 0,
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

    const selectedLap = computed(() => state.laps[selectedLapNum.value]);
    const streamingButtonText = computed(() => state.streaming ? 'Stop' : 'Start');

    function onTelemetry(data: TelemetryDataRow) {
      const row = telemetryArrayToObject(data);
      if (row.isRaceOn) {
        if (row.lap < state.laps.length - 1) {
          state.laps = [];
        }
        if (!state.laps[row.lap]) {
          if (state.laps.length > 1) {
            state.laps[state.laps.length - 1].time = row.lastLapTime;
          }
          state.laps.push({
            lap: row.lap,
            time: 0,
            telemetry: [],
            stats:
          });
        }
        try {
          state.laps[row.lap].time = row.currentLapTime;
          state.laps[row.lap].telemetry.push(row);
        } catch (error) {
          console.error(error);
          console.log(JSON.stringify(row));
        }
      }
    }

    // rawData.forEach(onTelemetry);

    // const socket = io('http://localhost:5555');
    const socket = useSocket();

    socket.on('telemetry', onTelemetry);

    function onLapClick(lap: number) {
      selectedLapNum.value = lap;
    }

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
            state.laps = [];
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
      onLapClick,
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
