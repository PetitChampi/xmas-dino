import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const avatar = localStorage.getItem("avatar")

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = .45
const GRAVITY = .0015
// alternate the dino images
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

const jumpElem = document.querySelector("[data-jump]")
const duckElem = document.querySelector("[data-duck]")

dinoElem.src = `imgs/${avatar}/dino-stationary.png`
jumpElem.addEventListener("click", onJump)
duckElem.addEventListener("mousedown", onDuck)
duckElem.addEventListener("mouseup", onDuck)
duckElem.addEventListener("touchstart", onDuck)
duckElem.addEventListener("touchend", onDuck)

let isJumping
let isDucking
let dinoFrame
let currentFrameTime
let yVelocity

export function setupDino() {
  isJumping = false
  isDucking = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  // removing the listeners in case of a reset after lost game, to avoid duplicating it
  document.removeEventListener("keydown", onJump)
  document.removeEventListener("keydown", onDuck)
  document.removeEventListener("keyup", onDuck)
  document.removeEventListener("touchstart", onJump)
  document.removeEventListener("mousedown", onJump)
  // then addng them
  document.addEventListener("keydown", onJump)
  document.addEventListener("keydown", onDuck)
  document.addEventListener("keyup", onDuck)
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
  dinoElem.src = `imgs/${avatar}/dino-lose.png`
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/${avatar}/dino-stationary.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/${avatar}/dino-run-${dinoFrame}.png`
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
      e.target !== jumpElem) ||
      isJumping ||
      isDucking) return

  yVelocity = JUMP_SPEED
  isJumping = true
}

function onDuck(e) {
  if ((e.code !== "ArrowDown" &&
      e.target !== duckElem) ||
      isJumping) return

  if (e.type == "keydown" ||
      e.type == "mousedown" ||
      e.type == "touchstart") {
    setCustomProperty(dinoElem, "--bottom", -11)
    isDucking = true
  }
  if (e.type == "keyup" ||
      e.type == "mouseup" ||
      e.type == "touchend") {
    setCustomProperty(dinoElem, "--bottom", 0)
    isDucking = false
  }
}