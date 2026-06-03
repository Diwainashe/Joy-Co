class ReviewsCarousel {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.reviews = [];
  }

  async load() {
    if (!this.container) return;

    try {
      const { data: reviews, error } = await window.joycoSupabase.client
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!reviews || reviews.length === 0) {
        this._renderPlaceholder();
        return;
      }

      this.reviews = reviews;
      this._render();

    } catch (error) {
      console.error('Error loading reviews:', error);
      this.container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Unable to load reviews. Please try again later.</p>';
    }
  }

  _renderPlaceholder() {
    this.container.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-2xl); background: var(--color-neutral-50);">
        <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">Be the first to leave a review! Share your Joy&Co experience.</p>
      </div>
    `;
  }

  _render() {
    if (this.reviews.length === 1) {
      this.container.innerHTML = this._renderCard(this.reviews[0]);
      return;
    }

    const reviewsHtml = `
      <div style="position: relative;">
        <div class="carousel-wrapper" id="reviews-wrapper">
          <div class="carousel-track" id="reviews-track" style="display: grid; grid-template-columns: repeat(${this.reviews.length}, 1fr); gap: var(--space-lg);">
            ${this.reviews.map(r => this._renderCard(r)).join('')}
          </div>
          <button class="carousel-btn carousel-btn--prev" data-action="prev">❮</button>
          <button class="carousel-btn carousel-btn--next" data-action="next">❯</button>
        </div>
        <div class="carousel-dots" id="reviews-dots">
          ${this.reviews.map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to review ${i + 1}"></button>`).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = reviewsHtml;

    const wrapper = document.getElementById('reviews-wrapper');
    const track = document.getElementById('reviews-track');
    const dotsContainer = document.getElementById('reviews-dots');

    if (track) {
      track.style.transition = 'transform 0.5s ease';

      wrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (btn) {
          if (btn.dataset.action === 'next') this.next();
          else if (btn.dataset.action === 'prev') this.prev();
        }
      });

      dotsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-index]');
        if (btn) this.goTo(parseInt(btn.dataset.index));
      });

      wrapper.addEventListener('mouseenter', () => this.pause());
      wrapper.addEventListener('mouseleave', () => this.play());
      this.play();
    }
  }

  _renderCard(review) {
    return `
      <div class="card" style="padding: var(--space-2xl); min-height: 200px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="margin-bottom: var(--space-md);">
            ${'⭐'.repeat(review.rating)}<span style="color: var(--color-neutral-300);">${'⭐'.repeat(5 - review.rating)}</span>
          </div>
          <p style="margin-bottom: var(--space-md); font-size: 1.05rem; line-height: 1.6;">"${review.body}"</p>
        </div>
        <p style="font-weight: 600; color: var(--text-primary);">- ${review.name}${review.location ? `, ${review.location}` : ''}</p>
      </div>
    `;
  }

  _update() {
    const track = document.getElementById('reviews-track');
    if (!track) return;

    const offset = this.currentIndex * -100;
    track.style.transform = `translateX(${offset}%)`;

    const dotsContainer = document.getElementById('reviews-dots');
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === this.currentIndex);
      });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
    this._update();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;
    this._update();
  }

  goTo(index) {
    if (index >= 0 && index < this.reviews.length) {
      this.currentIndex = index;
      this._update();
    }
  }

  play() {
    this.autoplayInterval = setInterval(() => this.next(), 4000);
  }

  pause() {
    clearInterval(this.autoplayInterval);
  }
}
