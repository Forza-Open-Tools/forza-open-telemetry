<script setup lang="ts">import { computed } from 'vue';
import { IStatistics, ITelemetryCorners } from '../lib/types';

const props = defineProps<{
  stats: ITelemetryCorners<IStatistics>;
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
      <th class="border-r border-grey-200" colspan="6">{{ label }}</th>
    </tr>
    <tr class="multi-row">
      <th class="border-r border-grey-200" colspan="3">Left</th>
      <th class="border-r border-grey-200" colspan="3">Right</th>
    </tr>
    <tr class="multi-row">
      <th class="border-r border-grey-200" colspan="3">Front</th>
      <th class="border-r border-grey-200" colspan="3">Rear</th>
    </tr>
    <tr class="multi-row">
      <th>min</th>
      <th>max</th>
      <th class="border-r border-grey-200">avg</th>
      <th>min</th>
      <th>max</th>
      <th class="border-r border-grey-200">avg</th>
    </tr>
    <tr>
      <td>{{ format(stats.front.left.min) }}</td>
      <td>{{ format(stats.front.left.max) }}</td>
      <td class="border-r border-grey-200">{{ format(stats.front.left.avg) }}</td>
      <td>{{ format(stats.front.right.min) }}</td>
      <td>{{ format(stats.front.right.max) }}</td>
      <td class="border-r border-grey-200">{{ format(stats.front.right.avg) }}</td>
    </tr>
    <tr>
      <td>{{ format(stats.rear.left.min) }}</td>
      <td>{{ format(stats.rear.left.max) }}</td>
      <td class="border-r border-grey-200">{{ format(stats.rear.left.avg) }}</td>
      <td>{{ format(stats.rear.right.min) }}</td>
      <td>{{ format(stats.rear.right.max) }}</td>
      <td class="border-r border-grey-200">{{ format(stats.rear.right.avg) }}</td>
    </tr>
  </table>
</template>
