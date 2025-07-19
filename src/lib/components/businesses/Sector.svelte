<script lang="ts">
  import Widget from "$lib/components/Widget.svelte";
  import type { BusinessSector } from "$lib/types/business";
  import { readableSector } from "$lib/utils/readable";

  export let sector: BusinessSector;

  const labels: Record<
    BusinessSector,
    { label: string; value: string; bg: string }
  > = {
    technology: { label: "Technology", value: "🖥️", bg: "bg-blue-500" },
    healthcare: { label: "Healthcare", value: "💊", bg: "bg-green-500" },
    finance: { label: "Finance", value: "💰", bg: "bg-yellow-500" },
    consumer_discretionary: {
      label: "Consumer Discretionary",
      value: "🛍️",
      bg: "bg-purple-500",
    },
    consumer_staples: {
      label: "Consumer Staples",
      value: "🛒",
      bg: "bg-orange-500",
    },
    energy: { label: "Energy", value: "⚡", bg: "bg-red-500" },
    utilities: { label: "Utilities", value: "💡", bg: "bg-teal-500" },
    materials: { label: "Materials", value: "🏗️", bg: "bg-gray-500" },
    industrials: { label: "Industrials", value: "🏭", bg: "bg-indigo-500" },
    real_estate: { label: "Real Estate", value: "🏠", bg: "bg-amber-500" },
    telecommunications: {
      label: "Telecommunications",
      value: "📞",
      bg: "bg-pink-500",
    },
    other: { label: "Other", value: "❓", bg: "bg-gray-500" },
  };

  let { label, value, bg } = labels[sector] || {
    label: "Unknown",
    value: "❓",
    bg: "bg-gray",
  };
</script>

<Widget {label} {value} className={`${bg} *:font-bold`} />
