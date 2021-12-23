const scoreboardBody = document.querySelector("[data-scoreboard-body]")

export function getScoreboard() {
  // call ajax
  let ajax = new XMLHttpRequest()
  let method = "GET"
  let url = "php/scoreboard.php"
  let asynchronous = true

  ajax.open(method, url, asynchronous)
  // sending ajax request
  ajax.send()

  // receive response from php file
  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // converting JSON back to array
      let data = JSON.parse(this.responseText)

      // html value for <tbody>
      let html = ""
      // looping through the data
      for (let i = 0; i < data.length; i++) {
        let nickname = data[i].nickname
        let character = data[i].avatar
        let score = data[i].score

        // appending to HTML
        html += "<tr>"
        html += `<td>${nickname}</td>`
        html += `<td><img style="object-fit:contain; height:30px; width:100%; text-align:center;" src="imgs/${character}/dino-stationary.png""></td>`
        html += `<td>${score}</td>`
        html += "</tr>"
      }

      // replacing the contents of <tbody>
      scoreboardBody.innerHTML = html
    }
  }
}