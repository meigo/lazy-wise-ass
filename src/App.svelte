<script>
  import service from './fsm.js';
  import Spine from './Spine.svelte';
  import Speech from './Speech.svelte';
  import SpeechBubble from './SpeechBubble.svelte';
  import StateMessage from './StateMessage.svelte';
  import GithubButton from './GithubButton.svelte';

  const send = $service.send;
  $: currentState = $service.machine.current;
  $: error = $service.context.error;
  $: writtenQuote = $service.context.writtenQuote;
  $: isBubbleVisible = $service.context.isBubbleVisible;
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    margin-top: 10vh;
  }

  @media (min-aspect-ratio: 3/4) and (max-aspect-ratio: 1/1) {
    .container {
      margin-top: 5vh;
      margin-left: 15vw;
      flex-direction: row;
      align-items: center; /* vertical center */
    }
  }

  @media (min-aspect-ratio: 1/1) {
    .container {
      margin-top: 5vh;
      margin-left: 0;
      flex-direction: row;
      align-items: center; /* vertical center */
    }
  }
</style>

<svelte:window on:click={() => send('wake')} />

<div class="container">
  <SpeechBubble text={writtenQuote} visible={isBubbleVisible} />
  <Spine {service} />
</div>
<StateMessage message={currentState} {error} />
<GithubButton />
<Speech {service} />
