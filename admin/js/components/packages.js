export class PackagesSection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
    this.selectedPackageItems = {};
    this.editingPackageId = null;
  }

  init() {
    const createBtn = document.querySelector('#packages-section .btn-primary');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.openModal());
    }
    this._wireModal();
  }

  async onShow() {
    await this._loadPackageItems();
    await this.loadList();
  }

  async _loadPackageItems() {
    const grid = document.getElementById('package-items-grid');
    try {
      const { data: items, error } = await this.supabase
        .from('items')
        .select('id, name, price_zar')
        .eq('available', true);

      if (error) throw error;

      grid.innerHTML = items.map(item => `
        <label class="item-select-card" onclick="event.preventDefault();">
          <input type="checkbox" data-item-id="${item.id}" onchange="window.updateSelectedItems?.()">
          <div style="text-align: left; margin-top: 8px;">
            <div style="font-weight: 500; font-size: 13px;">${item.name}</div>
            <div style="font-size: 12px; color: var(--jc-pink); margin-top: 4px;">R ${item.price_zar.toLocaleString()}</div>
          </div>
        </label>
      `).join('');

      this._wireItemSelection();
      this._setupPriceSummary();
    } catch (err) {
      console.error('Error loading items:', err);
    }
  }

  _wireItemSelection() {
    document.querySelectorAll('.item-select-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const checkbox = card.querySelector('input[type="checkbox"]');
        const itemId = checkbox.dataset.itemId;
        checkbox.checked = !checkbox.checked;
        this._togglePackageItem(itemId);
      });
    });

    window.updateSelectedItems = () => this._updateSelectedItems();
    this._updateSelectedItems();
  }

  _togglePackageItem(itemId) {
    const checkbox = document.querySelector(`input[data-item-id="${itemId}"]`);
    const card = checkbox.closest('.item-select-card');

    if (checkbox.checked) {
      this.selectedPackageItems[itemId] = { id: itemId, qty: 1 };
      card.classList.add('selected');
    } else {
      delete this.selectedPackageItems[itemId];
      card.classList.remove('selected');
    }
    this._updateSelectedItems();
  }

  _updateSelectedItems() {
    const checkboxes = document.querySelectorAll('input[data-item-id]');
    let subtotal = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const priceText = cb.closest('.item-select-card').textContent.match(/R\s*([\d,]+)/);
        if (priceText) {
          subtotal += parseFloat(priceText[1].replace(/,/g, ''));
        }
      }
    });

    document.getElementById('package-subtotal').textContent = `R ${subtotal.toLocaleString()}`;
    const suggestedPrice = Math.round(subtotal * 0.9);
    document.getElementById('package-price').placeholder = suggestedPrice;

    const actualPrice = parseFloat(document.getElementById('package-price').value) || suggestedPrice;
    const savings = subtotal - actualPrice;
    document.getElementById('package-savings').textContent = `R ${Math.max(0, savings).toLocaleString()}`;
  }

  _wireModal() {
    const modal = document.getElementById('package-modal');
    const form = document.getElementById('package-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._submitPackage();
    });
  }

  openModal() {
    this.editingPackageId = null;
    this.selectedPackageItems = {};
    document.getElementById('package-modal-title').textContent = 'Create Package';
    document.getElementById('package-save-btn').textContent = 'Create Package';
    document.getElementById('package-form').reset();
    document.getElementById('package-modal').classList.add('active');
    document.querySelectorAll('.item-select-card').forEach(c => c.classList.remove('selected'));
    this._updateSelectedItems();
  }

  closeModal() {
    document.getElementById('package-modal').classList.remove('active');
  }

  async loadList() {
    const tbody = document.getElementById('packages-tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">Loading...</td></tr>';

    try {
      const { data: packages, error } = await this.supabase
        .from('packages')
        .select('id, name, price_zar, featured, published, package_items(item_id, quantity)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!packages || packages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">No packages yet. <a href="#" onclick="showSection(\'packages\'); window.openPackageModal?.(); return false;" style="color: var(--jc-pink);">Create one now.</a></td></tr>';
        return;
      }

      tbody.innerHTML = packages.map(pkg => `
        <tr>
          <td><strong>${pkg.name}</strong></td>
          <td>${pkg.package_items?.length || 0} items</td>
          <td class="text-price">R ${pkg.price_zar.toLocaleString()}</td>
          <td>${pkg.featured ? '✓' : '—'}</td>
          <td><span class="status-badge ${pkg.published ? 'published' : 'draft'}">${pkg.published ? 'Published' : 'Draft'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-btn" data-package-id="${pkg.id}" title="Edit">✎</button>
              <button class="action-btn delete delete-btn" data-package-id="${pkg.id}" title="Delete">🗑</button>
            </div>
          </td>
        </tr>
      `).join('');

      this._wirePackageActions();
    } catch (err) {
      console.error('Error loading packages:', err);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--jc-coral);">Error loading packages</td></tr>';
    }
  }

  _wirePackageActions() {
    document.querySelectorAll('#packages-section .edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkgId = e.target.dataset.packageId;
        this._editPackage(pkgId);
      });
    });

    document.querySelectorAll('#packages-section .delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkgId = e.target.dataset.packageId;
        this._deletePackage(pkgId);
      });
    });
  }

  async _editPackage(packageId) {
    this.editingPackageId = packageId;
    document.getElementById('package-modal-title').textContent = 'Edit Package';
    document.getElementById('package-save-btn').textContent = 'Save Changes';

    try {
      const { data: pkg, error } = await this.supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (error) throw error;

      document.getElementById('package-name').value = pkg.name;
      document.getElementById('package-description').value = pkg.description || '';
      document.getElementById('package-price').value = pkg.price_zar;
      document.getElementById('package-featured').checked = pkg.featured;
      document.getElementById('package-published').checked = pkg.published;

      this.selectedPackageItems = {};
      const { data: packageItems } = await this.supabase
        .from('package_items')
        .select('item_id, quantity')
        .eq('package_id', packageId);

      packageItems.forEach(pi => {
        this.selectedPackageItems[pi.item_id] = { id: pi.item_id, qty: pi.quantity };
        const checkbox = document.querySelector(`input[data-item-id="${pi.item_id}"]`);
        const card = checkbox?.closest('.item-select-card');
        if (checkbox) checkbox.checked = true;
        if (card) card.classList.add('selected');
      });

      this._updateSelectedItems();
      document.getElementById('package-modal').classList.add('active');
    } catch (err) {
      console.error('Error loading package:', err);
      alert('Error loading package');
    }
  }

  async _deletePackage(packageId) {
    if (!confirm('Delete this package? This cannot be undone.')) return;

    try {
      await this.supabase
        .from('package_items')
        .delete()
        .eq('package_id', packageId);

      const { error } = await this.supabase
        .from('packages')
        .delete()
        .eq('id', packageId);

      if (error) throw error;
      await this.loadList();
    } catch (err) {
      console.error('Error deleting package:', err);
      alert('Error deleting package');
    }
  }

  async _submitPackage() {
    const packageData = {
      name: document.getElementById('package-name').value,
      description: document.getElementById('package-description').value,
      price_zar: parseFloat(document.getElementById('package-price').value),
      featured: document.getElementById('package-featured').checked,
      published: document.getElementById('package-published').checked
    };

    try {
      let packageId = this.editingPackageId;

      if (packageId) {
        const { error } = await this.supabase
          .from('packages')
          .update(packageData)
          .eq('id', packageId);
        if (error) throw error;

        await this.supabase.from('package_items').delete().eq('package_id', packageId);
      } else {
        const { data, error } = await this.supabase
          .from('packages')
          .insert([packageData])
          .select()
          .single();
        if (error) throw error;
        packageId = data.id;
      }

      const itemsToInsert = Object.values(this.selectedPackageItems).map(item => ({
        package_id: packageId,
        item_id: item.id,
        quantity: item.qty
      }));

      if (itemsToInsert.length > 0) {
        const { error } = await this.supabase
          .from('package_items')
          .insert(itemsToInsert);
        if (error) throw error;
      }

      this.closeModal();
      await this.loadList();
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Error saving package');
    }
  }
}
