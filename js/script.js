import { setupGround, updateGround } from "./ground.js"
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js"
import { setupObstacle, updateObstacle, getObstacleRects } from "./cactus.js"

const nickname = localStorage.getItem("nickname")
const avatar = localStorage.getItem("avatar")
console.log(nickname + " " + avatar)

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world")
const scoreElem = document.querySelector("[data-score")
const startScreenElem = document.querySelector("[data-start-screen")
const endScreenElem = document.querySelector("[data-end-screen")
const scoreLineElem = document.querySelector("[data-score-line")
const controlsElem = document.querySelector("[data-controls")
const restartElem = document.querySelector("[data-restart")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })
document.addEventListener("touchstart", handleStart, { once: true })
document.addEventListener("mousedown", handleStart, { once: true })
restartElem.addEventListener("touchstart", handleStart)
restartElem.addEventListener("mousedown", handleStart)
controlsElem.addEventListener("touchstart", e => e.preventDefault())

setupGround()

let lastTime
let speedScale
let score
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateObstacle(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  if (checkLose()) return handleLose()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRect()
  return getObstacleRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
  score += delta * .01
  scoreElem.textContent = Math.floor(score)
}

function handleStart(e) {
  lastTime = null
  speedScale = 1
  score = 0
  setupGround()
  setupDino()
  setupObstacle()
  startScreenElem.classList.add("hide")
  if (!endScreenElem.classList.contains("hide")) endScreenElem.classList.add("hide")
  if (e.type == "touchstart") {
    controlsElem.classList.remove("hide")
    document.removeEventListener("keydown", handleStart)
    document.removeEventListener("mousedown", handleStart)
  }
  if (e.type == "mousedown") {
    document.addEventListener("touchend", () => {
      if (controlsElem.classList.contains("hide")) controlsElem.classList.remove("hide")
    })
    document.removeEventListener("touchstart", handleStart)
    document.removeEventListener("keydown", handleStart)
  }
  if (e.type == "keydown") {
    document.removeEventListener("touchstart", handleStart)
    document.removeEventListener("mousedown", handleStart)
  }
  window.requestAnimationFrame(update)
}

function handleLose() {
  setDinoLose()
  setTimeout(() => {
    scoreLineElem.innerText = `${nickname}'s score: ${Math.floor(score)}`
    endScreenElem.classList.remove("hide")
    if (!controlsElem.classList.contains("hide")) controlsElem.classList.add("hide")
  }, 50)
  
  // call ajax
  let data = { nickname: nickname, score: Math.floor(score), avatar: avatar }
  data = JSON.stringify(data)
  let ajax = new XMLHttpRequest()
  let method = "POST"
  let url = "php/register-score.php"
  let asynchronous = true

  ajax.open(method, url, asynchronous)
  ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  ajax.send(data)
}

function setPixelToWorldScale() {
  let worldToPixelScale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}