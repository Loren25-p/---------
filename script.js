let changeThemeBtn = document.querySelector(".themeChange")
let body = document.querySelector("body")

changeThemeBtn.addEventListener("click", changeTheme)

function changeTheme() {
    changeThemeBtn.classList.toggle('darkTheme')
    body.classList.toggle("dark")
}







let searchBtn = document.querySelector(".search button");
searchBtn.addEventListener("click", searchMovie);

let loader = document.querySelector(".loader")

async function searchMovie() {
    loader.style.display = "block";

    let searchText = document.getElementById('dd').value;
    console.log(searchText);

    let response = await sendRequest("http://www.omdbapi.com/", "GET", {
        "apikey": "74920bef",
        "t": searchText
    });

    if (response.Response == "False") {
        loader.style.display = "none";
        alert(response.Error);
        console.log(response);
    } else {
        let main = document.querySelector(".main");
        main.style.display = "block";

        let movieTitle = document.querySelector('.movieTitle h2');
        movieTitle.innerHTML = response.Title;

        let movieImg = document.querySelector(".movieImg");
        movieImg.style.backgroundImage = `url(${response.Poster})`;

        let detailsList = ["Language", "Actors", "Country", "Genre", "Released", "Runtime", "imdbRating"];
        let movieInfo = document.querySelector(".movieInfo");
        movieInfo.innerHTML = "";

        for (let i = 0; i < detailsList.length; i++) {
            let param = detailsList[i];
            let desc = `<div class="desc darckBg">
                <div class="title">${param}</div>
                <div class="value">${response[param]}</div>
            </div>`;
            movieInfo.innerHTML += desc;
        }

        loader.style.display = "none";
    }
}


async function sendRequest(url, method, data) {
    if (method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        response = JSON.parse(response)
        return response
    } else if (method == "GET") {
        url = url + "?" + new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET"
        })

        response = await response.json()
        return response
    }
}






