export class InventorySection {
  constructor(supabase, navigate) {
    this.supabase = supabase;
    this.navigate = navigate;
  }

  init() {
    const addBtn = document.querySelector('#inventory-section .btn-primary');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.navigate('add-item'));
    }
  }

  async onShow() {
    await this.load();
  }

  async load() {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">Loading...</td></tr>';

    try {
      const { data: items, error } = await this.supabase
        .from('items')
        .select('id, name, category, price_zar, stock_qty, featured, available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">No items yet. <a href="#" onclick="showSection(\'add-item\'); return false;" style="color: var(--jc-pink);">Add one now.</a></td></tr>';
        return;
      }

      tbody.innerHTML = items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td class="text-muted">${item.category}</td>
          <td class="text-price">R ${item.price_zar.toLocaleString()}</td>
          <td>${item.stock_qty}</td>
          <td>${item.featured ? '✓' : '—'}</td>
          <td><span class="status-badge ${item.available ? 'published' : 'draft'}">${item.available ? 'Available' : 'Unavailable'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-btn" data-item-id="${item.id}" title="Edit">✎</button>
              <button class="action-btn delete delete-btn" data-item-id="${item.id}" title="Delete">🗑</button>
            </div>
          </td>
        </tr>
      `).join('');

      this._wireItemActions();
    } catch (err) {
      console.error('Error loading items:', err);
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--jc-coral);">Error loading items</td></tr>';
    }
  }

  _wireItemActions() {
    document.querySelectorAll('#inventory-section .edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.dataset.itemId;
        this._editItem(itemId);
      });
    });

    document.querySelectorAll('#inventory-section .delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.dataset.itemId;
        this._deleteItem(itemId);
      });
    });
  }

  async _editItem(itemId) {
    try {
      const { data: item, error } = await this.supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) throw error;

      window.editingItemId = itemId;
      document.getElementById('add-item-title').textContent = 'Edit Item';
      document.getElementById('item-form').querySelector('button[type="submit"]').textContent = 'Save Changes';

      document.getElementById('item-name').value = item.name || '';
      document.getElementById('item-category').value = item.category || 'Inflatables';
      document.getElementById('item-price').value = item.price_zar || '';
      document.getElementById('item-stock').value = item.stock_qty || 1;
      document.getElementById('item-deposit').value = item.damage_deposit || '';
      document.getElementById('item-description').value = item.description || '';
      document.getElementById('item-featured').checked = item.featured || false;
      document.getElementById('item-available').checked = item.available !== false;

      this.navigate('add-item');
      window.updateItemPreview?.();
    } catch (err) {
      console.error('Error loading item:', err);
      alert('Error loading item data');
    }
  }

  async _deleteItem(itemId) {
    if (!confirm('Delete this item? This cannot be undone.')) return;

    try {
      const { error } = await this.supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await this.load();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
    }
  }
}
