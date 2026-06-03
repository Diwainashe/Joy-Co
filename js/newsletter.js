class NewsletterForm {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
  }

  init() {
    if (!this.container) return;

    const form = this.container.querySelector('form');
    const messageEl = this.container.querySelector('.newsletter-message');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.subscribe();
      });
    }
  }

  async subscribe() {
    const form = this.container.querySelector('form');
    const emailInput = form.querySelector('input[type="email"]');
    const nameInput = form.querySelector('input[type="text"]');
    const messageEl = this.container.querySelector('.newsletter-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    const name = nameInput?.value.trim() || null;

    if (!email) {
      this._showMessage('Please enter your email', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    try {
      const { error } = await window.joycoSupabase.client
        .from('newsletter_subscribers')
        .insert([{ email, name, subscribed_at: new Date().toISOString() }]);

      if (error) {
        if (error.code === '23505') {
          this._showMessage('You\'re already subscribed!', 'info');
        } else {
          throw error;
        }
      } else {
        this._showMessage('✓ You\'re subscribed! Check your inbox.', 'success');
        form.reset();
      }
    } catch (err) {
      console.error('Newsletter signup error:', err);
      this._showMessage('Error subscribing. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
    }
  }

  _showMessage(text, type) {
    const messageEl = this.container.querySelector('.newsletter-message');
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.className = `newsletter-message newsletter-message--${type}`;
      messageEl.style.display = 'block';
      if (type === 'success') {
        setTimeout(() => {
          messageEl.style.display = 'none';
        }, 4000);
      }
    }
  }
}
