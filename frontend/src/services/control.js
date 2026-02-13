const DEFAULT_URL = import.meta.env.VITE_CONTROL_URL;

const normalizeStatus = (value) => {
  if (typeof value === 'boolean') return value ? 'active' : 'inactive';
  const text = (value || '').toString().trim().toLowerCase();
  if (['aktif', 'active', 'on', 'enabled'].includes(text)) return 'active';
  if (['nonaktif', 'inactive', 'off', 'disabled', 'mati'].includes(text)) return 'inactive';
  return 'inactive';
};

export const fetchControlStatus = async (signal) => {
  if (!DEFAULT_URL) {
    throw new Error('VITE_CONTROL_URL belum di-set. Isi URL raw control.json GitHub.');
  }

  const response = await fetch(DEFAULT_URL, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Gagal memuat control.json dari GitHub');
  const json = await response.json();

  const status = normalizeStatus(json.status ?? json.state ?? json.mode ?? json.active);
  const message = json.message || json.notice || json.reason || '';
  const updatedAt = json.updated_at || json.updatedAt || json.last_updated || json.timestamp;

  return {
    status,
    message,
    updatedAt,
  };
};
