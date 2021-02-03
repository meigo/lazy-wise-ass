import { createMachine, action, guard, immediate, invoke, state, transition, reduce } from 'robot3';
import { useMachine } from 'svelte-robot-factory';

import { isSpeechSupported, getQuote, speak, getRandomResignText } from './speech.js';
import {
  init,
  loadAssets,
  setup,
  start,
  sleepForeverAnimation,
  sleepAnimation,
  wakeAnimation,
  talkAnimation,
  resignTalkAnimation,
  hesitateAnimation,
} from './spine.js';

//----------------------------------------------------------------------------------------------------------------------

// const context = (e) => ({});

// const fail = () => Promise.reject("Error");

// const logAction = (msg) => action((ctx) => console.log(msg));

// const logTransition = (event, state, ...args) => transition(event, state, logAction(state), ...args);

// const animationTransition = (event, state, animationAction, ...args) =>
//   transition(event, state, action(animationAction), logAction(state), ...args);

const wait = (ms) => () => new Promise((resolve) => setTimeout(resolve, ms));

const invokeState = (func, doneState, errorState = 'error', ...args) =>
  invoke(
    func,
    transition(
      'done',
      doneState,
      reduce((ctx, e) => ({ ...ctx, ...e.data, error: null })),
      ...args
    ),
    transition(
      'error',
      errorState,
      reduce((ctx, e) => ({ ...ctx, error: e.error })),
      action((ctx) => console.log(ctx.error))
    )
  );

//--------------------------------------------------------------------------------------------------------------------

const machine = createMachine({
  start: state(
    transition(
      'init',
      'initializing',
      reduce((ctx, e) => ({ ...ctx, canvas: e.canvas }))
    )
  ),

  error: state(),

  initializing: invokeState(init, 'loadingAssets', 'error'),

  loadingAssets: invokeState(loadAssets, 'assetsLoaded', 'error'),

  assetsLoaded: invokeState(setup, 'settingUp', 'error'),

  settingUp: invokeState(start, 'ready', 'error'),

  ready: state(
    immediate(
      'sleeping',
      action(sleepAnimation),
      reduce((ctx, e) => ({ ...ctx, canvasVisible: true }))
    )
  ),

  sleeping: state(
    transition(
      'wake',
      'validatingSpeechSupport',
      reduce((ctx, e) => {
        delete ctx.writtenQuote;
        delete ctx.spokenQuote;
        delete ctx.personPageUrl;
        return ctx;
      })
    )
  ),

  validatingSpeechSupport: state(
    immediate('waking', guard(isSpeechSupported)),
    immediate(
      'error',
      action(sleepForeverAnimation),
      reduce((ctx, e) => ({ ...ctx, error: 'Speech synthesis not supported, sleeping forever!' }))
    )
  ),

  waking: state(
    immediate(
      'loadingQuote',
      action(wakeAnimation),
      action((ctx) => speak('ooh'))
    )
  ),

  loadingQuote: invokeState(getQuote, 'quoteLoaded', 'quoteError'),

  quoteLoaded: state(
    // Quote is valid
    immediate(
      'talking',
      guard((ctx) => ctx.writtenQuote),
      action(talkAnimation),
      action((ctx) => speak(ctx.spokenQuote)),
      reduce((ctx, e) => ({ ...ctx, isResigning: false, isBubbleVisible: true }))
    ),
    // Quote not valid
    immediate('quoteError')
  ),

  quoteError: state(
    immediate(
      'hesitating',
      action(hesitateAnimation),
      reduce((ctx, e) => ({ ...ctx, isResigning: true, resignText: 'I cannot find any words' }))
    )
  ),

  talking: state(
    transition(
      'hesitate',
      'hesitating',
      action(hesitateAnimation),
      action(() => speak('hmm')),
      reduce((ctx, e) => ({ ...ctx, isResigning: true, resignText: getRandomResignText() }))
    )
  ),

  hesitating: invoke(
    wait(1000),
    transition(
      'done',
      'resignTalking',
      action(resignTalkAnimation),
      action((ctx) => speak(ctx.resignText))
    )
  ),

  resignTalking: state(transition('talkDone', 'doneTalking')),

  doneTalking: state(
    immediate(
      'sleeping',
      action(sleepAnimation),
      reduce((ctx, e) => ({ ...ctx, isBubbleVisible: false }))
    )
  ),
});

const service = useMachine(machine, {});

export default service;
