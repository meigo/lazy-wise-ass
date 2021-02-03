<script>
  import service from './js/fsm.js';
  import Spine from './components/Spine.svelte';
  import Speech from './components/Speech.svelte';
  import SpeechBubble from './components/SpeechBubble.svelte';
  import StateMessage from './components/StateMessage.svelte';
  import GithubButton from './components/GithubButton.svelte';

  const send = $service.send;
  $: currentState = $service.machine.current;
  $: error = $service.context.error;
  $: writtenQuote = $service.context.writtenQuote;
  $: personPageUrl = $service.context.personPageUrl;
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

<svelte:body on:click={() => send('wake')} />

<Speech {service} />

<div class="container">
  <SpeechBubble text={writtenQuote} visible={isBubbleVisible} url={personPageUrl} />
  <Spine {service} />
</div>

<StateMessage message={currentState} {error} />

<GithubButton />
