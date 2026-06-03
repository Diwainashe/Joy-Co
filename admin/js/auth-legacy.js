// Admin Auth Guard
// Protects all admin pages and handles logout

const { client: supabase } = window.joycoSupabase;

// Check authentication on page load
async function protectAdminPage() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Not logged in, redirect to login
    window.location.href = '/admin/index.html';
    return false;
  }

  // Store current user info
  window.adminUser = session.user;
  return true;
}

// Logout function
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
  } else {
    window.location.href = '/admin/index.html';
  }
}

// Add logout button to nav
function setupAdminNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn btn-sm btn-outline';
  logoutBtn.textContent = 'Logout';
  logoutBtn.onclick = logout;
  logoutBtn.style.marginLeft = 'var(--space-md)';

  const navLinks = nav.querySelector('.nav-links');
  if (navLinks) {
    navLinks.appendChild(logoutBtn);
  }
}

// Initialize admin page on load
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = await protectAdminPage();
  if (isAuthenticated) {
    setupAdminNav();
  }
});
