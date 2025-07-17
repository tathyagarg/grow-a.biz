<script lang="ts">
  export let count: number;
  export let sectorCount: number;
</script>

<div class="text-center">
  <h1 class="text-8xl font-bold text-accent">
    {count}
  </h1>
  <h2 class="text-subtext-bright">Asset(s)</h2>
</div>
<div class="text-center">
  <h2 class="text-subtext-bright text-2xl">
    Over <span class="text-accent font-bold">{sectorCount}</span> sector(s)
  </h2>
</div>
