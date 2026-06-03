import { AdminAuth } from './components/auth.js';
import { AdminSidebar } from './components/sidebar.js';
import { DashboardSection } from './components/dashboard.js';
import { InventorySection } from './components/inventory.js';
import { AddItemSection } from './components/add-item.js';
import { PackagesSection } from './components/packages.js';
import { ReviewsSection } from './components/reviews.js';
import { SettingsSection } from './components/settings.js';

class AdminApp {
  constructor() {
    this.sections = {};
    this.currentSection = null;
    this.supabase = null;
    this.auth = null;
    this.sidebar = null;
    this.user = null;
  }

  async init() {
    if (!window.joycoSupabase?.client) {
      console.error('Supabase client not initialized');
      return;
    }

    this.supabase = window.joycoSupabase.client;
    this.auth = new AdminAuth(this.supabase);

    const user = await this.auth.checkSession();
    if (user) {
      this.user = user;
      this._showDashboard();
      this._initComponents();
    } else {
      this._showLogin();
      this._wireLoginForm();
    }
  }

  _showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
  }

  _showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    this.sidebar = new AdminSidebar(this.navigate.bind(this));
    this.sidebar.init();
    this.sidebar.render(this.user);
    this._wireLogout();
  }

  _wireLoginForm() {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.classList.remove('active');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const { user, error } = await this.auth.login(email, password);

      if (error || !user) {
        errorMsg.textContent = error?.message || 'Login failed. Please check your credentials.';
        errorMsg.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      } else {
        this.user = user;
        this._showDashboard();
        this._initComponents();
      }
    });
  }

  _wireLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async () => {
      await this.auth.logout();
      document.getElementById('login-form').reset();
      document.getElementById('error-message').classList.remove('active');
      this._showLogin();
      this._wireLoginForm();
    });
  }

  _initComponents() {
    this.sections = {
      dashboard: new DashboardSection(this.supabase, this.navigate.bind(this)),
      inventory: new InventorySection(this.supabase, this.navigate.bind(this)),
      'add-item': new AddItemSection(this.supabase, this.navigate.bind(this)),
      packages: new PackagesSection(this.supabase, this.navigate.bind(this)),
      reviews: new ReviewsSection(this.supabase, this.navigate.bind(this)),
      settings: new SettingsSection(this.supabase, this.navigate.bind(this)),
    };

    Object.values(this.sections).forEach(section => {
      if (section.init) section.init();
    });

    this.navigate('dashboard');
  }

  navigate(sectionName) {
    document.querySelectorAll('[id$="-section"]').forEach(section => {
      section.style.display = 'none';
    });

    const section = document.getElementById(sectionName + '-section');
    if (section) {
      section.style.display = 'block';
    }

    if (this.sidebar) {
      this.sidebar.setActive(sectionName);
    }

    document.getElementById('page-title').textContent = this._getTitleForSection(sectionName);

    const component = this.sections[sectionName];
    if (component?.onShow) {
      component.onShow();
    }

    this.currentSection = sectionName;
  }

  _getTitleForSection(sectionName) {
    const titles = {
      'dashboard': 'Dashboard',
      'inventory': 'Inventory',
      'add-item': 'Add Item',
      'packages': 'Packages',
      'reviews': 'Reviews',
      'settings': 'Settings'
    };
    return titles[sectionName] || 'Admin';
  }
}

let adminApp;

document.addEventListener('DOMContentLoaded', () => {
  adminApp = new AdminApp();
  adminApp.init();
  window.showSection = (sectionName) => adminApp.navigate(sectionName);
  window.showReviewsTab = (tabName) => {
    const component = adminApp.sections?.reviews;
    if (component?.showTab) component.showTab(tabName);
  };
  window.openPackageModal = () => adminApp.sections?.packages?.openModal();
  window.closePackageModal = () => adminApp.sections?.packages?.closeModal();
});
