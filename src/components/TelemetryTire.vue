<script setup lang="ts">import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { formatAsTemp } from '../lib/utils';

const props = defineProps<{
  row: TelemetryRow;
  corner: 'FrontLeft' | 'FrontRight' | 'RearLeft' | 'RearRight';
}>();
const name = computed(() => `tireTemp${props.corner}` as keyof TelemetryRow);

const temp = computed(() => props.row[name.value]);

const formatted = computed(() => formatAsTemp(temp.value));

const slipValues = computed(() => ({
  combined: (Math.round(props.row[`tireCombinedSlip${props.corner}` as keyof TelemetryRow] * 10) / 10).toFixed(1),
  ratio: (Math.round(props.row[`tireSlipRatio${props.corner}` as keyof TelemetryRow] * 10) / 10).toFixed(1),
  angle: (Math.round(props.row[`tireSlipAngle${props.corner}` as keyof TelemetryRow] * 10) / 10).toFixed(1),
}));

const color = computed(() => {

  if (temp.value < 80) {
    return `bg-blue-${Math.min(Math.ceil((80 - temp.value) / 2) * 100, 900)}`;
  }
  if (temp.value < 90) return 'bg-white'
  if (temp.value < 120) {
    return `bg-yellow-${Math.min(Math.floor((temp.value - 90) / 2) * 100, 400)}`;
  }
  return `bg-orange-${Math.min(Math.floor(temp.value - 115) * 100, 500)}`;
})

const colors = [
  'bg-yellow-100',
  'bg-yellow-200',
  'bg-yellow-300',
  'bg-yellow-400',
  'bg-yellow-500',
  'bg-yellow-600',
  'bg-yellow-700',
  'bg-yellow-800',
  'bg-yellow-900',
  'bg-blue-100',
  'bg-blue-200',
  'bg-blue-300',
  'bg-blue-400',
  'bg-blue-500',
  'bg-blue-600',
  'bg-blue-700',
  'bg-blue-800',
  'bg-blue-900',
  'bg-orange-100',
  'bg-orange-200',
  'bg-orange-300',
  'bg-orange-400',
  'bg-orange-500',
  'bg-orange-600',
  'bg-orange-700',
  'bg-orange-800',
  'bg-orange-900',
];
</script>
<template>
  <div class="tire" :class="color">
    <div class="mb-4">{{ formatted }}</div>
    <div>
      <div class="tire-slip">
        N {{ slipValues.combined }}
        <br />
        R {{ slipValues.ratio }}
        <br />
        A {{ slipValues.angle }}
        <br />
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
  @apply rounded-full
    w-[60px]
    h-[60px]
    border-8
    border-green-100
    text-center;
}
</style>
