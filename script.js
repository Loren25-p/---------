let changeThemeBtn = document.querySelector(".themeChange");
let body = document.querySelector("body");

changeThemeBtn.addEventListener("click", changeTheme);

function changeTheme() {
  changeThemeBtn.classList.toggle("darkTheme");
  body.classList.toggle("dark");
}

let searchBtn = document.querySelector(".search button");
if (searchBtn) {
  searchBtn.addEventListener("click", searchMovie);
}

document.getElementById("dd").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click(); // Симулирует нажатие кнопки поиска
  }
});

let favs = JSON.parse(localStorage.getItem("favStar")) || []; // Загружаем избранные фильмы из localStorage

function addToFav(event) {
  let favBtn = event.target;

  let title = favBtn.getAttribute("data-title");
  let poster = favBtn.getAttribute("data-poster");
  let imdbID = favBtn.getAttribute("data-imdbId");

  let fav = { title, poster, imdbID };

  // Проверяем, если фильм уже в избранном
  if (!favs.some((f) => f.imdbID === imdbID)) {
    favs.push(fav);
    localStorage.setItem("favStar", JSON.stringify(favs));
    favBtn.classList.add("active");
  }
}

let loader = document.querySelector(".loader");

async function searchMovie() {
  loader.style.display = "block";

  let searchText = document.getElementById("dd").value;
  console.log(searchText);

  try {
    let response = await sendRequest("https://www.omdbapi.com/", "GET", {
      apikey: "74920bef",
      t: searchText,
    });

    if (response.Response === "False") {
      alert(response.Error);
      return;
    }

    let main = document.querySelector(".main");
    main.style.display = "block";

    let movieTitle = document.querySelector(".movieTitle h2");
    movieTitle.innerHTML = response.Title;

    let movieImg = document.querySelector(".movieImg");
    movieImg.style.backgroundImage = `url(${response.Poster})`;

    let detailsList = [
      "Language",
      "Actors",
      "Country",
      "Genre",
      "Released",
      "Runtime",
      "imdbRating",
    ];
    let movieInfo = document.querySelector(".movieInfo");
    movieInfo.innerHTML = "";

    for (let param of detailsList) {
      let desc = `<div class="desc darckBg">
                    <div class="title">${param}</div>
                    <div class="value">${response[param]}</div>
                  </div>`;
      movieInfo.innerHTML += desc;
    }

    fetchSimilarMovies(searchText);
  } catch (error) {
    alert("Ошибка при получении данных о фильме.");
    console.error(error);
  } finally {
    loader.style.display = "none";
  }
}

async function fetchSimilarMovies(title) {
  try {
    let similarMoviesResponse = await sendRequest(
      "https://www.omdbapi.com/",
      "GET",
      {
        apikey: "74920bef",
        s: title,
      }
    );

    let similarMovieTitle = document.querySelector(".similarMovieTitle h2");

    if (similarMoviesResponse.Response === "False") {
      similarMovieTitle.innerHTML = "Похожие фильмы не найдены.";
      similarMovieTitle.style.display = "block";
      document.querySelector(".similarMovies").style.display = "none";
      return;
    }

    similarMovieTitle.innerHTML = `Похожие фильмы: ${similarMoviesResponse.totalResults}`;
    similarMovieTitle.style.display = "block";

    if (
      similarMoviesResponse.Search &&
      similarMoviesResponse.Search.length > 0
    ) {
      displaySimilarMovies(similarMoviesResponse.Search);
    } else {
      document.querySelector(".similarMovies").innerHTML =
        "Похожие фильмы не найдены.";
    }
  } catch (error) {
    console.error("Ошибка при получении похожих фильмов:", error);
  }
}

function displaySimilarMovies(movies) {
  let similarMovieCardContainer = document.querySelector(".similarMovies");

  const similarMoviesHTML = movies
    .map((movie) => {
      const index = favs.findIndex((obj) => obj.imdbID === movie.imdbID);
      const favCheck = index < 0 ? "" : "active";

      return `
      <div class="similarMovieCard" style="background-image:url(${movie.Poster})">
          <div class="favStar ${favCheck}" data-title="${movie.Title}" data-poster="${movie.Poster}" data-imdbId="${movie.imdbID}" style="cursor: pointer;"></div>
          <div class="similarMovieText">${movie.Title}</div>
      </div>
    `;
    })
    .join("");

  similarMovieCardContainer.innerHTML = similarMoviesHTML;

  document.querySelectorAll(".favStar").forEach((star) => {
    star.addEventListener("click", toggleFavorite);
  });
}

function toggleFavorite(event) {
  const title = event.currentTarget.getAttribute("data-title");
  const imdbID = event.currentTarget.getAttribute("data-imdbId");
  const favStar = event.currentTarget;

  const index = favs.findIndex((movie) => movie.imdbID === imdbID);

  if (index >= 0) {
    favs.splice(index, 1); // Удаляем фильм из избранного
    favStar.classList.remove("active");
  } else {
    const poster = favStar.getAttribute("data-poster");
    const fav = { title, poster, imdbID };
    favs.push(fav); // Добавляем фильм в избранное
    favStar.classList.add("active");
  }

  localStorage.setItem("favStar", JSON.stringify(favs)); // Сохраняем изменения в localStorage
  console.log("Избранные фильмы:", favs); // Для отладки
}

async function sendRequest(url, method, params) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${url}?${queryString}`, { method });
  if (!response.ok) throw new Error("Сетевая ошибка");
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  displayFavoriteMovies();
});
