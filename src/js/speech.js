import { getRandomWikiQuote } from './wikiquote.js';

let ss;
let ssu;

let voices = [];

let pitch = 0.2;
let rate = 0.8;
let voiceIndex = 0;

export let _isSpeechSupported;
export let isSpeechInitialized;

export function isSpeechSupported() {
  return _isSpeechSupported;
}

export function init(speechEndHandler) {
  _isSpeechSupported = typeof speechSynthesis !== 'undefined';
  isSpeechInitialized = true;
  if (!_isSpeechSupported) return;

  ss = speechSynthesis;
  if ('onvoiceschanged' in speechSynthesis) ss.onvoiceschanged = getVoices;

  ssu = new SpeechSynthesisUtterance();
  ssu.onend = speechEndHandler;
}

async function getVoices() {
  return new Promise((resolve) => {
    voices = speechSynthesis.getVoices();
    if (voices.length) {
      voiceIndex = findVoiceIndex(voices);
      resolve(voices);
      return;
    }
  });
}

function findVoiceIndex(voices) {
  let index = voices.findIndex((voice) => voice.name === 'Google Deutsch'); // Chrome
  if (index > -1) return index;

  index = voices.findIndex((voice) => voice.name.startsWith('Microsoft George')); // Edge
  if (index > -1) return index;

  index = voices.findIndex((voice) => voice.name.startsWith('Microsoft Hazel')); // Opera, Firefox, Brave
  if (index > -1) return index;

  return 0;
}

//----------------------------------------------------------------------------------------------------------------------

export function speak(text) {
  if (!_isSpeechSupported) return;

  ss.cancel();
  ssu.voice = voices[voiceIndex];
  ssu.volume = 1;
  ssu.rate = rate;
  ssu.pitch = pitch;
  ssu.text = text;
  ss.speak(ssu);
}

export function hush() {
  if (!_isSpeechSupported) return;

  ss.cancel();
}

//----------------------------------------------------------------------------------------------------------------------

export async function getQuote() {
  const { person, quote, personPageUrl } = await getRandomWikiQuote();

  if (quote) {
    const writtenQuote = quote.replace(/^(.{100}[^\s]*).*/, '$1');
    const spokenQuote = quote.replace(/^(.{50}[^\s]*).*/, '$1');
    const ellipses = quote.length > writtenQuote.length ? '...' : '';
    return {
      spokenQuote: person + '.' + spokenQuote,
      writtenQuote: person + ':\n' + writtenQuote + ellipses,
      personPageUrl: personPageUrl,
    };
  }
  return { spokenQuote: '', writtenQuote: '', personPageUrl: '' };
}

//----------------------------------------------------------------------------------------------------------------------

const resignTexts = ['whatever', "doesn't matter", 'who cares'];

export function getRandomResignText() {
  return resignTexts[Math.floor(Math.random() * resignTexts.length)];
}
