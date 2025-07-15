<script lang="ts">
  export let count: number;
  export let category_count: number;
</script>

<div class="text-center">
  <h1 class="text-8xl font-bold text-accent">
    {count}
  </h1>
  <h2 class="text-subtext-bright">Assets</h2>
</div>
<div class="text-center">
  <h2 class="text-subtext-bright text-2xl">
    Over <span class="text-accent font-bold">{category_count}</span> categories
  </h2>
</div>
