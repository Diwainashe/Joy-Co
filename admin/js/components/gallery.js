export class GallerySection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
    this.selectedFile = null;
  }

  init() {
    this._wireUpload();
    this._wireForm();
  }

  onShow() {
    this.load();
  }

  async load() {
    const tbody = document.getElementById('gallery-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-secondary);">Loading...</td></tr>';

    const { data, error } = await this.supabase
      .from('gallery')
      .select('id, title, category, image_url, image_path, published, sort_order, created_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data?.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-secondary);">No gallery images yet. Upload one above.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td>
          <img src="${item.image_url}" alt="${item.title || ''}"
            style="width:60px;height:60px;object-fit:cover;border:1px solid var(--color-neutral-200);">
        </td>
        <td style="font-size:14px;">${item.title || '<span style="color:var(--text-secondary);">—</span>'}</td>
        <td style="font-size:13px;text-transform:capitalize;">${item.category || 'general'}</td>
        <td>
          <span class="status-badge ${item.published ? 'published' : 'draft'}">
            ${item.published ? 'Published' : 'Hidden'}
          </span>
        </td>
        <td style="white-space:nowrap;">
          <button class="admin-btn admin-btn-sm gallery-toggle-btn"
            data-id="${item.id}" data-published="${item.published}"
            style="margin-right:6px;">
            ${item.published ? 'Hide' : 'Show'}
          </button>
          <button class="admin-btn admin-btn-sm admin-btn-danger gallery-delete-btn"
            data-id="${item.id}" data-path="${item.image_path || ''}">
            Delete
          </button>
        </td>
      </tr>
    `).join('');

    this._wireActions();
  }

  _wireActions() {
    document.querySelectorAll('.gallery-toggle-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const published = btn.dataset.published === 'true';
        await this.supabase.from('gallery').update({ published: !published }).eq('id', btn.dataset.id);
        this.load();
      });
    });

    document.querySelectorAll('.gallery-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this gallery image? This cannot be undone.')) return;
        const { id, path } = btn.dataset;
        if (path) await this.supabase.storage.from('gallery').remove([path]);
        await this.supabase.from('gallery').delete().eq('id', id);
        this.load();
      });
    });
  }

  _wireUpload() {
    const zone = document.getElementById('gallery-upload-zone');
    const input = document.getElementById('gallery-file-input');
    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) this._setPreview(file);
    });
    input.addEventListener('change', (e) => {
      if (e.target.files[0]) this._setPreview(e.target.files[0]);
    });
  }

  _setPreview(file) {
    this.selectedFile = file;
    document.getElementById('gallery-image-preview').innerHTML =
      `<img src="${URL.createObjectURL(file)}" style="max-height:150px;border:1px solid var(--color-neutral-200);margin-top:8px;">`;
  }

  _wireForm() {
    const form = document.getElementById('gallery-upload-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._submitUpload();
    });
  }

  async _submitUpload() {
    if (!this.selectedFile) {
      alert('Please select an image first.');
      return;
    }

    const btn = document.getElementById('gallery-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Uploading...';

    try {
      const timestamp = Date.now();
      const safeName = this.selectedFile.name.replace(/\s+/g, '-');
      const path = `${timestamp}-${safeName}`;

      const { error: uploadErr } = await this.supabase.storage
        .from('gallery')
        .upload(path, this.selectedFile, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = this.supabase.storage.from('gallery').getPublicUrl(path);

      const { error: dbErr } = await this.supabase.from('gallery').insert([{
        title: document.getElementById('gallery-title').value.trim() || null,
        caption: document.getElementById('gallery-caption').value.trim() || null,
        category: document.getElementById('gallery-category').value || 'general',
        image_url: publicUrl,
        image_path: path,
        sort_order: parseInt(document.getElementById('gallery-sort-order').value) || 0,
        published: document.getElementById('gallery-published').checked
      }]);
      if (dbErr) throw dbErr;

      document.getElementById('gallery-upload-form').reset();
      document.getElementById('gallery-image-preview').innerHTML = '';
      this.selectedFile = null;
      this.load();
    } catch (err) {
      console.error('Gallery upload error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Upload to Gallery';
    }
  }
}
