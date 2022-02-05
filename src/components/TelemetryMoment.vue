<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import TelemetryCorner from './TelemetryCorner.vue';
import TelemetryMap from './TelemetryMap.vue';
import TelemetryTimeline from './TelemetryTimeline.vue';
import { CarCorner, ITelemetryLap } from '../lib/types';
import { formatLapTime } from '../lib/utils';

const props = defineProps<{
  lap: ITelemetryLap;
  laps: ITelemetryLap[];
}>();

const state = reactive({
  currentIndex: 0,
});

watch(() => props.lap, () => {
  state.currentIndex = 0;
});

const arrowKeys: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

function onArrowKeyPress(e: KeyboardEvent) {
  console.log('document keypress');
  if (e.key in arrowKeys) {
    console.log(e.key);
    e.preventDefault();
    let modifier = arrowKeys[e.key];
    if (e.ctrlKey) modifier *= 10;
    else if (e.shiftKey) modifier *= 30;
    state.currentIndex += modifier;
  }
}

document.addEventListener('keydown', onArrowKeyPress);

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onArrowKeyPress);
});

const currentRow = computed(() => props.lap.telemetry[state.currentIndex]);
</script>
<template>
  <!-- <div>
    <label>Current Point in Time</label>
    <input
      v-model.number="state.currentIndex"
      type="number"
      min="0"
      :max="lap.telemetry.length - 1"
    />
  </div>-->
  <div class="flex w-full mt-8">
    <div class="flex flex-col justify-between">
      <TelemetryCorner :corner="CarCorner.frontLeft" :row="currentRow" />
      <TelemetryCorner :corner="CarCorner.rearLeft" :row="currentRow" />
    </div>
    <div class="w-32">&nbsp;</div>
    <div class="flex flex-col justify-between">
      <TelemetryCorner :corner="CarCorner.frontRight" :row="currentRow" />
      <TelemetryCorner :corner="CarCorner.rearRight" :row="currentRow" />
    </div>
    <div class="w-[300px] mx-4 flex flex-col justify-between">
      <div>
        <slot />
        <div class="text-xl font-bold">
          <div class="flex justify-between">
            <div>Current Lap Time:</div>
            <div>{{ formatLapTime(currentRow.currentLapTime * 1000) }}</div>
          </div>
          <div class="flex justify-between">
            <div>Current Race Time:</div>
            <div>{{ formatLapTime(currentRow.currentRaceTime * 1000) }}</div>
          </div>
        </div>
      </div>
      <!-- <Speedometer :row="telemetry" /> -->
    </div>
    <div class="relative w-[500px] h-[500px]">
      <TelemetryMap
        v-for="l in laps"
        :key="l.lap"
        :lap="l"
        class="absolute top-0 left-0"
        :class="{ 'z-20': l.lap === lap.lap }"
        :current="l.lap === lap.lap ? currentRow : undefined"
      />
    </div>
  </div>
  <TelemetryTimeline v-model="state.currentIndex" :lap="lap" />
</template>

<style>
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
