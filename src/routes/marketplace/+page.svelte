<script>
  import Icon from "@iconify/svelte";
</script>

<div
  class="w-full h-[95vh] flex p-2 gap-2 *:rounded-md *:border-2 *:border-secondary"
>
  <div class="flex-[1] p-1">
    <!-- search bar -->
    <form method="POST" class="flex flex-row gap-2">
      <input
        type="text"
        placeholder="Search for a product..."
        class="flex-2 h-10 px-4 border-2 border-secondary rounded-md bg-background text-text"
      />
      <button
        type="submit"
        class="w-6 h-10 bg-secondary text-text rounded-md hover:bg-secondary-hover px-2 box-content"
      >
        <Icon icon="mdi:magnify" class="w-6 h-6" />
      </button>
    </form>
  </div>
  <div class="flex-[4]"></div>
</div>
