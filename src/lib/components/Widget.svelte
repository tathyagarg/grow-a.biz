<script lang="ts">
  export let value: string;
  export let label: string;

  export let className: string = "";
</script>

<div
  class={`h-full text-center text-background flex flex-col items-center justify-center bg-accent rounded-md ${className}`}
>
  <h2 class="text-3xl font-bold">{value}</h2>
  <p class="text-base">{label}</p>
</div>
