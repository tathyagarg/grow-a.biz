<script lang="ts">
  export let label: string;
  export let callback: () => void;
</script>

<div
  class="flex items-center gap-2 rounded-md transition-all
    bg-accent text-background w-full text-center flex-1 relative"
>
  <input
    type="radio"
    name="datasource"
    id={label}
    class="peer absolute h-full w-full cursor-pointer appearance-none rounded-md border-2 border-secondary"
    on:change={callback}
    checked={label === "Net Worth"}
  />
  <label
    for={label}
    class="cursor-pointer w-full text-center text-lg font-semibold text-background/50 peer-hover:text-background peer-checked:text-background transition-all duration-300"
  >
    {label}
  </label>
</div>
