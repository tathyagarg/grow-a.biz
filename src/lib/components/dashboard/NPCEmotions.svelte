<script lang="ts">
  export let npcData: { name: string; value: number }[];

  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import {
    GraphicComponent,
    TitleComponent,
    TooltipComponent,
  } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";
  import type { EChartsOption } from "echarts";

  import { onMount, tick } from "svelte";

  let options: EChartsOption = {};

  use([TitleComponent, TooltipComponent, SVGRenderer, GraphicComponent]);

  const bar_height = 400;

  onMount(async () => {
    const text = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text",
    );

    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
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

    const top_offset = 50;

    const container = document.getElementById("emotion-parent");
    const height = container?.clientHeight || 500;
    const scale = height / (bar_height + top_offset);

    options = {
      title: {
        text: "NPC Emotions",
        left: "center",
        top: top_offset - 50,
        textStyle: {
          color: text,
          fontSize: 40,
          fontWeight: "bold",
          fontFamily: "Space Grotesk",
        },
      },
      graphic: {
        elements: [
          {
            type: "group",
            left: "center",
            scaleX: scale,
            scaleY: height / (bar_height + top_offset * 2.5),
            children: npcData.flatMap(({ name, value }, i) => ({
              type: "group",
              left: 100 * i,
              children: [
                {
                  type: "rect",
                  shape: {
                    x: -200 + 100 * i,
                    y: top_offset,
                    width: 50,
                    height: bar_height,
                  },
                  style: {
                    fill: text,
                  },
                },
                {
                  type: "rect",
                  shape: {
                    x: -200 + 100 * i,
                    y: top_offset + (bar_height * (100 - value)) / 100,
                    width: 50,
                    height: (bar_height * value) / 100,
                  },
                  style: {
                    fill: accent,
                  },
                },
                {
                  type: "text",
                  style: {
                    text: name, // `${value}%`,
                    fill: text,
                    fontSize: 20,
                    textAlign: "center",
                    fontFamily: "Space Grotesk",
                  },
                  x: -200 + 100 * i + 25,
                  y: bar_height + top_offset + 10,
                },
                {
                  type: "text",
                  style: {
                    text: `${value}%`,
                    fill: value > 75 ? green : value < 25 ? red : yellow,
                    fontSize: 20,
                    textAlign: "center",
                    fontFamily: "Space Grotesk",
                  },
                  x: -200 + 100 * i + 25,
                  y: bar_height + top_offset + 35,
                },
              ],
            })),
          },
        ],
      },
    };
  });
</script>

<div class="h-full w-full" id="emotion-parent">
  <Chart {init} {options} />
</div>
