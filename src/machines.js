import { createMachine, action, guard, immediate, invoke, state, transition, reduce } from 'robot3';
import { useMachine } from 'svelte-robot-factory';

import { getQuote, speak, getConclusion } from './speech';
import {
  init,
  loadAssets,
  setup,
  start,
  sleepAnimation,
  wakeAnimation,
  talkAnimation,
  talkPauseAnimation,
} from './spine.js';

//--------------------------------------------------------------------------------------------------------------------

// const context = (e) => ({});
// const fail = () => Promise.reject("Error");

const wait = (ms) => () => new Promise((resolve) => setTimeout(resolve, ms));

const logAction = (msg) => action((ctx) => console.log(msg));

const animationTransition = (event, state, animationAction, ...args) =>
  transition(event, state, action(animationAction), logAction(state), ...args);

const invokeState = (func, doneState, errorState = 'error', ...args) =>
  invoke(
    func,
    transition(
      'done',
      doneState,
      reduce((ctx, e) => ({ ...ctx, ...e.data })),
      logAction(doneState),
      ...args
    ),
    transition(
      'error',
      errorState,
      reduce((ctx, e) => ({ ...ctx, error: e.error })),
      logAction('error')
    )
  );

const logTransition = (event, state, ...args) => transition(event, state, logAction(state), ...args);

//--------------------------------------------------------------------------------------------------------------------

const machine = createMachine({
  start: state(
    logTransition(
      'init',
      'initializing',
      reduce((ctx, e) => ({ ...ctx, canvas: e.canvas }))
    )
  ),

  error: state(immediate('sleep')),

  initializing: invokeState(init, 'loadingAssets', 'error'),

  loadingAssets: invokeState(loadAssets, 'assetsLoaded'),

  assetsLoaded: invokeState(setup, 'settingUp'),

  settingUp: invokeState(start, 'ready'),

  ready: state(
    immediate(
      'sleeping',
      reduce((ctx, e) => ({ ...ctx, canvasVisible: true })),
      action(sleepAnimation)
    )
  ),

  sleeping: state(
    logTransition(
      'wake',
      'waking',
      reduce((ctx, e) => {
        delete ctx.quote;
        delete ctx.spokenQuote;
        return ctx;
      })
    )
  ),

  waking: state(
    immediate(
      'loadingQuote',
      action(wakeAnimation),
      action((ctx) => speak('oops')),
      logAction('loadingQuote')
    )
  ),

  loadingQuote: invokeState(getQuote, 'quoteLoaded', 'sleeping'), // If success, quote added to ctx else sleep

  quoteLoaded: state(
    // Quote valid
    immediate(
      'talking',
      guard((ctx) => ctx.quote),
      action(talkAnimation),
      action((ctx) => speak(ctx.spokenQuote)),
      logAction('talking'),
      reduce((ctx, e) => ({ ...ctx, closing: false, isBubbleVisible: true }))
    ),
    // Quote not valid
    immediate(
      'talkingPaused',
      reduce((ctx, e) => ({ ...ctx, closing: true }))
    )
  ),

  talking: state(
    animationTransition(
      'pauseTalk',
      'talkingPaused',
      talkPauseAnimation,
      action((ctx) => speak('hmm')),
      reduce((ctx, e) => ({ ...ctx, closing: true }))
    )
  ),

  talkingPaused: invoke(
    wait(1000),
    animationTransition(
      'done',
      'closingTalk',
      talkAnimation,
      action((ctx) => speak(getConclusion()))
    )
  ),

  closingTalk: state(transition('talkDone', 'doneTalking')),

  doneTalking: state(
    immediate(
      'sleeping',
      action(sleepAnimation),
      logAction('doneTalking'),
      reduce((ctx, e) => ({ ...ctx, isBubbleVisible: false }))
    )
  ),
});

const service = useMachine(machine, {});

export default service;
