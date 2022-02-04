<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { TelemetryLap } from '../lib';
import { formatAsPercent } from '../lib/utils';
import TelemetryCorner from './TelemetryCorner.vue';
import TelemetryMap from './TelemetryMap.vue';
import TelemetryTimeline from './TelemetryTimeline.vue';
import Speedometer from './Speedometer.vue';
import { CarCorner } from '../lib/types';

const props = defineProps<{
  lap: TelemetryLap;
}>();

const state = reactive({
  currentIndex: 0,
});

watch(() => props.lap, () => {
  state.currentIndex = 0;
})

const telemetry = computed(() => props.lap.telemetry[state.currentIndex]);
</script>
<template>
  <div>
    <label>Current Point in Time</label>
    <input
      v-model.number="state.currentIndex"
      type="number"
      min="0"
      :max="lap.telemetry.length - 1"
    />
  </div>
  <div class="flex w-full mt-8">
    <div class="flex flex-col justify-between">
      <TelemetryCorner :corner="CarCorner.frontLeft" :row="telemetry" />
      <TelemetryCorner :corner="CarCorner.rearLeft" :row="telemetry" />
    </div>
    <div class="w-32">&nbsp;</div>
    <div class="flex flex-col justify-between">
      <TelemetryCorner :corner="CarCorner.frontRight" :row="telemetry" />
      <TelemetryCorner :corner="CarCorner.rearRight" :row="telemetry" />
    </div>
    <div class="w-[250px] flex flex-col justify-between">
      <slot />
      <!-- <Speedometer :row="telemetry" /> -->
    </div>
    <div class="flex justify-center">
      <TelemetryMap :lap="lap" :current="telemetry" />
    </div>
  </div>

  <TelemetryTimeline v-model="state.currentIndex" :lap="lap" />
</template>

<style lang="postcss">
.side {
  @apply flex;
}

.timeline {
  @apply w-full
    h-8
    p-3
    relative
    flex
    items-center;
}

.timeline-line {
  @apply left-0
    w-full
    h-2
    bg-black;
}

.marker {
  @apply absolute
    bg-blue-700
    h-8
    w-8
    rounded-full
    top-0
    z-30;
}
</style>
