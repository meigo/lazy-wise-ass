<script>
  import { resize } from '../js/spine.js';

  export let service;

  const send = $service.send;
  $: canvasVisible = $service.context.canvasVisible;

  function startFSM(node) {
    send({ type: 'start', canvas: node }); // Start the state machine
  }
</script>

<style>
  canvas {
    display: block;
    position: relative;
    width: 100vw;
    opacity: 0;
    visibility: hidden;
    transition: visibility 1s linear, opacity 1s linear;
    pointer-events: none;
  }

  .visible {
    visibility: visible;
    opacity: 1;
  }

  @media (min-aspect-ratio: 3/4) {
    canvas {
      width: auto;
      height: 100vh;
    }
  }
</style>

<svelte:window on:resize={resize} />

<canvas use:startFSM width="900" height="900" class:visible={canvasVisible} />
