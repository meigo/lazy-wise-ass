<script>
  import { scale } from 'svelte/transition';
  import { backIn, backOut } from 'svelte/easing';

  export let visible;
  export let text;
  export let url;
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
  }
  .text-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
    /* user-select: none; */
  }

  svg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: fill;
  }

  .bg {
    fill: black;
  }

  a:hover .bg {
    fill: #222;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }

  @media (min-aspect-ratio: 3/4) and (max-aspect-ratio: 1/1) {
    .quote-container {
      margin-top: -35vh;
      margin-right: -35vh;
      width: 40vh;
      height: 45vh;
    }
    .quote-text {
      font-size: 3.5vh;
      letter-spacing: 0.25vh;
      margin: 0 4vw;
    }
  }

  @media (min-aspect-ratio: 1/1) {
    .quote-container {
      margin-top: -35vh;
      margin-right: -30vh;
      width: 50vh;
      height: 40vh;
    }
    .quote-text {
      font-size: 3.5vh;
      letter-spacing: 0.25vh;
      margin: 0 5vh;
    }
  }
</style>

<div class="quote-container">
  {#if visible}
    <a href={url} target="_blank">
      <div
        class="scale-container"
        in:scale={{ duration: 500, delay: 0, start: 0, easing: backOut }}
        out:scale={{ duration: 500, delay: 0, easing: backIn }}
      >
        <svg
          viewBox="0 0 500 400"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <path
            class="bg"
            d="M465.453 4.888c4.226-.19 8.375-1.687 12.628-1.135 7.31.184 13.603 7.558 13.541 15.256.007 6.77-.484 13.54-.256 20.31-.442 6.49.484 12.942.242 19.425.892 4.486.595 9.046.498 13.584.788 15.33.083 28.184.63 43.514-.256 9.12.048 18.246.553 27.344.477 21.245 1.805 42.482 1.535 63.75.235 9.163.041 18.327.256 27.498.228 10.093-.16 20.2.325 30.291-.29 8.48.076 16.958.027 25.444.574 7.706-.159 15.44.505 23.138.637 14.483.132 28.98.574 43.463.139.972.38 1.922.726 2.858v17.318c-1.334 2.74-2.614 5.732-5.096 7.522-1.778 1.318-3.513 2.762-5.491 3.727-2.283.413-4.634.177-6.881.825-3.375.796-7.262 1.62-10.16-.935-1.369.626-2.607 1.797-4.17 1.672-22.876.08-45.76.14-68.63.339-7.082-.369-14.164.316-21.245-.126-57.85 0-115.726.376-173.569 1.842-2.551-.28-5.103-.14-7.641.191-13.797.34-27.594.53-41.39.737-7.87.685-15.782.015-23.645.715-3.88.235-7.76-.089-11.632-.162-10.194.228-20.387.677-30.588.464-5.519.552-11.044-.236-16.57.088-3.693.221-7.372-.25-11.058-.243-6.687.243-13.368-.17-20.055-.044-8.396-.45-16.964.464-25.18-1.857-2.635-.854-5.512-1.642-7.455-3.86-1.293-1.834-1.542-4.206-2.4-6.261-1.805-4.442-1.556-9.473-.546-14.092 1.051-4.501.131-9.142.463-13.702.36-4.913-.719-9.76-.747-14.666-.069-4.442-.421-8.877-.172-13.32.276-5.148-.478-10.32.22-15.447.533-4.22-.283-8.478.381-12.685.567-3.38-1.494-6.563-.788-9.922.913-5.164.864-10.446.954-15.684.844-19.882-.214-39.793-.885-59.668.45-9.267-.456-18.527-.104-27.794-.09-14.777.367-29.569.643-44.353-.076-5.164.07-10.336.27-15.5.484-21.37.609-42.74.768-64.117-.325-7.838.2-15.698-.533-23.514.194-4.722-.235-9.407-.643-14.107-.567-4 1.819-7.47 3.403-10.865 2.773-4.325 7.814-5.386 12.316-6.691 14.295-.957 28.59.112 42.891.198 11.272.185 22.566.193 33.859.191 8.077.01 16.134.237 24.218.2 11.01.17 22.027.314 33.043.461 10.34.226 20.713.117 31.058.249 35.16.066 70.298-.404 105.436-.675 8.493.035 16.985-.17 25.477-.12 10.125-.195 20.277-.109 30.415-.158 22.794-.187 45.616-.156 68.396-.465 11.1-.09 45.27-.17 51.28-.446z"
          />
        </svg>
        <div class="text-container">
          <h2 class="quote-text">{text}</h2>
        </div>
      </div>
    </a>
  {/if}
</div>
