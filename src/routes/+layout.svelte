<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="min-w-screen min-h-screen bg-background text-text" id="layout">
  <div
    class="w-screen h-[5vh] border-b-2 text-xl flex items-center justify-start gap-12 p-4"
  >
    <a href="/dashboard">Home</a>
    <a href="/businesses">Businesses</a>
    <a href="/invest">Invest</a>
  </div>
  {@render children()}
</div>

<style>
  #layout {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><text x='0' y='32' font-size='24' fill='rgba(255,255,255,0.03)'>₹</text><text x='32' y='64' font-size='24' fill='rgba(255,255,255,0.03)'>₹</text></svg>");
    background-repeat: repeat;
    background-size: 32px 32px;
  }
</style>
