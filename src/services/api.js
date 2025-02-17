const BASE_URL = "https://api.jikan.moe/v4";

export const animeApi = {
  getGenres: () => fetch(`${BASE_URL}/genres/anime`).then((res) => res.json()),

  getWatchEpisodes: () => fetch(`${BASE_URL}/watch/episodes`).then((res) => res.json()),

  getPopular: () => fetch(`${BASE_URL}/top/anime`).then((res) => res.json()),

  searchAnime: ({ page = 1, searchQuery = "", genres = "" }) => {
    const searchParam = searchQuery ? `&q=${searchQuery}` : "";
    const genreParam = genres ? `&genres=${genres}` : "";
    return fetch(`${BASE_URL}/anime?page=${page}${searchParam}${genreParam}`).then((res) => res.json());
  },

  getAllEpisodesURL: ({ animeID = "" }) => fetch(`${BASE_URL}/anime/${animeID}/episodes`).then((res) => res.json()),
  getRecommendedAnime: ({ animeID = "" }) => fetch(`${BASE_URL}/anime/${animeID}/recommendations`).then((res) => res.json()),
  getAnimeData: ({ animeID = "" }) => fetch(`${BASE_URL}/anime/${animeID}`).then((res) => res.json()),
};
