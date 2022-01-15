<template>
  <h2>Lap #{{ lap.lap }}</h2>
  <table>
    <thead>
      <tr>
        <th>Row #</th>
        <th>Elapsed Time</th>
        <th>Lap Time</th>
        <th>Race Time</th>
        <th>Position</th>
        <th>Speed</th>
        <th>Gear</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in lap.telemetry" :key="row.timestampMS" :class="{
        'border-t border-black': (index % 10) === 0,
        'bg-yellow-200': index > 0 && row.currentLapTime < lap.telemetry[index - 1].currentLapTime,
      }">
        <td>{{ index + 1 }}</td>
        <td>{{ formatLapTime(row.timestampMS - startTs) }}</td>
        <td>{{ formatLapTime(row.currentLapTime * 1000) }}</td>
        <td>{{ formatLapTime(row.currentRaceTime * 1000) }}</td>
        <td>{{ row.racePosition }}</td>
        <td>{{ Math.round(row.speed * 10) / 10 }}</td>
        <td>{{ row.gear }}</td>
        <td>({{ row.timestampMS }})</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import dayjs from 'dayjs';
import { ScatterChart } from 'vue-chart-3';
import { TelemetryLap } from '../lib';

export default defineComponent({
  components: { ScatterChart },
  props: {
    lap: {
      type: Object as PropType<TelemetryLap>,
      required: true,
    },
  },
  setup(props) {
    const startTs = computed(() => props.lap.telemetry[0].timestampMS)

    function formatLapTime(time: number): string {
      return dayjs(time).format('m:ss.SSS');
    }
    return {
      startTs,
      formatLapTime,
    }
  },
})
</script>
