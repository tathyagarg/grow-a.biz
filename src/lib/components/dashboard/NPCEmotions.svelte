<script lang="ts">
  export let npcData: { name: string; value: number }[];

  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { TitleComponent, TooltipComponent } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";
  import type { EChartsOption } from "echarts";

  import { onMount, tick } from "svelte";
  import { BarChart } from "echarts/charts";

  let options: EChartsOption = {};

  use([TitleComponent, TooltipComponent, SVGRenderer, BarChart]);

  onMount(async () => {
    const text = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text",
    );

    const green = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-green",
    );

    const red = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-red",
    );

    const yellow = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-yellow",
    );

    await tick();

    options = {
      title: {
        text: "NPC Emotions",
        top: 10,
        left: "center",
        textStyle: {
          color: text,
          fontFamily: "Space Grotesk",
          fontSize: 32,
        },
      },
      xAxis: {
        type: "category",
        data: npcData.map((npc) => npc.name),
        axisLabel: {
          color: text,
          fontSize: 14,
          fontFamily: "Space Grotesk",
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: text,
          fontSize: 14,
          fontFamily: "Space Grotesk",
        },
        max: 100,
      },
      series: [
        {
          data: npcData.map((npc) => npc.value),
          type: "bar",
          itemStyle: {
            color: (params) => {
              const data: number = (params.data as number) || 0;
              return data > 75 ? green : data < 25 ? red : yellow;
            },
          },
          showBackground: true,
          backgroundStyle: {
            color: text,
          },
          barWidth: "75%",
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const data = params.data as number;
          return `${params.name}: ${data}%`;
        },
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          fontFamily: "Space Grotesk",
        },
      },
    };
  });
</script>

<div class="h-full w-full" id="emotion-parent">
  <Chart {init} {options} />
</div>
