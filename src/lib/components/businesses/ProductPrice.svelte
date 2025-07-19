<script lang="ts">
  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { BarChart } from "echarts/charts";
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
      name: string;
      thisProductPrices: number[];
      competitorPrices: Record<string, number[]>;
    };
  } = $props();

  onMount(() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
    );

    const green = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-green",
    );

    const red = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-red",
    );

    const prices: Record<string, number> = Object.fromEntries(
      Object.entries({
        ...Object.entries(data.competitorPrices).reduce(
          (acc, [key, value]) => {
            acc[key] =
              value.reduce((sum, price) => sum + price, 0) / value.length;

            return acc;
          },
          {} as Record<string, number>,
        ),
        [data.name]:
          data.thisProductPrices.reduce((sum, price) => sum + price, 0) /
          data.thisProductPrices.length,
      }).sort(([, a], [, b]) => a - b),
    ) as Record<string, number>;

    const thisPrice = prices[data.name];
    const maxPrice = Math.max(...Object.values(prices));
    const minPrice = Math.min(...Object.values(prices));

    options = {
      title: {
        text: "Average Product Price Comparison",
        left: "center",
        textStyle: {
          color: "var(--color-text)",
          fontSize: 24,
          fontWeight: "bold",
        },
      },
      xAxis: {
        type: "category",
        data: Object.keys(prices),
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
        min: minPrice * 0.95,
        max: maxPrice + (maxPrice - minPrice) * 0.05,
      },
      series: [
        {
          data: Object.entries(prices).map(([name, value]) => ({
            name,
            value,
            itemStyle: {
              color:
                value < thisPrice ? red : value > thisPrice ? green : accent,
            },
          })),
          type: "bar",
          itemStyle: {
            color: accent,
          },
          barWidth: "75%",
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

  use([BarChart, SVGRenderer, GridComponent, TooltipComponent, TitleComponent]);
</script>

<Chart {init} {options} />
