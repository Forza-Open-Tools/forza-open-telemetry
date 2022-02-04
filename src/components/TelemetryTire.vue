<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { CarCorner } from '../lib/types';
import { angleDegree, formatAsTemp } from '../lib/utils';

const props = defineProps<{
  row: TelemetryRow;
  corner: CarCorner;
}>();

const tempColors = [
  // 'bg-blue-900',
  // 'bg-blue-800',
  // 'bg-blue-700',
  // 'bg-blue-600',
  'bg-blue-400 bg-opacity-30',
  'bg-blue-400 bg-opacity-50',
  'bg-blue-300',
  'bg-blue-200',
  'bg-blue-100',
  'bg-white',
  'bg-white',
  'bg-white',
  'bg-white',
  'bg-white',
  'bg-yellow-300',
  'bg-yellow-300',
  'bg-yellow-300',
  'bg-yellow-300',
  'bg-yellow-300',
  'bg-yellow-300',
  'bg-yellow-400',
  'bg-yellow-400',
  'bg-yellow-400',
  'bg-yellow-400',
  'bg-yellow-400',
  'bg-yellow-400',
  'bg-yellow-400',
  'bg-yellow-500',
  'bg-yellow-500',
  'bg-yellow-500',
  'bg-yellow-500',
  'bg-yellow-500',
  'bg-orange-400',
  'bg-orange-400',
  'bg-orange-400',
  'bg-orange-500',
  'bg-orange-500',
  // 'bg-orange-600',
  // 'bg-orange-700',
  // 'bg-orange-800',
  // 'bg-orange-900',
];

function getTempColor(temp: number) {

  const tempIndex = Math.floor((temp - 70) / 2);
  const index = Math.max(0, Math.min(tempColors.length - 1, tempIndex));
  const color = tempColors[index];
  // console.log('temp', temp, tempIndex, color);
  return color;
  // if (temp < 80) {
  //   return `bg-blue-${Math.min(Math.ceil((80 - temp) / 2) * 100, 900)}`;
  // }
  // if (temp < 90) return 'bg-white'
  // if (temp < 120) {
  //   return `bg-yellow-${Math.min(Math.floor((temp - 90) / 2) * 100, 400)}`;
  // }
  // return `bg-orange-${Math.min(Math.floor(temp - 115) * 100, 500)}`;
}
const values = computed(() => ({
  temp: props.row[`tireTemp${props.corner}`],
  combinedSlip: props.row[`tireCombinedSlip${props.corner}`],
  slipRatio: props.row[`tireSlipRatio${props.corner}`],
  slipAngle: angleDegree(props.row[`tireSlipAngle${props.corner}`]),
}));

const formatted = computed(() => ({
  temp: formatAsTemp(values.value.temp),
  tempColor: getTempColor(values.value.temp),
  combinedSlip: values.value.combinedSlip.toFixed(2),
  slipRatio: values.value.slipRatio.toFixed(2),
  slipAngle: values.value.slipAngle.toFixed(2),
  needleClass: values.value.combinedSlip < 1 ? 'bg-green-400' : 'bg-red-500',
}));

const needleStyle = computed(() => ({
  transform: `rotate(${(values.value.slipAngle - 90).toFixed(2)}deg)`,
  width: `${(values.value.combinedSlip * 30).toFixed(1)}px`,
  transformOrigin: '4px center',
}));
</script>
<template>
  <div class="tire" :class="formatted.tempColor">
    <div class="mb-4">{{ formatted.temp }}</div>
    <div>
      <div class="tire-slip">
        <!-- N {{ formatted.combinedSlip }}
        <br />
        R {{ formatted.slipRatio }}
        <br />
        A {{ formatted.slipAngle }}
        <br />-->
        <div class="w-full h-full">
          <div class="tire-slip-center">&nbsp;</div>
          <div class="tire-slip-needle" :class="formatted.needleClass" :style="needleStyle">&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tire {
  @apply w-[100px]
    h-[175px]
    border-4
    border-gray-600
    rounded-3xl
    flex
    flex-col
    justify-center
    items-center;
}

.tire-slip {
  @apply relative
    rounded-full
    w-[60px]
    h-[60px]
    /* outline-8
    outline-gray-600 */
    border-8
    border-gray-600
    text-center
    text-sm;
}

.tire-slip-center {
  @apply w-2
    h-2
    bg-yellow-400
    rounded-full
    absolute
    left-[18px]
    top-[18px];
}

.tire-slip-needle {
  @apply absolute
    h-2
    min-w-[8px]
    bg-black
    left-[18px]
    top-[18px]
    rounded-full
    border-gray-600
    border;
}
</style>
