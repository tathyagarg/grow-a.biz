<script lang="ts">
  import "../app.css";
  import "$lib/stores/gameloop";

  let { children } = $props();
</script>

<svelte:head>
  <title>Grow a Business</title>
  <meta name="description" content="A business simulator game" />

  <meta property="og:title" content="Grow a Business" />
  <meta property="og:description" content="A business simulator game" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://grow-a.biz" />
  <meta property="og:image" content="https://grow-a.biz/favicon.svg" />
  <meta
    property="og:image:secure_url"
    content="https://grow-a.biz/favicon.svg"
  />
  <meta property="og:image:alt" content="Grow a Business Logo" />
  <meta property="og:image:type" content="image/svg+xml" />
</svelte:head>

<div class="min-w-screen min-h-screen bg-background text-text" id="layout">
  <div
    class="w-screen h-[5vh] border-b-2 text-xl flex items-center justify-start gap-12 p-4 bg-background"
  >
    <a href="/dashboard">Home</a>
    <a href="/businesses">Businesses</a>
    <a href="/marketplace">Marketplace</a>
  </div>
  <div class="w-full h-[95vh] p-4">
    {@render children()}
  </div>
</div>

<style>
  #layout {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><text x='0' y='32' font-size='24' fill='rgba(255,255,255,0.03)'>₹</text><text x='32' y='64' font-size='24' fill='rgba(255,255,255,0.03)'>₹</text></svg>");
    background-repeat: repeat;
    background-size: 32px 32px;
  }
</style>
