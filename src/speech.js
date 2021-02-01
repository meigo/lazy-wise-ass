import { getRandomWikiQuote } from './wikiquote';

let ss;
let ssu;

let voices = [];

let pitch = 0.5;
let rate = 0.8;
let selectedVoiceIndex = 3;

export function init() {
  ss = speechSynthesis;
  ssu = new SpeechSynthesisUtterance();

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = getVoices;
  }

  return ssu;
}

const getVoices = async () => {
  return new Promise((resolve) => {
    voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

//----------------------------------------------------------------------------------------------------------------------

export function speak(text) {
  ss.cancel();
  ssu.voice = voices[selectedVoiceIndex];
  ssu.volume = 1;
  ssu.rate = rate;
  ssu.pitch = pitch;
  ssu.text = text;
  ss.speak(ssu);
}

export function hush() {
  ss.cancel();
}

//----------------------------------------------------------------------------------------------------------------------

export async function getQuote() {
  const { person, quote } = await getRandomWikiQuote();

  if (quote) {
    const writtenQuote = quote.replace(/^(.{100}[^\s]*).*/, '$1');
    const spokenQuote = quote.replace(/^(.{50}[^\s]*).*/, '$1');
    const ellipses = quote.length > writtenQuote.length ? '...' : '';
    return { spokenQuote: person + '.' + spokenQuote, writtenQuote: person + ':\n' + writtenQuote + ellipses };
  }
  return { spokenQuote: '', writtenQuote: '' };
}

//----------------------------------------------------------------------------------------------------------------------

const resignTexts = ['whatever', "doesn't matter", 'who cares'];

export function getRandomResignText() {
  return resignTexts[Math.floor(Math.random() * resignTexts.length)];
}
