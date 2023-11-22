<script setup lang="ts">
import { useRaceStore } from '../stores';

const store = useRaceStore();

</script>
<template>
  <div class="gear-indicator">
    {{ store.currentDataPoint!.controls.gear }}
  </div>
</template>

<style>
.gear-indicator {
  @apply
    border-gray-200
    mt-2
    border-2
    rounded-md
    text-5xl
    p-2
    mx-auto
    w-fit;
}
</style>
