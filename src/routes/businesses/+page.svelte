<script lang="ts">
  import Business from "$lib/components/businesses/Business.svelte";
  import can_buy from "$lib/utils/business/can_buy";

  let { data } = $props();

  const colors = ["bg-red", "bg-blue", "bg-yellow", "bg-green", "bg-orange"];
  const lockedColors = [
    "bg-red-locked",
    "bg-blue-locked",
    "bg-yellow-locked",
    "bg-green-locked",
    "bg-orange-locked",
  ];

  const businesses = data.businesses;
</script>

<div class="h-[95vh] min-w-full grid grid-cols-5">
  {#each Array.from({ length: 5 }) as _, i}
    <Business
      id={i}
      locked={i >= businesses.length}
      name={businesses[i]?.name || "Empty"}
      bgColor={i < businesses.length
        ? colors[i % colors.length]
        : lockedColors[i % lockedColors.length]}
      can_buy={can_buy(i, businesses)}
    />
  {/each}
  <!--
  {#each businesses as business, i}
    <Business
      id={i}
      locked={false}
      name={business.name}
      bgColor={colors[i % colors.length]}
    />
  {/each}
  {#each { length: 5 - businesses.length } as _, i}
    <Business
      id={i + businesses.length}
      locked={true}
      name="Empty"
      bgColor={lockedColors[i + businesses.length]}
    />
  {/each}
  -->
</div>
