<template>
  <LineChart :chart-data="data.front" :options="frontOptions" title="Front Suspension" />
  <LineChart :chart-data="data.rear" :options="rearOptions" title="Rear Suspension" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { LineChart } from 'vue-chart-3';

interface SuspensionData {
  timestampMS: number;
  normalizedSuspensionTravelFrontLeft: number;
  normalizedSuspensionTravelFrontRight: number;
  normalizedSuspensionTravelRearLeft: number;
  normalizedSuspensionTravelRearRight: number;
}

export default defineComponent({
  components: { LineChart },
  props: {
    telemetry: {
      type: Array as PropType<SuspensionData[]>,
      required: true,
    },
  },
  setup(props) {
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
        front.labels?.push('');
        front.datasets[0].data.push(row.normalizedSuspensionTravelFrontLeft);
        front.datasets[1].data.push(row.normalizedSuspensionTravelFrontRight);

        rear.labels?.push('');
        rear.datasets[0].data.push(row.normalizedSuspensionTravelRearLeft);
        rear.datasets[1].data.push(row.normalizedSuspensionTravelRearRight);
      });

      return {
        front,
        rear,
      };
    });

    const options: ChartOptions = {
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

    const frontOptions: ChartOptions = {
      ...options,
      plugins: {
        title: {
          display: true,
          text: 'Front Suspension',
        },
      },
    };

    const rearOptions: ChartOptions = {
      ...options,
      plugins: {
        title: {
          display: true,
          text: 'Rear Suspension',
        },
      },
    };

    return {
      data,
      frontOptions,
      rearOptions,
    }
  },
})
</script>
