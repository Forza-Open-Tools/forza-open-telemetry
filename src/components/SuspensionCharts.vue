<template>
  <LineChart :chart-data="data.front" :options="frontOptions" title="Front Suspension" />
  <LineChart :chart-data="data.rear" :options="rearOptions" title="Rear Suspension" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { ChartData, ChartOptions } from 'chart.js';
import { LineChart } from 'vue-chart-3';
import { TelemetryDataPoint } from '../lib/data';

export default defineComponent({
  components: { LineChart },
  props: {
    telemetry: {
      type: Array as PropType<TelemetryDataPoint[]>,
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
