<script setup lang="ts">
import { reactive, ref } from 'vue';
import { TelemetryJsonParser } from '../lib';
import { Race } from '../lib/data';
import { useRaceStore } from '../store';

const state = reactive({
  wrapperClass: '',
});

const raceStore = useRaceStore();

const fileParser = new TelemetryJsonParser();

const races = ref<Race[]>([]);

async function onFileDrop(event: DragEvent) {
  console.log('File dropped');
  state.wrapperClass = '';
  // clear();

  if (event.dataTransfer?.items) {
    for (let index = 0; index < event.dataTransfer.items.length; index++) {
      const file = event.dataTransfer.items[index].getAsFile();
      if (file) {
        const parsed = await fileParser.parseFile(file);
        parsed.forEach(raceStore.addRace);
        races.value = parsed;
      }
    }
  }
}

function onDragOver() {
  state.wrapperClass = 'wrapper-dragover';
}

function onDragLeave() {
  state.wrapperClass = '';
}
</script>
<template>
  <div
    class="wrapper"
    :class="state.wrapperClass"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onFileDrop"
  >
    <slot />
  </div>
</template>
