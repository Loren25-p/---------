let changeThemeBtn = document.querySelector(".themeChange")
let body = document.querySelector("body")

changeThemeBtn.addEventListener("click", changeTheme)

function changeTheme() {
    changeThemeBtn.classList.toggle('darkTheme')
    body.classList.toggle("dark")
}


