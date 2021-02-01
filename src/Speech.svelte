<script>
  import { onMount } from 'svelte';
  import { init } from './speech';

  export let service;

  const send = $service.send;
  $: isResigning = $service.context.isResigning;

  onMount(() => {
    const ssu = init();
    ssu.onend = onEnd;
  });

  function onEnd(e) {
    if (isResigning) send('talkDone');
    else send('hesitate');
  }
</script>
