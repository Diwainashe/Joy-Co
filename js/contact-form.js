class ContactForm {
  constructor(formId) {
    this.formId = formId;
    this.form = document.getElementById(formId);
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this._handleSubmit(e));
  }

  async _handleSubmit(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      location: document.getElementById('location').value || null,
      rating: parseInt(this.form.querySelector('input[name="rating"]:checked').value),
      body: document.getElementById('body').value,
      status: 'pending'
    };

    const btn = this.form.querySelector('.submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
      const { error } = await window.joycoSupabase.client
        .from('reviews')
        .insert([formData]);

      if (error) throw error;

      this._showToast('✓ Thanks! Your review will appear once approved.');
      this.form.reset();
      document.getElementById('star5').checked = false;
    } catch (error) {
      console.error('Error submitting review:', error);
      this._showToast('✗ Something went wrong. Please try again.', 'error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  _showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 16px 24px;
      border-radius: 6px;
      z-index: 1000;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}
