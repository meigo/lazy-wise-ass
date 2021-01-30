<script>
  import { scale } from 'svelte/transition';
  import { backIn, backOut } from 'svelte/easing';

  export let visible;
  export let text;
</script>

<style>
  .quote-container {
    position: relative;
    margin: 0 18vw;
    margin-bottom: -20vmin;
    height: 45vmin;
    z-index: 0;
  }
  .scale-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    border-radius: 20px;
  }
  .quote-text {
    position: relative;
    font-family: 'Komikula';
    font-size: 4vmin;
    letter-spacing: 0.3vmin;
    margin: 0 8vw;
    hyphens: auto;
    text-align: center;
    text-transform: uppercase;
    color: white;
    user-select: none;
  }

  @media (min-aspect-ratio: 3/4) {
    .quote-container {
      margin-top: -200px;
      margin-right: -250px;
      width: 400px;
      height: 350px;
    }
    .quote-text {
      font-size: 30px;
      margin: 30px;
    }
  }
</style>

<div class="quote-container">
  {#if visible}
    <div
      class="scale-container"
      in:scale={{ duration: 500, delay: 0, start: 0, easing: backOut }}
      out:scale={{ duration: 500, delay: 0, easing: backIn }}
    >
      <h2 class="quote-text">{text}</h2>
    </div>
  {/if}
</div>
