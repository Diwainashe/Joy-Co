class ReviewsManager {
  constructor(containerId = 'reviews-section', badgeId = 'pending-badge') {
    this.container = document.getElementById(containerId);
    this.badge = document.getElementById(badgeId);
    this.reviews = [];
    this.currentTab = 'pending';
  }

  async init() {
    if (!this.container) return;
    await this.loadPending();
    this._setupTabButtons();
    this._setupEventDelegation();
  }

  _setupTabButtons() {
    const tabButtons = this.container.querySelectorAll('[data-tab]');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTab(btn.dataset.tab);
      });
    });
  }

  _setupEventDelegation() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        const { action, id, tab } = btn.dataset;
        if (action === 'approve') this.approve(id);
        else if (action === 'delete') this.delete(id, tab);
      }
    });
  }

  async loadPending() {
    this.currentTab = 'pending';
    try {
      const { data, error } = await window.joycoSupabase.client
        .from('reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.reviews = data || [];
      this._render();
      this._updateBadge();
    } catch (err) {
      console.error('Error loading pending reviews:', err);
    }
  }

  async loadApproved() {
    this.currentTab = 'approved';
    try {
      const { data, error } = await window.joycoSupabase.client
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.reviews = data || [];
      this._render();
    } catch (err) {
      console.error('Error loading approved reviews:', err);
    }
  }

  async approve(id) {
    try {
      const { error } = await window.joycoSupabase.client
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      await this.loadPending();
    } catch (err) {
      console.error('Error approving review:', err);
    }
  }

  async delete(id, tab) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await window.joycoSupabase.client
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (tab === 'pending') {
        await this.loadPending();
      } else {
        await this.loadApproved();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  }

  showTab(tab) {
    if (tab === 'pending') {
      this.loadPending();
    } else if (tab === 'approved') {
      this.loadApproved();
    }
  }

  _render() {
    const tableBody = this.container.querySelector('tbody');
    if (!tableBody) return;

    if (this.reviews.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-secondary);">No ${this.currentTab} reviews</td></tr>`;
      return;
    }

    tableBody.innerHTML = this.reviews.map(review => `
      <tr>
        <td>${review.name}</td>
        <td>${review.location || '-'}</td>
        <td>${'⭐'.repeat(review.rating)}</td>
        <td>${review.body.substring(0, 50)}...</td>
        <td>
          <div class="action-buttons">
            ${this.currentTab === 'pending' ? `<button class="action-btn" data-action="approve" data-id="${review.id}" data-tab="pending">Approve</button>` : ''}
            <button class="action-btn delete" data-action="delete" data-id="${review.id}" data-tab="${this.currentTab}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  _updateBadge() {
    if (this.badge) {
      const count = this.reviews.length;
      if (count > 0) {
        this.badge.textContent = count;
        this.badge.style.display = 'inline-flex';
      } else {
        this.badge.style.display = 'none';
      }
    }
  }
}
