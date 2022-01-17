<template>
  <div class="flex">
    <TravelPath :telemetry="state.laps" />
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
      <Suspension :telemetry="selectedLap.telemetry" />
    </div>
  </div>
  <RawTelemetry :lap="selectedLap" />
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
    });

    const selectedLap = computed(() => state.laps[selectedLapNum.value]);

    function onTelemetry(data: TelemetryDataRow) {
      const row = telemetryArrayToObject(data);
      if (row.isRaceOn) {
        if (!state.laps[row.lap]) {
          if (state.laps.length > 1) {
            state.laps[row.lap - 1].time = row.lastLapTime;
          }
          state.laps.push({
            lap: row.lap,
            time: 0,
            telemetry: [],
          });
        }
        state.laps[row.lap].time = row.currentLapTime;
        state.laps[row.lap].telemetry.push(row);
      }
    }

    rawData.forEach(onTelemetry);

    // const socket = io('http://localhost:5555');
    const socket = useSocket();

    socket.on('telemetry', onTelemetry);

    function onLapClick(lap: number) {
      selectedLapNum.value = lap;
    }

    return {
      state,
      selectedLap,
      onLapClick,
      socket: socket.state,
    };
  },
});
</script>
