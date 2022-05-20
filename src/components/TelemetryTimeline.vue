<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { ITelemetryLap } from '../lib/types';
import { useRaceStore } from '../store';

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void,
}>();

const store = useRaceStore();

const lap = computed(() => store.selectedLap!);
const currentRow = computed(() => store.currentDataPoint!);
const currentIndex = computed(() => store.currentDataPointIndex);

const state = reactive({
  playing: false,
  timeout: 0,
  delay: 0,
  speed: 2,
  playStarted: 0,
});

const containerRef = ref<HTMLElement>();
const timelineRef = ref<HTMLElement>();

const markerPos = computed(() => {
  if (!timelineRef.value) return 0;
  const width = timelineRef.value.getBoundingClientRect().width;
  const ratio = width / lap.value.telemetry.length;
  const pos = currentIndex.value * ratio;
  return pos;
});

const playButtonText = computed(() => state.playing ? 'Pause' : 'Play');

// function getDelay(index: number) {
//   const curIndex = Math.max(state.lastIndex, index);
//   const nextIndex = Math.floor(curIndex + state.speed);
//   state.lastIndex = nextIndex;
//   console.log('getDelay index', index, 'nextIndex', nextIndex, 'length', lap.value.telemetry.length);
//   if (nextIndex > index && nextIndex < lap.value.telemetry.length) {
//     const currentTime = lap.value.telemetry[currentIndex.value].currentRaceTime;
//     const nextTime = lap.value.telemetry[nextIndex].currentRaceTime;
//     const difference = (nextTime - currentTime) * 1000;
//     console.log('difference', difference, 'delay', delay);
//     return delay;
//   }
//   return -1;
// }

function getNextFrameIndex() {
  const elapsed = Date.now() - state.playStarted;
  const adjusted = elapsed * state.speed;
  for (let index = currentIndex.value + 1; index < lap.value.telemetry.length; index++) {
    const racetime = lap.value.telemetry[index].raceTime * 1000;
    const currentRaceTime = currentRow.value.raceTime * 1000;
    // const racetimeDiff = racetime - currentRow.value.currentRaceTime * 1000;
    console.log('index', index, 'racetime', racetime, 'currentRaceTime', currentRaceTime, 'adjusted', adjusted); // 'racetimeDiff', racetimeDiff,
    if (currentRaceTime + adjusted > racetime) {
      state.playStarted = Date.now();
      return index;
    }
    // if (racetimeDiff < adjusted) {
    //   return index;
    // }
  }
  return -1;
}

// state.delay = getDelay(currentIndex.value);

function callback() {
  // const nextDelay = getDelay(currentIndex.value);
  // state.delay = nextDelay;
  const index = getNextFrameIndex();
  console.log('callback index', index);
  if (index > -1) {
    emit('update:modelValue', index);
  } else {
    state.playing = false;
  }
  // if (nextDelay > -1) {
  //   window.setTimeout(() => {
  //     getNextFrameIndex()
  //     if ()
  //     emit('update:modelValue', currentIndex.value + 1);
  //   }, nextDelay);
  // } else {
  //   emit('update:modelValue', lap.value.telemetry.length - 1);
  //   state.playing = false;
  // }
  // const index = currentIndex.value + 1;
  // if (index >= lap.value.telemetry.length) {
  //   // index = lap.value.telemetry.length - 1;
  //   state.playing = false;
  // } else {
  //   emit('update:modelValue', index);
  //   const nextDelay = getDelay(index);
  //   if (nextDelay > -1 && state.playing) {
  //     window.setTimeout(callback, nextDelay);
  //   }
  // }
}

// watch(() => currentIndex.value, () => {
//   if (state.playing) callback();
// });

watch(() => state.playing, (current) => {
  if (current) {
    state.playStarted = Date.now();
    state.timeout = window.setInterval(callback, 33.333333);
  } else {
    window.clearInterval(state.timeout);
    state.timeout = 0;
  }
});

function startPlaying() {
  callback();
}

function onBackClick() {
  // clearInterval(state.timeout);
  // if (state.playing) {
  //   startInterval();
  // }
  emit('update:modelValue', 0);
}

function onPlayClick() {
  state.playing = !state.playing;
  // if (state.playing) {
  //   clearTimeout(state.timeout);
  //   state.timeout = 0;
  //   state.playing = false;
  // } else {
  //   state.playing = true;
  //   if (currentIndex.value === lap.value.telemetry.length - 1) {
  //     emit('update:modelValue', 0);
  //   } else {
  //     startPlaying()
  //   }
  // }
}

onBeforeUnmount(() => {
  clearInterval(state.timeout);
  state.timeout = 0;
});

function normalizeOffset(ele: HTMLElement, rect: DOMRect, offset: number) {
  if (ele.offsetLeft > offset) return 0;
  if (rect.width + ele.offsetLeft < offset) return rect.width;
  return offset;
}

function onTimelineClick(e: MouseEvent) {
  if (timelineRef.value) {
    const rect = timelineRef.value.getBoundingClientRect();
    const width = rect.width;
    const offset = normalizeOffset(timelineRef.value, rect, e.offsetX);

    // console.log(rect.toJSON());
    // console.log(timelineRef.value.offsetWidth, timelineRef.value.offsetLeft);

    // let offset = e.offsetX;
    // if (offset <= 12) offset = 0;
    // else if (offset >= )
    const index = Math.floor(offset / width * (lap.value.telemetry.length - 1));
    emit('update:modelValue', index);
  }
}

const speedOptions = [0.25, 0.5, 1, 2, 4, 8, 16, 32];

</script>

<template>
  <div class="flex mt-8 items-end">
    <div class="control mx-2">
      <label>Speed</label>
      <select v-model="state.speed">
        <option v-for="value in speedOptions" :key="value" :value="value">{{ value }}x</option>
      </select>
    </div>
    <div>
      <button type="button" @click="onPlayClick" class="mx-2 w-16">{{ playButtonText }}</button>
    </div>
    <div ref="containerRef" class="timeline cursor-pointer" @click="onTimelineClick">
      <div ref="timelineRef" class="timeline-line">&nbsp;</div>
      <div class="marker" :style="{ left: `${markerPos}px` }"></div>
    </div>
  </div>
  <!-- <p>Delay: {{ state.delay }}</p> -->
</template>
