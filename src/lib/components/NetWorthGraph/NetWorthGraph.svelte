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
  import type { LineGraphData } from "$lib/types/graph";

  import Datasource from "./Datasource.svelte";

  use([
    LineChart,
    GridComponent,
    SVGRenderer,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    DataZoomComponent,
  ]);

  let props = $props();

  let netWorthGraph: LineGraphData = props.netWorthGraph || [];
  let liquidCashGraph: LineGraphData = props.liquidCashGraph || [];
  let debtGraph: LineGraphData = props.debtGraph || [];

  let data: LineGraphData = $state(netWorthGraph);

  let current = $state("Net Worth");

  let text = $state("");
  let accent = $state("");
  let secondary = $state("");

  let options: EChartsOption = $derived({
    title: {
      text: `Change in ${current}`,
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
        fontFamily: "Space Grotesk",
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
        fontFamily: "Space Grotesk",
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
        fontFamily: "Space Grotesk",
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
    dataZoom: {
      type: "slider",
      show: true,
      backgroundColor: "transparent",
      borderColor: "transparent",
      fillerColor: `${darken(secondary, 50)}80`,
      handleStyle: {
        color: secondary,
        borderColor: darken(secondary, 50),
      },
    },
  });

  onMount(() => {
    accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
    );

    text = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text",
    );

    secondary = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-secondary",
    );
  });
</script>

<div class="w-full h-full flex flex-row py-4 px-2">
  <div class="flex flex-col w-1/6 h-full gap-1 pl-1 justify-start items-start">
    <!-- radio buttons for data source -->
    <Datasource
      label="Net Worth"
      callback={() => {
        data = netWorthGraph;
        current = "Net Worth";
      }}
    />
    <Datasource
      label="Liquid Cash"
      callback={() => {
        data = liquidCashGraph;
        current = "Liquid Cash";
      }}
    />
    <Datasource
      label="Debt"
      callback={() => {
        data = debtGraph;
        current = "Debt";
      }}
    />
  </div>
  <Chart {init} {options} />
</div>
