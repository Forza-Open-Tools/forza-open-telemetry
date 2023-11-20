<script setup lang="ts">
import { computed } from "vue";
import { ChartData, ChartOptions } from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';
import { TelemetryDataPoint } from '../lib/data';

const props = defineProps<{
  telemetry: TelemetryDataPoint[];
}>();

const data = computed(() => {
  const front: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Left', borderColor: 'red', pointBackgroundColor: 'red' },
      { data: [], label: 'Right', borderColor: 'blue', pointBackgroundColor: 'blue' },
    ]
  };

  const rear: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Left', borderColor: 'red', pointBackgroundColor: 'red' },
      { data: [], label: 'Right', borderColor: 'blue', pointBackgroundColor: 'blue' },
    ]
  };

  props.telemetry.forEach((row) => {
    const suspension = row.suspensionTravel.normalized;
    front.labels?.push('');
    front.datasets[0].data.push(suspension.front.right);
    front.datasets[1].data.push(suspension.front.left);

    rear.labels?.push('');
    rear.datasets[0].data.push(suspension.rear.right);
    rear.datasets[1].data.push(suspension.rear.left);
  });

  return {
    front,
    rear,
  };
});

const options: ChartOptions<'line'> = {
  scales: {
    y: {
      ticks: {
        callback: function (val) {
          const value = parseFloat(this.getLabelForValue(val as number)) * 100;
          return `${value}%`;
        }
      }
    }
  },
  elements: {
    line: {
      cubicInterpolationMode: 'monotone',
      borderWidth: 1,

    },
    point: {
      backgroundColor: 'none',
      borderColor: 'none',
      radius: 1,
    }
  },
};

const frontOptions: ChartOptions<'line'> = {
  ...options,
  plugins: {
    title: {
      display: true,
      text: 'Front Suspension',
    },
  },
};

const rearOptions: ChartOptions<'line'> = {
  ...options,
  plugins: {
    title: {
      display: true,
      text: 'Rear Suspension',
    },
  },
};
</script>

<template>
  <LineChart :data="data.front" :options="frontOptions" title="Front Suspension" />
  <LineChart :data="data.rear" :options="rearOptions" title="Rear Suspension" />
</template>
