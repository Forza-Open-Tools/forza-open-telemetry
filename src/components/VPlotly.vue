<!-- <template>
  <div ref="rootRef" :id="id" />
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, PropType, ref, watch } from "vue";
import Plotly from "plotly.js/lib/core";
import { camelCase } from "change-case";

const eventNames = [
  "AfterExport",
  "AfterPlot",
  "Animated",
  "AnimatingFrame",
  "AnimationInterrupted",
  "AutoSize",
  "BeforeExport",
  "ButtonClicked",
  "Click",
  "ClickAnnotation",
  "Deselect",
  "DoubleClick",
  "Framework",
  "Hover",
  "LegendClick",
  "LegendDoubleClick",
  "Relayout",
  "Restyle",
  "Redraw",
  "Selected",
  "Selecting",
  "SliderChange",
  "SliderEnd",
  "SliderStart",
  "Transitioning",
  "TransitionInterrupted",
  "Unhover"
];

export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: Array as PropType<Plotly.Data[]>,
      required: true,
    },
    layout: {
      type: Object as PropType<Plotly.Layout>,
      default: () => ({}),
    },
    id: {
      type: String,
      default: null,
    }
  },
  setup(props, { emit, attrs }) {
    const rootRef = ref<HTMLElement>();

    const layout = computed(() => ({ ...props.layout }));

    const options = computed<Plotly.Config>(() => {
      const optionsFromAttrs = Object.keys(attrs).reduce((acc, k) => ({
        ...acc,
        [camelCase(k)]: attrs[k],
      }), {} as Record<string, unknown>);

      return {
        responsive: false,
        ...optionsFromAttrs
      } as Plotly.Config;
    });

    const plotlyEvents = eventNames.map((name) => {
      const eventName = name.toLocaleLowerCase();
      const completeName = `plotly_${eventName}`;
      return {
        name,
        eventName,
        completeName,
        handler: (...args: unknown[]) => {
          emit(eventName, ...args);
        },
      };
    });

    onMounted(() => {
      nextTick(() => {
        if (rootRef.value) {
          Plotly.newPlot(rootRef.value, props.data, layout.value, options.value);
          plotlyEvents.forEach((event) => {
            rootRef.value?.addEventListener(event.completeName, event.handler);
          });
        }
      });
    });

    onBeforeUnmount(() => {
      if (rootRef.value) {
        plotlyEvents.forEach((event) => {
          rootRef.value?.removeEventListener(event.completeName, event.handler);
        });
        Plotly.purge(rootRef.value);
      }
    });

    function getPrintOptions(): Plotly.ToImgopts {
      return {
        format: "png",
        width: rootRef.value?.clientWidth || 0,
        height: rootRef.value?.clientHeight || 0,
      };
    }

    // function onResize() {
    //   if (rootRef.value) {
    //     Plotly.Plots.resize(rootRef.value);
    //   }
    // }

    function toImage(options: Partial<Plotly.ToImgopts>) {
      if (rootRef.value) {
        const allOptions = {
          ...getPrintOptions(),
          ...options,
        };
        return Plotly.toImage(rootRef.value, allOptions);
      }
      return Promise.reject('Invalid div ref');
    }

    function downloadImage(options: Partial<Plotly.DownloadImgopts>) {
      if (rootRef.value) {
        const filename = `plot--${new Date().toISOString()}`;
        const allOptions = {
          ...getPrintOptions(),
          filename,
          ...options,
        };
        return Plotly.downloadImage(rootRef.value, allOptions);
      }
      return Promise.reject('Invalid div ref');
    }

    function relayout() {
      if (rootRef.value) {
        Plotly.relayout(rootRef.value, layout.value);
      }
    }

    function react() {
      if (rootRef.value) {
        Plotly.react(rootRef.value, props.data, layout.value, options.value);
      }
    }

    const scheduledUpdate = {
      isScheduled: false,
      replot: false,
    };

    function schedule(replot: boolean) {
      if (scheduledUpdate.isScheduled) {
        scheduledUpdate.replot = scheduledUpdate.replot || replot;
        return;
      }

      scheduledUpdate.isScheduled = true;
      scheduledUpdate.replot = replot;

      nextTick(() => {
        scheduledUpdate.isScheduled = false;
        if (scheduledUpdate.replot) {
          scheduledUpdate.replot = false;
          react();
        } else {
          relayout();
        }
      });
    }

    watch(() => props.data, () => {
      schedule(true);
    }, { deep: true });

    watch(options, (current, previous) => {
      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        schedule(true);
      }
    });

    watch(() => props.layout, (current) => {
      schedule(false);
    });

    return {
      rootRef,
      toImage,
      downloadImage,
    }
  },
});
</script> -->
