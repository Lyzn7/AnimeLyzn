const BASE_URL = 'https://www.sankavollerei.com/anime';

export const getHomeData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/home`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { status: 'error', data: { ongoing_anime: [], complete_anime: [] } };
  }
};

export const getAnimeDetail = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${slug}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching anime detail:", error);
    return { status: 'error', data: null };
  }
};

export const searchAnime = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error searching anime:", error);
    return { status: 'error', data: [] };
  }
};

export const getSchedule = async () => {
  try {
    const response = await fetch(`${BASE_URL}/schedule`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { status: 'error', data: [] };
  }
};

export const getOngoingAnime = async (page = 1) => {
  try {
    const url = `${BASE_URL}/ongoing-anime${page ? `?page=${page}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching ongoing anime:", error);
    return { status: 'error', data: [] };
  }
};

export const getCompletedAnime = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/complete-anime/${page}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching completed anime:", error);
    return { status: 'error', data: [] };
  }
};

export const getGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    return { status: 'error', data: [] };
  }
};

export const getAnimeByGenre = async (slug, page = 1) => {
  try {
    const url = `${BASE_URL}/genre/${slug}${page ? `?page=${page}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    return { status: 'error', data: [] };
  }
};

export const getEpisodeDetail = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/episode/${slug}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching episode detail:", error);
    return { status: 'error', data: null };
  }
};

export const getBatchDownload = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/batch/${slug}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching batch download:", error);
    return { status: 'error', data: null };
  }
};

export const getServerUrl = async (serverId) => {
  try {
    // serverId bisa sudah termasuk prefix /anime/server/
    let path = serverId;
    if (serverId.startsWith('http')) {
      path = serverId;
    } else {
      const clean = serverId.startsWith('/anime') ? serverId.replace('/anime', '') : (serverId.startsWith('/') ? serverId : `/${serverId}`);
      path = `${BASE_URL}${clean}`;
    }
    const response = await fetch(path);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching server url:", error);
    return { status: 'error', url: null };
  }
};

export const getAllAnime = async () => {
  try {
    const response = await fetch(`${BASE_URL}/unlimited`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching all anime:", error);
    return { status: 'error', data: [] };
  }
};
