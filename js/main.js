const moviesDdBtn = document.getElementById("movies-dd-btn");
const moviesDdMenu = document.getElementById("movies-dd-menu");
const ddChevron = document.getElementById("dd-chevron");

const desktopSearch = document.getElementById("desktop-search");

const themeToggle = document.getElementById("theme-toggle");
const iconMoon = document.getElementById("icon-moon");
const iconSun = document.getElementById("icon-sun");

const hamburgerBtn = document.getElementById("hamburger-btn");
const menuIconOpen = document.getElementById("menu-icon-open");
const menuIconClose = document.getElementById("menu-icon-close");
const mobileMenu = document.getElementById("mobile-menu");

const heroTrack = document.getElementById("hero-track");
const heroPrev = document.getElementById("hero-prev");
const heroNext = document.getElementById("hero-next");
const heroDots = document.querySelectorAll(".hero-dot");

const searchModal = document.getElementById("search-modal");
const backdrop = document.getElementById("backdrop");
const closeSearchModal = document.getElementById("closeSearchModal");
const openSearchModalBtn = document.getElementById("search-icon-btn");
const modalSearchInput = document.getElementById("modal-search-input");
const htmlTag = document.documentElement;

const trailerModal = document.getElementById("trailer-modal");
const trailerBackdrop = document.getElementById("trailer-backdrop");
const trailerIframe = document.getElementById("trailer-iframe");
const trailerTitle = document.getElementById("trailer-title");
const trailerLoader = document.getElementById("trailer-loader");
const closeTrailer = document.getElementById("close-trailer");
const closeTrailerBottom = document.getElementById("close-trailer-bottom");

const apiKey = `a14cbdc8a097c452f501ce7e17ae5e7b`;
const baseURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

// theme mode toggle

if (localStorage.getItem("theme") === "dark") {
  htmlTag.classList.add("dark");
  iconMoon.classList.add("hidden");
  iconSun.classList.remove("hidden");
} else {
  htmlTag.classList.remove("dark");
  iconMoon.classList.remove("hidden");
  iconSun.classList.add("hidden");
}

const themeMode = () => {
  const isDark = htmlTag.classList.contains("dark");
  if (isDark) {
    htmlTag.classList.remove("dark");
    iconMoon.classList.remove("hidden");
    iconSun.classList.add("hidden");
    localStorage.setItem("theme", "light");
  } else {
    iconMoon.classList.add("hidden");
    iconSun.classList.remove("hidden");
    htmlTag.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

// dropdown menu toggle
const toggleDropdown = () => {
  const isOpen = moviesDdMenu.classList.contains("hidden");
  if (isOpen) {
    moviesDdMenu.classList.remove("hidden");
    ddChevron.classList.add("rotate-180");
  } else {
    moviesDdMenu.classList.add("hidden");
    ddChevron.classList.remove("rotate-180");
  }
  document.addEventListener("click", (e) => {
    if (isOpen) {
      if (e.target !== moviesDdBtn && !moviesDdMenu.contains(e.target)) {
        moviesDdMenu.classList.add("hidden");
        ddChevron.classList.remove("rotate-180");
      }
    }
  });
};

// hamburger menu toggle
const toggleMobileMenu = () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  if (isOpen) {
    mobileMenu.classList.add("hidden");
    menuIconOpen.classList.remove("hidden");
    menuIconClose.classList.add("hidden");
  } else {
    mobileMenu.classList.remove("hidden");
    menuIconOpen.classList.add("hidden");
    menuIconClose.classList.remove("hidden");
  }
};

// search modal toggle
const openSearchModal = () => {
  searchModal.classList.replace("hidden", "flex");
  setTimeout(() => modalSearchInput.focus(), 50);
};
const closeSearchModalFunc = () => {
  searchModal.classList.replace("flex", "hidden");
  modalSearchInput.value = "";
};

// slider
let currentSlide = 0;
const totalSlides = 5;

function goToSlide(index) {
  currentSlide = index;

  heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  heroDots.forEach((dot, i) => {
    if (i === currentSlide) {
      dot.classList.remove("w-2", "bg-white/40");
      dot.classList.add("w-7", "bg-white");
    } else {
      dot.classList.remove("w-7", "bg-white");
      dot.classList.add("w-2", "bg-white/40");
    }
  });
}

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = Number(dot.dataset.slide);

    goToSlide(slideIndex);
  });
});

// display popularMovies
const displaySliderMovies = () => {
  let box = ``;
  popularMovies.forEach((movie) => {
    box += `<div class="relative shrink-0 w-full h-full">
  <img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" alt="${movie.title}" class="absolute inset-0 w-full h-full object-cover"/>
  <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent"></div>
  <div class="relative h-full flex items-center">
    <div class="max-w-screen-xl mx-auto px-6 md:px-16 w-full">
      <div class="max-w-xl">
        <div class="flex items-center gap-3 mb-4">
          <span class="flex items-center gap-1 text-sm font-semibold text-rating">
            <svg class="w-4 h-4 fill-rating" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            ${movie.vote_average.toFixed(1)}
          </span>
          <span class="text-sm text-white/50">${movie.release_date}</span>
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-4 drop-shadow-lg">${movie.title}</h1>
        <p class="text-base text-white/65 leading-relaxed mb-8 max-w-xl">${movie.overview}</p>
        <div class="flex items-center gap-3 flex-wrap">
          <button 
          data-movie-id="${movie.id}"
            class="flex watch-now-btn items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.45)]">
            <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Watch Now
          </button>
          <button data-addmovie-id="${movie.id}" class="flex add-watchlist-btn items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
    
    
    `;
  });
  heroTrack.innerHTML = box;

  const watchButtons = heroTrack.querySelectorAll(".watch-now-btn");

  watchButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const movieId = button.dataset.movieId;

      const movie = popularMovies.find((movie) => movie.id == movieId);

      const trailer = await getMovieTrailer(movie.id);

      openTrailerModal(trailer, movie);
    });
  });
};

// get popular movies to silder
let popularMovies;
const getPopularMovies = async () => {
  const res = await fetch(`${baseURL}`, {
    method: "GET",
  });
  const data = await res.json();
  const movies = data.results.slice(0, 5);
  popularMovies = movies;
  displaySliderMovies();
};
getPopularMovies();

// get movie trailer
const getMovieTrailer = async (movieId) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`,
  );

  const data = await res.json();

  const trailer =
    data.results.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official === true,
    ) ||
    data.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    );

  return trailer;
};
// open trailer modal
const openTrailerModal = (trailer, movie) => {
  if (!trailer) {
    alert("Trailer not available");
    return;
  }

  trailerModal.classList.remove("hidden");
  trailerModal.classList.add("flex");

  trailerTitle.textContent = movie.title;

  trailerLoader.classList.remove("hidden");

  trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

  trailerIframe.onload = () => {
    trailerLoader.classList.add("hidden");
  };
};
// close trailer modal

const closeTrailerModal = () => {
  trailerModal.classList.add("hidden");
  trailerModal.classList.remove("flex");

  trailerIframe.src = "";
};

// add movie to wishlist
const addToWishlist = () => {
  htmlTag.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-watchlist-btn");
    if (!addBtn) return;
    const dataId = Number(addBtn.dataset.addmovieId);
    const findMovie = popularMovies.find((movie) => movie.id === dataId);
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = wishlist.some((movie) => movie.id === dataId);
    if (!alreadyExists) {
      wishlist.push(findMovie);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        theme: "dark",
        title: "Added to Watchlist",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        theme: "dark",
        title: "Already in Watchlist",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    }
  });
};

addToWishlist();
// ------------- Event Listeners -------------

// theme toggle btn
themeToggle.addEventListener("click", themeMode);

// dropdown btn
moviesDdBtn.addEventListener("click", toggleDropdown);

// hamburger btn
hamburgerBtn.addEventListener("click", toggleMobileMenu);

// open search modal btn
openSearchModalBtn.addEventListener("click", openSearchModal);

// close search modal btn
closeSearchModal.addEventListener("click", closeSearchModalFunc);

// if i click on anything out of the search model close it
document.addEventListener("click", (e) => {
  if (!searchModal.classList.contains("hidden")) {
    if (e.target === backdrop) {
      closeSearchModalFunc();
    }
  }
});

// if i click on esc close search model
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {
    closeSearchModalFunc();
  }
});

// slider next btn
heroNext.addEventListener("click", () => {
  currentSlide++;
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  goToSlide(currentSlide);
});

// slider prev btn
heroPrev.addEventListener("click", () => {
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  goToSlide(currentSlide);
});

closeTrailer.addEventListener("click", closeTrailerModal);

closeTrailerBottom.addEventListener("click", closeTrailerModal);

trailerBackdrop.addEventListener("click", closeTrailerModal);
