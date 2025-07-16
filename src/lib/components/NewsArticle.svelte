<script lang="ts">
  export let title: string;
  export let content: string;

  let real_content =
    content.length > 100 ? content.slice(0, 100) + "..." : content;

  let real_title = title.length > 30 ? title.slice(0, 30) + "..." : title;
</script>

<div class="relative w-full">
  <div
    class="p-2 bg-accent text-background serif my-2 rounded-md overflow-hidden peer"
  >
    <h1 class="text-base font-bold mb-2 text-nowrap">{real_title}</h1>
    <p class="text-xs">{real_content}</p>
  </div>
  <div
    class="absolute top-0 left-0 w-full h-full bg-secondary opacity-0 peer-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-md"
  >
    <div class="flex items-center justify-center h-full p-2">
      <p class="text-sm">{content}</p>
    </div>
  </div>
</div>
