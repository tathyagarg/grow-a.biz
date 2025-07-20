<script lang="ts">
  import Product from "$lib/components/businesses/Product.svelte";
  import Revenue from "$lib/components/businesses/product/Revenue.svelte";
  import Widget from "$lib/components/Widget.svelte";

  import type { ProductWithRevenue } from "$lib/types/product";

  let {
    data,
  }: { data: { id: number; productId: number; product: ProductWithRevenue } } =
    $props();

  let { product } = data;
  console.log("product", product);
</script>

<div class="h-full grid grid-cols-5 grid-rows-3 gap-4">
  <div
    class="col-start-1 row-start-1 col-span-2 row-span-2 border-2 border-secondary rounded-md p-2 overflow-hidden"
  >
    <h1 class="text-4xl font-black text-center">{product.name}</h1>
    <p class="text-lg text-center text-subtext">Product Information</p>
    <div class="h-full">
      <Product productData={product} />
    </div>
  </div>
  <div
    class="col-start-1 row-start-3 col-span-2 row-span-1 border-2 border-secondary rounded-md p-2 flex flex-col"
  >
    <h1 class="text-center text-4xl font-bold">Distribution Channels</h1>
    <div class="h-full gap-2 *:flex-1 *:p-2 grid grid-cols-2 grid-rows-2">
      <Widget value="DTC" label="Channels" />
      <Widget value="Retailer" label="Channels" />
      <Widget value="Wholesale" label="Channels" />
      <Widget value="Distributors" label="Channels" />
    </div>
  </div>
  <div
    class="col-start-3 row-start-1 col-span-2 row-span-2 border-2 border-secondary rounded-md p-2 overflow-hidden"
  >
    <Revenue data={{ revenue: product.revenues }} />
  </div>
  <button>
    <Widget value="Optimize Costs" label="" className="bg-blue" />
  </button>
  <button>
    <Widget value="Buy Inventory" label="" className="bg-green" />
  </button>
  <button>
    <Widget value="Change Price" label="" className="bg-yellow" />
  </button>
  <div
    class="col-start-5 row-start-1 col-span-1 row-span-2 grid grid-cols-3 grid-rows-4 border-2 border-secondary rounded-md pr-2 overflow-hidden"
  >
    <div
      class="col-start-1 row-start-1 col-span-1 row-span-4 backdrop-blur-xs [writing-mode:sideways-lr] flex items-center justify-center"
    >
      <p class="text-center text-4xl font-bold">Product Stats</p>
    </div>
    <div class="col-start-2 row-start-1 col-span-2 row-span-1 pt-2">
      <Widget value={`${product.stats?.quality || 0}/100`} label="Quality" />
    </div>
    <div class="col-start-2 row-start-2 col-span-2 row-span-1 pt-2">
      <Widget
        value={`${product.stats?.packaging || 0}/100`}
        label="Packaging"
      />
    </div>
    <div class="col-start-2 row-start-3 col-span-2 row-span-1 pt-2">
      <Widget value={`${product.stats?.design || 0}/100`} label="Design" />
    </div>
    <div class="col-start-2 row-start-4 col-span-2 row-span-1 py-2">
      <Widget
        value={`${product.stats?.easeOfUse || 0}/100`}
        label="Ease of Use"
      />
    </div>
  </div>
</div>
