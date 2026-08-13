/* ============================================================
   CONFIG
   ============================================================ */

const TMDB_API_KEY = window.TMDB_API_KEY || "a14cbdc8a097c452f501ce7e17ae5e7b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES_URL = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;

const HERO_SLIDE_COUNT = 5;
const TOP_RATED_COUNT = 10;

/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const elements = {
  // Navbar
  moviesDdBtn: document.getElementById("movies-dd-btn"),
  moviesDdMenu: document.getElementById("movies-dd-menu"),
  ddChevron: document.getElementById("dd-chevron"),
  desktopSearch: document.getElementById("desktop-search"),

  // Theme
  themeToggle: document.getElementById("theme-toggle"),
  iconMoon: document.getElementById("icon-moon"),
  iconSun: document.getElementById("icon-sun"),

  // Mobile menu
  hamburgerBtn: document.getElementById("hamburger-btn"),
  menuIconOpen: document.getElementById("menu-icon-open"),
  menuIconClose: document.getElementById("menu-icon-close"),
  mobileMenu: document.getElementById("mobile-menu"),

  // Hero slider
  heroTrack: document.getElementById("hero-track"),
  heroPrev: document.getElementById("hero-prev"),
  heroNext: document.getElementById("hero-next"),
  heroDots: document.querySelectorAll(".hero-dot"),

  // Search modal
  searchModal: document.getElementById("search-modal"),
  backdrop: document.getElementById("backdrop"),
  closeSearchModal: document.getElementById("closeSearchModal"),
  openSearchModalBtn: document.getElementById("search-icon-btn"),
  modalSearchInput: document.getElementById("modal-search-input"),

  // Trailer modal
  trailerModal: document.getElementById("trailer-modal"),
  trailerBackdrop: document.getElementById("trailer-backdrop"),
  trailerIframe: document.getElementById("trailer-iframe"),
  trailerTitle: document.getElementById("trailer-title"),
  trailerLoader: document.getElementById("trailer-loader"),
  closeTrailer: document.getElementById("close-trailer"),
  closeTrailerBottom: document.getElementById("close-trailer-bottom"),

  // Top rated slider
  topRatedSlider: document.getElementById("top-rated-slider"),
  topRatedTrack: document.getElementById("top-rated-track"),
  topRatedPrev: document.getElementById("top-rated-prev"),
  topRatedNext: document.getElementById("top-rated-next"),
};

const htmlTag = document.documentElement;

/* ============================================================
   STATE
   ============================================================ */

const state = {
  popularMovies: [],
  topRatedMovies: [],
  heroCurrentSlide: 0,
  topRatedCurrentSlide: 0,
};

/* ============================================================
   THEME
   ============================================================ */

function initTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  htmlTag.classList.toggle("dark", isDark);
  elements.iconMoon.classList.toggle("hidden", isDark);
  elements.iconSun.classList.toggle("hidden", !isDark);
}

function toggleTheme() {
  const isDark = htmlTag.classList.toggle("dark");
  elements.iconMoon.classList.toggle("hidden", isDark);
  elements.iconSun.classList.toggle("hidden", !isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

/* ============================================================
   DROPDOWN MENU
   ============================================================ */

function toggleDropdown() {
  const willOpen = elements.moviesDdMenu.classList.contains("hidden");
  elements.moviesDdMenu.classList.toggle("hidden", !willOpen);
  elements.ddChevron.classList.toggle("rotate-180", willOpen);
}

function handleOutsideDropdownClick(e) {
  const isOpen = !elements.moviesDdMenu.classList.contains("hidden");
  if (!isOpen) return;

  const clickedInside =
    e.target === elements.moviesDdBtn ||
    elements.moviesDdMenu.contains(e.target);

  if (!clickedInside) {
    elements.moviesDdMenu.classList.add("hidden");
    elements.ddChevron.classList.remove("rotate-180");
  }
}

/* ============================================================
   MOBILE MENU
   ============================================================ */

function toggleMobileMenu() {
  const willOpen = elements.mobileMenu.classList.contains("hidden");
  elements.mobileMenu.classList.toggle("hidden", !willOpen);
  elements.menuIconOpen.classList.toggle("hidden", willOpen);
  elements.menuIconClose.classList.toggle("hidden", !willOpen);
}

/* ============================================================
   HERO SLIDER
   ============================================================ */

function goToHeroSlide(index) {
  state.heroCurrentSlide = index;
  elements.heroTrack.style.transform = `translateX(-${index * 100}%)`;

  elements.heroDots.forEach((dot, i) => {
    const isActive = i === index;
    dot.classList.toggle("w-7", isActive);
    dot.classList.toggle("bg-white", isActive);
    dot.classList.toggle("w-2", !isActive);
    dot.classList.toggle("bg-white/40", !isActive);
  });
}

function nextHeroSlide() {
  const next = (state.heroCurrentSlide + 1) % HERO_SLIDE_COUNT;
  goToHeroSlide(next);
}

function prevHeroSlide() {
  const prev =
    (state.heroCurrentSlide - 1 + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT;
  goToHeroSlide(prev);
}

function renderHeroSlide(movie) {
  return `
    <div class="relative shrink-0 w-full h-full">
      <img
        src="https://image.tmdb.org/t/p/original${movie.backdrop_path}"
        alt="${movie.title}"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent"></div>
      <div class="relative h-full flex items-center">
        <div class="max-w-screen-xl mx-auto px-6 md:px-16 w-full">
          <div class="max-w-xl">
            <div class="flex items-center gap-3 mb-4">
              <span class="flex items-center gap-1 text-sm font-semibold text-rating">
                <svg class="w-4 h-4 fill-rating" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                ${movie.vote_average.toFixed(1)}
              </span>
              <span class="text-sm text-white/50">${movie.release_date}</span>
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-4 drop-shadow-lg">
              ${movie.title}
            </h1>
            <p class="text-base text-white/65 leading-relaxed mb-8 max-w-xl">
              ${movie.overview}
            </p>
            <div class="flex items-center gap-3 flex-wrap">
              <button
                data-movie-id="${movie.id}"
                class="watch-now-btn flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.45)]"
              >
                <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch Now
              </button>
              <button
                data-addmovie-id="${movie.id}"
                class="add-watchlist-btn flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHeroSlider() {
  elements.heroTrack.innerHTML = state.popularMovies
    .map(renderHeroSlide)
    .join("");

  elements.heroTrack.querySelectorAll(".watch-now-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const movieId = button.dataset.movieId;
      const movie = state.popularMovies.find((m) => m.id == movieId);
      if (!movie) return;

      try {
        const trailer = await fetchMovieTrailer(movie.id);
        openTrailerModal(trailer, movie);
      } catch (error) {
        showToast("error", "Unable to load trailer");
      }
    });
  });
}

async function loadPopularMovies() {
  try {
    const res = await fetch(POPULAR_MOVIES_URL);
    if (!res.ok) throw new Error("Failed to fetch popular movies");

    const data = await res.json();
    state.popularMovies = data.results.slice(0, HERO_SLIDE_COUNT);
    renderHeroSlider();
  } catch (error) {
    showToast("error", "Unable to load featured movies");
  }
}

/* ============================================================
   TRAILER MODAL
   ============================================================ */

async function fetchMovieTrailer(movieId) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`,
  );
  if (!res.ok) throw new Error("Failed to fetch trailer");

  const data = await res.json();

  return (
    data.results.find(
      (video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.official,
    ) ||
    data.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    )
  );
}

function openTrailerModal(trailer, movie) {
  if (!trailer) {
    showToast("error", "Trailer not available");
    return;
  }

  elements.trailerModal.classList.remove("hidden");
  elements.trailerModal.classList.add("flex");
  elements.trailerTitle.textContent = movie.title;
  elements.trailerLoader.classList.remove("hidden");
  elements.trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

  elements.trailerIframe.onload = () => {
    elements.trailerLoader.classList.add("hidden");
  };
}

function closeTrailerModal() {
  elements.trailerModal.classList.add("hidden");
  elements.trailerModal.classList.remove("flex");
  elements.trailerIframe.src = "";
}

/* ============================================================
   WATCHLIST
   ============================================================ */

function showToast(icon, title) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    theme: "dark",
    title,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function handleAddToWishlist(e) {
  const addBtn = e.target.closest(".add-watchlist-btn");
  if (!addBtn) return;

  const movieId = Number(addBtn.dataset.addmovieId);
  const movie =
    state.popularMovies.find((m) => m.id === movieId) ||
    state.topRatedMovies.find((m) => m.id === movieId);

  if (!movie) return;

  const wishlist = getWishlist();
  const alreadyExists = wishlist.some((m) => m.id === movieId);

  if (alreadyExists) {
    showToast("error", "Already in Watchlist");
    return;
  }

  wishlist.push(movie);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showToast("success", "Added to Watchlist");
}

/* ============================================================
   TOP RATED SLIDER
   ============================================================ */

function getTopRatedCards() {
  return elements.topRatedTrack.querySelectorAll(".movie-card");
}

function getTopRatedVisibleCards() {
  const cards = getTopRatedCards();
  if (!cards.length) return 1;

  const sliderWidth = elements.topRatedSlider.clientWidth;
  const cardWidth = cards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(elements.topRatedTrack).gap) || 0;

  return Math.max(1, Math.floor((sliderWidth + gap) / (cardWidth + gap)));
}

function updateTopRatedSlider() {
  const cards = getTopRatedCards();
  if (!cards.length) return;

  const visibleCards = getTopRatedVisibleCards();
  const maxSlide = Math.max(0, cards.length - visibleCards);
  state.topRatedCurrentSlide = Math.min(state.topRatedCurrentSlide, maxSlide);

  const cardWidth = cards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(elements.topRatedTrack).gap) || 0;
  const moveDistance = state.topRatedCurrentSlide * (cardWidth + gap);

  elements.topRatedTrack.style.transform = `translateX(-${moveDistance}px)`;

  const atStart = state.topRatedCurrentSlide === 0;
  const atEnd = state.topRatedCurrentSlide === maxSlide;

  elements.topRatedPrev.disabled = atStart;
  elements.topRatedNext.disabled = atEnd;

  elements.topRatedPrev.classList.toggle("opacity-40", atStart);
  elements.topRatedPrev.classList.toggle("cursor-not-allowed", atStart);

  elements.topRatedNext.classList.toggle("opacity-40", atEnd);
  elements.topRatedNext.classList.toggle("cursor-not-allowed", atEnd);
}

function nextTopRatedSlide() {
  const cards = getTopRatedCards();
  if (!cards.length) return;

  const visibleCards = getTopRatedVisibleCards();
  const maxSlide = Math.max(0, cards.length - visibleCards);

  if (state.topRatedCurrentSlide < maxSlide) {
    state.topRatedCurrentSlide++;
    updateTopRatedSlider();
  }
}

function prevTopRatedSlide() {
  if (state.topRatedCurrentSlide > 0) {
    state.topRatedCurrentSlide--;
    updateTopRatedSlider();
  }
}

function renderTopRatedCard(movie) {
  return `
    <div class="movie-card group relative w-[190px] sm:w-[200px] md:w-[220px] shrink-0 overflow-hidden rounded-2xl bg-bg-secondary border border-border shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div class="relative aspect-[2/3] overflow-hidden">
        <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          alt="${movie.title}"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        <div class="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          <i class="fa-solid fa-star text-yellow-400"></i>
          <span>${movie.vote_average.toFixed(1)}</span>
        </div>

        <span class="absolute top-3 left-3 rounded-lg bg-accent px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Movie
        </span>

        <div class="absolute inset-x-0 bottom-0 p-4">
          <h3 class="truncate text-lg font-bold text-white" title="${movie.title}">
            ${movie.title}
          </h3>
          <div class="mt-1.5 flex items-center gap-2 text-xs text-white/70">
            <span>${movie.release_date?.slice(0, 4) || "N/A"}</span>
            <span>•</span>
            <span>Movie</span>
          </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <button
            data-movie-id="${movie.id}"
            type="button"
            class="watch-trailer-btn flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:brightness-110"
          >
            <i class="fa-solid fa-play text-xs"></i>
            Watch Trailer
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderTopRatedSlider() {
  elements.topRatedTrack.innerHTML = state.topRatedMovies
    .map(renderTopRatedCard)
    .join("");

  state.topRatedCurrentSlide = 0;
  updateTopRatedSlider();

  elements.topRatedTrack
    .querySelectorAll(".watch-trailer-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const movieId = button.dataset.movieId;
        const movie = state.topRatedMovies.find((m) => m.id == movieId);
        if (!movie) return;

        try {
          const trailer = await fetchMovieTrailer(movie.id);
          openTrailerModal(trailer, movie);
        } catch (error) {
          showToast("error", "Unable to load trailer");
        }
      });
    });
}

async function loadTopRatedMovies() {
  try {
    const res = await fetch(POPULAR_MOVIES_URL);
    if (!res.ok) throw new Error("Failed to fetch top rated movies");

    const data = await res.json();
    state.topRatedMovies = data.results.slice(0, TOP_RATED_COUNT);
    renderTopRatedSlider();
  } catch (error) {
    showToast("error", "Unable to load top rated movies");
  }
}

/* ============================================================
   SEARCH MODAL
   ============================================================ */

function openSearchModal() {
  elements.searchModal.classList.remove("hidden");
  elements.searchModal.classList.add("flex");
  elements.modalSearchInput?.focus();
}

function closeSearchModalFn() {
  elements.searchModal.classList.add("hidden");
  elements.searchModal.classList.remove("flex");
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

function initEventListeners() {
  elements.themeToggle.addEventListener("click", toggleTheme);

  elements.moviesDdBtn.addEventListener("click", toggleDropdown);
  document.addEventListener("click", handleOutsideDropdownClick);

  elements.hamburgerBtn.addEventListener("click", toggleMobileMenu);

  elements.heroNext.addEventListener("click", nextHeroSlide);
  elements.heroPrev.addEventListener("click", prevHeroSlide);
  elements.heroDots.forEach((dot) => {
    dot.addEventListener("click", () =>
      goToHeroSlide(Number(dot.dataset.slide)),
    );
  });

  elements.closeTrailer.addEventListener("click", closeTrailerModal);
  elements.closeTrailerBottom.addEventListener("click", closeTrailerModal);
  elements.trailerBackdrop.addEventListener("click", closeTrailerModal);

  elements.topRatedNext.addEventListener("click", nextTopRatedSlide);
  elements.topRatedPrev.addEventListener("click", prevTopRatedSlide);
  window.addEventListener("resize", updateTopRatedSlider);

  if (elements.openSearchModalBtn) {
    elements.openSearchModalBtn.addEventListener("click", openSearchModal);
  }
  if (elements.closeSearchModal) {
    elements.closeSearchModal.addEventListener("click", closeSearchModalFn);
  }
  if (elements.backdrop) {
    elements.backdrop.addEventListener("click", closeSearchModalFn);
  }

  htmlTag.addEventListener("click", handleAddToWishlist);
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  initTheme();
  initEventListeners();
  loadPopularMovies();
  loadTopRatedMovies();
}

init();
