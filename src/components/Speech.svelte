<script>
  import { onMount } from 'svelte';
  import { isSpeechSupported, init } from '../js/speech.js';

  export let service;

  const send = $service.send;
  $: isResigning = $service.context.isResigning;

  onMount(() => {
    if (isSpeechSupported()) {
      const ssu = init();
      ssu.onend = onEnd;
    }
  });

  function onEnd(e) {
    if (isResigning) send('talkDone');
    else send('hesitate');
  }
</script>
