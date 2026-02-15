const HISTORY_KEY = 'animeapp-history';
const MAX_ITEMS = 50;

const readHistory = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to read history', err);
    return [];
  }
};

const writeHistory = (list) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to write history', err);
  }
};

export const addHistory = (entry) => {
  if (!entry?.slug) return;
  const list = readHistory();
  const filtered = list.filter((item) => item.slug !== entry.slug);
  const now = new Date().toISOString();
  const newItem = {
    slug: entry.slug,
    title: entry.title || 'Unknown title',
    poster: entry.poster,
    lastViewed: entry.lastViewed || now,
  };
  const next = [newItem, ...filtered].slice(0, MAX_ITEMS);
  writeHistory(next);
  return next;
};

export const getHistory = () => readHistory();

export const clearHistory = () => {
  writeHistory([]);
};
