const sounds = {
  snore: [new Audio('sound/snore1.mp3'), new Audio('sound/snore2.mp3')],
};

export function playSound(name) {
  let sound;
  switch (name) {
    case 'snore':
      sound = sounds.snore[Math.floor(Math.random() * sounds.snore.length)];
      sound.playbackRate = getRandomRange(1, 2);
      sound.volume = getRandomRange(0.2, 0.7);
  }
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}
