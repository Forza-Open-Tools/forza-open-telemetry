<script setup lang="ts">
import { TelemetryLap } from '../lib/data';
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
      :stats="lap.stats.normalizedSuspensionTravel"
      :formatter="formatAsPercent"
    />
    <StatisticsTable label="Tire Temp" :stats="lap.stats.tireTemp" />
  </div>
</template>
