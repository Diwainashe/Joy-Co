class Carousel {
  constructor(name, images, altTexts, options = {}) {
    this.name = name;
    this.images = images;
    this.altTexts = altTexts;
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.minForScroll = options.minForScroll ?? 3;
    this.autoplayDelay = options.autoplayDelay ?? 3500;

    // Elements
    this.wrapper = document.getElementById(`carousel-${name}`);
    this.track = document.getElementById(`carousel-${name}-track`);
    this.dotsContainer = document.getElementById(`carousel-${name}-dots`);

    this.scrollable = this.images.length > this.minForScroll;
    this.isMobile = window.innerWidth <= 640;
    this.slideWidth = this.isMobile ? 240 + 12 : 300 + 16;
    this.visibleSlides = 3;
    this.maxIndex = Math.max(0, this.images.length - this.visibleSlides);
  }

  init() {
    if (!this.wrapper || !this.track) return;
    this._render();
    if (this.scrollable) {
      this._setupScrollUI();
    }
    window.addEventListener('resize', () => this._handleResize());
  }

  _handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 640;
    this.slideWidth = this.isMobile ? 240 + 12 : 300 + 16;
    this.maxIndex = Math.max(0, this.images.length - this.visibleSlides);
    if (wasMobile !== this.isMobile) {
      this._update();
    }
  }

  _render() {
    this.track.innerHTML = this.images
      .map((img, i) => `<div class="carousel-slide"><img src="${img}" alt="${this.altTexts[i]}" loading="lazy"></div>`)
      .join('');

    if (this.scrollable) {
      this.track.style.transition = 'transform 0.5s ease';
    }
  }

  _setupScrollUI() {
    this.wrapper.classList.add('scrollable');

    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = this.images
        .map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
        .join('');

      this.dotsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-index]');
        if (btn) this.goTo(parseInt(btn.dataset.index));
      });
    }

    this.wrapper.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        if (btn.dataset.action === 'next') this.next();
        else if (btn.dataset.action === 'prev') this.prev();
      }
    });

    this.wrapper.addEventListener('mouseenter', () => this.pause());
    this.wrapper.addEventListener('mouseleave', () => this.play());
    this.play();
  }

  _update() {
    const offset = this.currentIndex * -this.slideWidth;
    this.track.style.transform = `translateX(${offset}px)`;

    if (this.dotsContainer) {
      this.dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === this.currentIndex);
      });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % (this.maxIndex + 1);
    this._update();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.maxIndex + 1) % (this.maxIndex + 1);
    this._update();
  }

  goTo(index) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
      this._update();
    }
  }

  play() {
    if (!this.scrollable) return;
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
  }

  pause() {
    clearInterval(this.autoplayInterval);
  }
}
