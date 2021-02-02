<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import debounce from '../libs/debounce.js';

  export let timeToIdle = 5000;
  export let isIdle = false;

  let timeout;

  onMount(() => {
    setIdleTimeout();
  });

  function onActivity(e) {
    isIdle = false;
    setIdleTimeout();
  }

  const setIdleTimeout = debounce(
    () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isIdle = true;
      }, timeToIdle);
    },
    250,
    false
  );

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<svelte:window on:pointermove={onActivity} on:keydown={onActivity} />
