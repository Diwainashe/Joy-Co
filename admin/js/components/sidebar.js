export class AdminSidebar {
  constructor(navigate) {
    this.navigate = navigate;
    this.currentActive = 'dashboard';
  }

  init() {
    this._wireMobileToggle();
    this._wireNavLinks();
  }

  render(user) {
    const emailDisplay = document.getElementById('user-email-display');
    if (emailDisplay && user?.email) {
      emailDisplay.textContent = user.email;
    }
  }

  setActive(sectionName) {
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    this.currentActive = sectionName;
  }

  _wireMobileToggle() {
    const burger = document.getElementById('admin-nav-burger');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.getElementById('admin-nav-overlay');

    if (!burger || !sidebar || !overlay) return;

    burger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
      const isOpen = sidebar.classList.contains('open');
      burger.textContent = isOpen ? '✕' : '☰';
      burger.setAttribute('aria-expanded', isOpen);
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      burger.textContent = '☰';
      burger.setAttribute('aria-expanded', 'false');
    });
  }

  _wireNavLinks() {
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) {
          this.navigate(section);
          this._closeMobileMenu();
        }
      });
    });
  }

  _closeMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.getElementById('admin-nav-overlay');
    const burger = document.getElementById('admin-nav-burger');

    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (burger) {
      burger.textContent = '☰';
      burger.setAttribute('aria-expanded', 'false');
    }
  }
}
