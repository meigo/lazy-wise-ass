import { tweened } from 'svelte/motion';
import { backOut } from 'svelte/easing';
import { spine } from './spine-webgl.js';

let atlasFile = 'spine/wise-ass.atlas';
let skelFile = 'spine/wise-ass.skel';

let canvas;
let gl;
let shader;
let batcher;
let mvp = new spine.webgl.Matrix4();
let assetManager;
let skeleton;
let skeletonRenderer;
let animationStateData;
let animationState;

let lastFrameTime;
let character = {};

//----------------------------------------------------------------------------------------------------------------------

export async function init(ctx) {
  try {
    canvas = ctx.canvas;

    const config = { alpha: true };
    gl = canvas.getContext('webgl', config) || canvas.getContext('experimental-webgl', config);
    if (!gl) {
      return Promise.reject('WebGL is unavailable.');
    }

    // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
    shader = spine.webgl.Shader.newTwoColoredTextured(gl);
    batcher = new spine.webgl.PolygonBatcher(gl);
    mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
    skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
    assetManager = new spine.webgl.AssetManager(gl);
  } catch (e) {
    return Promise.reject(e);
  }
}

//----------------------------------------------------------------------------------------------------------------------

async function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

export async function loadAssets() {
  if (assetManager.toLoad == 0 && assetManager.loaded == 0) {
    assetManager.loadBinary(skelFile);
    assetManager.loadTextureAtlas(atlasFile);
  }
  while (true) {
    if (assetManager.hasErrors()) {
      return Promise.reject(Object.values(assetManager.getErrors()));
    }
    if (assetManager.isLoadingComplete()) {
      return;
    } else await nextFrame();
  }
}

//----------------------------------------------------------------------------------------------------------------------

export async function setup() {
  // Load the texture atlas from the AssetManager.
  const atlas = assetManager.get(atlasFile);

  // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);

  // Create a SkeletonBinary instance for parsing the .skel file.
  const skeletonBinary = new spine.SkeletonBinary(atlasLoader);

  // Set the scale to apply during parsing, parse the file, and create a new skeleton.
  skeletonBinary.scale = 1;
  const skeletonData = skeletonBinary.readSkeletonData(assetManager.get(skelFile));
  skeleton = new spine.Skeleton(skeletonData);

  const bounds = calculateSetupPoseBounds(skeleton);

  // Create an AnimationState.
  animationStateData = new spine.AnimationStateData(skeleton.data);
  animationStateData.setMix('sleep', 'wake', 0.3);
  animationStateData.setMix('wake', 'talk', 0.3);
  animationStateData.setMix('wake', 'resign-talk', 0.3);
  animationStateData.setMix('talk', 'hesitate', 0.3);
  animationStateData.setMix('hesitate', 'resign-talk', 0.3);
  animationStateData.setMix('resign-talk', 'sleep', 1);

  animationState = new spine.AnimationState(animationStateData);

  character = { skeleton, state: animationState, bounds, premultipliedAlpha: true };

  return { character };
}

function calculateSetupPoseBounds(skeleton) {
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform();
  let offset = new spine.Vector2();
  let size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);
  return { offset, size };
}

//----------------------------------------------------------------------------------------------------------------------

export async function start() {
  lastFrameTime = Date.now() / 1000;
  resize();
  render();
  return true;
}

//----------------------------------------------------------------------------------------------------------------------

function render() {
  let now = Date.now() / 1000;
  let delta = now - lastFrameTime;
  lastFrameTime = now;

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Apply the animation state based on the delta time.
  let skeleton = character.skeleton;
  let state = character.state;
  let premultipliedAlpha = character.premultipliedAlpha;
  state.update(delta);
  state.apply(skeleton);
  skeleton.updateWorldTransform();

  // Bind the shader and set the texture and model-view-projection matrix.
  shader.bind();
  shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
  shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

  // Start the batch and tell the SkeletonRenderer to render the active skeleton.
  batcher.begin(shader);
  skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
  skeletonRenderer.draw(batcher, skeleton);
  batcher.end();

  shader.unbind();

  requestAnimationFrame(render);
}

export function resize() {
  // Calculations to center the skeleton in the canvas.
  let bounds = character.bounds;
  let centerX = bounds.offset.x + bounds.size.x / 2;
  let centerY = bounds.offset.y + bounds.size.y / 2;
  let scaleX = bounds.size.x / canvas.width;
  let scaleY = bounds.size.y / canvas.height;

  let scale = Math.max(scaleX, scaleY) * 1.5;
  if (scale < 1) scale = 1;
  let width = canvas.width * scale;
  let height = canvas.height * scale;

  mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
  gl.viewport(0, 0, canvas.width, canvas.height);
}

//----------------------------------------------------------------------------------------------------------------------
// ANIMATION
//----------------------------------------------------------------------------------------------------------------------

const animations = {
  sleep: { track: 0, name: 'sleep', loop: true, mixBlend: 'replace', entry: null },
  wake: { track: 0, name: 'wake', loop: false, mixBlend: 'replace', entry: null },
  talk: { track: 0, name: 'talk', loop: true, mixBlend: 'replace', entry: null },
  hesitate: { track: 0, name: 'hesitate', loop: false, mixBlend: 'replace', entry: null },
  resignTalk: { track: 0, name: 'resign-talk', loop: false, mixBlend: 'replace', entry: null },
  eyesBlink: { track: 1, name: 'eyes-blink', loop: true, mixBlend: 'replace', entry: null },
  talkMouth: { track: 2, name: 'talk-mouth', loop: true, mixBlend: 'replace', entry: null },
  headFront: { track: 3, name: 'head-front', loop: false, mixBlend: 'replace', entry: null },
  fly: { track: 4, name: 'fly', loop: true, mixBlend: 'replace', entry: null },
  flyWings: { track: 5, name: 'fly-wings', loop: true, mixBlend: 'replace', entry: null },
};

function setAnimation(animation) {
  animation.entry = animationState.setAnimation(animation.track, animation.name, animation.loop);
  animation.entry.mixBlend = spine.MixBlend[animation.mixBlend];
}

function setSmoothInAnimation(animation, delay = 0, mixDuration = 0) {
  animationState.setEmptyAnimation(animation.track, 0); // To force animation to be mixed in smoothly http://esotericsoftware.com/spine-applying-animations
  animation.entry = animationState.addAnimation(animation.track, animation.name, animation.loop, delay);
  animation.entry.mixDuration = mixDuration;
  // animation.entry.mixBlend = spine.MixBlend.replace;
}

function setSmoothOutAnimation(animation, delay = 0, mixDuration = 0) {
  animationState.addEmptyAnimation(animation.track, mixDuration, delay); // Mix an animation out to the setup pose
  animation.entry = null;
}

function clearAnimation(animation) {
  animationState.clearTrack(animation.track);
}

//----------------------------------------------------------------------------------------------------------------------

const headTurnAlphaStore = tweened(0, {
  duration: 400,
  easing: backOut,
});

headTurnAlphaStore.subscribe((value) => {
  if (animations.headFront.entry) animations.headFront.entry.alpha = value;
});

function addTweenedHeadTurns() {
  animations.hesitate.entry.listener = {
    event: function (entry, event) {
      if (event.data.name === 'head-front') {
        headTurnAlphaStore.set(event.floatValue);
      }
    },
  };
}

//----------------------------------------------------------------------------------------------------------------------

export function sleepAnimation() {
  setAnimation(animations.sleep);
  clearAnimation(animations.talkMouth);
  setSmoothOutAnimation(animations.flyWings, 0, 4);
  setSmoothOutAnimation(animations.fly, 2, 4);
}

export function wakeAnimation() {
  setAnimation(animations.wake);
  setAnimation(animations.flyWings);
  setSmoothInAnimation(animations.fly, 0, 0.5);
}

export function talkAnimation() {
  setAnimation(animations.talk);
  setAnimation(animations.talkMouth);
  setAnimation(animations.eyesBlink);
}

export function hesitateAnimation() {
  setAnimation(animations.hesitate);
  clearAnimation(animations.eyesBlink);
  clearAnimation(animations.talkMouth);

  setAnimation(animations.headFront);
  animations.headFront.entry.alpha = 0;
  addTweenedHeadTurns();
}

export function resignTalkAnimation() {
  setAnimation(animations.resignTalk);
  setAnimation(animations.talkMouth);
  setSmoothOutAnimation(animations.headFront, 0, 0.3);
}
