<script>
  import service from './fsm.js';
  import Speaker from './Speaker.svelte';
  import SpeechBubble from './SpeechBubble.svelte';

  const SpineComponent = import('./Spine.svelte').then(({ default: C }) => C);

  $: send = $service.send;
  $: currentState = $service.machine.current;
  $: error = $service.context.error;
  $: text = $service.context.quote;
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
  .state {
    position: fixed;
    display: block;
    margin: 10px auto;
    padding: 5px 10px;
    font-size: 0.8rem;
    bottom: 0;
    text-align: center;
    background-color: black;
    color: white;
    border-radius: 5px;
  }
  .container {
    display: flex;
    flex-direction: column;
    margin-top: 10vh;
  }

  @media (min-aspect-ratio: 3/4) {
    .container {
      margin-top: -5vh;
      margin-left: 15vw;
      flex-direction: row;
      align-items: center; /* vertical center */
    }
  }

  @media (min-aspect-ratio: 1/1) {
    .container {
      margin-left: 0;
    }
  }
</style>

<main>
  {#await SpineComponent}
    Loading spine component...
  {:then Spine}
    {#if !error}
      <p class="state">{currentState}</p>
    {:else}
      <p class="state" style="background-color:red;">{'error: ' + error}</p>
    {/if}

    <div class="container">
      <SpeechBubble {text} visible={$service.context.isBubbleVisible} />
      <Spine {service} />
    </div>
  {/await}
</main>

<Speaker {service} />
