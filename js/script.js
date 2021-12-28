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
const WORLD_HEIGHT = 50
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world")
const scoreElem = document.querySelector("[data-score")
const hiScoreElem = document.querySelector("[data-hiscore")
const nicknameElem = document.querySelector("[data-nickname")
const overlayElem = document.querySelector("[data-overlay")
const startScreenElem = document.querySelector("[data-start-screen")

// end screen elems
const endScreenElem = document.querySelector("[data-end-screen")
const endScreenGameoverElem = document.querySelector("[data-end-screen-gameover")
const endScreenBoardElem = document.querySelector("[data-end-screen-scoreboard")
const endScreenCreditsElem = document.querySelector("[data-end-screen-credits")
const endScreenShareElem = document.querySelector("[data-end-screen-share")
const closeBoardElem = document.querySelectorAll("[data-close-board")
const seeBoardElem = document.querySelector("[data-view-scoreboard")
const creditsBtnElem = document.querySelector("[data-credits")
const shareBtnElem = document.querySelector("[data-share")

const scoreLineElem = document.querySelector("[data-score-line")
const controlsElem = document.querySelector("[data-controls")
const restartElem = document.querySelectorAll("[data-restart")
const scoreboardBody = document.querySelector("[data-scoreboard-body]")

nicknameElem.innerText = nickname

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState == 'hidden') documentHidden = true
})
document.addEventListener("keydown", handleStart, { once: true })
document.addEventListener("touchstart", handleStart, { once: true })
document.addEventListener("mousedown", handleStart, { once: true })
restartElem.forEach(elem => {
  elem.addEventListener("touchstart", handleStart)
  elem.addEventListener("mousedown", handleStart)
})
controlsElem.addEventListener("touchstart", e => e.preventDefault())
seeBoardElem.addEventListener("click", () => {
  endScreenBoardElem.classList.remove('hide')
  endScreenGameoverElem.classList.add('hide')
})
creditsBtnElem.addEventListener("click", () => {
  endScreenCreditsElem.classList.remove('hide')
  endScreenGameoverElem.classList.add('hide')
})
shareBtnElem.addEventListener("click", () => {
  endScreenShareElem.classList.remove('hide')
  endScreenGameoverElem.classList.add('hide')
})
closeBoardElem.forEach( elem => {
  elem.addEventListener("click", () => {
    if (!endScreenBoardElem.classList.contains("hide")) { endScreenBoardElem.classList.add('hide') }
    if (!endScreenCreditsElem.classList.contains("hide")) { endScreenCreditsElem.classList.add('hide') }
    if (!endScreenShareElem.classList.contains("hide")) { endScreenShareElem.classList.add('hide') }
    endScreenGameoverElem.classList.remove('hide')
  })
})

setupGround()

// let paused
let documentHidden
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

  if (documentHidden) return handleLose()
  // if (paused) return
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
  // paused = false
  documentHidden = false
  setupGround()
  setupDino()
  setupObstacle()
  startScreenElem.classList.add("hide")
    overlayElem.classList.remove("hide")
  if (!endScreenElem.classList.contains("hide")) endScreenElem.classList.add("hide")
  if (!overlayElem.classList.contains("hide")) overlayElem.classList.add("hide")
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
  setDinoLose()

  if (score > highScore) {
    highScore = Math.floor(score)
    postScore()
  }

  setTimeout(() => {
    scoreLineElem.innerText = Math.floor(score)
    endScreenElem.classList.remove("hide")
    overlayElem.classList.remove("hide")
    hiScoreElem.textContent = highScore
    getScoreboard()
  }, 50)
  // setTimeout(() => {
  //   let scoreboardRows = Array.from(scoreboardBody.getElementsByTagName("tr"))
  //   scoreboardRows.forEach(row => {
  //     if (row.innerText.includes(nickname)
  //     && row.innerText.includes(score)
  //     && row.innerText.includes(avatar)) {
  //       row.classList.add("score-highlighted")
  //       console.log('added class')
  //     }
  //   })
  // }, 60)
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

  // ajax.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     console.log(this.responseText)
  //   }
  // }
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
        // let character = data[i].avatar
        let score = data[i].score

        html += "<tr>"
        html += `<td>${String(i + 1).padStart(2, '0')}.</td>`
        html += `<td class="name">${nickname}</td>`
        // html += `<td><img style="object-fit:contain; height:30px; width:100%; text-align:center;" src="imgs/${character}/${character}-stationary.png""></td>`
        html += `<td class="align-right">${score}</td>`
        html += "</tr>"
      }

      scoreboardBody.innerHTML = html
    }
  }
}

// pauseElem.addEventListener('click', () => {
//   paused = true
// })
// resumeElem.addEventListener('click', () => {
//   paused = false
//   lastTime = null
//   window.requestAnimationFrame(update)
// })