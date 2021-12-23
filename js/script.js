import { setupGround, updateGround } from "./ground.js"
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js"
import { setupObstacle, updateObstacle, getObstacleRects } from "./cactus.js"

const nickname = localStorage.getItem("nickname")
const avatar = localStorage.getItem("avatar")
let highScore = localStorage.getItem("score")

console.log(nickname + " + " + avatar)

if (!nickname || !avatar) {
  window.location.replace("index.html")
}

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 40
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world")
const scoreElem = document.querySelector("[data-score")
const startScreenElem = document.querySelector("[data-start-screen")
const endScreenElem = document.querySelector("[data-end-screen")
const scoreLineElem = document.querySelector("[data-score-line")
const controlsElem = document.querySelector("[data-controls")
const restartElem = document.querySelector("[data-restart")
const scoreboardBody = document.querySelector("[data-scoreboard-body]")

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
  localStorage.setItem("score", Math.floor(score))
  console.log(localStorage.getItem("score"))
  setDinoLose()

  if (score > highScore) {
    highScore = Math.floor(score)
    postScore()
  }

  setTimeout(() => {
    scoreLineElem.innerText = `score: ${Math.floor(score)}\n high score: ${highScore}`
    endScreenElem.classList.remove("hide")
    getScoreboard()
  }, 50)
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

// -------------------------------------------------------
// -------------------- AJAX -----------------------------
// -------------------------------------------------------

function postScore() {
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

function getScoreboard() {
  let ajax = new XMLHttpRequest()
  let method = "GET"
  let url = "php/scoreboard.php"
  let asynchronous = true

  ajax.open(method, url, asynchronous)
  ajax.send()

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText)

      let html = ""
      
      for (let i = 0; i < data.length; i++) {
        let nickname = data[i].nickname
        let character = data[i].avatar
        let score = data[i].score

        html += "<tr>"
        html += `<td>${nickname}</td>`
        html += `<td><img style="object-fit:contain; height:30px; width:100%; text-align:center;" src="imgs/${character}/${character}-stationary.png""></td>`
        html += `<td>${score}</td>`
        html += "</tr>"
      }

      scoreboardBody.innerHTML = html
    }
  }
}