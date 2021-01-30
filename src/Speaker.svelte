<script>
  import { onMount } from 'svelte';
  import { init } from './speech';

  export let service;

  const send = $service.send;
  $: closing = $service.context.closing;

  onMount(() => {
    const ssu = init();
    ssu.onend = onEnd;
  });

  function onEnd(e) {
    if (closing) send('talkDone');
    else send('pauseTalk');
  }
</script>
