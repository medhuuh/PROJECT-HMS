/* ============================================
   BookEasy — Application Logic
   ============================================ */

// ============ NAVIGATION ============
const pageTitles = {
  dashboard: 'Dashboard', bookings: 'Booking Management', rooms: 'Room Management',
  guests: 'Guest Management', checkin: 'Check-in / Check-out', billing: 'Billing & Payments',
  reports: 'Reports & Analytics', staff: 'Staff Management', inventory: 'Hotel Services & Inventory',
  notifications: 'Notifications', settings: 'Settings'
};

function navigateTo(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  const section = document.getElementById('page-' + page);
  if (section) section.classList.add('active');
  const menuItem = document.querySelector(`.sidebar-item[data-page="${page}"]`);
  if (menuItem) menuItem.classList.add('active');
  document.getElementById('pageTitle').textContent = pageTitles[page] || page;
  if (page === 'reports') setTimeout(drawAllCharts, 100);
  if (page === 'dashboard') setTimeout(() => drawLineChart('revenueChart', revenueData, '#2ecc71'), 100);
}

document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.page));
});

// ============ MODAL SYSTEM ============
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  });
});

// ============ TOAST NOTIFICATIONS ============
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3200);
}

// ============ CONFIRM POPUP ============
let confirmCallback = null;

function confirmAction(text, callback) {
  document.getElementById('confirmTitle').textContent = 'Are you sure?';
  document.getElementById('confirmText').textContent = text;
  confirmCallback = callback;
  openModal('confirm-popup');
}

function confirmYes() {
  closeModal('confirm-popup');
  if (confirmCallback === 'cancelBooking') showToast('Booking cancelled successfully!');
  else if (confirmCallback === 'deleteRoom') showToast('Room deleted successfully!');
  else if (confirmCallback === 'deleteStaff') showToast('Staff member removed!');
  else if (confirmCallback === 'deleteService') showToast('Item deleted!');
  else if (confirmCallback === 'exportPDF') showToast('Report exported as PDF!');
  else if (confirmCallback === 'exportExcel') showToast('Report exported as Excel!');
  else if (confirmCallback === 'blacklistGuest') showToast('Guest has been blacklisted.');
  else showToast('Action completed!');
  confirmCallback = null;
}

// ============ FORM SUBMISSIONS ============
function submitBooking() {
  closeModal('booking-modal');
  showToast('Booking saved successfully!');
}

function generateInvoice() {
  closeModal('booking-modal');
  showToast('Invoice generated successfully!');
}

function submitRoom() {
  closeModal('room-modal');
  showToast('Room saved successfully!');
}

function submitGuest() {
  closeModal('guest-modal');
  showToast('Guest saved successfully!');
}

function submitNotes() {
  closeModal('notes-modal');
  showToast('Notes saved!');
}

function submitInvoice() {
  closeModal('invoice-modal');
  showToast('Invoice generated successfully!');
}

function submitStaff() {
  closeModal('staff-modal');
  showToast('Staff member saved!');
}

function submitService() {
  closeModal('service-modal');
  showToast('Service/item saved!');
}

// ============ EDIT PROMPTS ============
function editBookingPrompt() {
  showToast('Select a booking from the table to edit.', 'success');
}

function editBooking(id) {
  openModal('booking-modal');
  document.querySelector('#booking-modal .modal-title').textContent = 'Edit Booking #' + id;
}

function editRoomPrompt() {
  showToast('Select a room card to edit.', 'success');
}

function editRoom(num) {
  openModal('room-modal');
  document.querySelector('#room-modal .modal-title').textContent = 'Edit Room ' + num;
}

function editGuest(id) {
  openModal('guest-modal');
  document.querySelector('#guest-modal .modal-title').textContent = 'Edit Guest';
}

function editStaff(id) {
  openModal('staff-modal');
  document.querySelector('#staff-modal .modal-title').textContent = 'Edit Staff';
}

function editService(id) {
  openModal('service-modal');
  document.querySelector('#service-modal .modal-title').textContent = 'Edit Service/Item';
}

// ============ GUEST HISTORY ============
const guestHistories = {
  '1': [{ booking: '#BK001', room: '101 - Deluxe', dates: '27 Feb – 01 Mar 2026', status: 'Confirmed' },
        { booking: '#BK010', room: '205 - Suite', dates: '10 Jan – 14 Jan 2026', status: 'Checked-out' }],
  '2': [{ booking: '#BK002', room: '205 - Suite', dates: '28 Feb – 03 Mar 2026', status: 'Pending' }],
  '3': [{ booking: '#BK003', room: '302 - Standard', dates: '25 Feb – 27 Feb 2026', status: 'Checked-in' }],
};

function viewGuestHistory(guestId) {
  const panel = document.getElementById('guestHistoryContent');
  const history = guestHistories[guestId] || [];
  if (history.length === 0) {
    panel.innerHTML = '<p style="color:var(--text-secondary);font-size:13px;margin-top:12px">No booking history found.</p>';
    return;
  }
  panel.innerHTML = history.map(h => `
    <div style="background:var(--bg);border-radius:var(--radius-sm);box-shadow:var(--shadow-raised-sm);padding:14px;margin-top:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <strong style="font-size:13px">${h.booking}</strong>
        <span class="badge ${h.status==='Confirmed'?'badge-green':h.status==='Pending'?'badge-grey':h.status==='Checked-in'?'badge-outline-green':'badge-light'}">${h.status}</span>
      </div>
      <div style="font-size:12px;color:var(--text-secondary)">${h.room} &nbsp;•&nbsp; ${h.dates}</div>
    </div>
  `).join('');
}

// ============ CHECK-IN / CHECK-OUT ============
function expressCheckin() { showToast('Express check-in completed! Room auto-assigned.'); }
function manualCheckin() { showToast('Guest checked in successfully!'); }
function processCheckout() { showToast('Guest checked out successfully!'); }
function printReceipt() { showToast('Sending receipt to printer...'); closeModal('receipt-modal'); }

// ============ BLACKLIST CONFIRM ============
document.getElementById('confirm-blacklist')?.addEventListener('click', () => {});
// Override the blacklist button
(function() {
  const blBtn = document.querySelector('[onclick*="confirm-blacklist"]');
  if (blBtn) {
    blBtn.setAttribute('onclick', "confirmAction('Blacklist this guest? They will not be able to make future bookings.','blacklistGuest')");
  }
})();

// ============ PAYMENT METHOD SELECTION ============
function selectPayment(el) {
  el.parentElement.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

// ============ TOGGLE METRIC ============
function toggleMetric(el, period) {
  const parent = el.closest('.toggle-tabs');
  parent.querySelectorAll('.toggle-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const valueEl = el.closest('.metric-card').querySelector('.metric-value');
  if (period === 'today') valueEl.textContent = '142';
  else valueEl.textContent = '3,502';
}

// ============ CHART DRAWING (Canvas) ============
const revenueData = [120, 180, 150, 220, 190, 280, 250, 310, 270, 350, 320, 400];
const dailyData = [45, 52, 38, 65, 48, 72, 58];
const bookingData = [30, 45, 35, 55, 40, 60, 50, 70, 55, 75, 65, 85];
const paymentData = [80, 120, 95, 140, 110, 160, 130];
const taxData = [15, 22, 18, 28, 20, 30, 25, 35, 28, 38, 32, 42];

function drawLineChart(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  const max = Math.max(...data) * 1.15;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  // Grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), padding.left - 8, y + 4);
  }

  // Line
  const points = data.map((v, i) => ({
    x: padding.left + (plotW / (data.length - 1)) * i,
    y: padding.top + plotH - (v / max) * plotH
  }));

  // Fill gradient
  const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  grad.addColorStop(0, color + '30');
  grad.addColorStop(1, color + '05');
  ctx.beginPath();
  ctx.moveTo(points[0].x, h - padding.bottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // Smooth line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  ctx.stroke();

  // Dots
  points.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  });
}

function drawBarChart(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  const max = Math.max(...data) * 1.15;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;
  const barW = (plotW / data.length) * 0.6;
  const gap = (plotW / data.length) * 0.4;

  // Grid
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), padding.left - 8, y + 4);
  }

  // Bars
  data.forEach((v, i) => {
    const barH = (v / max) * plotH;
    const x = padding.left + (plotW / data.length) * i + gap / 2;
    const y = padding.top + plotH - barH;
    ctx.fillStyle = color + 'cc';
    roundedRect(ctx, x, y, barW, barH, 6);
    ctx.fill();
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAllCharts() {
  drawLineChart('dailyRevenueChart', dailyData, '#2ecc71');
  drawBarChart('monthlyRevenueChart', revenueData, '#2ecc71');
  drawLineChart('bookingReportChart', bookingData, '#3498db');
  drawBarChart('paymentReportChart', paymentData, '#2ecc71');
  drawBarChart('taxReportChart', taxData, '#e67e22');
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Draw dashboard chart
  setTimeout(() => drawLineChart('revenueChart', revenueData, '#2ecc71'), 200);

  // Fix blacklist button
  const blBtn = document.querySelector('.btn-danger[onclick*="blacklist"]');
  if (blBtn) blBtn.setAttribute('onclick', "confirmAction('Blacklist this guest?','blacklistGuest')");

  // Keyboard - Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
});
