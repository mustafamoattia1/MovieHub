/* ============================================================
   CONFIG
   ============================================================ */

const TMDB_API_KEY = window.TMDB_API_KEY || "a14cbdc8a097c452f501ce7e17ae5e7b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES_URL = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_POSTER = "https://via.placeholder.com/500x750?text=No+Poster";

const MOVIES_PER_PAGE = 20;
const MAX_VISIBLE_PAGE_BUTTONS = 5;
const SEARCH_DEBOUNCE_MS = 300;

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const elements = {
  search: document.getElementById("movies-search"),
  genre: document.getElementById("genre-filter"),
  sort: document.getElementById("sort-filter"),
  clearFilters: document.getElementById("clear-filters"),
  emptyClearFilters: document.getElementById("empty-clear-filters"),

  loading: document.getElementById("movies-loading"),
  grid: document.getElementById("movies-grid"),
  empty: document.getElementById("movies-empty"),
  error: document.getElementById("movies-error"),
  retry: document.getElementById("movies-retry"),

  count: document.getElementById("movies-count"),

  pagination: document.getElementById("movies-pagination"),
  prev: document.getElementById("movies-prev"),
  next: document.getElementById("movies-next"),
  pageNumbers: document.getElementById("movies-page-numbers"),

  themeToggle: document.getElementById("theme-toggle"),
  mobileMenuBtn: document.getElementById("mobile-menu-btn"),
  mobileMenu: document.getElementById("mobile-menu"),
};

/* ============================================================
   STATE
   ============================================================ */

const state = {
  allMovies: [],
  filteredMovies: [],
  currentPage: 1,
  searchTimeout: null,
};

/* ============================================================
   INIT
   ============================================================ */

function initMovies() {
  renderGenreOptions();
  setupEventListeners();
  loadTheme();
  loadMovies();
}

/* ============================================================
   DATA LOADING
   ============================================================ */

async function loadMovies() {
  showLoading();

  try {
    const response = await fetch(POPULAR_MOVIES_URL);
    if (!response.ok) throw new Error("Failed to fetch movies");

    const data = await response.json();

    state.allMovies = data.results || [];
    state.filteredMovies = [...state.allMovies];
    state.currentPage = 1;

    hideLoading();
    applyFilters();
  } catch (error) {
    showError();
  }
}

async function fetchMovieTrailer(movieId) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch trailer");

  const data = await res.json();

  return (
    data.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer" && video.official
    ) || data.results.find((video) => video.site === "YouTube" && video.type === "Trailer")
  );
}

/* ============================================================
   FILTERING & SORTING
   ============================================================ */

function applyFilters() {
  const searchValue = elements.search.value.trim().toLowerCase();
  const selectedGenre = elements.genre.value;
  const selectedSort = elements.sort.value;

  let movies = [...state.allMovies];

  if (searchValue) {
    movies = movies.filter((movie) => movie.title?.toLowerCase().includes(searchValue));
  }

  if (selectedGenre !== "all") {
    movies = movies.filter((movie) => movie.genre_ids?.includes(Number(selectedGenre)));
  }

  state.filteredMovies = sortMovies(movies, selectedSort);
  state.currentPage = 1;

  renderMovies();
}

function sortMovies(movies, sortType) {
  const sorted = [...movies];

  switch (sortType) {
    case "rating-desc":
      return sorted.sort((a, b) => b.vote_average - a.vote_average);
    case "rating-asc":
      return sorted.sort((a, b) => a.vote_average - b.vote_average);
    case "date-desc":
      return sorted.sort(
        (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)
      );
    case "date-asc":
      return sorted.sort(
        (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0)
      );
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

function clearFilters() {
  elements.search.value = "";
  elements.genre.value = "all";
  elements.sort.value = "default";

  state.filteredMovies = [...state.allMovies];
  state.currentPage = 1;

  renderMovies();
}

/* ============================================================
   RENDERING — GRID
   ============================================================ */

function renderGenreOptions() {
  const options = [`<option value="all">All Genres</option>`];

  GENRES.forEach((genre) => {
    options.push(`<option value="${genre.id}">${genre.name}</option>`);
  });

  elements.genre.innerHTML = options.join("");
}

function renderMovies() {
  hideAllStates();

  if (!state.filteredMovies.length) {
    showEmpty();
    elements.count.textContent = "No movies found";
    return;
  }

  const startIndex = (state.currentPage - 1) * MOVIES_PER_PAGE;
  const endIndex = startIndex + MOVIES_PER_PAGE;
  const moviesToDisplay = state.filteredMovies.slice(startIndex, endIndex);

  elements.grid.innerHTML = moviesToDisplay.map(createMovieCard).join("");
  elements.grid.classList.remove("hidden");
  elements.grid.classList.add("grid");

  elements.count.textContent = `${state.filteredMovies.length} movies found`;

  renderPagination();
  attachTrailerEvents();
}

function createMovieCard(movie) {
  const poster = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_POSTER;
  const title = movie.title || "Unknown Movie";
  const year = movie.release_date?.slice(0, 4) || "N/A";
  const rating = Number(movie.vote_average || 0).toFixed(1);

  return `
    <article class="movie-card group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl">
      <div class="relative aspect-[2/3] overflow-hidden">
        <img
          src="${poster}"
          alt="${title}"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        <div class="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          <i class="fa-solid fa-star text-accent"></i>
          <span>${rating}</span>
        </div>

        <span class="absolute left-3 top-3 rounded-lg bg-accent px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Movie
        </span>

        <div class="absolute inset-x-0 bottom-0 p-4">
          <h3 class="truncate text-base font-bold text-white" title="${title}">
            ${title}
          </h3>
          <div class="mt-1.5 flex items-center gap-2 text-xs text-white/70">
            <span>${year}</span>
            <span>•</span>
            <span>Movie</span>
          </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <button
            type="button"
            data-movie-id="${movie.id}"
            class="watch-trailer-btn flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:brightness-110"
          >
            <i class="fa-solid fa-play text-xs"></i>
            Watch Trailer
          </button>
        </div>
      </div>
    </article>
  `;
}

function attachTrailerEvents() {
  const buttons = elements.grid.querySelectorAll(".watch-trailer-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const movieId = Number(button.dataset.movieId);
      const movie = state.allMovies.find((item) => item.id === movieId);
      if (!movie) return;

      const originalContent = button.innerHTML;
      button.disabled = true;
      button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;

      try {
        const trailer = await fetchMovieTrailer(movie.id);
        openTrailerModal(trailer, movie);
      } catch (error) {
        // Trailer fetch failed silently; button resets below so the user can retry.
      } finally {
        button.disabled = false;
        button.innerHTML = originalContent;
      }
    });
  });
}

/**
 * Opens the site's trailer modal. Expects a #trailer-modal / #trailer-iframe
 * pair (see the hero slider script) to already exist on the page.
 */
function openTrailerModal(trailer, movie) {
  if (!trailer) return;

  const modal = document.getElementById("trailer-modal");
  const iframe = document.getElementById("trailer-iframe");
  const titleEl = document.getElementById("trailer-title");
  const loader = document.getElementById("trailer-loader");

  if (!modal || !iframe) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (titleEl) titleEl.textContent = movie.title;
  if (loader) loader.classList.remove("hidden");

  iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
  iframe.onload = () => loader?.classList.add("hidden");
}

/* ============================================================
   RENDERING — PAGINATION
   ============================================================ */

function renderPagination() {
  const totalPages = Math.ceil(state.filteredMovies.length / MOVIES_PER_PAGE);

  if (totalPages <= 1) {
    elements.pagination.classList.add("hidden");
    return;
  }

  elements.pagination.classList.remove("hidden");
  elements.prev.disabled = state.currentPage === 1;
  elements.next.disabled = state.currentPage === totalPages;

  let startPage = Math.max(1, state.currentPage - 2);
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGE_BUTTONS - 1);

  if (endPage - startPage < MAX_VISIBLE_PAGE_BUTTONS - 1) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGE_BUTTONS + 1);
  }

  const pages = [];
  for (let page = startPage; page <= endPage; page++) {
    const isActive = page === state.currentPage;
    pages.push(`
      <button
        type="button"
        data-page="${page}"
        class="movie-page-btn flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "border-accent bg-accent text-white"
            : "border-border bg-bg-secondary text-text-muted hover:border-accent/40 hover:text-accent"
        }"
      >
        ${page}
      </button>
    `);
  }

  elements.pageNumbers.innerHTML = pages.join("");

  elements.pageNumbers.querySelectorAll(".movie-page-btn").forEach((button) => {
    button.addEventListener("click", () => {
      goToPage(Number(button.dataset.page));
    });
  });
}

function goToPage(page) {
  state.currentPage = page;
  renderMovies();
  scrollToTop();
}

function goToPrevPage() {
  if (state.currentPage <= 1) return;
  goToPage(state.currentPage - 1);
}

function goToNextPage() {
  const totalPages = Math.ceil(state.filteredMovies.length / MOVIES_PER_PAGE);
  if (state.currentPage >= totalPages) return;
  goToPage(state.currentPage + 1);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   VIEW STATES
   ============================================================ */

function showLoading() {
  elements.loading.classList.remove("hidden");
  elements.grid.classList.add("hidden");
  elements.empty.classList.add("hidden");
  elements.error.classList.add("hidden");
  elements.pagination.classList.add("hidden");
}

function hideLoading() {
  elements.loading.classList.add("hidden");
}

function hideAllStates() {
  elements.loading.classList.add("hidden");
  elements.empty.classList.add("hidden");
  elements.error.classList.add("hidden");
}

function showEmpty() {
  elements.empty.classList.remove("hidden");
  elements.grid.classList.add("hidden");
  elements.pagination.classList.add("hidden");
}

function showError() {
  elements.loading.classList.add("hidden");
  elements.grid.classList.add("hidden");
  elements.empty.classList.add("hidden");
  elements.error.classList.remove("hidden");
  elements.pagination.classList.add("hidden");
}

/* ============================================================
   THEME
   ============================================================ */

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme !== "light";

  document.documentElement.classList.toggle("dark", isDark);
  elements.themeToggle.innerHTML = isDark
    ? `<i class="fa-solid fa-moon"></i>`
    : `<i class="fa-solid fa-sun"></i>`;
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");
  elements.themeToggle.innerHTML = isDark
    ? `<i class="fa-solid fa-moon"></i>`
    : `<i class="fa-solid fa-sun"></i>`;
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

function setupEventListeners() {
  elements.search.addEventListener("input", () => {
    clearTimeout(state.searchTimeout);
    state.searchTimeout = setTimeout(applyFilters, SEARCH_DEBOUNCE_MS);
  });

  elements.genre.addEventListener("change", applyFilters);
  elements.sort.addEventListener("change", applyFilters);

  elements.clearFilters.addEventListener("click", clearFilters);
  elements.emptyClearFilters.addEventListener("click", clearFilters);

  elements.retry.addEventListener("click", loadMovies);

  elements.prev.addEventListener("click", goToPrevPage);
  elements.next.addEventListener("click", goToNextPage);

  elements.mobileMenuBtn.addEventListener("click", () => {
    elements.mobileMenu.classList.toggle("hidden");
  });

  elements.themeToggle.addEventListener("click", toggleTheme);
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */

initMovies();