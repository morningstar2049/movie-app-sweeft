import { Store } from "./store/store.js";

const API_TVSHOWS_URL =
  "https://api.themoviedb.org/3/discover/tv?api_key=dbfdeb12dc114137c3eeb9635154dd89&language=en-US&sort_by=popularity.desc&include_video=false&page=1&append_to_response=videos";

const API_MOVIE_URL =
  "https://api.themoviedb.org/3/discover/movie?api_key=dbfdeb12dc114137c3eeb9635154dd89&append_to_response=videos&page=1";

const API_PEOPLE_URL =
  "https://api.themoviedb.org/3/person/popular?api_key=dbfdeb12dc114137c3eeb9635154dd89&language=en-US&page=1";

const movieLogo = document.querySelector(".fa-clapperboard");
const movies = document.querySelector(".movies");
const tvShows = document.querySelector(".tvShows");
const people = document.querySelector(".people");
const mainContent = document.querySelector(".main-content");
const modal = document.querySelector(".modal");
let currentPage = "";
let fetchedData;
let currentItemIndex;

initialRender();
registerListenres();

function initialRender() {
  renderContent("movies");
}

function registerListenres() {
  movies.addEventListener("click", () => renderContent("movies"));
  tvShows.addEventListener("click", () => renderContent("tvShows"));
  people.addEventListener("click", () => renderContent("people"));
}

async function renderContent(page) {
  if (page === currentPage) return;
  mainContent.innerHTML = "";
  const url =
    page === "movies"
      ? API_MOVIE_URL
      : page === "tvShows"
      ? API_TVSHOWS_URL
      : API_PEOPLE_URL;

  const response = await fetch(url);
  const data = await response.json();
  fetchedData = data.results;

  data.results.forEach((item) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("movie-container");
    itemContainer.innerHTML = `
    
      <img src=${
        item.backdrop_path !== null
          ? `https://image.tmdb.org/t/p/w300${
              page === "people" ? item.profile_path : item.backdrop_path
            }`
          : "./assets/noimage.png"
      } alt="movie-img" class=${
      page === "people" ? "people-img" : "movie-img"
    } />
      <p class="movie-title">${page === "movies" ? item.title : item.name}</p>
      <p class="vote-average">Average Score : ${
        page === "people" ? item.popularity : item.vote_average
      } 
      <i class="fa-solid fa-star"></i>
      </p>
  
    `;
    mainContent.append(itemContainer);

    itemContainer.addEventListener("click", (e) => {
      const mainArray = Array.from(mainContent.childNodes);
      currentItemIndex = mainArray.indexOf(e.currentTarget);
      showModal();
    });
  });

  currentPage = page;
}

const modalState = new Store(false);

const setModalState = modalState.useState((newState) => {
  if (newState) {
    modal.showModal();
    const itemData = fetchedData[currentItemIndex];
    modal.innerHTML = `
    <div class="close-button">
      <i class="fa-regular fa-circle-xmark"></i>
    </div>
    <div class="modal-content">
      <div><strong>${
        currentPage === "movies" ? itemData.title : itemData.name
      }</strong></div>
      <img src=${
        itemData.backdrop_path !== null
          ? `https://image.tmdb.org/t/p/w300${
              currentPage === "people"
                ? itemData.profile_path
                : itemData.backdrop_path
            }`
          : "./assets/noimage.png"
      } alt="img" class=${
      currentPage === "people" ? "img-people" : "img-movies"
    } />
      ${currentPage !== "people" ? `<div>${itemData.overview}</div>` : ""}
      ${
        currentPage !== "people"
          ? `<div><strong>Release Date: </strong> ${
              currentPage === "movies"
                ? itemData.release_date
                : itemData.first_air_date
            }</div>`
          : ""
      }
      <p class="vote-average">Average Score : ${
        currentPage === "people" ? itemData.popularity : itemData.vote_average
      } 
      <i class="fa-solid fa-star"></i>
      </p>
      ${currentPage === "people" ? "<strong>Known For :</strong>" : ""}
      
    </div>
    `;
    if (currentPage === "people") {
      itemData.known_for.forEach((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-div");
        movieDiv.innerHTML = `
          <img src=https://image.tmdb.org/t/p/w300${movie.backdrop_path} />
          <p><strong>${
            movie.media_type === "movie" ? movie.title : movie.name
          }</strong></p>
        `;
        const modalContent = document.querySelector(".modal-content");
        modalContent.append(movieDiv);
      });
    }
    const modalClose = document.querySelector(".close-button");
    modalClose.addEventListener("click", () => {
      closeModal();
    });
  } else {
    modal.close();
  }
});

function showModal() {
  setModalState(true);
}

function closeModal() {
  setModalState(false);
}
