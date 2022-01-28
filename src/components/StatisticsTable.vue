<script setup lang="ts">import { computed } from 'vue';
import { LapStatistics, Statistics, TelemetryLap } from '../lib';

const props = defineProps<{
  lap: TelemetryLap;
  label: string;
  name: string;
  formatter?: (value: number) => string;
}>();

const names = [
  'FrontLeft',
  'FrontRight',
  'BackLeft',
  'BackRight',
];

const valueNames: (keyof Omit<Statistics, 'add'>)[] = ['min', 'max', 'avg'];

const fullNames = computed(() => {
  return ['Front', 'Rear'].map((pos) => {
    return {
      label: pos,
      values: ['Left', 'Right'].map((side) => `${props.name}${pos}${side}` as keyof Omit<LapStatistics, 'add'>)
    };
  });
});

const format = computed(() => props.formatter || ((value: number) => (Math.round(value * 10000) / 100).toString()));

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
      <th>min</th>
      <th>max</th>
      <th class="border-r border-black">avg</th>
      <th>min</th>
      <th>max</th>
      <th class="border-r border-black">avg</th>
    </tr>
    <tr v-for="pos in fullNames" :key="pos.label">
      <template v-for="side in pos.values" :key="side">
        <td
          v-for="valueName in valueNames"
          :key="valueName"
          :class="{ 'border-r border-black': valueName === 'avg' }"
        >{{ format(lap.stats[side][valueName]) }}</td>
      </template>
    </tr>
  </table>
</template>
