<script setup lang="ts">
import { computed } from "vue";
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { ScatterChart } from 'vue-chart-3';
import { useRaceStore } from '../store';

const store = useRaceStore();

const data = computed<ChartData<'scatter'>>(() => {
  const datasets = store.selectedRace!.laps.map<ChartDataset<'scatter'>>((lap) => ({
    data: lap.telemetry.map((row) => ({
      x: row.position.x,
      y: row.position.z,

    })),
    showLine: true,
    label: `Lap ${lap.lap + 1}`,
    borderColor: store.lapColorClasses[lap.lap].bg,
    backgroundColor: store.lapColorClasses[lap.lap].bg,
  }));

  datasets.unshift({
    data: [{ ...(datasets[0].data as { x: number, y: number }[])[0] }],
    label: 'Start Point',
    pointBackgroundColor: 'black',
    pointRadius: 10,
    pointBorderColor: 'black',
  });

  return {
    datasets
  };
});

const options: ChartOptions = {
  elements: {
    line: {
      borderWidth: 2,
      borderCapStyle: 'round',
      tension: 0.05,

    },
    point: {
      backgroundColor: 'none',
      borderColor: 'none',
      radius: 0,
    }
  },
}
</script>

<template>
  <ScatterChart :chart-data="data" :options="options" class="square-chart" />
</template>

<style>
.square-chart {
  height: 1000px;
  width: 1000px;
}
</style>
