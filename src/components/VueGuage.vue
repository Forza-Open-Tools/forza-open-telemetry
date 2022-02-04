<script setup lang="ts">
import { RadialGauge, RadialGaugeOptions } from 'canvas-gauges';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  value: number;
  options: RadialGaugeOptions;
}>();

const canvasRef = ref<HTMLCanvasElement>();

const gauge = ref<RadialGauge>();

onMounted(() => {
  if (canvasRef.value) {
    const options: RadialGaugeOptions = {
      ...props.options,
      value: props.value || props.options.minValue || 0,
      renderTo: canvasRef.value,
    }
    gauge.value = new RadialGauge(props.options);
  }
});

onBeforeUnmount(() => {
  if (gauge.value) {
    gauge.value.destroy();
  }
});

watch(() => props.value, (current) => {
  if (gauge.value) {
    gauge.value.value = current;
  }
})

</script>
<template>
  <canvas ref="canvasRef" class="canvas-gauges" />
</template>
