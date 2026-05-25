class NavManager {
  constructor(options = {}) {
    this.burgerId = options.burgerId;
    this.linksId = options.linksId;
    this.logoTriggerId = options.logoTriggerId;
    this.secretTaps = options.secretTaps ?? 5;
    this.adminPath = options.adminPath ?? '/admin/index.html';

    this.burger = this.burgerId ? document.getElementById(this.burgerId) : null;
    this.links = this.linksId ? document.getElementById(this.linksId) : null;
    this.logoTrigger = this.logoTriggerId ? document.getElementById(this.logoTriggerId) : null;

    this.logoTaps = 0;
    this.logoTapTimer = null;
  }

  init() {
    if (this.burger && this.links) this._setupBurger();
    if (this.logoTrigger) this._setupLogoTap();
  }

  _setupBurger() {
    this.burger.addEventListener('click', () => {
      this.links.classList.toggle('open');
      const isOpen = this.links.classList.contains('open');
      this.burger.textContent = isOpen ? '✕' : '☰';
      this.burger.setAttribute('aria-expanded', isOpen);
    });

    this.links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.links.classList.remove('open');
        this.burger.textContent = '☰';
        this.burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  _setupLogoTap() {
    this.logoTrigger.addEventListener('click', () => {
      this.logoTaps++;
      clearTimeout(this.logoTapTimer);
      this.logoTapTimer = setTimeout(() => { this.logoTaps = 0; }, 3000);
      if (this.logoTaps === this.secretTaps) {
        this.logoTaps = 0;
        window.location.href = this.adminPath;
      }
    });
  }
}
