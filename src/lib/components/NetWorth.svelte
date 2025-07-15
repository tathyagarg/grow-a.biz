<script lang="ts">
  import convert_to_readable from "$lib/utils/readable";

  export let net_worth: number;
  export let liquid_cash: number;
  export let debt: number;
  export let change_percent: number;
</script>

<div class="text-center">
  <h2 class="text-subtext-bright">Net Worth</h2>
  <h1 class="text-6xl font-bold text-accent">
    ₹{convert_to_readable(net_worth)}
  </h1>
</div>
<div class="flex flex-row w-full justify-around gap-2 *:text-center p-2 mt-2">
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
