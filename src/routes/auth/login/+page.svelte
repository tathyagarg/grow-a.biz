<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<div class="w-full h-[95vh] flex flex-col items-center justify-center">
  <div
    class="flex flex-col items-center justify-center w-fit py-8 px-4 bg-surface rounded-lg shadow-lg"
  >
    <h1 class="text-4xl font-bold text-center mb-8">Login / Register</h1>
    {#if form?.message}
      <p class="text-red mb-8">Error: {form?.message ?? ""}</p>
    {/if}
    <form
      method="post"
      action="?/login"
      use:enhance
      class="flex flex-col gap-2"
    >
      <label class="bg-accent p-4 text-background font-bold rounded-md">
        Username
        <input name="username" class="bg-text px-1 rounded-md" />
      </label>
      <label class="bg-accent p-4 text-background font-bold rounded-md">
        Password:
        <input
          type="password"
          name="password"
          class="bg-text px-1 rounded-md"
        />
      </label>
      <div class="flex gap-2 justify-around">
        <button
          class="bg-green text-background py-4 flex-1 rounded-md font-bold cursor-pointer"
          >Login</button
        >
        <button
          class="bg-secondary text-background py-4 flex-1 rounded-md font-bold cursor-pointer"
          formaction="?/register">Register</button
        >
      </div>
    </form>
  </div>
</div>
