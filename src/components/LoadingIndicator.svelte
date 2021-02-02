<style>
  .la-ball-pulse,
  .la-ball-pulse > div {
    position: relative;
    box-sizing: border-box;
  }

  .la-ball-pulse {
    display: block;
    font-size: 0;
    color: black;
  }

  .la-ball-pulse > div {
    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
  }

  .la-ball-pulse {
    width: 54px;
    height: 18px;
  }

  .la-ball-pulse > div:nth-child(1) {
    animation-delay: -200ms;
  }

  .la-ball-pulse > div:nth-child(2) {
    animation-delay: -100ms;
  }

  .la-ball-pulse > div:nth-child(3) {
    animation-delay: 0ms;
  }

  .la-ball-pulse > div {
    width: 10px;
    height: 10px;
    margin: 4px;
    border-radius: 100%;

    animation: ball-pulse 1s ease infinite;
  }

  /*
 * Animation
 */
  @-webkit-keyframes ball-pulse {
    0%,
    60%,
    100% {
      opacity: 1;

      transform: scale(1);
    }
    30% {
      opacity: 0.1;

      transform: scale(0.01);
    }
  }
  @-moz-keyframes ball-pulse {
    0%,
    60%,
    100% {
      opacity: 1;

      transform: scale(1);
    }
    30% {
      opacity: 0.1;

      transform: scale(0.01);
    }
  }
  @-o-keyframes ball-pulse {
    0%,
    60%,
    100% {
      opacity: 1;

      transform: scale(1);
    }
    30% {
      opacity: 0.1;

      transform: scale(0.01);
    }
  }
  @keyframes ball-pulse {
    0%,
    60%,
    100% {
      opacity: 1;

      transform: scale(1);
    }
    30% {
      opacity: 0.1;

      transform: scale(0.01);
    }
  }
</style>

<div class="la-ball-pulse">
  <div />
  <div />
  <div />
</div>
