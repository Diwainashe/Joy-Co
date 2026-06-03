export class AddItemSection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
    this.selectedFiles = [];
  }

  init() {
    this._wireFileUpload();
    this._wireFormPreview();
    this._wireFormSubmit();
  }

  onShow() {
    window.updateItemPreview?.();
  }

  _wireFileUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const imagePreviewGrid = document.getElementById('image-preview-grid');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      this._addFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
      this._addFiles(Array.from(e.target.files));
    });

    window.removeImage = (idx) => {
      this.selectedFiles.splice(idx, 1);
      this._renderImagePreviews();
    };
  }

  _addFiles(files) {
    this.selectedFiles = [...this.selectedFiles, ...files];
    this._renderImagePreviews();
  }

  _renderImagePreviews() {
    const grid = document.getElementById('image-preview-grid');
    grid.innerHTML = this.selectedFiles.map((file, idx) => `
      <div class="admin-image-preview">
        <img src="${URL.createObjectURL(file)}" alt="Preview">
        <button type="button" class="admin-image-remove" onclick="removeImage(${idx})" title="Remove">×</button>
      </div>
    `).join('');
    window.updateItemPreview?.();
  }

  _wireFormPreview() {
    window.updateItemPreview = () => {
      const name = document.getElementById('item-name').value || 'Item Name';
      const price = document.getElementById('item-price').value;
      const description = document.getElementById('item-description').value || 'Description will appear here';
      const available = document.getElementById('item-available').checked;
      const priceFormatted = price ? window.joycoSupabase.formatZAR(parseFloat(price)) + '/day' : 'R —';

      const imageHtml = this.selectedFiles.length > 0
        ? `<img src="${URL.createObjectURL(this.selectedFiles[0])}" alt="${name}" class="product-card__image">`
        : `<div class="product-card__image" style="background: #e5e7eb;"></div>`;

      const previewHtml = `
        <div class="product-card card--coral" style="position: relative;">
          ${imageHtml}
          ${!available ? '<div style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Unavailable</div>' : ''}
          <div class="product-card__content">
            <h3 class="product-card__name" style="color: ${name === 'Item Name' ? '#ccc' : 'white'};">${name}</h3>
            <p class="product-card__description" style="color: ${description === 'Description will appear here' ? '#ccc' : 'rgba(255,255,255,0.95)'};">${description}</p>
            <div class="product-card__rating">⭐⭐⭐⭐⭐</div>
            <div class="product-card__price">${priceFormatted}</div>
            <a class="btn product-card__cta">💬 Enquire</a>
          </div>
        </div>
      `;

      document.getElementById('item-preview').innerHTML = previewHtml;
    };

    ['item-name', 'item-price', 'item-description'].forEach(id => {
      document.getElementById(id).addEventListener('input', window.updateItemPreview);
    });
    ['item-category', 'item-available', 'item-featured'].forEach(id => {
      document.getElementById(id).addEventListener('change', window.updateItemPreview);
    });
  }

  _wireFormSubmit() {
    const form = document.getElementById('item-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._submitForm();
    });
  }

  async _submitForm() {
    const itemData = {
      name: document.getElementById('item-name').value,
      category: document.getElementById('item-category').value,
      price_zar: parseFloat(document.getElementById('item-price').value),
      stock_qty: parseInt(document.getElementById('item-stock').value) || 1,
      damage_deposit: document.getElementById('item-deposit').value ? parseFloat(document.getElementById('item-deposit').value) : null,
      description: document.getElementById('item-description').value,
      featured: document.getElementById('item-featured').checked,
      available: document.getElementById('item-available').checked
    };

    try {
      let itemId = window.editingItemId;

      if (itemId) {
        const { error } = await this.supabase
          .from('items')
          .update(itemData)
          .eq('id', itemId);
        if (error) throw error;
      } else {
        const { data, error } = await this.supabase
          .from('items')
          .insert([itemData])
          .select()
          .single();
        if (error) throw error;
        itemId = data.id;
      }

      for (const file of this.selectedFiles) {
        const timestamp = Date.now();
        const path = `${itemId}/${timestamp}-${file.name}`;
        const { error } = await this.supabase
          .storage
          .from('item-images')
          .upload(path, file, { upsert: true });
        if (error) console.warn('Image upload warning:', error);
      }

      window.editingItemId = null;
      this.selectedFiles = [];
      document.getElementById('item-form').reset();
      document.getElementById('add-item-title').textContent = 'Add New Item';
      document.getElementById('item-form').querySelector('button[type="submit"]').textContent = 'Save Item';
      document.getElementById('image-preview-grid').innerHTML = '';
      this.navigate('inventory');
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error saving item');
    }
  }
}
