<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { TelemetryLap } from '../lib';
import { formatAsPercent } from '../lib/utils';
import TelemetryCorner from './TelemetryCorner.vue';
import TelemetryMap from './TelemetryMap.vue';

const props = defineProps<{
  lap: TelemetryLap;
}>();

const telemetry = computed(() => props.lap.telemetry[state.currentIndex]);

const state = reactive({
  currentIndex: 0,
  playing: false,
  timeout: 0,
});

const timelineRef = ref<HTMLElement>();

const markerPos = computed(() => {
  if (!timelineRef.value) return 0;
  const width = timelineRef.value.getBoundingClientRect().width;
  const ratio = width / props.lap.telemetry.length;
  const pos = state.currentIndex * ratio;
  console.log('markerPos', pos);
  return pos;
})

function startInterval() {
  state.timeout = window.setInterval(() => {
    state.currentIndex += 3;
    if (state.currentIndex >= props.lap.telemetry.length) {
      state.currentIndex = props.lap.telemetry.length - 1;
      clearInterval(state.timeout);
    }
  }, 600);
}

function onBackClick() {
  // clearInterval(state.timeout);
  // if (state.playing) {
  //   startInterval();
  // }
  state.currentIndex = 0;
}

function onPlayClick() {
  if (state.playing) {
    clearInterval(state.timeout);
    state.playing = false;
  } else {
    startInterval()
    state.playing = true;
  }
}

onBeforeUnmount(() => {
  clearTimeout(state.timeout);
});

function onTimelineClick(e: MouseEvent) {
  if (timelineRef.value) {
    const width = timelineRef.value.getBoundingClientRect().width;
    const index = Math.floor(e.offsetX / width * (props.lap.telemetry.length - 1));
    console.log({
      offsetX: e.offsetX,
      width,
      percent: e.offsetX / width,
      index,
    });
    state.currentIndex = index;
  }
}
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
      <TelemetryCorner corner="FrontLeft" :row="telemetry" />
      <TelemetryCorner corner="RearLeft" :row="telemetry" />
    </div>
    <div class="flex-grow flex justify-center">
      <TelemetryMap :lap="lap" :current="telemetry" />
    </div>
    <div class="flex flex-col justify-between">
      <TelemetryCorner corner="FrontRight" :row="telemetry" />
      <TelemetryCorner corner="RearRight" :row="telemetry" />
    </div>
  </div>

  <div class="flex mt-8">
    <div>
      <button type="button" @click="onPlayClick">Play</button>
    </div>
    <div ref="timelineRef" class="timeline" @click="onTimelineClick">
      <div class="timeline-line">&nbsp;</div>
      <div class="marker" :style="{ left: `${markerPos}px` }"></div>
    </div>
  </div>
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
