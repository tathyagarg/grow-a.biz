<script lang="ts">
  import { convert_to_readable_float } from "$lib/utils/readable";

  export let netWorth: number;
  export let liquidCash: number;
  export let debt: number;
  export let changePercent: number;
</script>

<div class="text-center">
  <h2 class="text-subtext-bright">Net Worth</h2>
  <h1 class="text-6xl font-bold text-accent">
    ₹{convert_to_readable_float(netWorth)}
  </h1>
</div>
<div class="flex flex-row w-full justify-around gap-2 *:text-center p-2 mt-2">
  <div>
    <h2 class="text-subtext-bright">Liquid Cash</h2>
    <h3 class="text-2xl font-bold text-accent">
      ₹{convert_to_readable_float(liquidCash)}
    </h3>
  </div>
  <div>
    <h2 class="text-subtext-bright">Debt</h2>
    <h3 class="text-2xl font-bold text-accent">
      ₹{convert_to_readable_float(debt)}
    </h3>
  </div>
</div>
<h2
  class:text-green={changePercent > 0}
  class:text-red={changePercent < 0}
  class="text-2xl font-bold"
>
  {changePercent}%
  {#if changePercent > 0}
    <span>▲</span>
  {:else}
    <span>▼</span>
  {/if}
</h2>
