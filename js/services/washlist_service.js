const wishlistGrid = document.getElementById("wishlistGrid");
const wishlistCount = document.getElementById("wishlistCount");
const searchInput = document.getElementById("wishlistSearch");
const emptyState = document.getElementById("empty-wishlist");
const htmlTag = document.documentElement;

// theme mode
if (localStorage.getItem("theme") === "dark") {
  htmlTag.classList.add("dark");
} else {
  htmlTag.classList.remove("dark");
}

// get washlist from localstrorage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const renderWishlist = (movies = wishlist) => {
  wishlistGrid.innerHTML = "";
  wishlistCount.textContent = `${movies.length} Movies`;
  if (movies.length === 0) {
    wishlistGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  wishlistGrid.classList.remove("hidden");
  emptyState.classList.add("hidden");
  displayMovie(movies);
};

const displayMovie = (movies = wishlist) => {
  let box = ``;
  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Poster";

    const rating =
      typeof movie.vote_average === "number"
        ? movie.vote_average.toFixed(1)
        : "N/A";

    const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";

    box += `
    
    <article class="group">
<div
    class="relative aspect-[2/3] overflow-hidden rounded-2xl
    border border-zinc-200 bg-white shadow-sm
    transition duration-300 hover:-translate-y-1 hover:shadow-xl
    dark:border-white/[0.08] dark:bg-zinc-900 dark:shadow-black/20"
>
    <img
    src="${poster}"
    alt="${movie.title || "Movie"}"
    class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    loading="lazy"
    />
    <div
    class="absolute inset-x-0 bottom-0 h-1/2
    bg-gradient-to-t from-black/95 via-black/30 to-transparent"
    ></div>

    <div
    class="absolute left-3 top-3 flex items-center gap-1.5
    rounded-lg border border-white/10 bg-black/60
    px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
    >
    <span class="text-yellow-400">★</span>
    ${rating}
    </div>

    <button
    type="button"
    data-id="${movie.id}"
    aria-label="Remove from wishlist"
    class="remove-wishlist absolute right-3 top-3
    flex h-9 w-9 items-center justify-center rounded-xl
    border border-white/10 bg-black/60 text-pink-400
    backdrop-blur-md transition hover:bg-pink-500 hover:text-white"
    >
    ♥
    </button>

    <div class="absolute inset-x-0 bottom-0 p-4">
    <p class="mb-1 text-xs text-zinc-300">
        ${year}
    </p>

    <h3 class="line-clamp-1 text-base font-bold text-white">
        ${movie.title || "Unknown Movie"}
    </h3>
    </div>

</div>
</article>
`;
  });
  wishlistGrid.innerHTML = box;
};

renderWishlist();

const deleteMovie = async (movieId) => {
  const result = await Swal.fire({
    title: "Remove from Watchlist?",
    text: "This movie will be removed from your watchlist.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    background: "#18181b",
    color: "#fff",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#3f3f46",
  });

  if (!result.isConfirmed) return;

  wishlist = wishlist.filter((movie) => movie.id !== movieId);

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  renderWishlist();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Removed from Watchlist",
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
};

wishlistGrid.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-wishlist");

  if (!removeBtn) return;

  const movieId = Number(removeBtn.dataset.id);

  deleteMovie(movieId);
});

const searchInWishlist = () => {
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    const filteredMovies = wishlist.filter((movie) =>
      movie.title.toLowerCase().includes(searchValue),
    );
    renderWishlist(filteredMovies);
  });
};

searchInWishlist();
