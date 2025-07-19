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

  let selected_business: any | null = $state(null);

  function selectBusiness(business: any) {
    selected_business = business;
  }
</script>

<div class="h-[95vh] min-w-full grid grid-cols-5">
  {#each Array.from({ length: 5 }) as _, i}
    <Business
      id={businesses[i]?.userBusinessId || i}
      locked={i >= businesses.length}
      name={businesses[i]?.name || "Empty"}
      bgColor={i < businesses.length
        ? colors[i % colors.length]
        : lockedColors[i % lockedColors.length]}
      can_buy={can_buy(i, businesses)}
      handle_click={selectBusiness}
    />
  {/each}
  {#if selected_business}
    <div
      class="h-1/3 w-1/3 absolute bg-text top-1/2 left-1/2 translate-[-50%] shadow-2xl rounded-lg text-2xl text-background border-4 border-secondary"
    >
      <form
        class="flex flex-col justify-center h-full w-full gap-4 px-[16.67%]"
        method="POST"
      >
        <h2 class="text-2xl font-bold text-center">Create New Business</h2>
        <div class="">
          <label for="name" class="block text-sm font-medium mb-2"
            >Business Name</label
          >
          <input
            type="text"
            id="name"
            name="name"
            class="w-full p-2 border-2 border-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
            placeholder="Enter business name"
            required
          />
        </div>
        <div class="">
          <label for="sector" class="block text-sm font-medium mb-2">
            Sector
          </label>
          <select
            id="sector"
            name="sector"
            class="w-full p-2 border-2 border-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
            required
          >
            <option value="" disabled selected>Select a sector</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="consumer_discretionary"
              >Consumer Discretionary</option
            >
            <option value="consumer_staples">Consumer Staples</option>
            <option value="energy">Energy</option>
            <option value="utilities">Utilities</option>
            <option value="materials">Materials</option>
            <option value="industrials">Industrials</option>
            <option value="real_estate">Real Estate</option>
            <option value="telecommunications">Telecommunications</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="flex flex-row gap-2">
          <div class="flex-1">
            <button
              type="submit"
              class="w-full bg-blue text-white p-2 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create Business!
            </button>
          </div>
          <div class="flex-1">
            <button
              type="button"
              class="w-full bg-red text-white p-2 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onclick={() => (selected_business = null)}
            >
              Nevermind
            </button>
          </div>
        </div>
      </form>
    </div>
  {/if}
</div>
