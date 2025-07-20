<script lang="ts">
  import Market from "$lib/components/dashboard/Market.svelte";
  import NetWorth from "$lib/components/dashboard/NetWorth.svelte";
  import NetWorthGraph from "$lib/components/dashboard/NetWorthGraph/NetWorthGraph.svelte";
  import NewsArticle from "$lib/components/dashboard/NewsArticle.svelte";
  import Assets from "$lib/components/dashboard/Assets.svelte";
  import NPCEmotions from "$lib/components/dashboard/NPCEmotions.svelte";
  import type { LineGraphNode, LineGraphNodeRaw } from "$lib/types/graph";

  let { data } = $props();

  const netWorth = data.user.netWorth;
  const liquidCash = data.user.liquidCash;
  const debt = data.user.debt;

  const currentNetWorth: number = data.user.netWorth;
  const previousNetWorth: number = data.historicalData.netWorth[1]
    ? data.historicalData.netWorth[1].value
    : currentNetWorth;

  const changePercent =
    ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100;

  const netWorthGraph: LineGraphNode[] = data.historicalData.netWorth
    .map(
      (item: LineGraphNodeRaw): LineGraphNode => ({
        date: item.timestamp.toLocaleTimeString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) as string,
        value: item.value,
      }),
    )
    .reverse();

  const liquidCashGraph = data.historicalData.liquidCash
    .map((item) => ({
      date: item.timestamp.toLocaleTimeString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      value: item.value,
    }))
    .reverse();

  const debtGraph = data.historicalData.debt
    .map((item) => ({
      date: item.timestamp.toLocaleTimeString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      value: item.value,
    }))
    .reverse();

  const assetCount = data.assets.length;
  const assetSectorCount = Object.keys(
    data.assets.reduce(
      (acc, asset) => {
        acc[asset.sector ?? ""] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  ).length;

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

  function generateChartData() {
    let chartData = [];
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 2000);
    firstDate.setHours(0, 0, 0, 0);
    let value = 1200;
    for (var i = 0; i < 100; i++) {
      let newDate = new Date(firstDate);
      newDate.setDate(newDate.getDate() + i);

      value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      let open = value + Math.round(Math.random() * 16 - 8);
      let close = value + Math.round(Math.random() * 16 - 8);
      let low = Math.min(value, open) - Math.round(Math.random() * 5);
      let high = Math.max(value, open) + Math.round(Math.random() * 5);

      chartData.push({
        date: newDate.toISOString().split("T")[0],
        value: value,
        open: open,
        close: close,
        low: low,
        high: high,
      });
    }
    return chartData;
  }

  let marketData = generateChartData();

  let npcData = data.npcData.flatMap((npc) => ({
    name: npc.name,
    value: npc.feelings,
  }));
</script>

<div
  class="h-full grid grid-cols-5 grid-rows-5 gap-4 *:rounded-lg *:border-2 *:border-secondary"
>
  <div class="col-span-1 row-span-2 flex flex-col items-center justify-center">
    <NetWorth {netWorth} {liquidCash} {debt} {changePercent} />
  </div>
  <div class="col-span-3 row-span-2">
    <NetWorthGraph {netWorthGraph} {liquidCashGraph} {debtGraph} />
  </div>
  <div class="col-span-1 row-span-3 p-2 flex flex-col">
    <h1 class="font-bold text-3xl text-center py-4">News</h1>
    <div class="overflow-y-scroll h-full">
      {#each articles as article}
        <NewsArticle title={article.title} content={article.content} />
      {/each}
    </div>
  </div>
  <div class="col-span-2 row-span-3 pt-4">
    <Market data={marketData} />
  </div>
  <div class="col-span-2 row-span-3">
    <NPCEmotions {npcData} />
  </div>
  <div class="col-span-1 row-span-2 flex flex-col items-center justify-center">
    <Assets count={assetCount} sectorCount={assetSectorCount} />
  </div>
</div>
