const API = '/api';
let allMedicines = [];
let activeSaleMedicine = null;

// ── Clock ──────────────────────────────────────────────────────────────────
function updateClock() {
  document.getElementById('clock').textContent =
    new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

// ── View Routing ───────────────────────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.querySelectorAll('nav button')[['medicines', 'add', 'sales'].indexOf(name)].classList.add('active');

  if (name === 'medicines') loadMedicines();
  if (name === 'sales') loadSales();
}

// ── Toast Notification ─────────────────────────────────────────────────────
let toastTimer;
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.className = '', 3000);
}

// ── Utility Helpers ────────────────────────────────────────────────────────
function daysUntilExpiry(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function fmtPrice(n) {
  return '₹' + Number(n).toFixed(2);
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ── Medicines ──────────────────────────────────────────────────────────────
async function loadMedicines() {
  const search = document.getElementById('search').value.trim();
  const url = search
    ? `${API}/medicines?search=${encodeURIComponent(search)}`
    : `${API}/medicines`;

  try {
    const res = await fetch(url);
    allMedicines = await res.json();
    renderMedicines(allMedicines);
  } catch {
    toast('Failed to load medicines.', 'error');
  }
}

function filterMedicines() {
  const q = document.getElementById('search').value.toLowerCase();
  renderMedicines(allMedicines.filter(m => m.fullName.toLowerCase().includes(q)));
}

function renderMedicines(list) {
  const tbody = document.getElementById('medicines-tbody');

  if (!list.length) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"/>
          </svg>
          <p>No medicines found.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(m => {
    const days = daysUntilExpiry(m.expiryDate);
    const isExpiring = days < 30;
    const isLow = m.quantity < 10;
    const rowClass = isExpiring ? 'expiring' : isLow ? 'low-stock' : '';

    let badge = '';
    if (isExpiring && days <= 0) badge = `<span class="badge badge-red">Expired</span>`;
    else if (isExpiring)         badge = `<span class="badge badge-red">Exp. in ${days}d</span>`;
    else if (isLow)              badge = `<span class="badge badge-yellow">Low stock</span>`;
    else                         badge = `<span class="badge badge-green">OK</span>`;

    return `
      <tr class="${rowClass}">
        <td><strong>${esc(m.fullName)}</strong></td>
        <td>${esc(m.brand)}</td>
        <td>${fmtDate(m.expiryDate)}</td>
        <td>${m.quantity}</td>
        <td>${fmtPrice(m.price)}</td>
        <td>${badge}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-success btn-sm" onclick="openSaleModal('${m.id}')">Sell</button>
          <button class="btn btn-danger btn-sm" style="margin-left:6px"
            onclick="deleteMedicine('${m.id}', '${esc(m.fullName)}')">Delete</button>
        </td>
      </tr>`;
  }).join('');
}

async function deleteMedicine(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`${API}/medicines/${id}`, { method: 'DELETE' });
    if (res.ok) { toast(`"${name}" deleted.`); loadMedicines(); }
    else toast('Delete failed.', 'error');
  } catch {
    toast('Network error.', 'error');
  }
}

// ── Add Medicine ───────────────────────────────────────────────────────────
async function addMedicine() {
  const payload = {
    fullName:   document.getElementById('f-name').value.trim(),
    brand:      document.getElementById('f-brand').value.trim(),
    expiryDate: document.getElementById('f-expiry').value,
    quantity:   parseInt(document.getElementById('f-qty').value, 10),
    price:      parseFloat(document.getElementById('f-price').value),
    notes:      document.getElementById('f-notes').value.trim()
  };

  if (!payload.fullName || !payload.brand || !payload.expiryDate
      || isNaN(payload.quantity) || isNaN(payload.price)) {
    toast('Please fill in all required fields.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      toast(`"${payload.fullName}" added successfully!`);
      clearForm();
      showView('medicines');
    } else {
      toast('Failed to add medicine.', 'error');
    }
  } catch {
    toast('Network error.', 'error');
  }
}

function clearForm() {
  ['f-name', 'f-brand', 'f-expiry', 'f-qty', 'f-price', 'f-notes']
    .forEach(id => document.getElementById(id).value = '');
}

// ── Sale Modal ─────────────────────────────────────────────────────────────
function openSaleModal(id) {
  const m = allMedicines.find(x => x.id === id);
  if (!m) return;
  activeSaleMedicine = m;
  document.getElementById('sale-medicine-name').value = m.fullName;
  document.getElementById('sale-stock').value = m.quantity + ' units';
  document.getElementById('sale-qty').value = '';
  document.getElementById('sale-modal').classList.add('open');
  setTimeout(() => document.getElementById('sale-qty').focus(), 50);
}

function closeSaleModal() {
  document.getElementById('sale-modal').classList.remove('open');
  activeSaleMedicine = null;
}

async function confirmSale() {
  const qty = parseInt(document.getElementById('sale-qty').value, 10);

  if (!activeSaleMedicine || isNaN(qty) || qty <= 0) {
    toast('Enter a valid quantity.', 'error');
    return;
  }
  if (qty > activeSaleMedicine.quantity) {
    toast('Quantity exceeds available stock.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicineId: activeSaleMedicine.id, quantity: qty })
    });
    if (res.ok) {
      toast(`Sale recorded: ${qty} × ${activeSaleMedicine.fullName}`);
      closeSaleModal();
      loadMedicines();
    } else {
      const err = await res.json().catch(() => ({}));
      toast(err.error || 'Sale failed.', 'error');
    }
  } catch {
    toast('Network error.', 'error');
  }
}

// ── Sales Records ──────────────────────────────────────────────────────────
async function loadSales() {
  try {
    const res = await fetch(`${API}/sales`);
    const sales = await res.json();

    document.getElementById('stat-total').textContent = sales.length;
    document.getElementById('stat-units').textContent =
      sales.reduce((s, r) => s + r.quantitySold, 0);
    document.getElementById('stat-revenue').textContent =
      '₹' + sales.reduce((s, r) => s + r.totalAmount, 0).toFixed(2);

    const tbody = document.getElementById('sales-tbody');
    if (!sales.length) {
      tbody.innerHTML = `<tr><td colspan="5">
        <div class="empty"><p>No sales recorded yet.</p></div>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = [...sales].reverse().map(s => `
      <tr>
        <td>${new Date(s.saleDate).toLocaleString('en-IN')}</td>
        <td>${esc(s.medicineName)}</td>
        <td>${s.quantitySold}</td>
        <td>${fmtPrice(s.unitPriceAtSale)}</td>
        <td><strong>${fmtPrice(s.totalAmount)}</strong></td>
      </tr>`).join('');
  } catch {
    toast('Failed to load sales.', 'error');
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 30000);

  // Close sale modal when clicking the backdrop
  document.getElementById('sale-modal').addEventListener('click', function (e) {
    if (e.target === this) closeSaleModal();
  });

  loadMedicines();
});