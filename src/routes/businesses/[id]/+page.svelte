<script lang="ts">
  import Widget from "$lib/components/Widget.svelte";
  import MarketShare from "$lib/components/businesses/MarketShare.svelte";
  import Product from "$lib/components/businesses/Product.svelte";
  import ProductPrice from "$lib/components/businesses/ProductPrice.svelte";
  import Sector from "$lib/components/businesses/Sector.svelte";
  import type { ProductCategory } from "$lib/types/product";
  import type { BlueprintProps } from "$lib/types/blueprint";
  import { enhance } from "$app/forms";

  import { convert_to_readable, readableRawExpense } from "$lib/utils/readable";
  import blueprints from "$lib/utils/blueprints";

  let { data, form } = $props();

  console.log("data", data.competitorBusinesses[0].products);

  let { products, business, competitorBusinesses } = data;

  let productIndex = $state(products[0]?.id || -1);

  let product = $derived(
    products.find((p) => p.id === productIndex) || products[0],
  );

  let equityClassName = business?.owned_stake > 50 ? "bg-green" : "bg-red";

  let creating_product: boolean = $state(false);
  let creatingProductCategory: ProductCategory | null = $state(null);
  let currentBlueprints: BlueprintProps[] = $derived(
    creatingProductCategory ? blueprints[creatingProductCategory] : [],
  );
</script>

<div class="h-full grid grid-cols-6 grid-rows-5 gap-4 *:rounded-md">
  <div
    class="col-start-1 col-span-2 row-start-1 row-span-1 border-2 border-secondary flex flex-col items-center gap-4 p-2"
  >
    <h1 class="text-4xl font-bold">{business?.name}</h1>
    <div class="grid grid-cols-2 gap-2 w-full h-full">
      <Widget
        label="Equity Stake"
        value={`${business?.owned_stake}%`}
        className={equityClassName}
      />
      <Sector sector={business?.sector || "other"} />
    </div>
  </div>
  <div
    class="col-start-3 col-span-2 row-start-1 row-span-1 border-2 border-secondary flex flex-col items-center gap-4 p-2"
  >
    <h1 class="text-4xl font-bold">Revenue</h1>
    <div class="grid grid-cols-3 gap-2 w-full h-full">
      <Widget label="This Week" value={`₹${convert_to_readable(100000n)}`} />
      <Widget label="This Month" value={`₹${convert_to_readable(500000n)}`} />
      <Widget label="This Year" value={`₹${convert_to_readable(6000000n)}`} />
    </div>
  </div>
  <div
    class="col-span-3 row-span-4 col-start-1 row-start-2 border-2 border-secondary p-2 overflow-y-hidden"
  >
    <select
      class="block mx-auto p-2 rounded-md flex-1 text-center text-4xl font-bold bg-text/10"
      bind:value={productIndex}
    >
      {#if products.length === 0}
        <option value={-1} disabled selected class="text-base"
          >No Products Available</option
        >
      {:else}
        {#each products as p}
          <option value={p.id} class="text-base">{p.name}</option>
        {/each}
      {/if}
    </select>
    <div
      class="h-[90%] overflow-y-hidden grid grid-cols-4 grid-rows-3 gap-4 p-2"
    >
      <Product productData={product} />
      <Widget
        label="Available Stock"
        value={product?.availableStock.toString() || "0"}
        className="flex-1 col-start-4 row-start-1"
      />
      <Widget
        label="Price"
        value={`₹${product?.price || "0"}`}
        className="p-2 col-start-4 row-start-2"
      />
      <a
        class="flex-1 col-start-4 row-start-3 cursor-pointer"
        href={`/businesses/${business.userBusinessId}/products/${product?.id || 0}`}
      >
        <Widget label="" value="Product Information" className="p-2" />
      </a>
    </div>
  </div>
  <button
    class="col-span-2 row-span-1 row-start-1 col-start-5 bg-secondary text-background flex flex-col items-center justify-center gap-4 p-2 cursor-pointer"
    onclick={() => (creating_product = true)}
  >
    <h1 class="text-4xl font-bold">New Product</h1>
  </button>
  <div
    class="col-span-3 row-span-2 row-start-2 col-start-4 border-2 border-secondary text-background flex flex-col items-center justify-center gap-4 p-2"
  >
    <MarketShare
      data={{
        name: business.name || "Your Business",
        thisBusinessRevenue: business.revenue?.value || 1000000n,
        competitorRevenues: competitorBusinesses.reduce(
          (acc, item) => {
            acc[item.name] = item.revenue?.value || 0n;
            return acc;
          },
          {} as Record<string, bigint>,
        ),
      }}
    />
  </div>
  <div
    class="col-span-3 row-span-2 row-start-4 col-start-4 border-2 border-secondary text-text flex flex-col items-center justify-center gap-4 p-2"
  >
    <ProductPrice
      data={{
        name: business.name || "Your Business",
        thisProductPrices: products.map((p) => p.price),
        competitorPrices: competitorBusinesses.reduce(
          (acc, item) => {
            acc[item.name] = item.products.map((p) => p.price);
            return acc;
          },
          {} as Record<string, number[]>,
        ),
      }}
    />
  </div>
  {#if creating_product}
    <div
      class="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-text text-background p-4 rounded-md min-w-1/2 min-h-1/3 flex flex-col items-center justify-center gap-4 border-2 border-secondary shadow-2xl"
      >
        <form
          method="POST"
          class="w-full *:w-1/2 *:mx-auto"
          use:enhance={async ({ formData }) => {
            formData.append("business_id", business.id?.toString() || "");

            return async ({ result, update }) => {
              if (result?.type === "success") {
                window.location.reload();
              } else {
                update({ form: result?.error || "An error occurred." });
              }
            };
          }}
        >
          <h1 class="text-4xl font-bold mb-4">Create New Product</h1>
          {#if form?.error}
            <div class="text-red-500 mb-4">
              {form?.error || "An error occurred while creating the product."}
            </div>
          {/if}
          <div class="w-full mb-4">
            <label for="product_name" class="block text-sm font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              class="w-full p-2 border-2 border-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="Enter product name"
              required
            />
          </div>
          <div class="w-full mb-4">
            <label
              for="product_category"
              class="block text-sm font-medium mb-2"
            >
              Product Category
            </label>
            <select
              id="product_category"
              name="product_category"
              class="w-full p-2 border-2 border-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              required
              bind:value={creatingProductCategory}
            >
              <option value="" disabled selected>Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
              <option value="furniture">Furniture</option>
              <option value="toys">Toys</option>
              <option value="books">Books</option>
              <option value="health">Health</option>
              <option value="automotive">Automotive</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
          <label class="block text-sm font-medium mb-2" for="blueprint">
            Product Blueprint
          </label>
          <div class="w-full! flex flex-row items-center justify-center mb-4">
            <div
              class="w-full flex flex-wrap gap-4 items-center justify-center"
            >
              {#each currentBlueprints as blueprint}
                <label class="flex items-center cursor-pointer w-1/3">
                  <input
                    type="radio"
                    name="blueprint"
                    value={blueprint.name}
                    class="mr-2 hidden peer"
                    required
                  />
                  <div
                    class="peer-checked:border-blue-500 peer-checked:border-4 p-4 border-2 border-secondary bg-text rounded-md flex gap-4 w-full"
                  >
                    <div>
                      {#if blueprint.image.type === "image"}
                        <img
                          src={blueprint.image.src}
                          alt={blueprint.name}
                          class="w-24 h-24 object-cover rounded-md"
                        />
                      {:else if blueprint.image.type === "emoji"}
                        <span class="text-5xl">{blueprint.image.emoji}</span>
                      {:else}
                        <span class="text-sm">{blueprint.name}</span>
                      {/if}
                      <h2 class="text-lg font-bold">{blueprint.name}</h2>
                      <hr class="py-1" />
                      <h3 class="font-semibold">Expenses</h3>
                      <ul>
                        {#each Object.entries(blueprint.expenses) as [key, value]}
                          <li class="text-sm text-red-500 font-semibold">
                            {readableRawExpense(key)}: ₹{convert_to_readable(
                              BigInt(value as number),
                            )}
                          </li>
                        {/each}
                      </ul>
                      <h3 class="font-semibold">Revenue</h3>
                      <p class="text-sm text-green-500 font-semibold">
                        Price: ₹{convert_to_readable(BigInt(blueprint.price))}
                      </p>
                      <h3 class="font-semibold">Requirements</h3>
                      <p class="text-sm font-semibold">
                        Initial Investment: ₹{convert_to_readable(
                          BigInt(blueprint.initialInvestment),
                        )}
                      </p>
                    </div>
                  </div>
                </label>
              {/each}
            </div>
          </div>
          <div class="w-full flex items-center justify-center gap-4 *:flex-1">
            <button
              type="submit"
              class="bg-secondary text-background p-2 rounded-md cursor-pointer"
            >
              Create!
            </button>
            <button
              type="button"
              class="bg-red text-background p-2 rounded-md cursor-pointer"
              onclick={() => (creating_product = false)}
            >
              Nevermind
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
