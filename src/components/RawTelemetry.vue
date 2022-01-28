<template>
  <h2>Lap #{{ lap.lap }}</h2>
  <table>
    <thead>
      <tr>
        <th colspan="9"></th>
        <th colspan="4" class="border-l border-black">Tire Temp</th>
        <th colspan="4" class="border-l border-black">Suspension Travel</th>
        <th colspan="4" class="border-l border-black">Normalized Susp</th>
        <th colspan="4" class="border-l border-black">Tire Slip</th>
        <th colspan="4" class="border-l border-black">Tire Slip Angle</th>
        <th colspan="4" class="border-l border-black">Tire Combined Slip</th>
        <th colspan="5" class="border-l border-black"></th>
        <th></th>
      </tr>
      <tr>
        <th>Row #</th>
        <th>Elapsed Time</th>
        <th>Lap</th>
        <th>Lap Time</th>
        <th>Race Time</th>
        <th>Position</th>
        <th>Speed</th>
        <th>Gear</th>
        <th>RPM</th>
        <th class="border-l border-black">FL</th>
        <th>FR</th>
        <th>RL</th>
        <th>RR</th>
        <th class="border-l border-black">FL</th>
        <th>FR</th>
        <th>RL</th>
        <th>RR</th>
        <th class="border-l border-black">FL</th>
        <th>FR</th>
        <th>RL</th>
        <th>RR</th>
        <th class="border-l border-black">FL</th>
        <th>FR</th>
        <th>RL</th>
        <th>RR</th>
        <th class="border-l border-black">FL</th>
        <th>FR</th>
        <th>RL</th>
        <th>RR</th>
        <th class="border-l border-black">FL</th>
        <th>FR</th>
        <th>RL</th>
        <th>RR</th>
        <th class="border-l border-black">Brake</th>
        <th>Clutch</th>
        <th>Handbrake</th>
        <th>Steer</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in lap.telemetry"
        :key="row.timestampMS"
        :class="{
          'border-t border-black': (index % 10) === 0,
          'bg-yellow-200': index > 0 && row.currentLapTime < lap.telemetry[index - 1].currentLapTime,
        }"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ formatLapTime(row.timestampMS - startTs) }}</td>
        <td class="text-center">{{ row.lap }}</td>
        <td>{{ formatLapTime(row.currentLapTime * 1000) }}</td>
        <td>{{ formatLapTime(row.currentRaceTime * 1000) }}</td>
        <td class="text-center">{{ row.racePosition }}</td>
        <td>{{ Math.round(row.speed * 10) / 10 }}</td>
        <td>{{ row.gear }}</td>
        <td>{{ Math.round(row.currentEngineRpm) }}</td>
        <td class="border-l border-black">{{ Math.round(row.tireTempFrontLeft * 10) / 10 }}</td>
        <td>{{ Math.round(row.tireTempFrontRight * 10) / 10 }}</td>
        <td>{{ Math.round(row.tireTempRearLeft * 10) / 10 }}</td>
        <td>{{ Math.round(row.tireTempRearRight * 10) / 10 }}</td>
        <td
          class="border-l border-black"
        >{{ Math.round(row.suspensionTravelMetersFrontLeft * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravelMetersFrontRight * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravelMetersRearLeft * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravelMetersRearRight * 10000) / 100 }}</td>
        <td
          class="border-l border-black"
        >{{ Math.round(row.normalizedSuspensionTravelFrontLeft * 10000) / 100 }}</td>
        <td>{{ Math.round(row.normalizedSuspensionTravelFrontRight * 10000) / 100 }}</td>
        <td>{{ Math.round(row.normalizedSuspensionTravelRearLeft * 10000) / 100 }}</td>
        <td>{{ Math.round(row.normalizedSuspensionTravelRearRight * 10000) / 100 }}</td>
        <td class="border-l border-black">{{ Math.round(row.tireSlipRatioFrontLeft * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireSlipRatioFrontRight * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireSlipRatioRearLeft * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireSlipRatioRearRight * 100) / 100 }}</td>
        <td class="border-l border-black">{{ Math.round(row.tireSlipAngleFrontLeft * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireSlipAngleFrontRight * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireSlipAngleRearLeft * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireSlipAngleRearRight * 100) / 100 }}</td>
        <td
          class="border-l border-black"
        >{{ Math.round(row.tireCombinedSlipFrontLeft * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireCombinedSlipFrontRight * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireCombinedSlipRearLeft * 100) / 100 }}</td>
        <td>{{ Math.round(row.tireCombinedSlipRearRight * 100) / 100 }}</td>
        <td class="border-l border-black">{{ row.brake }}</td>
        <td>{{ row.clutch }}</td>
        <td>{{ row.handbrake }}</td>
        <td>{{ row.steer }}</td>
        <td>({{ row.epochMs }})</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { ScatterChart } from 'vue-chart-3';
import { TelemetryLap } from '../lib';
import { formatLapTime } from '../lib/utils';

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


    return {
      startTs,
      formatLapTime,
    }
  },
})
</script>
