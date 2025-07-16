<script lang="ts">
  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { CandlestickChart } from "echarts/charts";
  import {
    ToolboxComponent,
    DataZoomComponent,
    TitleComponent,
    TooltipComponent,
  } from "echarts/components";

  import { SVGRenderer } from "echarts/renderers";
  import type { EChartsOption } from "echarts";

  import { onMount } from "svelte";

  let options: EChartsOption = {};

  export let data: {
    date: string;
    open: number;
    close: number;
    high: number;
    low: number;
  }[];

  onMount(() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
    );
    const text = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text",
    );

    const red = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-red",
    );

    const green = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-green",
    );

    options = {
      title: {
        text: "Market Candlestick Chart",
        left: "center",
        textStyle: {
          color: text,
          fontFamily: "Space Grotesk",
        },
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.date),
        axisLabel: {
          color: text,
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          },
          interval: 10,
          fontFamily: "Space Grotesk",
        },
        axisLine: { lineStyle: { color: text } },
        axisPointer: {
          label: {
            backgroundColor: accent,
            fontFamily: "Space Grotesk",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: text, fontFamily: "Space Grotesk" },
        axisLine: { lineStyle: { color: text } },
        // min: 1100,
        // max: 1250,
        axisPointer: {
          label: {
            backgroundColor: accent,
            fontFamily: "Space Grotesk",
          },
          value: 1200,
        },
      },
      series: [
        {
          type: "candlestick",
          data: data.map((d) => [d.open, d.close, d.high, d.low]),
          itemStyle: {
            color: green,
            color0: red,
            borderColor: green,
            borderColor0: red,
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        backgroundColor: "rgba(0,0,0,0.7)",
        textStyle: {
          color: text,
          fontFamily: "Space Grotesk",
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 0,
          },
        },
      },
      dataZoom: [
        {
          type: "inside",
          yAxisIndex: [0],
        },
        {
          type: "slider",
          xAxisIndex: [0],
        },
      ],
    };
  });

  use([
    CandlestickChart,
    TitleComponent,
    SVGRenderer,
    TooltipComponent,
    ToolboxComponent,
    DataZoomComponent,
  ]);
</script>

<Chart {init} {options} />
