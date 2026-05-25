class ItemsLoader {
  constructor(gridId, businessPhone = '27732026535') {
    this.gridId = gridId;
    this.businessPhone = businessPhone;
    this.grid = document.getElementById(gridId);
  }

  async load() {
    if (!this.grid) return;
    const { client, formatZAR, getCardColorClass, getWhatsAppLink } = window.joycoSupabase;

    try {
      const { data: items, error } = await client
        .from('items')
        .select('id, name, description, price_zar, category, item_images(url, is_primary)')
        .eq('available', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading items:', error);
        this._renderError();
        return;
      }

      if (!items || items.length === 0) {
        this._renderEmpty();
        return;
      }

      this.grid.innerHTML = items.map((item, index) => this._renderCard(item, index)).join('');

    } catch (err) {
      console.error('Unexpected error:', err);
      this._renderError();
    }
  }

  _renderCard(item, index) {
    const { formatZAR, getCardColorClass, getWhatsAppLink } = window.joycoSupabase;
    const primaryImage = item.item_images?.find(img => img.is_primary)?.url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E';
    const colorClass = getCardColorClass(index);
    const whatsappLink = getWhatsAppLink(item.name, this.businessPhone);

    return `
      <div class="product-card ${colorClass}">
        <img src="${primaryImage}" alt="${item.name}" class="product-card__image" loading="lazy">
        <div class="product-card__content">
          <h3 class="product-card__name">${item.name}</h3>
          <p class="product-card__description">${item.description}</p>
          <div class="product-card__rating">⭐⭐⭐⭐⭐</div>
          <div class="product-card__price">${formatZAR(item.price_zar)}/day</div>
          <a href="${whatsappLink}" target="_blank" rel="noopener" class="btn product-card__cta">
            💬 Enquire
          </a>
        </div>
      </div>
    `;
  }

  _renderEmpty() {
    this.grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No items available yet.</p>';
  }

  _renderError() {
    this.grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Failed to load items. Please try again later.</p>';
  }
}
