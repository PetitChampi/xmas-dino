let nameScreen = document.querySelector("[data-name-screen]")
let avtrScreen = document.querySelector("[data-avatar-screen]")
let input = document.querySelector("[data-nickname-input]")
let nameLine = document.querySelector("[data-nickname]")
let playBtn = document.querySelector("[data-play-btn]")
let nextBtn = document.querySelector("[data-next-btn]")
let changeNameBtn = document.querySelector("[data-change-name]")
let nameError = document.querySelector("[data-noname]")
let avatarElems = document.querySelectorAll(".avatar-grid-item")
let reinier = document.querySelector("[data-reinier]")
let esther = document.querySelector("[data-esther]")
let eva = document.querySelector("[data-eva]")
let sharyon = document.querySelector("[data-sharyon]")
let roberta = document.querySelector("[data-roberta]")
let nickname = localStorage.getItem("nickname") || ""
let avatar = localStorage.getItem("avatar") || "reinier"

input.value = nickname
nameLine.innerText = nickname
initAvatar(avatar)

reinier.addEventListener("click", chooseAvatar)
esther.addEventListener("click", chooseAvatar)
eva.addEventListener("click", chooseAvatar)
sharyon.addEventListener("click", chooseAvatar)
roberta.addEventListener("click", chooseAvatar)

input.addEventListener("input", () => {
  if (!nameError.classList.contains("hide")) nameError.classList.add('hide')
  nickname = input.value.trim()
})

input.addEventListener('keydown', (e) => {
  if(['<','>'].indexOf(e.key) !== -1) {
    e.preventDefault()
  }
})

nextBtn.addEventListener("click", e => {
  e.preventDefault()
  if (nickname == "") {
    nameError.classList.remove('hide')
    return
  }
  avtrScreen.classList.remove('hide')
  nameScreen.classList.add('hide')
  localStorage.setItem("nickname", nickname)
  nameLine.innerText = nickname
})

changeNameBtn.addEventListener("click", e => {
  e.preventDefault()
  avtrScreen.classList.add('hide')
  nameScreen.classList.remove('hide')
})

playBtn.addEventListener("click", e => {
  e.preventDefault()
  if (nickname === "") {
    nameError.classList.remove('hide')
  } else window.location.href = "game.html"
})

function initAvatar(avtr) {
  switch (avtr) {
    case "reinier":
      avtr = reinier
      break
    case "esther":
      avtr = esther
      break
    case "eva":
      avtr = eva
      break
    case "sharyon":
      avtr = sharyon
      break
    case "roberta":
      avtr = roberta
      break
  }
  avtr.classList.add("avatar-focus")
}

function chooseAvatar(e) {
  if (e.currentTarget != reinier &&
  e.currentTarget != esther &&
  e.currentTarget != eva &&
  e.currentTarget != sharyon &&
  e.currentTarget != roberta) return

  avatarElems.forEach(elem => {
    if (elem.classList.contains("avatar-focus")) elem.classList.remove("avatar-focus")
  })

  e.currentTarget.classList.add("avatar-focus")

  switch (e.currentTarget) {
    case reinier:
      avatar = 'reinier'
      break
    case esther:
      avatar = 'esther'
      break
    case eva:
      avatar = 'eva'
      break
    case sharyon:
      avatar = 'sharyon'
      break
    case roberta:
      avatar = 'roberta'
      break
    default:
      avatar = "reinier"
  }
  localStorage.setItem("avatar", avatar)
}

localStorage.setItem("score", 0)

console.log(nickname + " + " + avatar)