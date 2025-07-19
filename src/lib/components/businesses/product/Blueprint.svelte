<script lang="ts">
  import type { BlueprintProps } from "$lib/types/blueprint";

  let { data }: { data: BlueprintProps } = $props();
</script>

<div>
  {data.name}
</div>
