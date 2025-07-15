<script lang="ts">
  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { LineChart } from "echarts/charts";
  import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    DataZoomComponent,
  } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";
  import type { EChartsOption } from "echarts";

  import { onMount } from "svelte";

  import { darken } from "$lib/utils/colors";

  let options: EChartsOption = {};

  export let data: {
    date: string;
    value: number;
  }[];

  onMount(() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
    );

    const text = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text",
    );

    options = {
      title: {
        text: "Weekly Change in Net Worth",
        left: "center",
        textStyle: {
          color: text,
        },
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.date),
        axisLabel: {
          color: text,
          formatter: (value: string) => {
            console.log(value);
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          },
        },
        axisLine: {
          lineStyle: {
            color: text,
          },
        },
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: text,
        },
        axisLine: {
          lineStyle: {
            color: text,
          },
        },
      },
      series: [
        {
          type: "line",
          data: data.map((d) => d.value),
          lineStyle: {
            width: 4,
            color: accent,
          },
          itemStyle: {
            color: darken(accent, 100),
            borderJoin: "round",
            borderWidth: 8,
          },
          clip: false,
          symbolSize: 10,
          symbol: "circle",
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        textStyle: {
          color: text,
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            show: true,
            title: {
              zoom: "Zoom",
              back: "Reset Zoom",
            },
          },
        },
      },
    };
  });

  use([
    LineChart,
    GridComponent,
    SVGRenderer,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    DataZoomComponent,
  ]);
</script>

<Chart {init} {options} />
