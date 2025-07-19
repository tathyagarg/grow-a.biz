<script lang="ts">
  import Widget from "$lib/components/Widget.svelte";
  import Product from "$lib/components/businesses/Product.svelte";
  import Sector from "$lib/components/businesses/Sector.svelte";

  import { convert_to_readable } from "$lib/utils/readable";

  let { data } = $props();
  let { products, business } = data;

  console.log(data);

  let productIndex = $state(products[0].id);

  let product = $derived(
    products.find((p) => p.id === productIndex) || products[0],
  );

  let equityClassName = 100 > 50 ? "bg-green" : "bg-red";
</script>

<div
  class="h-[95vh] min-w-screen grid grid-cols-4 grid-rows-4 gap-4 p-4 *:rounded-md"
>
  <div
    class="col-span-1 row-span-1 border-2 border-secondary flex flex-col items-center gap-4 p-2"
  >
    <h1 class="text-4xl font-bold">{business?.name}</h1>
    <div class="grid grid-cols-2 gap-2 w-full h-full">
      <Widget label="Equity Stake" value={"100%"} className={equityClassName} />
      <Sector sector={business?.sector || "other"} />
    </div>
  </div>
  <div
    class="col-span-1 border-2 border-secondary flex flex-col items-center gap-4 p-2"
  >
    <h1 class="text-4xl font-bold">Revenue</h1>
    <div class="grid grid-cols-3 gap-2 w-full h-full">
      <Widget label="This Week" value={`₹${convert_to_readable(100000n)}`} />
      <Widget label="This Month" value={`₹${convert_to_readable(500000n)}`} />
      <Widget label="This Year" value={`₹${convert_to_readable(6000000n)}`} />
    </div>
  </div>
  <div
    class="col-span-2 row-span-3 col-start-1 border-2 border-secondary p-2 overflow-y-hidden"
  >
    <select
      class="block mx-auto p-2 rounded-md flex-1 text-center text-4xl font-bold bg-text/10"
      bind:value={productIndex}
    >
      {#each products as p}
        <option value={p.id} class="text-base">{p.name}</option>
      {/each}
    </select>
    <div class="h-[90%] overflow-y-hidden flex flex-row gap-2">
      <Product productData={product} />
      <div class="w-1/4 flex flex-col gap-2">
        <Widget
          label="Available Stock"
          value={product.availableStock.toString()}
          className="flex-1"
        />
        <div class="flex-1"></div>
      </div>
    </div>
  </div>
</div>
