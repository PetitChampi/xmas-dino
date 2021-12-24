import { setCustomProperty, getCustomProperty, incrementCustomProperty } from "./updateCustomProperty.js"

// Has to be the same speed as the ground
const SPEED = .05
const OBSTACLE_INTERVAL_MIN = 1000
const OBSTACLE_INTERVAL_MAX = 2000
const worldElem = document.querySelector("[data-world")

let nextObstacleTime
export function setupObstacle() {
  nextObstacleTime = OBSTACLE_INTERVAL_MIN
  // remove all obstacles already on screen after lost game
  document.querySelectorAll("[data-obstacle]").forEach(obs => {
    obs.remove()
  })
}

export function updateObstacle(delta, speedScale) {
  document.querySelectorAll("[data-obstacle]").forEach(cactus => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1)
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove()
    }
  })

  if (nextObstacleTime <= 0) {
    createObstacle()
    nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale
  }
  nextObstacleTime -= delta
}

export function getObstacleRects() {
  return [...document.querySelectorAll("[data-obstacle]")].map(obs => {
    return obs.getBoundingClientRect()
  })
}

function createObstacle() {
  const cactus = document.createElement("img")
  cactus.dataset.cactus = true
  cactus.dataset.obstacle = true
  if (Math.floor(Math.random() * 2) == 0) cactus.src = "imgs/obstacle-tree-decorated.png"
  else cactus.src = "imgs/obstacle-tree-naked.png"
  cactus.classList.add("cactus")
  setCustomProperty(cactus, "--left", 100)

  const ptero = document.createElement("img")
  ptero.dataset.ptero = true
  ptero.dataset.obstacle = true
  if (Math.floor(Math.random() * 2) == 0) ptero.src = "imgs/obstacle-gift.png"
  else ptero.src = "imgs/obstacle-reindeer.png"
  ptero.classList.add("ptero")
  setCustomProperty(ptero, "--left", 100)

  if (Math.floor(Math.random() * 2) == 0) worldElem.append(cactus)
  else worldElem.append(ptero)
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}