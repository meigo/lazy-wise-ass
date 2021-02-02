<script>
  import LoadingIndicator from './components/LoadingIndicator.svelte';
  const AppComponent = import('./App.svelte').then(({ default: C }) => C);
</script>

<style>
  main {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>

<main>
  {#await AppComponent}
    <LoadingIndicator />
  {:then App}
    <App />
  {/await}
</main>
