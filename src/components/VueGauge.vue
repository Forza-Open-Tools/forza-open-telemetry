<script setup lang="ts">
import { RadialGauge, RadialGaugeOptions } from 'canvas-gauges';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  value: number;
  options: Partial<RadialGaugeOptions>;
}>();

const canvasRef = ref<HTMLCanvasElement>();

// const gauge = ref<RadialGauge>();
let gauge: RadialGauge | null = null;

const fullOptions = computed<RadialGaugeOptions>(() => {
  return {
    width: 200,
    height: 200,
    colorPlate: 'transparent',
    borderShadowWidth: 0,
    borders: false,
    needleType: 'arrow',
    needleWidth: 2,
    colorNeedle: 'red',
    colorNeedleEnd: 'red',
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animation: false,
    valueBox: false,
    fontUnitsSize: 30,
    colorUnits: 'rgb(229 231 235)',
    colorNumbers: 'rgb(229 231 235)',
    colorMajorTicks: 'rgb(229 231 235)',
    colorMinorTicks: 'rgb(229 231 235)',
    colorBorderOuter: 'rgb(229 231 235)',
    fontNumbersSize: 30,
    fontNumbersWeight: 'bold',
    ...props.options,
    value: props.value || props.options.minValue || 0,
    renderTo: canvasRef.value || '',
  };
});

onMounted(() => {
  if (canvasRef.value) {
    gauge = new RadialGauge(fullOptions.value);
    gauge.draw();
  }
});

onBeforeUnmount(() => {
  if (gauge) {
    gauge.destroy();
    gauge = null;
  }
});

watch(fullOptions, (current) => {
  if (gauge) {
    gauge.update(current);
  }
});

watch(() => props.value, (current) => {
  if (gauge) {
    gauge.value = current;
    gauge.draw();
  }
})

</script>
<template>
  <canvas ref="canvasRef" class="canvas-gauges" />
</template>
