<script lang="ts">
  export let npc_data: { name: string; value: number }[];

  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import {
    GraphicComponent,
    TitleComponent,
    TooltipComponent,
  } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";
  import type { EChartsOption } from "echarts";

  import { onMount } from "svelte";

  let options: EChartsOption = {};

  use([TitleComponent, TooltipComponent, SVGRenderer, GraphicComponent]);

  const bar_height = 400;

  onMount(() => {
    const text = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-text",
    );

    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-accent",
    );

    const top_offset = 75;

    options = {
      title: {
        text: "NPC Emotions",
        left: "center",
        top: 20,
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
            // top: "center",
            left: "center",
            children: npc_data.flatMap(({ name, value }, i) => ({
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
                    fill: text,
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

<Chart {init} {options} />
