<script setup lang="ts">
import { CarCorner, ITelemetryDataPoint } from '../lib/types';
import TelemetrySpring from './TelemetrySpring.vue';
import TelemetryTire from './TelemetryTire.vue';

const props = defineProps<{
  data: ITelemetryDataPoint;
  corner: CarCorner;
}>();

</script>
<template>
  <div class="corner" :class="corner.toLowerCase()">
    <TelemetrySpring :data="data" :corner="corner" />
    <TelemetryTire :data="data" :corner="corner" />
  </div>
</template>

<style>
.corner {
  @apply flex;
}

/* .corner div:first-child {
  @apply mr-4;
} */

.corner+.corner {
  @apply mt-8;
}

.corner.frontright,
.corner.rearright {
  @apply flex-row-reverse;
}
</style>
