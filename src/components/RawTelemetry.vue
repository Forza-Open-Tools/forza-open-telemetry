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
          'bg-yellow-200': index > 0 && row.lapTime < lap.telemetry[index - 1].lapTime,
        }"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ formatLapTime(row.timestampMS - startTs) }}</td>
        <td class="text-center">{{ row.lap }}</td>
        <td>{{ formatLapTime(row.lapTime * 1000) }}</td>
        <td>{{ formatLapTime(row.raceTime * 1000) }}</td>
        <td class="text-center">{{ row.racePosition }}</td>
        <td>{{ Math.round(row.engine.speed * 10) / 10 }}</td>
        <td>{{ row.controls.gear }}</td>
        <td>{{ Math.round(row.engine.rpm) }}</td>
        <td class="border-l border-black">{{ Math.round(row.tires.temp.front.left * 10) / 10 }}</td>
        <td>{{ Math.round(row.tires.temp.front.right * 10) / 10 }}</td>
        <td>{{ Math.round(row.tires.temp.rear.left * 10) / 10 }}</td>
        <td>{{ Math.round(row.tires.temp.rear.right * 10) / 10 }}</td>
        <td
          class="border-l border-black"
        >{{ Math.round(row.suspensionTravel.meters.front.left * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravel.meters.front.right * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravel.meters.rear.left * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravel.meters.rear.right * 10000) / 100 }}</td>
        <td
          class="border-l border-black"
        >{{ Math.round(row.suspensionTravel.normalized.front.left * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravel.normalized.front.right * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravel.normalized.rear.left * 10000) / 100 }}</td>
        <td>{{ Math.round(row.suspensionTravel.normalized.rear.right * 10000) / 100 }}</td>
        <td class="border-l border-black">{{ Math.round(row.tires.slipRatio.front.left * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.slipRatio.front.right * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.slipRatio.rear.left * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.slipRatio.rear.right * 100) / 100 }}</td>
        <td class="border-l border-black">{{ Math.round(row.tires.slipAngle.front.left * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.slipAngle.front.right * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.slipAngle.rear.left * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.slipAngle.rear.right * 100) / 100 }}</td>
        <td
          class="border-l border-black"
        >{{ Math.round(row.tires.combinedSlip.front.left * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.combinedSlip.front.right * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.combinedSlip.rear.left * 100) / 100 }}</td>
        <td>{{ Math.round(row.tires.combinedSlip.rear.right * 100) / 100 }}</td>
        <td class="border-l border-black">{{ row.controls.brake }}</td>
        <td>{{ row.controls.clutch }}</td>
        <td>{{ row.controls.handbrake }}</td>
        <td>{{ row.controls.steer }}</td>
        <td>({{ row.epochMs }})</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { ScatterChart } from 'vue-chart-3';
import { TelemetryLap } from '../lib/data';
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
