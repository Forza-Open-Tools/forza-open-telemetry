<script setup lang="ts">
import { useSettings } from '../stores';

const settings = useSettings();

</script>
<template>
  <div class="flex items-center p-2 border-b border-gray-700">
      <label>
        <input type="checkbox" v-model="settings.show.travelPath" />
        Show Travel Path
      </label>
      <label class="ml-8">
        <input type="checkbox" v-model="settings.show.currentStats" />
        Show Current Stats
      </label>
      <label class="ml-8">
        <input type="checkbox" v-model="settings.show.telemetryTable" />
        Show Overview
      </label>

      <!-- <div>
        <label>Throttle:</label>
        <input type="text" v-model="state.throttle" />
      </div>
      <div>Tire slip index: {{ state.slipIndex }}</div> -->
    </div>
</template>
