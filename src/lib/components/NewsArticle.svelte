<script lang="ts">
  export let title: string;
  export let content: string;

  let real_content =
    content.length > 100 ? content.slice(0, 100) + "..." : content;

  let real_title = title.length > 30 ? title.slice(0, 30) + "..." : title;
</script>

<div class="p-2 bg-surface/35 serif my-2 rounded-lg overflow-hidden">
  <h1 class="text-base font-bold mb-2 text-nowrap">{real_title}</h1>
  <p class="text-xs">{real_content}</p>
</div>
