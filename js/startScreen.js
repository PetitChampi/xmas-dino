let input = document.querySelector("[data-nickname]")
let playBtn = document.querySelector("[data-play-btn]")
let nameError = document.querySelector("[data-noname]")
let avatarElems = document.querySelectorAll(".avatar")
let green = document.querySelector("[data-green]")
let yellow = document.querySelector("[data-yellow]")
let red = document.querySelector("[data-red]")
let reinier = document.querySelector("[data-reinier]")
let nickname = localStorage.getItem("nickname") || ""
let avatar = localStorage.getItem("avatar") || "reinier"

input.value = nickname
initAvatar(avatar)

document.addEventListener("click", chooseAvatar)

input.addEventListener("input", () => {
  if (!nameError.classList.contains("hide")) nameError.classList.add('hide')
  nickname = input.value.trim()
  localStorage.setItem("nickname", nickname)
})

input.addEventListener('keydown', (e) => {
  if(['<','>'].indexOf(e.key) !== -1) {
    e.preventDefault()
  }
})

playBtn.addEventListener("click", e => {
  e.preventDefault()
  if (nickname === "") {
    nameError.classList.remove('hide')
  } else window.location.href = "game.html"
})

function initAvatar(avtr) {
  switch (avtr) {
    case "green":
      avtr = green
      break
    case "reinier":
      avtr = reinier
      break
    case "yellow":
      avtr = yellow
      break
    case "red":
      avtr = red
      break
  }
  avtr.classList.add("avatar-focus")
}

function chooseAvatar(e) {
  if (e.target != green &&
  e.target != reinier &&
  e.target != yellow &&
  e.target != red) return

  avatarElems.forEach(elem => {
    if (elem.classList.contains("avatar-focus")) elem.classList.remove("avatar-focus")
  })

  e.target.classList.add("avatar-focus")

  switch (e.target) {
    case green:
      avatar = 'green'
      break
    case reinier:
      avatar = 'reinier'
      break
    case yellow:
      avatar = 'yellow'
      break
    case red:
      avatar = 'red'
      break
    default:
      avatar = "reinier"
  }
  localStorage.setItem("avatar", avatar)
}

console.log(nickname + " + " + avatar)