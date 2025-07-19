<script lang="ts">
  let { data }: { data: { id: number; productId: number } } = $props();
</script>

<p class="whitespace-pre-wrap">
  {JSON.stringify(data, null, 2)}
</p>
