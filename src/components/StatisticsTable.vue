<script setup lang="ts">import { computed } from 'vue';
import { LapStatistics, Statistics, TelemetryLap } from '../lib/data';
import { ITelemetryCorners } from '../lib/types';

const props = defineProps<{
  stats: ITelemetryCorners<Statistics>;
  label: string;
  formatter?: (value: number) => string;
}>();

function defaultFormatter(value: number) {
  return (Math.round(value * 10000) / 100).toString();
}

const format = computed(() => props.formatter || defaultFormatter);

</script>
<template>
  <table>
    <tr>
      <th class="border-r border-black" colspan="6">{{ label }}</th>
    </tr>
    <tr class="multi-row">
      <th class="border-r border-black" colspan="3">Left</th>
      <th class="border-r border-black" colspan="3">Right</th>
    </tr>
    <tr class="multi-row">
      <th class="border-r border-black" colspan="3">Front</th>
      <th class="border-r border-black" colspan="3">Rear</th>
    </tr>
    <tr class="multi-row">
      <th>min</th>
      <th>max</th>
      <th class="border-r border-black">avg</th>
      <th>min</th>
      <th>max</th>
      <th class="border-r border-black">avg</th>
    </tr>
    <tr>
      <td>{{ format(stats.front.left.min) }}</td>
      <td>{{ format(stats.front.left.min) }}</td>
      <td class="border-r border-black">{{ format(stats.front.left.avg) }}</td>
      <td>{{ format(stats.front.right.min) }}</td>f
      <td>{{ format(stats.front.right.min) }}</td>
      <td class="border-r border-black">{{ format(stats.front.right.avg) }}</td>
    </tr>
    <tr>
      <td>{{ format(stats.rear.left.min) }}</td>
      <td>{{ format(stats.rear.left.min) }}</td>
      <td class="border-r border-black">{{ format(stats.rear.left.avg) }}</td>
      <td>{{ format(stats.rear.right.min) }}</td>f
      <td>{{ format(stats.rear.right.min) }}</td>
      <td class="border-r border-black">{{ format(stats.rear.right.avg) }}</td>
    </tr>
  </table>
</template>
