/**
 * AURUM & BURGUNDY - ADMIN DASHBOARD LOGIC
 */

(function () {
  let authToken = localStorage.getItem('aurum_admin_token');
  let currentTab = 'overview';
  let cachedProperties = [];
  let cachedLeads = [];

  document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
  });

  async function initAdmin() {
    if (!authToken) {
      showLoginScreen();
      return;
    }

    try {
      const res = await fetch('/api/admin/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        showDashboardScreen(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error(err);
      logout();
    }
  }

  function showLoginScreen() {
    document.getElementById('adminApp').innerHTML = `
      <div class="admin-login-wrap">
        <div class="login-card">
          <div style="width: 50px; height: 50px; border-radius: 8px; background: #741F38; border: 1px solid #D7C1A0; display: inline-flex; align-items: center; justify-content: center; color: #D7C1A0; font-family: 'Cinzel', serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 1.25rem;">
            PH
          </div>
          <h2 style="color: #FFF; font-family: 'Cinzel', serif; font-size: 1.5rem; margin-bottom: 0.5rem;">Principal Broker Portal</h2>
          <p style="color: #8E8E93; font-size: 0.85rem; margin-bottom: 2rem;">Property Hub Real Estate Advisory</p>

          <form id="adminLoginForm" style="text-align: left;">
            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.82rem; color: #D7C1A0; margin-bottom: 0.4rem; font-weight: 600;">Username</label>
              <input type="text" id="loginUsername" class="form-input-admin" placeholder="e.g. admin" required value="admin">
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.82rem; color: #D7C1A0; margin-bottom: 0.4rem; font-weight: 600;">Secure Password</label>
              <input type="password" id="loginPassword" class="form-input-admin" placeholder="••••••••••••" required value="admin@burgundy2026">
              <span style="font-size: 0.72rem; color: #8E8E93; margin-top: 0.3rem; display: block;">Default test credential: admin@burgundy2026</span>
            </div>

            <div id="loginError" style="display: none; background: rgba(220, 38, 38, 0.2); border: 1px solid #dc2626; color: #fca5a5; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1.25rem;"></div>

            <button type="submit" class="btn-admin btn-admin-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
              Access Dashboard
            </button>
          </form>

          <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.25rem;">
            <a href="/" style="color: #8E8E93; font-size: 0.85rem; text-decoration: none;">← Return to Main Website</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('adminLoginForm').addEventListener('submit', handleLogin);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorBox = document.getElementById('loginError');
    errorBox.style.display = 'none';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        authToken = data.token;
        localStorage.setItem('aurum_admin_token', authToken);
        showDashboardScreen(data.user);
      } else {
        errorBox.textContent = data.error || 'Invalid credentials';
        errorBox.style.display = 'block';
      }
    } catch (err) {
      errorBox.textContent = 'Server connection failed';
      errorBox.style.display = 'block';
    }
  }

  function logout() {
    authToken = null;
    localStorage.removeItem('aurum_admin_token');
    showLoginScreen();
  }

  function showDashboardScreen(user) {
    document.getElementById('adminApp').innerHTML = `
      <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
          <div class="sidebar-header">
            <div class="sidebar-brand-crest">PH</div>
            <div>
              <div class="sidebar-brand-text">PROPERTY HUB</div>
              <div style="font-size: 0.7rem; color: #D7C1A0;">Control Console</div>
            </div>
          </div>

          <ul class="sidebar-nav">
            <li class="sidebar-nav-item ${currentTab === 'overview' ? 'active' : ''}">
              <button onclick="window.AdminApp.switchTab('overview')">
                <span>📊</span> Overview & Analytics
              </button>
            </li>
            <li class="sidebar-nav-item ${currentTab === 'properties' ? 'active' : ''}">
              <button onclick="window.AdminApp.switchTab('properties')">
                <span>🏰</span> Manage Properties
              </button>
            </li>
            <li class="sidebar-nav-item ${currentTab === 'leads' ? 'active' : ''}">
              <button onclick="window.AdminApp.switchTab('leads')">
                <span>📋</span> Leads CRM
              </button>
            </li>
            <li class="sidebar-nav-item ${currentTab === 'settings' ? 'active' : ''}">
              <button onclick="window.AdminApp.switchTab('settings')">
                <span>⚙️</span> Website Settings
              </button>
            </li>
          </ul>

          <div class="sidebar-footer">
            <div>
              <div style="font-size: 0.85rem; color: #FFF; font-weight: 600;">${user.full_name || 'Principal Broker'}</div>
              <div style="font-size: 0.75rem; color: #8E8E93;">Authenticated</div>
            </div>
            <button class="btn-admin btn-admin-danger" style="padding: 0.4rem 0.7rem; font-size: 0.75rem;" onclick="window.AdminApp.logout()">
              Logout
            </button>
          </div>
        </aside>

        <!-- Main Body -->
        <main class="admin-main">
          <div class="admin-topbar">
            <div>
              <h2 id="adminTabTitle" style="font-size: 1.3rem; color: #FFF; font-family: 'Cinzel', serif;">Dashboard Overview</h2>
            </div>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <a href="/" target="_blank" class="btn-admin btn-admin-outline">
                <span>👁️</span> View Live Website
              </a>
              <a href="/api/admin/leads/export" class="btn-admin btn-admin-primary" style="background: #25D366; border-color: #25D366;" download>
                <span>📥</span> Export Leads (CSV)
              </a>
            </div>
          </div>

          <div class="admin-body" id="adminTabContent">
            <!-- Loaded dynamically -->
          </div>
        </main>
      </div>

      <!-- Add / Edit Property Modal Container -->
      <div class="admin-modal" id="propertyModal">
        <div class="admin-modal-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <h3 id="propModalTitle" style="color: #FFF; font-family: 'Cinzel', serif; font-size: 1.3rem;">Add New Property</h3>
            <button class="modal-close-btn" onclick="document.getElementById('propertyModal').classList.remove('open')">&times;</button>
          </div>
          <form id="propertyEditForm">
            <input type="hidden" id="propEditId">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Property Title *</label>
                <input type="text" id="propTitle" class="form-input-admin" placeholder="e.g. The Imperial Residence" required>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Category *</label>
                <select id="propCategory" class="form-select-admin">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Plots & Land</option>
                  <option value="rental">Rentals</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Subcategory</label>
                <input type="text" id="propSubcategory" class="form-input-admin" placeholder="e.g. Penthouse, Villa, Showroom">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Transaction Type</label>
                <select id="propTransaction" class="form-select-admin">
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                  <option value="Lease">Lease</option>
                  <option value="Invest">Invest</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Price in INR (Numbers) *</label>
                <input type="number" id="propPrice" class="form-input-admin" placeholder="e.g. 45000000" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Price Display String</label>
                <input type="text" id="propPriceDisplay" class="form-input-admin" placeholder="e.g. ₹4.50 Cr or ₹75,000 / mo">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">City *</label>
                <input type="text" id="propCity" class="form-input-admin" placeholder="e.g. Pune" required>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Locality *</label>
                <input type="text" id="propLocality" class="form-input-admin" placeholder="e.g. Koregaon Park" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Carpet Area (sq ft)</label>
                <input type="number" id="propArea" class="form-input-admin" placeholder="3200">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Bedrooms (BHK)</label>
                <input type="number" id="propBedrooms" class="form-input-admin" placeholder="4">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Bathrooms</label>
                <input type="number" id="propBathrooms" class="form-input-admin" placeholder="4">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Status</label>
                <select id="propStatus" class="form-select-admin">
                  <option value="Available">Available</option>
                  <option value="Under Offer">Under Offer</option>
                  <option value="Sold">Sold</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Primary Image URL</label>
              <input type="url" id="propImage" class="form-input-admin" placeholder="https://images.unsplash.com/photo-...">
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">MahaRERA Registration ID</label>
              <input type="text" id="propRera" class="form-input-admin" placeholder="e.g. MahaRERA P52100028941">
            </div>

            <div style="display: flex; gap: 1.5rem; margin-bottom: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.4rem; color: #FFF; font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="propFeatured">
                <span>Mark as Featured</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.4rem; color: #FFF; font-size: 0.85rem; cursor: pointer;">
                <input type="checkbox" id="propVerified" checked>
                <span>Mark as RERA Verified</span>
              </label>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.3rem;">Description</label>
              <textarea id="propDescription" class="form-textarea-admin" rows="3" placeholder="Luxury property narrative..."></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="button" class="btn-admin btn-admin-outline" onclick="document.getElementById('propertyModal').classList.remove('open')">Cancel</button>
              <button type="submit" class="btn-admin btn-admin-primary">Save Property</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('propertyEditForm').addEventListener('submit', handleSaveProperty);
    switchTab('overview');
  }

  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));

    const titles = {
      overview: 'Dashboard Overview & Analytics',
      properties: 'Property Portfolio Management',
      leads: 'Customer Leads & WhatsApp CRM',
      settings: 'Website Settings & Configuration'
    };

    const titleEl = document.getElementById('adminTabTitle');
    if (titleEl) titleEl.textContent = titles[tab] || 'Dashboard';

    if (tab === 'overview') renderOverviewTab();
    if (tab === 'properties') renderPropertiesTab();
    if (tab === 'leads') renderLeadsTab();
    if (tab === 'settings') renderSettingsTab();
  }

  // TAB 1: OVERVIEW
  async function renderOverviewTab() {
    const content = document.getElementById('adminTabContent');
    content.innerHTML = '<div style="color: #D7C1A0;">Loading metrics...</div>';

    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      const s = data.stats;

      content.innerHTML = `
        <div class="stats-grid-admin">
          <div class="stat-widget">
            <span class="stat-widget-label">Total Properties</span>
            <span class="stat-widget-num">${s.totalProps}</span>
            <span style="font-size: 0.75rem; color: #25D366;">${s.availableProps} Available Now</span>
          </div>

          <div class="stat-widget">
            <span class="stat-widget-label">Total Leads Captured</span>
            <span class="stat-widget-num">${s.totalLeads}</span>
            <span style="font-size: 0.75rem; color: #25D366;">${s.newLeads} New Inquiries</span>
          </div>

          <div class="stat-widget">
            <span class="stat-widget-label">Site Visits Scheduled</span>
            <span class="stat-widget-num">${s.siteVisits}</span>
            <span style="font-size: 0.75rem; color: #D7C1A0;">Private Appointments</span>
          </div>

          <div class="stat-widget">
            <span class="stat-widget-label">Converted Mandates</span>
            <span class="stat-widget-num">${s.convertedLeads}</span>
            <span style="font-size: 0.75rem; color: #D7C1A0;">Transactions Closed</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <!-- Recent Inquiries -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 style="font-size: 1.1rem; color: #FFF; font-family: 'Cinzel', serif;">Recent Client Inquiries</h3>
              <button class="btn-admin btn-admin-outline" onclick="window.AdminApp.switchTab('leads')">View All Leads →</button>
            </div>
            <div id="recentLeadsContainer" style="padding: 1.5rem;">
              Loading recent inquiries...
            </div>
          </div>

          <!-- Quick Actions & Status -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 style="font-size: 1.1rem; color: #FFF; font-family: 'Cinzel', serif;">Brokerage Quick Actions</h3>
            </div>
            <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <button class="btn-admin btn-admin-primary" style="width: 100%; justify-content: center;" onclick="window.AdminApp.openPropertyModal()">
                + Add New Property
              </button>
              <a href="/api/admin/leads/export" class="btn-admin btn-admin-outline" style="width: 100%; justify-content: center;" download>
                📥 Export All Leads to CSV
              </a>
              <a href="https://wa.me/917972889444" target="_blank" class="btn-admin" style="width: 100%; justify-content: center; background: #25D366; color: #FFF;">
                Open WhatsApp Web (+91 79728 89444)
              </a>
            </div>
          </div>
        </div>
      `;

      // Load recent leads
      loadRecentLeads();
    } catch (err) {
      content.innerHTML = '<div style="color: red;">Failed to load statistics.</div>';
    }
  }

  async function loadRecentLeads() {
    const container = document.getElementById('recentLeadsContainer');
    if (!container) return;

    try {
      const res = await fetch('/api/admin/leads?limit=5', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.leads.length === 0) {
        container.innerHTML = '<div style="color: #8E8E93;">No inquiries logged yet.</div>';
        return;
      }

      container.innerHTML = data.leads.slice(0, 5).map(l => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <div>
            <div style="font-size: 0.95rem; color: #FFF; font-weight: 600;">${l.name} <span style="font-size: 0.75rem; color: #D7C1A0; margin-left: 0.5rem;">(${l.lead_type.toUpperCase()})</span></div>
            <div style="font-size: 0.8rem; color: #8E8E93;">Phone: ${l.phone} ${l.preferred_location ? `| Loc: ${l.preferred_location}` : ''}</div>
          </div>
          <div>
            <span class="badge-status ${l.status.toLowerCase().replace(/\s+/g, '')}">${l.status}</span>
          </div>
        </div>
      `).join('');
    } catch (e) {
      container.innerHTML = 'Error loading recent leads';
    }
  }

  // TAB 2: PROPERTIES
  async function renderPropertiesTab() {
    const content = document.getElementById('adminTabContent');
    content.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <input type="text" id="adminPropSearch" class="form-input-admin" placeholder="Search property by title, ID or locality..." style="width: 320px;">
            <select id="adminPropCatFilter" class="form-select-admin" style="width: 160px;">
              <option value="all">All Categories</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Plots & Land</option>
              <option value="rental">Rentals</option>
            </select>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="window.AdminApp.openPropertyModal()">
            + Add New Property
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Thumbnail & Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="adminPropertiesTableBody">
              <tr><td colspan="7" style="text-align: center; color: #D7C1A0;">Loading properties...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('adminPropSearch').addEventListener('input', filterPropertiesTable);
    document.getElementById('adminPropCatFilter').addEventListener('change', filterPropertiesTable);

    await loadAdminProperties();
  }

  async function loadAdminProperties() {
    const tbody = document.getElementById('adminPropertiesTableBody');
    if (!tbody) return;

    try {
      const res = await fetch('/api/properties?limit=100');
      const data = await res.json();
      cachedProperties = data.properties || [];
      renderPropertiesRows(cachedProperties);
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="7" style="color:red;">Error loading properties</td></tr>';
    }
  }

  function renderPropertiesRows(list) {
    const tbody = document.getElementById('adminPropertiesTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #D7C1A0; padding: 3.5rem 1rem;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏰</div>
        <div style="font-size: 1.1rem; color: #FFF; font-weight: 600; margin-bottom: 0.5rem;">No properties in portfolio</div>
        <p style="color: #8E8E93; font-size: 0.85rem; margin-bottom: 1.25rem;">Start creating your real estate listings to display them on the website.</p>
        <button class="btn-admin btn-admin-primary" onclick="window.AdminApp.openPropertyModal()">+ Add Your First Property</button>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td style="font-family: monospace; font-weight: 600; color: #D7C1A0;">${p.id}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${(p.images && p.images[0]) || ''}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            <div>
              <div style="font-weight: 600; color: #FFF; font-size: 0.9rem;">${p.title}</div>
              <div style="font-size: 0.75rem; color: #8E8E93;">${p.subcategory} | ${p.bedrooms > 0 ? p.bedrooms + ' BHK' : p.area_sqft + ' sq ft'}</div>
            </div>
          </div>
        </td>
        <td style="text-transform: capitalize;">${p.category}</td>
        <td style="color: #D7C1A0; font-weight: 600;">${p.price_display}</td>
        <td>${p.locality}, ${p.city}</td>
        <td>
          <select onchange="window.AdminApp.updatePropertyStatus('${p.id}', this.value)" class="form-select-admin" style="padding: 0.25rem 0.5rem; font-size: 0.78rem; width: auto;">
            <option value="Available" ${p.status === 'Available' ? 'selected' : ''}>Available</option>
            <option value="Under Offer" ${p.status === 'Under Offer' ? 'selected' : ''}>Under Offer</option>
            <option value="Sold" ${p.status === 'Sold' ? 'selected' : ''}>Sold</option>
            <option value="Rented" ${p.status === 'Rented' ? 'selected' : ''}>Rented</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-admin btn-admin-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="window.AdminApp.editProperty('${p.id}')">Edit</button>
            <button class="btn-admin btn-admin-danger" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="window.AdminApp.deleteProperty('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function filterPropertiesTable() {
    const search = document.getElementById('adminPropSearch').value.toLowerCase();
    const cat = document.getElementById('adminPropCatFilter').value;

    const filtered = cachedProperties.filter(p => {
      const matchCat = (cat === 'all' || p.category === cat);
      const matchSearch = (!search || p.title.toLowerCase().includes(search) || p.id.toLowerCase().includes(search) || p.locality.toLowerCase().includes(search));
      return matchCat && matchSearch;
    });

    renderPropertiesRows(filtered);
  }

  function openPropertyModal(prop = null) {
    const modal = document.getElementById('propertyModal');
    const title = document.getElementById('propModalTitle');
    const form = document.getElementById('propertyEditForm');

    form.reset();
    document.getElementById('propEditId').value = prop ? prop.id : '';

    if (prop) {
      title.textContent = `Edit Property: ${prop.id}`;
      document.getElementById('propTitle').value = prop.title || '';
      document.getElementById('propCategory').value = prop.category || 'residential';
      document.getElementById('propSubcategory').value = prop.subcategory || '';
      document.getElementById('propTransaction').value = prop.transaction_type || 'Buy';
      document.getElementById('propPrice').value = prop.price || '';
      document.getElementById('propPriceDisplay').value = prop.price_display || '';
      document.getElementById('propCity').value = prop.city || '';
      document.getElementById('propLocality').value = prop.locality || '';
      document.getElementById('propArea').value = prop.area_sqft || '';
      document.getElementById('propBedrooms').value = prop.bedrooms || '';
      document.getElementById('propBathrooms').value = prop.bathrooms || '';
      document.getElementById('propStatus').value = prop.status || 'Available';
      document.getElementById('propImage').value = (prop.images && prop.images[0]) || '';
      document.getElementById('propRera').value = prop.rera_id || '';
      document.getElementById('propFeatured').checked = Boolean(prop.featured);
      document.getElementById('propVerified').checked = Boolean(prop.verified);
      document.getElementById('propDescription').value = prop.description || '';
    } else {
      title.textContent = 'Add New Property';
      document.getElementById('propCity').value = 'Pune';
      document.getElementById('propVerified').checked = true;
    }

    modal.classList.add('open');
  }

  function editProperty(id) {
    const prop = cachedProperties.find(p => p.id === id);
    if (prop) openPropertyModal(prop);
  }

  async function handleSaveProperty(e) {
    e.preventDefault();
    const id = document.getElementById('propEditId').value;
    const isEdit = Boolean(id);

    const priceNum = parseFloat(document.getElementById('propPrice').value) || 0;
    let priceDisp = document.getElementById('propPriceDisplay').value.trim();
    if (!priceDisp) {
      priceDisp = priceNum >= 10000000 ? `₹${(priceNum / 10000000).toFixed(2)} Cr` : `₹${(priceNum / 100000).toFixed(2)} Lakh`;
    }

    const payload = {
      title: document.getElementById('propTitle').value.trim(),
      category: document.getElementById('propCategory').value,
      subcategory: document.getElementById('propSubcategory').value.trim() || 'Apartment',
      transaction_type: document.getElementById('propTransaction').value,
      price: priceNum,
      price_display: priceDisp,
      city: document.getElementById('propCity').value.trim(),
      locality: document.getElementById('propLocality').value.trim(),
      area_sqft: parseFloat(document.getElementById('propArea').value) || 0,
      bedrooms: parseInt(document.getElementById('propBedrooms').value, 10) || 0,
      bathrooms: parseInt(document.getElementById('propBathrooms').value, 10) || 0,
      status: document.getElementById('propStatus').value,
      images: [document.getElementById('propImage').value.trim() || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      rera_id: document.getElementById('propRera').value.trim(),
      featured: document.getElementById('propFeatured').checked,
      verified: document.getElementById('propVerified').checked,
      description: document.getElementById('propDescription').value.trim()
    };

    const url = isEdit ? `/api/admin/properties/${id}` : '/api/admin/properties';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('propertyModal').classList.remove('open');
        await loadAdminProperties();
      } else {
        alert('Failed to save: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  }

  async function updatePropertyStatus(id, newStatus) {
    const prop = cachedProperties.find(p => p.id === id);
    if (!prop) return;
    prop.status = newStatus;

    try {
      await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(prop)
      });
    } catch (e) {
      alert('Failed to update property status');
    }
  }

  async function deleteProperty(id) {
    if (!confirm(`Are you sure you want to permanently delete property ${id}?`)) return;

    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await loadAdminProperties();
      } else {
        alert('Delete failed');
      }
    } catch (e) {
      alert('Error deleting property');
    }
  }

  // TAB 3: LEADS CRM
  async function renderLeadsTab() {
    const content = document.getElementById('adminTabContent');
    content.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <input type="text" id="adminLeadSearch" class="form-input-admin" placeholder="Search by name, phone, or location..." style="width: 320px;">
            <select id="adminLeadStatusFilter" class="form-select-admin" style="width: 170px;">
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Site Visit Scheduled">Site Visit Scheduled</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <a href="/api/admin/leads/export" class="btn-admin btn-admin-primary" style="background: #25D366; border-color: #25D366;" download>
            📥 Export to CSV
          </a>
        </div>

        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Client Name & Contact</th>
                <th>Type</th>
                <th>Property / Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Notes / Actions</th>
              </tr>
            </thead>
            <tbody id="adminLeadsTableBody">
              <tr><td colspan="7" style="text-align: center; color: #D7C1A0;">Loading client leads...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('adminLeadSearch').addEventListener('input', filterLeadsTable);
    document.getElementById('adminLeadStatusFilter').addEventListener('change', filterLeadsTable);

    await loadAdminLeads();
  }

  async function loadAdminLeads() {
    const tbody = document.getElementById('adminLeadsTableBody');
    if (!tbody) return;

    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      cachedLeads = data.leads || [];
      renderLeadsRows(cachedLeads);
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="7" style="color:red;">Error loading leads</td></tr>';
    }
  }

  function renderLeadsRows(list) {
    const tbody = document.getElementById('adminLeadsTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #8E8E93; padding: 3rem;">No inquiries recorded yet.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(l => {
      const waLink = `https://wa.me/91${l.phone}?text=${encodeURIComponent(`Hello ${l.name}, following up from Property Hub regarding your inquiry.`)}`;
      return `
        <tr>
          <td style="font-family: monospace; font-weight: 600; color: #D7C1A0;">#${l.id}</td>
          <td>
            <div style="font-weight: 600; color: #FFF; font-size: 0.95rem;">${l.name}</div>
            <div style="font-size: 0.8rem; color: #8E8E93;">
              <a href="tel:${l.phone}" style="color: #D7C1A0;">${l.phone}</a>
              ${l.email ? ` | ${l.email}` : ''}
            </div>
            <div style="margin-top: 0.25rem;">
              <a href="${waLink}" target="_blank" style="font-size: 0.75rem; color: #25D366; font-weight: 600;">
                💬 Message on WhatsApp
              </a>
            </div>
          </td>
          <td style="text-transform: uppercase; font-size: 0.8rem; font-weight: 600; color: #D7C1A0;">${l.lead_type}</td>
          <td>
            <div style="font-size: 0.88rem; color: #FFF;">${l.property_title || l.property_id || 'General Requirement'}</div>
            <div style="font-size: 0.78rem; color: #8E8E93;">${l.preferred_location || 'Not specified'}</div>
          </td>
          <td style="color: #D7C1A0; font-weight: 600;">${l.budget || 'Flexible'}</td>
          <td>
            <select onchange="window.AdminApp.updateLeadStatus(${l.id}, this.value)" class="form-select-admin" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; width: auto;">
              <option value="New" ${l.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Follow-up" ${l.status === 'Follow-up' ? 'selected' : ''}>Follow-up</option>
              <option value="Site Visit Scheduled" ${l.status === 'Site Visit Scheduled' ? 'selected' : ''}>Site Visit Scheduled</option>
              <option value="Converted" ${l.status === 'Converted' ? 'selected' : ''}>Converted</option>
              <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </td>
          <td>
            <button class="btn-admin btn-admin-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="window.AdminApp.promptLeadNotes(${l.id}, '${(l.notes || '').replace(/'/g, "\\'")}')">
              Notes (${l.notes ? '✓' : 'Add'})
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterLeadsTable() {
    const search = document.getElementById('adminLeadSearch').value.toLowerCase();
    const st = document.getElementById('adminLeadStatusFilter').value;

    const filtered = cachedLeads.filter(l => {
      const matchSt = (st === 'all' || l.status === st);
      const matchSearch = (!search || l.name.toLowerCase().includes(search) || l.phone.includes(search) || (l.property_title && l.property_title.toLowerCase().includes(search)));
      return matchSt && matchSearch;
    });

    renderLeadsRows(filtered);
  }

  async function updateLeadStatus(id, newStatus) {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      alert('Error updating status');
    }
  }

  async function promptLeadNotes(id, currentNotes) {
    const newNotes = prompt('Update internal broker notes for this lead:', currentNotes);
    if (newNotes === null) return;

    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ notes: newNotes })
      });
      await loadAdminLeads();
    } catch (e) {
      alert('Error saving notes');
    }
  }

  // TAB 4: SETTINGS
  async function renderSettingsTab() {
    const content = document.getElementById('adminTabContent');
    content.innerHTML = '<div style="color:#D7C1A0;">Loading settings...</div>';

    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      const s = data.settings || {};

      content.innerHTML = `
        <div class="admin-card" style="max-width: 800px;">
          <div class="admin-card-header">
            <h3 style="color:#FFF; font-family:'Cinzel', serif;">Business Identity & Contact Settings</h3>
          </div>
          <form id="siteSettingsForm" style="padding: 2rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">WhatsApp Number (Int'l Format)</label>
                <input type="text" name="whatsapp_number" class="form-input-admin" value="${s.whatsapp_number || '917972889444'}" required>
                <span style="font-size: 0.72rem; color: #8E8E93;">Used for all click-to-chat links (e.g. 917972889444)</span>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Display Phone Number</label>
                <input type="text" name="display_phone" class="form-input-admin" value="${s.display_phone || '+91 79728 89444'}" required>
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Business Name</label>
              <input type="text" name="business_name" class="form-input-admin" value="${s.business_name || 'Property Hub'}">
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Registered Office Address</label>
              <textarea name="business_address" class="form-textarea-admin" rows="2">${s.business_address || 'Penthouse Suite 802, Prestige Tower, Senapati Bapat Road, Pune 411016'}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Stat: Properties</label>
                <input type="text" name="stat_properties" class="form-input-admin" value="${s.stat_properties || '500+'}">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Stat: Volume</label>
                <input type="text" name="stat_volume" class="form-input-admin" value="${s.stat_volume || '₹350+ Cr'}">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Stat: Satisfaction</label>
                <input type="text" name="stat_satisfaction" class="form-input-admin" value="${s.stat_satisfaction || '99.4%'}">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #D7C1A0; margin-bottom: 0.4rem;">Stat: Years Exp</label>
                <input type="text" name="stat_experience" class="form-input-admin" value="${s.stat_experience || '14+ Years'}">
              </div>
            </div>

            <button type="submit" class="btn-admin btn-admin-primary" style="padding: 0.75rem 1.5rem;">
              Save Settings
            </button>
          </form>
        </div>
      `;

      document.getElementById('siteSettingsForm').addEventListener('submit', handleSaveSettings);
    } catch (e) {
      content.innerHTML = '<div style="color:red;">Error loading settings</div>';
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      alert('Error updating settings');
    }
  }

  // Window export
  window.AdminApp = {
    switchTab,
    logout,
    openPropertyModal,
    editProperty,
    deleteProperty,
    updatePropertyStatus,
    updateLeadStatus,
    promptLeadNotes
  };

})();
