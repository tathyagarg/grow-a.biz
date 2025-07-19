<script lang="ts">
  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { PieChart } from "echarts/charts";
  import type { EChartsOption } from "echarts";
  import { SVGRenderer } from "echarts/renderers";
  import {
    LegendComponent,
    TitleComponent,
    TooltipComponent,
  } from "echarts/components";
  import { onMount } from "svelte";

  let {
    data,
  }: {
    data: {
      thisBusinessRevenue: bigint;
      competitorRevenues: Record<string, bigint>;
      name: string;
    };
  } = $props();

  let thisBusinessRevenue: bigint = $state(data.thisBusinessRevenue);
  let competitorRevenues: Record<string, bigint> = $state(
    data.competitorRevenues,
  );
  let name: string = $state(data.name);

  let background: string = $state("");
  let text: string = $state("");

  function updateOptions(thisBusiness: any, competitors: any): EChartsOption {
    return {
      title: {
        text: "Market Share Comparison",
        left: "center",
        top: "top",
        textStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: "var(--color-text)",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const marketCap: number =
            (Object.values(competitors).reduce(
              (acc, value) => (acc as number) + Number(value),
              0 as number,
            ) as number) + Number(thisBusiness);

          const marketSharePercent = (
            (Number(params.value) / marketCap) *
            100
          ).toFixed(2);

          return `<b>${params.name}</b><br/>₹${params.value.toLocaleString()} - ${marketSharePercent}%`;
        },
      },
      legend: {
        orient: "horizontal",
        left: "center",
        top: "bottom",
        textStyle: {
          color: "var(--color-text)",
          fontSize: 14,
        },
      },
      series: [
        {
          name: "Market Share",
          type: "pie",
          radius: "75%",
          data: [
            {
              value: thisBusiness,
              name,
              label: { color: "var(--color-text)" },
            },
            ...Object.entries(competitors).map(([name, value]) => ({
              value,
              name,
              label: { color: "var(--color-text)" },
            })),
          ],
        },
      ],
    };
  }

  let options: EChartsOption = $derived(
    updateOptions(thisBusinessRevenue, competitorRevenues),
  );

  onMount(() => {
    background = getComputedStyle(document.documentElement).getPropertyValue(
      "--background",
    );

    text = getComputedStyle(document.documentElement).getPropertyValue(
      "--text",
    );

    updateOptions(thisBusinessRevenue, competitorRevenues);
  });

  use([
    PieChart,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    SVGRenderer,
  ]);
</script>

<Chart {init} {options} />
