<script lang="ts">
  import convert_to_readable from "$lib/utils/readable";
  import { darken } from "$lib/utils/colors";

  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { LineChart } from "echarts/charts";
  import { GridComponent, TitleComponent } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";
  import type { EChartsOption } from "echarts";

  import NewsArticle from "$lib/components/NewsArticle.svelte";

  import { onMount } from "svelte";

  use([LineChart, GridComponent, SVGRenderer, TitleComponent]);

  let options: EChartsOption = {};

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
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        min: 0,
        max: 6,
        axisLabel: {
          color: text,
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
          data: [
            [0, 12],
            [1, 90],
            [2, 8],
            [3, 45],
            [4, 30],
            [5, 15],
            [6, 20],
          ],
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
    };
  });

  const net_worth = 2.5e7;
  const liquid_cash = 5e6;
  const debt = 1e6;
  const change_percent = 2.5;

  const articles = [
    {
      title: "Market Update: Sensex Hits Record High",
      content:
        "The Sensex has reached an all-time high, driven by strong corporate earnings and positive global cues. Analysts predict continued growth in the coming weeks.",
    },
    {
      title: "Tech Stocks Surge Amid AI Boom",
      content:
        "Technology stocks have surged as companies invest heavily in artificial intelligence, leading to significant gains in the sector.",
    },
    {
      title: "Economic Outlook: Inflation Concerns Persist",
      content:
        "Despite recent gains, economists warn that inflation remains a concern, potentially impacting consumer spending and investment.",
    },
    {
      title: "Real Estate Market Shows Signs of Recovery",
      content:
        "The real estate market is showing signs of recovery with increased demand for residential properties in urban areas.",
    },
    {
      title: "Global Markets React to US Interest Rate Hike",
      content:
        "Global markets are reacting to the recent interest rate hike by the US Federal Reserve, with mixed responses across different sectors.",
    },
    {
      title: "Cryptocurrency Market Volatility Continues",
      content:
        "The cryptocurrency market remains volatile, with significant price fluctuations in major coins like Bitcoin and Ethereum.",
    },
  ];
</script>

<div
  class="h-[95vh] min-w-screen grid grid-cols-5 grid-rows-5 gap-4 p-4 *:rounded-lg *:border-2 *:border-secondary"
>
  <div class="col-span-1 row-span-2 flex flex-col items-center justify-center">
    <div class="text-center">
      <h2 class="text-subtext-bright">Net Worth</h2>
      <h1 class="text-6xl font-bold text-accent">
        ₹{convert_to_readable(net_worth)}
      </h1>
    </div>
    <div
      class="flex flex-row w-full justify-around gap-2 *:text-center p-2 mt-2"
    >
      <div>
        <h2 class="text-subtext-bright">Liquid Cash</h2>
        <h3 class="text-2xl font-bold text-accent">
          ₹{convert_to_readable(liquid_cash)}
        </h3>
      </div>
      <div>
        <h2 class="text-subtext-bright">Debt</h2>
        <h3 class="text-2xl font-bold text-accent">
          ₹{convert_to_readable(debt)}
        </h3>
      </div>
    </div>
    <h2
      class:text-green={change_percent > 0}
      class:text-red={change_percent < 0}
      class="text-2xl font-bold"
    >
      {change_percent}%
      {#if change_percent > 0}
        <span>▲</span>
      {:else}
        <span>▼</span>
      {/if}
    </h2>
  </div>
  <div class="col-span-3 row-span-2 pt-4">
    <Chart {init} {options} />
  </div>
  <div class="col-span-1 row-span-3 p-2 flex flex-col">
    <h1 class="font-bold text-3xl text-center py-4">News</h1>
    <div class="overflow-y-scroll h-full">
      {#each articles as article}
        <NewsArticle title={article.title} content={article.content} />
      {/each}
    </div>
  </div>
  <div class="col-span-2 row-span-3"></div>
  <div class="col-span-2 row-span-3"></div>
  <div class="col-span-1 row-span-2"></div>
</div>
