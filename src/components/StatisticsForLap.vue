<script setup lang="ts">
import { TelemetryLap } from '../lib';
import { formatAsPercent, formatAsTemp } from '../lib/utils';
import StatisticsTable from './StatisticsTable.vue';

const props = defineProps<{
  lap: TelemetryLap;
}>();

function formatTemp(value: number) {
  return formatAsTemp(value, false);
}

</script>
<template>
  <div class="flex">
    <table>
      <tr>
        <th>&nbsp;</th>
      </tr>
      <tr>
        <th>&nbsp;</th>
      </tr>
      <tr>
        <th>Front</th>
      </tr>
      <tr>
        <th>Rear</th>
      </tr>
    </table>
    <StatisticsTable
      label="Suspension"
      name="normalizedSuspensionTravel"
      :lap="lap"
      :formatter="formatAsPercent"
    />
    <StatisticsTable label="Tire Slip" name="tireSlipRatio" :lap="lap" />
    <StatisticsTable label="Wheel Rotation Speed" name="wheelRotationSpeed" :lap="lap" />
    <StatisticsTable label="Tire Slip Angle" name="tireSlipAngle" :lap="lap" />
    <StatisticsTable label="Tire Combined Slip" name="tireCombinedSlip" :lap="lap" />
    <StatisticsTable label="Tire Temp" name="tireTemp" :lap="lap" :formatter="formatTemp" />
  </div>
  <!-- <table>
    <tr>
      <th></th>
      <th class="border-r border-black" colspan="6">Suspension</th>
    </tr>
    <tr class="multi-row">
      <th>&nbsp;</th>
      <th class="border-r border-black" colspan="3">Left</th>
      <th class="border-r border-black" colspan="3">Right</th>
    </tr>
    <tr class="multi-row">
      <th>&nbsp;</th>
      <th>min</th>
      <th>max</th>
      <th class="border-r border-black">avg</th>
      <th>min</th>
      <th>max</th>
      <th class="border-r border-black">avg</th>
    </tr>
    <tr>
      <th>Front</th>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelFrontLeft.min) }}</td>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelFrontLeft.max) }}</td>
      <td
        class="border-r border-black"
      >{{ formatAsPercent(lap.stats.normalizedSuspensionTravelFrontLeft.avg) }}</td>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelFrontRight.min) }}</td>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelFrontRight.max) }}</td>
      <td
        class="border-r border-black"
      >{{ formatAsPercent(lap.stats.normalizedSuspensionTravelFrontRight.avg) }}</td>
    </tr>
    <tr>
      <th>Rear</th>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelRearLeft.min) }}</td>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelRearLeft.max) }}</td>
      <td
        class="border-r border-black"
      >{{ formatAsPercent(lap.stats.normalizedSuspensionTravelRearLeft.avg) }}</td>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelRearRight.min) }}</td>
      <td>{{ formatAsPercent(lap.stats.normalizedSuspensionTravelRearRight.max) }}</td>
      <td
        class="border-r border-black"
      >{{ formatAsPercent(lap.stats.normalizedSuspensionTravelRearRight.avg) }}</td>
    </tr>
  </table>-->
</template>
