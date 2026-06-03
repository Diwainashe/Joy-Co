export class SettingsSection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
    this.currentTheme = 'noir';
  }

  init() {
    this._wirePasswordForm();
    this._wireThemePicker();
  }

  async onShow() {
    await this._displayUserEmail();
    await this._loadCurrentTheme();
  }

  async _displayUserEmail() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (user) {
        const emailDisplay = document.querySelector('#settings-section .settings-email');
        if (emailDisplay) {
          emailDisplay.textContent = user.email;
        }
      }
    } catch (err) {
      console.error('Error getting user:', err);
    }
  }

  _wirePasswordForm() {
    const form = document.getElementById('password-change-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handlePasswordChange();
    });
  }

  async _handlePasswordChange() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMsg = document.getElementById('password-error-message');
    const successMsg = document.getElementById('password-success-message');

    errorMsg?.classList.remove('active');
    successMsg?.classList.remove('active');

    if (!currentPassword) {
      this._showError(errorMsg, 'Enter your current password');
      return;
    }

    if (!newPassword) {
      this._showError(errorMsg, 'Enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      this._showError(errorMsg, 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      this._showError(errorMsg, 'Passwords do not match');
      return;
    }

    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user?.email) {
        this._showError(errorMsg, 'Unable to get user email');
        return;
      }

      const { error: authError } = await this.supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (authError) {
        this._showError(errorMsg, 'Incorrect current password');
        return;
      }

      const { error: updateError } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        this._showError(errorMsg, 'Error updating password: ' + updateError.message);
        return;
      }

      successMsg?.classList.add('active');
      document.getElementById('password-change-form').reset();

      setTimeout(() => {
        successMsg?.classList.remove('active');
      }, 5000);
    } catch (err) {
      console.error('Password change error:', err);
      this._showError(errorMsg, 'An unexpected error occurred');
    }
  }

  _showError(element, message) {
    if (element) {
      element.textContent = message;
      element.classList.add('active');
    }
  }

  _wireThemePicker() {
    const themeCards = document.querySelectorAll('.theme-card');
    const applyBtn = document.getElementById('apply-theme-btn');

    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.currentTheme = card.dataset.theme;
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', async () => {
        await this._applyTheme(this.currentTheme);
      });
    }
  }

  async _loadCurrentTheme() {
    try {
      const { data } = await this.supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'theme')
        .single();

      if (data?.value) {
        this.currentTheme = data.value;
        const activeCard = document.querySelector(`[data-theme="${this.currentTheme}"]`);
        if (activeCard) {
          document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
          activeCard.classList.add('active');
        }
      }
    } catch (err) {
      console.debug('Could not load current theme:', err.message);
    }
  }

  async _applyTheme(theme) {
    try {
      const { error } = await this.supabase
        .from('site_settings')
        .upsert({ key: 'theme', value: theme, updated_at: new Date().toISOString() });

      if (error) throw error;

      // Update localStorage and apply immediately
      localStorage.setItem('joyco_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);

      const btn = document.getElementById('apply-theme-btn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Applied!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Error applying theme:', err);
      alert('Failed to apply theme. Please try again.');
    }
  }
}
