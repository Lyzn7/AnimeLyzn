const BASE_URL = 'https://www.sankavollerei.com/anime/samehadaku';

const normalizeSlug = (value = '') => {
  if (!value) return '';
  if (typeof value === 'string') {
    const cleaned = value.replace(/^https?:\/\//, '').replace(/^.*?(\/anime\/)?/, '');
    const parts = cleaned.split('/').filter(Boolean);
    return parts.pop() || '';
  }
  return '';
};

const normalizeAnimeCard = (item = {}) => {
  const slug = item.slug || item.animeId || normalizeSlug(item.href);
  const episodeNumber = item.current_episode || item.episode || item.episodes || item.eps;

  return {
    title: item.title || item.anime_name || item.name || '',
    slug,
    poster: item.poster || item.img || item.image || '',
    current_episode: item.current_episode || (episodeNumber ? `Episode ${episodeNumber}` : undefined),
    episode_count: item.episode_count || item.episodes || item.eps,
    release_day: item.release_day || item.releaseDay,
    newest_release_date: item.newest_release_date || item.latestReleaseDate,
    last_release_date: item.last_release_date || item.lastReleaseDate,
    rating: item.rating || item.score,
    season: item.season,
  };
};

const normalizePagination = (p = {}) => ({
  has_previous_page: p.has_previous_page ?? p.hasPrevPage ?? false,
  previous_page: p.previous_page ?? p.prevPage ?? null,
  has_next_page: p.has_next_page ?? p.hasNextPage ?? false,
  next_page: p.next_page ?? p.nextPage ?? null,
  current_page: p.current_page ?? p.currentPage ?? 1,
  last_visible_page: p.last_visible_page ?? p.totalPages ?? p.lastVisiblePage ?? null,
});

const mapDownloadUrls = (downloadUrl) => {
  if (!downloadUrl?.qualities) return null;
  const normalized = downloadUrl.qualities.map((q) => ({
    resolution: q.title,
    size: q.size,
    urls: (q.urls || []).map((u) => ({ provider: u.title, url: u.url })),
  }));
  return { download: normalized };
};

export const getHomeData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/home`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const ongoingList = json.data?.ongoing?.animeList || [];
    const completeList = json.data?.completed?.animeList || [];

    return {
      ...json,
      data: {
        ongoing_anime: ongoingList.map((item) =>
          normalizeAnimeCard({
            ...item,
            current_episode: item.episodes ? `Episode ${item.episodes}` : undefined,
          })
        ),
        complete_anime: completeList.map((item) =>
          normalizeAnimeCard({
            ...item,
            episode_count: item.episodes,
            last_release_date: item.lastReleaseDate,
          })
        ),
      },
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { status: 'error', data: { ongoing_anime: [], complete_anime: [] } };
  }
};

export const getAnimeDetail = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${slug}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const data = json.data || {};
    const genres = (data.genreList || data.genres || []).map((g) => ({
      name: g.name || g.title,
      slug: g.slug || g.genreId,
    }));
    const episode_lists = (data.episodeList || data.episode_lists || []).map((ep) => ({
      slug: normalizeSlug(ep.slug || ep.episodeId || ep.href),
      episode_number: ep.episode_number || ep.eps || ep.episode || '',
      episode: ep.title || ep.episode || '',
    }));
    const recommendations = (data.recommendedAnimeList || data.recommendations || []).map((rec) =>
      normalizeAnimeCard(rec)
    );
    const batch = data.batch
      ? {
          ...data.batch,
          slug: data.batch.slug || data.batch.batchId || normalizeSlug(data.batch.href),
        }
      : null;

    return {
      ...json,
      data: {
        title: data.title,
        poster: data.poster,
        japanese_title: data.japanese || data.japanese_title,
        rating: data.score || data.rating,
        status: data.status,
        type: data.type,
        release_date: data.aired || data.release_date,
        duration: data.duration,
        studio: data.studios || data.studio,
        synopsis:
          typeof data.synopsis === 'string'
            ? data.synopsis
            : data.synopsis?.paragraphs?.join('\n\n') || '',
        genres,
        batch,
        episode_lists,
        recommendations,
      },
    };
  } catch (error) {
    console.error("Error fetching anime detail:", error);
    return { status: 'error', data: null };
  }
};

export const searchAnime = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const list = json.data?.animeList || [];
    return { ...json, data: list.map(normalizeAnimeCard) };
  } catch (error) {
    console.error("Error searching anime:", error);
    return { status: 'error', data: [] };
  }
};

export const getSchedule = async () => {
  try {
    const response = await fetch(`${BASE_URL}/schedule`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const mapped = (json.data || []).map((day) => ({
      ...day,
      anime_list: (day.anime_list || []).map((a) => ({
        ...a,
        anime_name: a.anime_name || a.title,
        slug: a.slug || normalizeSlug(a.href),
      })),
    }));
    return { ...json, data: mapped };
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { status: 'error', data: [] };
  }
};

export const getOngoingAnime = async (page = 1) => {
  try {
    const url = `${BASE_URL}/ongoing`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const list = json.data?.animeList || json.data?.ongoingAnimeData || [];
    const pagination = normalizePagination(json.pagination || json.data?.pagination);
    const anime = list.map(normalizeAnimeCard);

    return {
      ...json,
      data: { anime, pagination, ongoingAnimeData: anime, paginationData: pagination },
    };
  } catch (error) {
    console.error("Error fetching ongoing anime:", error);
    return { status: 'error', data: [] };
  }
};

export const getCompletedAnime = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/complete-anime?page=${page}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const list = json.data?.animeList || json.data?.completeAnimeData || [];
    const pagination = normalizePagination(json.pagination || json.data?.pagination);
    const anime = list.map((item) =>
      normalizeAnimeCard({
        ...item,
        episode_count: item.episodes,
        last_release_date: item.lastReleaseDate,
      })
    );

    return {
      ...json,
      data: { anime, pagination, completeAnimeData: anime, paginationData: pagination },
    };
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
    const json = await response.json();
    const list = json.data?.animeList || [];
    const pagination = normalizePagination(json.pagination || json.data?.pagination);
    const anime = list.map((item) =>
      normalizeAnimeCard({
        ...item,
        episode_count: item.episodes,
        rating: item.score,
      })
    );
    return { ...json, data: { anime, pagination } };
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    return { status: 'error', data: [] };
  }
};

export const getEpisodeDetail = async (slug) => {
  try {
    const response = await fetch(`${BASE_URL}/episode/${slug}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    const data = json.data || {};
    const stream_servers = (data.server?.qualities || []).map((q) => ({
      quality: q.title,
      servers: (q.serverList || []).map((srv) => ({
        name: srv.title,
        id: srv.serverId,
        url: srv.href?.startsWith('http') ? srv.href : `${BASE_URL}${srv.href || ''}`,
      })),
    }));
    const download_urls = mapDownloadUrls(data.downloadUrl);
    const episode_lists = (data.info?.episodeList || []).map((ep) => ({
      slug: normalizeSlug(ep.episodeId || ep.href),
      episode_number: ep.eps || ep.episode,
      episode: ep.title || ep.episode,
    }));

    return {
      ...json,
      data: {
        episode: data.title,
        anime: { slug: data.animeId },
        stream_url: data.defaultStreamingUrl,
        previous_episode: data.hasPrevEpisode && data.prevEpisode
          ? { slug: normalizeSlug(data.prevEpisode.episodeId || data.prevEpisode.href) }
          : null,
        next_episode: data.hasNextEpisode && data.nextEpisode
          ? { slug: normalizeSlug(data.nextEpisode.episodeId || data.nextEpisode.href) }
          : null,
        stream_servers,
        download_urls,
        episode_lists,
      },
    };
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
    const json = await response.json();
    return { status: json.status, url: json.data?.url || null };
  } catch (error) {
    console.error("Error fetching server url:", error);
    return { status: 'error', url: null };
  }
};

export const getAllAnime = async () => {
  try {
    const response = await fetch(`${BASE_URL}/unlimited`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    // Flatten grouped list and attach a placeholder poster so cards render nicely
    const groups = json.data?.list || [];
    const anime = groups.flatMap((g) =>
      (g.animeList || []).map((item) =>
        normalizeAnimeCard({
          ...item,
          poster: item.poster || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.title)}`,
        })
      )
    );
    return { ...json, data: anime };
  } catch (error) {
    console.error("Error fetching all anime:", error);
    return { status: 'error', data: [] };
  }
};

export const searchNeko = async (query) => {
  if (!query) return { status: 'error', data: [], message: 'query_required' };
  try {
    const response = await fetch(`${BASE_URL}/neko/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error searching neko:", error);
    return { status: 'error', data: [], message: 'search_failed' };
  }
};

export const getNekoDetail = async (url) => {
  if (!url) return { status: 'error', data: null, message: 'url_required' };
  try {
    const encoded = encodeURIComponent(url);
    const response = await fetch(`${BASE_URL}/neko/get?url=${encoded}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching neko detail:", error);
    return { status: 'error', data: null, message: 'detail_failed' };
  }
};
