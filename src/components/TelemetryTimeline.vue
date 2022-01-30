<script setup lang="ts">import { safeStorage } from 'electron';
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { TelemetryLap } from '../lib';

const props = defineProps<{
  modelValue: number;
  lap: TelemetryLap;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void,
}>();

const state = reactive({
  playing: false,
  timeout: 0,
  delay: 0,
  speed: 2,
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

function getDelay(index: number) {
  const nextIndex = index + state.speed;
  if (nextIndex < props.lap.telemetry.length) {
    const currentTime = props.lap.telemetry[props.modelValue].currentRaceTime;
    const nextTime = props.lap.telemetry[props.modelValue + 1].currentRaceTime;
    return (nextTime - currentTime) * 1000;
  }
  return -1;
}

state.delay = getDelay(props.modelValue);

function callback() {
  const nextDelay = getDelay(props.modelValue);
  state.delay = nextDelay;
  if (nextDelay > -1) {
    window.setTimeout(() => {
      emit('update:modelValue', props.modelValue + state.speed);
    }, nextDelay);
  } else {
    emit('update:modelValue', props.lap.telemetry.length - 1);
    state.playing = false;
  }
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

watch(() => props.modelValue, () => {
  if (state.playing) callback();
  // const delay = getDelay(current);
  // if (delay > -1 && state.playing) {
  //   window.setTimeout(callback, delay);
  // }
})

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
  if (state.playing) {
    clearTimeout(state.timeout);
    state.timeout = 0;
    state.playing = false;
  } else {
    state.playing = true;
    if (props.modelValue === props.lap.telemetry.length - 1) {
      emit('update:modelValue', 0);
    } else {
      startPlaying()
    }
  }
}

onBeforeUnmount(() => {
  clearTimeout(state.timeout);
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

    console.log(rect.toJSON());
    console.log(timelineRef.value.offsetWidth, timelineRef.value.offsetLeft);

    // let offset = e.offsetX;
    // if (offset <= 12) offset = 0;
    // else if (offset >= )
    const index = Math.floor(offset / width * (props.lap.telemetry.length - 1));
    emit('update:modelValue', index);
  }
}

const speedOptions = [1, 2, 4, 8, 16, 32];

</script>

<template>
  <div class="flex mt-8">
    <div>
      <button type="button" @click="onPlayClick" class="mr-8">Play</button>
    </div>
    <div ref="containerRef" class="timeline cursor-pointer" @click="onTimelineClick">
      <div ref="timelineRef" class="timeline-line">&nbsp;</div>
      <div class="marker" :style="{ left: `${markerPos}px` }"></div>
    </div>
  </div>
  <div>
    <div class="control">
      <label>Speed</label>
      <select v-model="state.speed">
        <option v-for="value in speedOptions" :key="value" :value="value">{{ value }}x</option>
      </select>
    </div>
    <p>Delay: {{ state.delay }}</p>
  </div>
</template>
