// Joy&Co Supabase Client Setup
// Initialize Supabase for data & auth management

// Only initialize if not already done
if (!window.joycoSupabase) {
  // Configuration
  const SUPABASE_URL = 'https://wnezchpvsgpatxbviinz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXpjaHB2c2dwYXR4YnZpaW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDA3MDgsImV4cCI6MjA5NTI3NjcwOH0.zLCA5zCYR6fYRyRs2kQuTQ_ot59mffZe-o6Ru7OJo8w';

  // Initialize Supabase client
  const { createClient } = window.supabase;

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  // Helper function to format prices in ZAR
  function formatZAR(amount) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Helper function to get color class for card based on index
  function getCardColorClass(index) {
    const colors = ['card--coral', 'card--pink', 'card--purple', 'card--amber', 'card--sage', 'card--lilac', 'card--mint', 'card--gold'];
    return colors[index % colors.length];
  }

  // Helper function to build WhatsApp inquiry link
  function getWhatsAppLink(itemName, businessPhone) {
    const message = `Hi Joy&Co! I'm interested in hiring the ${itemName}. Could you please send me more details and pricing?`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${businessPhone}?text=${encoded}`;
  }

  // Export for use in pages
  window.joycoSupabase = {
    client: supabase,
    formatZAR,
    getCardColorClass,
    getWhatsAppLink,
  };
}
