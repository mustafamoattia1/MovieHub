/* ============================================================
   CONFIG
   ============================================================ */

const TMDB_api_KEY = window.TMDB_api_KEY || "a14cbdc8a097c452f501ce7e17ae5e7b";
const TMDB_BASE_url = "https://api.themoviedb.org/3";

/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const trailerElements = {
  modal: document.getElementById("trailer-modal"),
  iframe: document.getElementById("trailer-iframe"),
  title: document.getElementById("trailer-title"),
  loader: document.getElementById("trailer-loader"),
  message: document.getElementById("trailer-message"),
  closeTop: document.getElementById("close-trailer"),
  closeBottom: document.getElementById("close-trailer-bottom"),
  backdrop: document.getElementById("trailer-backdrop"),
};

/* ============================================================
   DATA
   ============================================================ */

/**
 * Fetches the best available YouTube trailer for a movie.
 * Prefers an official trailer, falls back to any YouTube trailer,
 * and resolves to null if none exists or the request fails.
 */
async function getMovieTrailer(movieId) {
  try {
    const response = await fetch(
      `${TMDB_BASE_url}/movie/${movieId}/videos?api_key=${TMDB_api_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch movie trailer");

    const data = await response.json();

    const officialTrailer = data.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer" && video.official === true
    );

    if (officialTrailer) return officialTrailer;

    return (
      data.results.find((video) => video.site === "YouTube" && video.type === "Trailer") || null
    );
  } catch (error) {
    return null;
  }
}

/* ============================================================
   MODAL
   ============================================================ */

function openTrailerModal(trailer, movie) {
  const { modal, iframe, title, loader, message } = trailerElements;
  if (!modal || !iframe) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");

  if (title) {
    title.textContent = movie?.title || "Movie Trailer";
  }

  if (!trailer) {
    iframe.src = "";
    loader?.classList.add("hidden");
    if (message) {
      message.textContent = "Trailer not available for this movie.";
      message.classList.remove("hidden");
    }
    return;
  }

  message?.classList.add("hidden");
  loaderl?.cassList.remove("hidden");

  iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
  iframe.onload = () => loader?.classList.add("hidden");
}

function closeTrailerModal() {
  const { modal, iframe, message } = trailerElements;
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");

  if (iframe) iframe.src = "";
  message?.classList.add("hidden");
}

/* ============================================================
   INIT
   ============================================================ */

function initTrailerModal() {
  trailerElements.closeTop?.addEventListener("click", closeTrailerModal);
  trailerElements.closeBottom?.addEventListener("click", closeTrailerModal);
  trailerElements.backdrop?.addEventListener("click", closeTrailerModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTrailerModal();
  });
}

initTrailerModal();