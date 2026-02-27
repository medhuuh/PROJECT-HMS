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
  if (page === 'bookings') setTimeout(renderGanttCalendar, 100);
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
        <span class="badge ${h.status === 'Confirmed' ? 'badge-green' : h.status === 'Pending' ? 'badge-grey' : h.status === 'Checked-in' ? 'badge-outline-green' : 'badge-light'}">${h.status}</span>
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
document.getElementById('confirm-blacklist')?.addEventListener('click', () => { });
// Override the blacklist button
(function () {
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

// ============ GANTT CALENDAR ============
const GANTT_DAYS = 14;
let ganttStartDate = new Date(2026, 1, 24); // Feb 24, 2026

const ganttRooms = [
  { id: '101', name: 'Room 101', type: 'Deluxe', color: '#2ecc71' },
  { id: '102', name: 'Room 102', type: 'Standard', color: '#3b82f6' },
  { id: '108', name: 'Room 108', type: 'Deluxe', color: '#2ecc71' },
  { id: '205', name: 'Room 205', type: 'Suite', color: '#8b5cf6' },
  { id: '302', name: 'Room 302', type: 'Standard', color: '#3b82f6' },
  { id: '410', name: 'Room 410', type: 'Suite', color: '#8b5cf6' },
];

const ganttBookings = [
  { room: '101', guest: 'Rahul Sharma', start: '2026-02-27', end: '2026-03-01', status: 'confirmed' },
  { room: '205', guest: 'Priya Patel', start: '2026-02-28', end: '2026-03-03', status: 'pending' },
  { room: '302', guest: 'Amit Kumar', start: '2026-02-25', end: '2026-02-27', status: 'checked-in' },
  { room: '108', guest: 'Sneha Reddy', start: '2026-02-20', end: '2026-02-24', status: 'checked-out' },
  { room: '410', guest: 'Vikram Singh', start: '2026-02-26', end: '2026-02-28', status: 'cancelled' },
  { room: '101', guest: 'Meera Nair', start: '2026-03-03', end: '2026-03-07', status: 'confirmed' },
  { room: '102', guest: 'Arjun Das', start: '2026-02-24', end: '2026-02-28', status: 'checked-in' },
  { room: '302', guest: 'Kavitha R.', start: '2026-02-28', end: '2026-03-02', status: 'pending' },
  { room: '205', guest: 'Deepak Joshi', start: '2026-03-05', end: '2026-03-09', status: 'confirmed' },
  { room: '108', guest: 'Ritu Verma', start: '2026-02-26', end: '2026-03-01', status: 'confirmed' },
];

function shiftCalendar(days) {
  if (days === 0) {
    ganttStartDate = new Date(2026, 1, 24);
  } else {
    ganttStartDate = new Date(ganttStartDate.getTime() + days * 86400000);
  }
  renderGanttCalendar();
}

function fmtShort(d) {
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${m[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
}

function fmtDay(d) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function renderGanttCalendar() {
  const wrapper = document.getElementById('ganttWrapper');
  if (!wrapper) return;
  const today = new Date(2026, 1, 27); // Feb 27, 2026

  // Update date range label
  const endDate = new Date(ganttStartDate.getTime() + (GANTT_DAYS - 1) * 86400000);
  const rangeEl = document.getElementById('calendarDateRange');
  if (rangeEl) rangeEl.textContent = `${fmtShort(ganttStartDate)} – ${fmtShort(endDate)}, ${ganttStartDate.getFullYear()}`;

  // Build dates array
  const dates = [];
  for (let i = 0; i < GANTT_DAYS; i++) {
    dates.push(new Date(ganttStartDate.getTime() + i * 86400000));
  }

  // Build HTML table
  let html = `<table class="gantt-table"><thead><tr><th class="room-col">Room</th>`;
  dates.forEach(d => {
    const isToday = dateKey(d) === dateKey(today);
    html += `<th${isToday ? ' class="today"' : ''}>${fmtDay(d)}<br>${d.getDate()}</th>`;
  });
  html += `</tr></thead><tbody>`;

  ganttRooms.forEach((room, ri) => {
    html += `<tr>`;
    html += `<td class="room-label-cell"><span class="room-type-dot" style="background:${room.color}"></span>${room.name}<span class="room-type-label">${room.type}</span></td>`;
    dates.forEach((d, ci) => {
      const isToday = dateKey(d) === dateKey(today);
      html += `<td data-room="${ri}" data-col="${ci}"${isToday ? ' class="today-col"' : ''}></td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  wrapper.innerHTML = html;

  // Overlay booking bars
  requestAnimationFrame(() => {
    ganttRooms.forEach((room, ri) => {
      const roomBookings = ganttBookings.filter(b => b.room === room.id);
      roomBookings.forEach(booking => {
        const bStart = new Date(booking.start + 'T00:00:00');
        const bEnd = new Date(booking.end + 'T00:00:00');
        const rangeStart = ganttStartDate;
        const rangeEnd = new Date(ganttStartDate.getTime() + GANTT_DAYS * 86400000);
        if (bEnd <= rangeStart || bStart >= rangeEnd) return;

        const startCol = Math.max(0, Math.floor((bStart - rangeStart) / 86400000));
        const endCol = Math.min(GANTT_DAYS - 1, Math.ceil((bEnd - rangeStart) / 86400000) - 1);
        if (startCol > endCol) return;

        const firstCell = wrapper.querySelector(`td[data-room="${ri}"][data-col="${startCol}"]`);
        const lastCell = wrapper.querySelector(`td[data-room="${ri}"][data-col="${endCol}"]`);
        if (!firstCell || !lastCell) return;

        const firstRect = firstCell.getBoundingClientRect();
        const lastRect = lastCell.getBoundingClientRect();
        const barWidth = lastRect.right - firstRect.left - 4;

        const bar = document.createElement('div');
        bar.className = `gantt-bar ${booking.status}`;
        bar.style.width = barWidth + 'px';
        bar.innerHTML = `<span>${booking.guest}</span><div class="gantt-bar-tooltip">${booking.guest} • ${fmtShort(bStart)} – ${fmtShort(bEnd)} • ${booking.status}</div>`;
        firstCell.appendChild(bar);
      });
    });
  });
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
