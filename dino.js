import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = .45
const GRAVITY = .0015
// alternate the dino images
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  // removing the listener in case of a reset after lost game, to avoid duplicating it
  document.removeEventListener("keydown", onJump)
  document.removeEventListener("touchstart", onJump)
  document.removeEventListener("mousedown", onJump)
  document.addEventListener("keydown", onJump)
  document.addEventListener("touchstart", onJump)
  document.addEventListener("mousedown", onJump)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png"
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
  
  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onJump(e) {
  if ((e.code !== "Space" &&
      e.code !== "ArrowUp" &&
      e.type !== "touchstart" &&
      e.type !== "mousedown") ||
      isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
}