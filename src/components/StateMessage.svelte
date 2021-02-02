<script>
  import { scale } from 'svelte/transition';
  import { backIn, backOut } from 'svelte/easing';

  export let message;
  export let error = false;

  $: text = error ? error : message;
</script>

<style>
  .state-message {
    position: fixed;
    display: block;
    margin: 10px auto;
    padding: 5px 10px;
    font-size: 0.8rem;
    bottom: 0;
    text-align: center;
    background-color: #ddd;
    color: white;
    border-radius: 5px;
  }
  .error {
    background-color: tomato;
  }
</style>

{#key text}
  <p
    class="state-message"
    class:error
    in:scale={{ duration: 200, start: 0, easing: backOut }}
    out:scale={{ duration: 200, easing: backIn }}
  >
    {text}
  </p>
{/key}
