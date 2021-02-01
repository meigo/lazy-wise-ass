<script>
  import { onMount } from 'svelte';
  import { resize } from './spine.js';

  export let service;

  let canvas;

  const send = $service.send;
  $: canvasVisible = $service.context.canvasVisible;

  onMount(() => {
    send({ type: 'init', canvas: canvas }); // Start the state machine
  });
</script>

<style>
  canvas {
    display: block;
    position: relative;
    width: 100vw;
    opacity: 0;
    visibility: hidden;
    transition: visibility 1s linear, opacity 1s linear;
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

<canvas bind:this={canvas} width="900" height="900" class:visible={canvasVisible} />
