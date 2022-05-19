<script setup lang="ts">
import { TelemetryDataArray } from 'forza-open-telemetry-server';
import { computed } from 'vue';
import { TelemetryDataPoint } from '../lib/data';
import { CarCorner } from '../lib/types';
import TelemetrySpring from './TelemetrySpring.vue';
import TelemetryTire from './TelemetryTire.vue';

const props = defineProps<{
  data: TelemetryDataPoint;
  corner: CarCorner;
}>();

</script>
<template>
  <div class="corner" :class="corner.toLowerCase()">
    <TelemetrySpring :data="data" :corner="corner" />
    <TelemetryTire :data="data" :corner="corner" />
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
