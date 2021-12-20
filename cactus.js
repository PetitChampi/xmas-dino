import { setCustomProperty, getCustomProperty, incrementCustomProperty } from "./updateCustomProperty.js"

// Has to be the same speed as the ground
const SPEED = .05
const OBSTACLE_INTERVAL_MIN = 700
const OBSTACLE_INTERVAL_MAX = 2000
const worldElem = document.querySelector("[data-world")

let nextObstacleTime
export function setupObstacle() {
  nextObstacleTime = OBSTACLE_INTERVAL_MIN
  // remove all obstacles already on screen after lost game
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    cactus.remove()
  })
  document.querySelectorAll("[data-ptero]").forEach(ptero => {
    ptero.remove()
  })
}

export function updateCactus(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1)
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove()
    }
  })
  document.querySelectorAll("[data-ptero]").forEach(ptero => {
    incrementCustomProperty(ptero, "--left", delta * speedScale * SPEED * -1)
    if (getCustomProperty(ptero, "--left") <= -100) {
      ptero.remove()
    }
  })

  if (nextObstacleTime <= 0) {
    createObstacle()
    nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale
  }
  nextObstacleTime -= delta
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
    return cactus.getBoundingClientRect()
  })
}
export function getPteroRects() {
  return [...document.querySelectorAll("[data-ptero]")].map(ptero => {
    return ptero.getBoundingClientRect()
  })
}

function createObstacle() {
  const cactus = document.createElement("img")
  cactus.dataset.cactus = true
  cactus.src = "imgs/cactus.png"
  cactus.classList.add("cactus")
  setCustomProperty(cactus, "--left", 100)

  const ptero = document.createElement("img")
  ptero.dataset.ptero = true
  ptero.src = "imgs/cactus.png"
  ptero.classList.add("ptero")
  setCustomProperty(ptero, "--left", 100)

  if (Math.floor(Math.random() * 2) == 0) worldElem.append(cactus)
  else worldElem.append(ptero)
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}