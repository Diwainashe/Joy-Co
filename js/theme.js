class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'joyco_theme';
    this.DEFAULT_THEME = 'noir';
  }

  async init() {
    // Apply cached theme immediately (no flash — also applies before Supabase loads)
    const cached = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_THEME;
    this._apply(cached);

    // Sync from Supabase (source of truth) in the background
    try {
      if (!window.joycoSupabase?.client) return;
      const { data } = await window.joycoSupabase.client
        .from('site_settings')
        .select('value')
        .eq('key', 'theme')
        .single();

      if (data?.value) {
        this._apply(data.value);
      }
    } catch {
      // Supabase table may not exist yet — cached theme is fine
    }
  }

  _apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}

// Apply theme immediately on script load (no waiting for DOMContentLoaded)
;(function() {
  const stored = localStorage.getItem('joyco_theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);
})();
