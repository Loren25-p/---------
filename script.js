let changeThemeBtn = document.querySelector(".themeChange");
let body = document.querySelector("body");

changeThemeBtn.addEventListener("click", changeTheme);

function changeTheme() {
  changeThemeBtn.classList.toggle("darkTheme");
  body.classList.toggle("dark");
}

let searchBtn = document.querySelector(".search button");
searchBtn.addEventListener("click", searchMovie);

let loader = document.querySelector(".loader");

async function searchMovie() {
  loader.style.display = "block";

  let searchText = document.getElementById("dd").value;
  console.log(searchText);

  let response = await sendRequest("https://www.omdbapi.com/", "GET", {
    apikey: "74920bef",
    t: searchText,
  });

  if (response.Response == "False") {
    loader.style.display = "none";
    alert(response.Error);
    console.log(response);
  } else {
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

    for (let i = 0; i < detailsList.length; i++) {
      let param = detailsList[i];
      let desc = `<div class="desc darckBg">
                <div class="title">${param}</div>
                <div class="value">${response[param]}</div>
            </div>`;
      movieInfo.innerHTML += desc;
    }

    loader.style.display = "none";
    fetchSimilarMovies(searchText);
  }
}

async function fetchSimilarMovies(title) {
  try {
    // Fetch similar movies from the API
    let similarMoviesResponse = await sendRequest(
      "https://www.omdbapi.com/",
      "GET",
      {
        apikey: "74920bef",
        s: title,
      }
    );

    // Select the title element
    let similarMovieTitle = document.querySelector(".similarMovieTitle h2");

    // Check if the response indicates an error
    if (similarMoviesResponse.Response === "False") {
      document.querySelector(".similarMovieTitle h2").style.display = "none";
      document.querySelector(".similarMovies").style.display = "none";

      similarMovieTitle.innerHTML = "No similar movies found.";
      similarMovieTitle.style.display = "block";
      document.querySelector(".similarMovies").innerHTML = ""; // Clear previous results
      return;
    }

    // Display the total number of results
    similarMovieTitle.innerHTML = `Похожие фильмы: ${similarMoviesResponse.totalResults}`;
    similarMovieTitle.style.display = "block";

    // Check if there are movies to display
    if (
      similarMoviesResponse.Search &&
      similarMoviesResponse.Search.length > 0
    ) {
      displaySimilarMovies(similarMoviesResponse.Search);
    } else {
      document.querySelector(".similarMovies").innerHTML =
        "No similar movies found.";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    document.querySelector(".similarMovieTitle h2").innerHTML =
      "Error fetching movies.";
  }
}

function displaySimilarMovies(movies) {
  let similarMovieCardContainer = document.querySelector(".similarMovies");
  let similarMoviesHTML = movies
    .map((movie) => {
      return `
      <div class="similarMovieCard" style="background-image:url(${movie.Poster})">     
         <div class=favStar></div>
        <div class="similarMovieText">${movie.Title}</div>
      </div>
    `;
    })
    .join("");
  similarMovieCardContainer.innerHTML = similarMoviesHTML;
}

// Example usage
fetchSimilarMovies("Inception");

// Helper function to perform the API request
async function sendRequest(url, method, params) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${url}?${queryString}`, { method });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
}

// async function fetchSimilarMovies(title) {
//   try {
//     // Fetch similar movies from the API
//     let similarMoviesResponse = await sendRequest("https://www.omdbapi.com/", "GET", {
//       apikey: "74920bef",
//       s: title,
//     });

//     // Select the title and container elements
//     let similarMovieTitle = document.querySelector(".similarMovieTitle h2");
//     let similarMovieContainer = document.querySelector(".similarMovies");

//     // Check if the response indicates an error
//     if (similarMoviesResponse.Response === "False") {
//       similarMovieTitle.innerHTML = 'No similar movies found.';
//       similarMovieTitle.style.display = "block";
//       similarMovieContainer.style.display = "none"; // Hide movie container
//       return;
//     }

//     // Display the total number of results
//     similarMovieTitle.innerHTML = `Похожие фильмы: ${similarMoviesResponse.totalResults}`;
//     similarMovieTitle.style.display = "block";
//     similarMovieContainer.style.display = "block"; // Show movie container

//     // Check if there are movies to display
//     if (similarMoviesResponse.Search && similarMoviesResponse.Search.length > 0) {
//       displaySimilarMovies(similarMoviesResponse.Search);
//     } else {
//       similarMovieContainer.innerHTML = 'No similar movies found.';
//     }
//   } catch (error) {
//     console.error('Error fetching movies:', error);
//     document.querySelector(".similarMovieTitle h2").innerHTML = 'Error fetching movies.';
//   }
// }

// function displaySimilarMovies(movies) {
//   let similarMovieCardContainer = document.querySelector(".similarMovies");
//   let similarMoviesHTML = movies.map((movie) => {
//     return `
//       <div class="favStar"></div>
//       <div class="similarMovieCard" style="background-image:url(${movie.Poster})">
//         <div class="similarMovieText">${movie.Title}</div>
//       </div>
//     `;
//   }).join('');
//   similarMovieCardContainer.innerHTML = similarMoviesHTML;
// }

// // Example usage
// fetchSimilarMovies("Inception");

// // Helper function to perform the API request
// async function sendRequest(url, method, params) {
//   const queryString = new URLSearchParams(params).toString();
//   const response = await fetch(`${url}?${queryString}`, { method });
//   if (!response.ok) throw new Error('Network response was not ok');
//   return response.json();
// }

// async function fetchSimilarMovies(title) {
//   let similarMoviesResponse = await sendRequest("https://www.omdbapi.com/", "GET", {
//     apikey: "74920bef",
//     s: title,
//   });

//   let similarMovieTitle = document.querySelector(".similarMovieTitle h2");
//   if (similarMovies.Response== "False"){
//   }
//   else {
//     document.querySelector(".similarMovieTitle h2").innerHTML=`Похожие фильмы:${similarMovies.totalResults}`
//     fetchSimilarMovies(similarMovies.Search)
//     console.log(similarMovies);
//   // similarMovieTitle.innerHTML = `Похожие фильмы: ${similarMoviesResponse.totalResults}`;
//   similarMovieTitle.style.display = "block";
//   }
//   if (similarMoviesResponse.Search && similarMoviesResponse.Search.length > 0) {
//     displaySimilarMovies(similarMoviesResponse.Search);
//   } else {
//     console.log('No similar movies found.');
//   }
// }

// function displaySimilarMovies(movies) {
//   let similarMovieCardContainer = document.querySelector(".similarMovies");
//   let similarMoviesHTML = movies.map((movie) => {
//     return `
//       <div class="similarMovieCard" style="background-image:url(${movie.Poster})">
//         <div class="similarMovieText">${movie.Title}</div>
//       </div>
//     `;
//   }).join('');
//   similarMovieCardContainer.innerHTML = similarMoviesHTML;
// }

// // Example usage
// fetchSimilarMovies("Inception");

// async function showSimilarMoviesContainer(title) {
//   let similarMovies = await sendRequest("https://www.omdbapi.com/", "GET", {
//     apikey: "74920bef",
//     s: title,
//   });
//   let similarMovieTitle = document.querySelector(".similarMovieTitle h2");
//   similarMovieTitle.innerHTML = `Похожие фильмы: ${similarMovies.totalResults}`;
//   similarMovieTitle.style.display = "block";
//   console.log(similarMovies);
//   showSimilarMoviesContainer(similarMovies.Search)
// }

// function showSimilarMoviesContainer(movies) {
//   let similarMoviesContainer = document.querySelector(".similarMovies");
//   movies.forEach((movie) => {
//     similarMovies.innerHTML += `<div class "similarMovieCard" style="bacground-image:url(${movie.Poster})">
//     <div class"similarMovieText">${movie.Title}</div>
//     </div>`
//   });
//   similarMoviesContainer.style.display="grid"
// }

async function sendRequest(url, method, data) {
  if (method == "POST") {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    response = JSON.parse(response);
    return response;
  } else if (method == "GET") {
    url = url + "?" + new URLSearchParams(data);
    let response = await fetch(url, {
      method: "GET",
    });

    response = await response.json();
    return response;
  }
}
