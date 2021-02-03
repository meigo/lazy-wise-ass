<script>
  import LoadingIndicator from './components/LoadingIndicator.svelte';

  const AppComponent = import('./App.svelte').then(({ default: C }) => C);

  let innerHeight;
</script>

<style>
  main {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<svelte:window bind:innerHeight />

<main style="height:{innerHeight}px">
  {#await AppComponent}
    <LoadingIndicator />
  {:then App}
    <App />
  {/await}
</main>
