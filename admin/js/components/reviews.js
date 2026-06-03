export class ReviewsSection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
    this.currentTab = 'pending';
  }

  init() {
    this._wireTabs();
  }

  showTab(tabName) {
    if (tabName === 'pending') {
      this.currentTab = 'pending';
      document.getElementById('pending-reviews-container').style.display = 'block';
      document.getElementById('approved-reviews-container').style.display = 'none';
      document.getElementById('pending-tab').style.background = 'var(--jc-gold)';
      document.getElementById('pending-tab').style.color = 'black';
      document.getElementById('approved-tab').style.background = 'transparent';
      document.getElementById('approved-tab').style.color = 'var(--text-primary)';
      this._loadPendingReviews();
    } else if (tabName === 'approved') {
      this.currentTab = 'approved';
      document.getElementById('pending-reviews-container').style.display = 'none';
      document.getElementById('approved-reviews-container').style.display = 'block';
      document.getElementById('pending-tab').style.background = 'transparent';
      document.getElementById('pending-tab').style.color = 'var(--text-primary)';
      document.getElementById('approved-tab').style.background = 'var(--jc-gold)';
      document.getElementById('approved-tab').style.color = 'black';
      this._loadApprovedReviews();
    }
  }

  async onShow() {
    if (this.currentTab === 'pending') {
      await this._loadPendingReviews();
    } else {
      await this._loadApprovedReviews();
    }
  }

  _wireTabs() {
    const pendingTab = document.getElementById('pending-tab');
    const approvedTab = document.getElementById('approved-tab');

    if (pendingTab) {
      pendingTab.addEventListener('click', async () => {
        this.currentTab = 'pending';
        document.getElementById('pending-reviews-container').style.display = 'block';
        document.getElementById('approved-reviews-container').style.display = 'none';
        pendingTab.style.background = 'var(--jc-gold)';
        pendingTab.style.color = 'black';
        approvedTab.style.background = 'transparent';
        approvedTab.style.color = 'var(--text-primary)';
        await this._loadPendingReviews();
      });
    }

    if (approvedTab) {
      approvedTab.addEventListener('click', async () => {
        this.currentTab = 'approved';
        document.getElementById('pending-reviews-container').style.display = 'none';
        document.getElementById('approved-reviews-container').style.display = 'block';
        pendingTab.style.background = 'transparent';
        pendingTab.style.color = 'var(--text-primary)';
        approvedTab.style.background = 'var(--jc-gold)';
        approvedTab.style.color = 'black';
        await this._loadApprovedReviews();
      });
    }
  }

  async _loadPendingReviews() {
    try {
      const { data: reviews, error } = await this.supabase
        .from('reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tbody = document.getElementById('pending-reviews-tbody');
      if (!reviews || reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">No pending reviews</td></tr>';
        return;
      }

      tbody.innerHTML = reviews.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${r.location || '—'}</td>
          <td>${'⭐'.repeat(r.rating)}</td>
          <td style="max-width: 300px; white-space: normal;">${r.body.substring(0, 80)}${r.body.length > 80 ? '...' : ''}</td>
          <td>${new Date(r.created_at).toLocaleDateString('en-ZA')}</td>
          <td>
            <button class="btn btn-sm btn-primary approve-btn" data-review-id="${r.id}" style="margin-right: 4px;">Approve</button>
            <button class="btn btn-sm btn-secondary delete-btn" data-review-id="${r.id}">Delete</button>
          </td>
        </tr>
      `).join('');

      this._wireReviewActions('pending');
    } catch (err) {
      console.error('Error loading pending reviews:', err);
      document.getElementById('pending-reviews-tbody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Error loading reviews</td></tr>';
    }
  }

  async _loadApprovedReviews() {
    try {
      const { data: reviews, error } = await this.supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tbody = document.getElementById('approved-reviews-tbody');
      if (!reviews || reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">No approved reviews</td></tr>';
        return;
      }

      tbody.innerHTML = reviews.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${r.location || '—'}</td>
          <td>${'⭐'.repeat(r.rating)}</td>
          <td style="max-width: 300px; white-space: normal;">${r.body.substring(0, 80)}${r.body.length > 80 ? '...' : ''}</td>
          <td>${new Date(r.created_at).toLocaleDateString('en-ZA')}</td>
          <td>
            <button class="btn btn-sm btn-secondary delete-btn" data-review-id="${r.id}">Delete</button>
          </td>
        </tr>
      `).join('');

      this._wireReviewActions('approved');
    } catch (err) {
      console.error('Error loading approved reviews:', err);
      document.getElementById('approved-reviews-tbody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Error loading reviews</td></tr>';
    }
  }

  _wireReviewActions(tab) {
    const container = tab === 'pending' ? document.getElementById('pending-reviews-tbody') : document.getElementById('approved-reviews-tbody');

    container.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reviewId = e.target.dataset.reviewId;
        this._approveReview(reviewId);
      });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reviewId = e.target.dataset.reviewId;
        this._deleteReview(reviewId, tab);
      });
    });
  }

  async _approveReview(id) {
    if (!confirm('Approve this review?')) return;
    try {
      const { error } = await this.supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      await this._loadPendingReviews();
    } catch (err) {
      console.error('Error approving review:', err);
      alert('Error approving review');
    }
  }

  async _deleteReview(id, tab) {
    if (!confirm('Delete this review?')) return;
    try {
      const { error } = await this.supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (tab === 'pending') await this._loadPendingReviews();
      else await this._loadApprovedReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Error deleting review');
    }
  }
}
