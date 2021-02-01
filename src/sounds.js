const sounds = {
  pop: new Audio('sound/pop.mp3'),
  snore: [new Audio('sound/snore1.mp3'), new Audio('sound/snore2.mp3')],
};

export function playSound(name, delay = 0) {
  let sound;
  switch (name) {
    case 'snore':
      sound = getRandomGroupSound('snore');
      sound.playbackRate = getRandomRange(1, 2);
      sound.volume = getRandomRange(0.2, 0.7);
      break;
    default:
      sound = sounds[name];
  }
  if (sound) {
    sound.currentTime = 0;
    if (delay > 0) {
      setTimeout(() => sound.play(), delay);
    } else {
      sound.play();
    }
  }
}

function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomGroupSound(name) {
  return sounds[name][Math.floor(Math.random() * sounds[name].length)];
}
