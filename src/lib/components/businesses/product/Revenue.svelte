<script lang="ts">
  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { LineChart } from "echarts/charts";
  import type { EChartsOption } from "echarts";
  import { onMount } from "svelte";
  import { SVGRenderer } from "echarts/renderers";
  import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
  } from "echarts/components";

  let options: EChartsOption = $state({});

  let {
    data,
  }: {
    data: {
      revenue: {
        revenue: number;
        quantitySold: number;
        timestamp: Date;
      }[];
    };
  } = $props();

  const { revenue } = data;

  if (revenue.length < 5) {
    const earliestDate =
      revenue.length === 0
        ? new Date()
        : new Date(Math.min(...revenue.map((r) => r.timestamp.getTime())));

    revenue.unshift(
      ...Array.from({ length: 5 - revenue.length }, (v, i) => ({
        revenue: 0,
        quantitySold: 0,
        timestamp: new Date(
          earliestDate.getTime() -
            (5 - revenue.length - i) * 24 * 60 * 60 * 1000,
        ),
      })),
    );
  }

  console.log("revenue", revenue);

  onMount(() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
    );

    const min = Math.min(...revenue.map((r) => r.revenue));

    const max = Math.max(...revenue.map((r) => r.revenue));

    options = {
      title: {
        text: "Revenue",
        left: "center",
        textStyle: {
          color: "var(--color-text)",
          fontSize: 24,
          fontWeight: "bold",
        },
      },
      xAxis: {
        type: "category",
        data: revenue.map((r) => r.timestamp.toLocaleDateString()),
        axisLabel: {
          color: "var(--color-text)",
          fontSize: 14,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "var(--color-text)",
          fontSize: 14,
        },
        min: min * 0.95,
        max: max * 1.05,
      },
      series: [
        {
          data: revenue.map((r) => r.revenue),
          type: "line",
          itemStyle: {
            color: accent,
          },
          label: {
            show: true,
            position: "top",
            color: "var(--color-text)",
          },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          return `<b>${params.name}</b><br/>₹${params.value.toLocaleString()}`;
        },
      },
    };
  });

  use([
    SVGRenderer,
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LineChart,
  ]);
</script>

<Chart {init} {options} />
