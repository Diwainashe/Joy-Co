export class DashboardSection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
  }

  init() {
    // action cards wired via inline onclick="showSection(...)" in HTML
  }

  async onShow() {
    await this._loadStats();
  }

  async _loadStats() {
    try {
      const { count: itemsCount } = await this.supabase
        .from('items')
        .select('*', { count: 'exact', head: true });

      const { count: packagesCount } = await this.supabase
        .from('packages')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await this.supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      document.getElementById('stat-items').textContent = itemsCount || 0;
      document.getElementById('stat-packages').textContent = packagesCount || 0;
      document.getElementById('stat-bookings').textContent = '0';
      document.getElementById('stat-revenue').textContent = 'R 0';

      const badge = document.getElementById('pending-badge');
      if (badge) {
        if (pendingCount > 0) {
          badge.textContent = pendingCount;
          badge.style.display = 'inline-flex';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

}
