<script setup lang="ts">
import { computed } from 'vue';
import { useTelemetry } from '../helpers';

const telemetry = useTelemetry();

const streamingButtonText = computed(() => telemetry.state.streaming ? 'Stop' : 'Start');

function onToggleCollector() {
  if (telemetry.state.streaming) {
    telemetry.disconnect();
  } else {
    telemetry.connect();
  }
}

</script>
<template>
  <div>
      <button class="ml-8" type="button" @click="onToggleCollector">{{ streamingButtonText }} Collector</button>
      <div v-if="telemetry.state.streaming">Listening on {{ telemetry.state.address }}:{{ telemetry.state.port }}</div>
    </div>
</template>
