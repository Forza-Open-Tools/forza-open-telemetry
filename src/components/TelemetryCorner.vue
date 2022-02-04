<script setup lang="ts">
import { TelemetryRow } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { CarCorner } from '../lib/types';
import TelemetrySpring from './TelemetrySpring.vue';
import TelemetryTire from './TelemetryTire.vue';

const props = defineProps<{
  row: TelemetryRow;
  corner: CarCorner;
}>();

const name = computed(() => `normalizedSuspensionTravel${props.corner}` as keyof TelemetryRow);

const spring = computed(() => props.row[name.value]);

</script>
<template>
  <div class="corner" :class="corner.toLowerCase()">
    <TelemetrySpring :row="row" :corner="corner" />
    <TelemetryTire :row="row" :corner="corner" />
  </div>
</template>

<style lang="postcss">
.corner {
  @apply flex;
}

/* .corner div:first-child {
  @apply mr-4;
} */

.corner + .corner {
  @apply mt-8;
}

.corner.frontright,
.corner.rearright {
  @apply flex-row-reverse;
}
</style>
