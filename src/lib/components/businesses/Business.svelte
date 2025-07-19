<script lang="ts">
  import Icon from "@iconify/svelte";

  export let id: number;
  export let locked: boolean = false;
  export let name: string = "Empty";

  export let bgColor: string;

  export let can_buy: { can_buy_this: boolean; requirement: number } = {
    can_buy_this: false,
    requirement: 0,
  };

  export let handle_click: (id: number) => void = () => {};

  const { can_buy_this, requirement } = can_buy;
</script>

<div class="col-span-1 row-span-1 p-2 flex items-center justify-center">
  <a
    class="h-full w-full relative"
    href={`/businesses/${locked ? "" : id}`}
    class:cursor-default={locked}
  >
    <div
      id={`${locked ? "locked" : "business"}-${id}`}
      class={`w-full h-full rounded-lg flex flex-col items-center justify-around ${bgColor} border-12 border-text/25`}
    >
      <div
        class="w-18 h-18 rounded-full border-2 border-white bg-gray-700"
      ></div>
      <h2
        class="text-xl font-bold bg-yellow-50 px-32 py-8 rotate-270 text-background"
      >
        {name}
      </h2>
      <div
        class="w-18 h-18 rounded-full border-2 border-white bg-gray-700"
      ></div>
    </div>

    {#if locked && can_buy_this}
      <button
        class="h-28 w-64 bg-text border-4 border-background text-background rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] font-bold text-2xl flex items-center justify-center cursor-pointer"
        on:click={() => handle_click(id)}
      >
        Buy!
      </button>
    {:else if locked}
      <div
        class="h-28 w-64 bg-text border-4 border-background text-background rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] font-bold text-2xl flex items-center justify-center cursor-not-allowed flex-col"
      >
        <Icon icon="material-symbols:lock" />
        <p class="text-sm text-center">
          Reach {requirement}% market share* to unlock
        </p>
        <small class="text-xs text-subtext-bright invert"
          >*on any business</small
        >
      </div>
    {/if}
  </a>
</div>
