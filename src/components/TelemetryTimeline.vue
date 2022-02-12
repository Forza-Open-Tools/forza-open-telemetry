<script setup lang="ts">
import CrossProcessExports from 'electron';
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { ITelemetryLap } from '../lib/types';

const props = defineProps<{
  modelValue: number;
  lap: ITelemetryLap;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void,
}>();

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
  const ratio = width / props.lap.telemetry.length;
  const pos = props.modelValue * ratio;
  return pos;
});

const playButtonText = computed(() => state.playing ? 'Pause' : 'Play');

const currentRow = computed(() => props.lap.telemetry[Math.min(props.lap.telemetry.length - 1, props.modelValue)]);
// function getDelay(index: number) {
//   const curIndex = Math.max(state.lastIndex, index);
//   const nextIndex = Math.floor(curIndex + state.speed);
//   state.lastIndex = nextIndex;
//   console.log('getDelay index', index, 'nextIndex', nextIndex, 'length', props.lap.telemetry.length);
//   if (nextIndex > index && nextIndex < props.lap.telemetry.length) {
//     const currentTime = props.lap.telemetry[props.modelValue].currentRaceTime;
//     const nextTime = props.lap.telemetry[nextIndex].currentRaceTime;
//     const difference = (nextTime - currentTime) * 1000;
//     console.log('difference', difference, 'delay', delay);
//     return delay;
//   }
//   return -1;
// }

function getNextFrameIndex() {
  const elapsed = Date.now() - state.playStarted;
  const adjusted = elapsed * state.speed;
  for (let index = props.modelValue + 1; index < props.lap.telemetry.length; index++) {
    const racetime = props.lap.telemetry[index].currentRaceTime * 1000;
    const currentRaceTime = currentRow.value.currentRaceTime * 1000;
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

// state.delay = getDelay(props.modelValue);

function callback() {
  // const nextDelay = getDelay(props.modelValue);
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
  //     emit('update:modelValue', props.modelValue + 1);
  //   }, nextDelay);
  // } else {
  //   emit('update:modelValue', props.lap.telemetry.length - 1);
  //   state.playing = false;
  // }
  // const index = props.modelValue + 1;
  // if (index >= props.lap.telemetry.length) {
  //   // index = props.lap.telemetry.length - 1;
  //   state.playing = false;
  // } else {
  //   emit('update:modelValue', index);
  //   const nextDelay = getDelay(index);
  //   if (nextDelay > -1 && state.playing) {
  //     window.setTimeout(callback, nextDelay);
  //   }
  // }
}

// watch(() => props.modelValue, () => {
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
  //   if (props.modelValue === props.lap.telemetry.length - 1) {
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
    const index = Math.floor(offset / width * (props.lap.telemetry.length - 1));
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
