/**
 * AURUM & BURGUNDY REAL ESTATE - CORE APPLICATION
 * WhatsApp Lead Engine: +91 79728 89444
 */

(function () {
  const WHATSAPP_NUMBER = '917972889444';
  const WHATSAPP_DISPLAY = '+91 79728 89444';

  // App State
  let properties = [];
  let currentFilters = {
    category: 'all',
    subcategory: 'all',
    transaction: 'all',
    city: 'all',
    locality: '',
    min_price: '',
    max_price: '',
    bedrooms: 'all',
    furnishing: 'all',
    possession: 'all',
    verified: false,
    sort: 'featured',
    search: ''
  };

  let favorites = JSON.parse(localStorage.getItem('aurum_favorites') || '[]');
  let compareList = JSON.parse(localStorage.getItem('aurum_compare') || '[]');

  // DOM Elements
  const propertiesContainer = document.getElementById('propertiesGrid');
  const resultsCountEl = document.getElementById('resultsCount');
  const favCounterEl = document.getElementById('favCounter');
  const compareCounterEl = document.getElementById('compareCounter');
  const searchInput = document.getElementById('globalSearchInput');

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    setupEmiCalculator();
    setupFaqAccordion();
    setupWhatsAppFloatingMenu();
  });

  async function initApp() {
    updateCounters();
    await fetchProperties();
    checkUrlHashForProperty();
  }

  // Fetch properties from backend API
  async function fetchProperties() {
    if (!propertiesContainer) return;
    propertiesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid rgba(116, 31, 56, 0.3); border-top-color: var(--accent-burgundy); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 1rem; color: var(--accent-champagne); font-size: 0.95rem;">Curating luxury listings...</p>
      </div>
    `;

    try {
      // Build query string
      const params = new URLSearchParams();
      if (currentFilters.category !== 'all') params.append('category', currentFilters.category);
      if (currentFilters.subcategory !== 'all') params.append('subcategory', currentFilters.subcategory);
      if (currentFilters.transaction !== 'all') params.append('transaction', currentFilters.transaction);
      if (currentFilters.city !== 'all') params.append('city', currentFilters.city);
      if (currentFilters.locality) params.append('locality', currentFilters.locality);
      if (currentFilters.min_price) params.append('min_price', currentFilters.min_price);
      if (currentFilters.max_price) params.append('max_price', currentFilters.max_price);
      if (currentFilters.bedrooms !== 'all') params.append('bedrooms', currentFilters.bedrooms);
      if (currentFilters.furnishing !== 'all') params.append('furnishing', currentFilters.furnishing);
      if (currentFilters.possession !== 'all') params.append('possession', currentFilters.possession);
      if (currentFilters.verified) params.append('verified', '1');
      if (currentFilters.sort) params.append('sort', currentFilters.sort);
      if (currentFilters.search) params.append('search', currentFilters.search);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        properties = data.properties;
        renderProperties(properties);
        if (resultsCountEl) {
          resultsCountEl.textContent = properties.length;
        }
      } else {
        throw new Error(data.error || 'Failed to load properties');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      propertiesContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <h3 style="color: #FFF; margin-bottom: 0.5rem;">Unable to load properties</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Please check your server connection or refresh the page.</p>
          <button class="btn btn-burgundy" onclick="location.reload()">Retry Loading</button>
        </div>
      `;
    }
  }

  // Render property cards
  function renderProperties(list) {
    if (!propertiesContainer) return;

    if (list.length === 0) {
      propertiesContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-card);">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(116, 31, 56, 0.2); border: 1px solid var(--accent-champagne); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--accent-champagne); font-size: 2rem;">
            🏛️
          </div>
          <h3 style="font-size: 2rem; color: #FFF; font-family: var(--font-serif); margin-bottom: 0.75rem;">
            Fresh Luxury Listings Coming Soon
          </h3>
          <p style="color: var(--text-light-gray); max-width: 620px; margin: 0 auto 2.25rem; font-size: 1rem; line-height: 1.8;">
            Our public showcase is currently being refreshed with verified luxury mandates, premium penthouses, villas, and prime NA plots. We also manage discreet <strong>off-market portfolios</strong> for HNWI clients. Inquire directly on WhatsApp to receive available inventory tailored to your criteria.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-whatsapp" onclick="window.RealEstateForms.openInquiryModal('buy')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              Inquire Requirement on WhatsApp
            </button>
            <button class="btn btn-burgundy" onclick="window.RealEstateForms.openInquiryModal('sell')">
              List Your Property With Us
            </button>
            <a href="/admin" class="btn btn-dark" style="border-color: var(--accent-champagne); color: var(--accent-champagne);">
              + Admin: Add Properties
            </a>
          </div>
        </div>
      `;
      return;
    }

    propertiesContainer.innerHTML = list.map(prop => createPropertyCardHtml(prop)).join('');
  }

  function createPropertyCardHtml(prop) {
    const isFav = favorites.includes(prop.id);
    const isCompared = compareList.includes(prop.id);
    const mainImg = (prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const isRental = prop.category === 'rental' || prop.transaction_type === 'Rent';

    // Build WhatsApp message for listing card button
    const cardWaMsg = encodeURIComponent(
      `*Inquiry for Property ID: ${prop.id}*\n` +
      `*${prop.title}*\n` +
      `Price: ${prop.price_display}\n` +
      `Location: ${prop.locality}, ${prop.city}\n` +
      `Page: ${window.location.origin}/#property-${prop.id}\n\n` +
      `Hello, I would like to know the current availability, request the complete brochure & floor plans, and arrange a private site visit.`
    );
    const cardWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${cardWaMsg}`;

    return `
      <div class="property-card" id="card-${prop.id}" data-id="${prop.id}">
        <!-- Card Media -->
        <div class="card-media">
          <img src="${mainImg}" alt="${prop.title}" class="card-image" loading="lazy">
          
          <div class="card-badges">
            ${prop.featured ? '<span class="badge badge-featured">★ Featured</span>' : ''}
            ${prop.verified ? '<span class="badge badge-verified">✓ MahaRERA Verified</span>' : ''}
            <span class="badge badge-type">${prop.subcategory}</span>
            ${prop.status === 'Sold' ? '<span class="badge badge-status-sold">Sold Out</span>' : ''}
            ${prop.status === 'Rented' ? '<span class="badge badge-status-rented">Rented</span>' : ''}
          </div>

          <div class="card-actions-top">
            <button class="card-icon-btn ${isFav ? 'active' : ''}" onclick="window.RealEstateApp.toggleFavorite('${prop.id}')" title="Save to Favorites" aria-label="Favorite">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#741F38' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button class="card-icon-btn ${isCompared ? 'active' : ''}" onclick="window.RealEstateApp.toggleCompare('${prop.id}')" title="Compare Property" aria-label="Compare">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <div class="card-price-row">
            <div class="card-price">${prop.price_display}</div>
            <span class="card-prop-id">${prop.id}</span>
          </div>

          <h3 class="card-title" title="${prop.title}">${prop.title}</h3>

          <div class="card-location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-champagne);">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${prop.locality}, ${prop.city}</span>
          </div>

          <!-- Specs Grid -->
          <div class="card-specs">
            ${prop.bedrooms > 0 ? `
              <div class="spec-item" title="Bedrooms">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                <span>${prop.bedrooms} BHK</span>
              </div>
            ` : `
              <div class="spec-item" title="Type">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4"/></svg>
                <span>${prop.subcategory}</span>
              </div>
            `}

            <div class="spec-item" title="Carpet Area">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              <span>${prop.area_sqft ? prop.area_sqft.toLocaleString('en-IN') + ' ' + prop.area_unit : 'N/A'}</span>
            </div>

            <div class="spec-item" title="Possession Status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${prop.possession_status || 'Ready'}</span>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="card-footer">
            <button class="btn btn-dark btn-sm" onclick="window.RealEstateApp.showPropertyDetail('${prop.id}')">
              View Details
            </button>
            <a href="${cardWaUrl}" target="_blank" class="btn btn-burgundy btn-sm" title="Enquire on WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Show Property Detail Modal
  async function showPropertyDetail(propId) {
    let prop = properties.find(p => p.id === propId);
    if (!prop) {
      try {
        const res = await fetch(`/api/properties/${propId}`);
        const data = await res.json();
        if (data.success) {
          prop = data.property;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!prop) return;

    // Update URL hash for direct shareability
    window.location.hash = `property-${prop.id}`;

    let detailModal = document.getElementById('propertyDetailModal');
    if (!detailModal) {
      detailModal = document.createElement('div');
      detailModal.className = 'modal-overlay';
      detailModal.id = 'propertyDetailModal';
      document.body.appendChild(detailModal);
    }

    const images = (prop.images && prop.images.length) ? prop.images : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ];

    const waDetailMsg = encodeURIComponent(
      `*Private Inquiry for Property ID: ${prop.id}*\n` +
      `*${prop.title}*\n` +
      `Price: ${prop.price_display}\n` +
      `Location: ${prop.address || (prop.locality + ', ' + prop.city)}\n` +
      `RERA: ${prop.rera_id || 'Registered'}\n` +
      `Page: ${window.location.href}\n\n` +
      `Hello, please share the official brochure, detailed floor plans, and arrange a private tour.`
    );
    const waDetailUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waDetailMsg}`;

    detailModal.innerHTML = `
      <div class="modal-container prop-detail-container">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-champagne); font-weight: 600;">
              ${prop.category.toUpperCase()} | PROPERTY ID: ${prop.id}
            </div>
            <h2 class="modal-title" style="font-size: 1.6rem;">${prop.title}</h2>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('propertyDetailModal').classList.remove('active'); document.body.style.overflow = ''; window.location.hash = '';">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Gallery -->
          <div class="gallery-grid">
            <div class="gallery-main">
              <img src="${images[0]}" alt="${prop.title}" id="detailMainImage" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-md);">
            </div>
            <div class="gallery-thumbs">
              ${images.slice(1, 3).map((img, i) => `
                <div class="gallery-thumb-item" onclick="document.getElementById('detailMainImage').src='${img}'">
                  <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
                </div>
              `).join('')}
              ${images.length < 2 ? `
                <div class="gallery-thumb-item" style="background:#1a1a1a; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:0.85rem;">
                  Full HD Gallery
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Price & Primary Info Bar -->
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem; padding:1.25rem; background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); margin-bottom:1.5rem;">
            <div>
              <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase;">Listed Asking Price</div>
              <div style="font-family:var(--font-display); font-size:2rem; font-weight:700; color:var(--accent-champagne);">${prop.price_display}</div>
              ${prop.price_per_sqft ? `<div style="font-size:0.82rem; color:var(--text-light-gray);">Approx. ₹${prop.price_per_sqft.toLocaleString('en-IN')} / sq ft</div>` : ''}
            </div>

            <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
              <a href="${waDetailUrl}" target="_blank" class="btn btn-whatsapp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                WhatsApp Inquiry
              </a>
              <button class="btn btn-burgundy" onclick="window.RealEstateForms.openInquiryModal('site_visit', ${JSON.stringify(prop).replace(/"/g, '&quot;')})">
                Schedule Site Visit
              </button>
            </div>
          </div>

          <!-- Specifications Table / Grid -->
          <div style="margin-bottom:2rem;">
            <h4 style="font-size:1.15rem; color:var(--accent-champagne); margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.08em;">Property Specifications</h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:1rem;">
              <div style="background:#0e0e0e; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.78rem; color:var(--text-muted);">Carpet Area</div>
                <div style="font-size:1rem; color:#FFF; font-weight:600;">${prop.area_sqft ? prop.area_sqft.toLocaleString('en-IN') + ' ' + prop.area_unit : 'N/A'}</div>
              </div>
              <div style="background:#0e0e0e; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.78rem; color:var(--text-muted);">Configuration</div>
                <div style="font-size:1rem; color:#FFF; font-weight:600;">${prop.bedrooms > 0 ? prop.bedrooms + ' Bedrooms / ' + prop.bathrooms + ' Baths' : prop.subcategory}</div>
              </div>
              <div style="background:#0e0e0e; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.78rem; color:var(--text-muted);">Possession & Age</div>
                <div style="font-size:1rem; color:#FFF; font-weight:600;">${prop.possession_status} (${prop.age_of_property || 'Brand New'})</div>
              </div>
              <div style="background:#0e0e0e; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.78rem; color:var(--text-muted);">Floor Elevation</div>
                <div style="font-size:1rem; color:#FFF; font-weight:600;">${prop.floor_info || 'Prime Elevation'}</div>
              </div>
              <div style="background:#0e0e0e; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.78rem; color:var(--text-muted);">Furnishing Status</div>
                <div style="font-size:1rem; color:#FFF; font-weight:600;">${prop.furnishing}</div>
              </div>
              <div style="background:#0e0e0e; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
                <div style="font-size:0.78rem; color:var(--text-muted);">RERA Registration</div>
                <div style="font-size:0.92rem; color:var(--accent-champagne); font-weight:600;">${prop.rera_id || 'MahaRERA Approved'}</div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div style="margin-bottom:2rem;">
            <h4 style="font-size:1.15rem; color:var(--accent-champagne); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.08em;">Curator’s Overview</h4>
            <p style="color:var(--text-light-gray); line-height:1.8; font-size:1rem;">${prop.description}</p>
          </div>

          <!-- Amenities -->
          ${prop.amenities && prop.amenities.length ? `
            <div style="margin-bottom:2rem;">
              <h4 style="font-size:1.15rem; color:var(--accent-champagne); margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.08em;">Signature Amenities</h4>
              <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
                ${prop.amenities.map(a => `
                  <div style="padding:0.5rem 1rem; background:#161616; border:1px solid var(--border-light); border-radius:var(--radius-md); font-size:0.85rem; color:#FFF; display:flex; align-items:center; gap:0.4rem;">
                    <span style="color:var(--accent-champagne);">✦</span> ${a}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Direct Advisory Action Box -->
          <div style="background:linear-gradient(135deg, #180910 0%, #10060b 100%); border:1px solid var(--border-burgundy); border-radius:var(--radius-lg); padding:1.75rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.25rem;">
            <div>
              <h4 style="color:#FFF; font-size:1.25rem; margin-bottom:0.3rem;">Connect with Principal Broker</h4>
              <p style="color:var(--text-light-gray); font-size:0.9rem;">Exclusive mandates, title deed inspection, and private viewings.</p>
            </div>
            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              <a href="tel:+917972889444" class="btn btn-outline-gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call: +91 79728 89444
              </a>
              <a href="${waDetailUrl}" target="_blank" class="btn btn-whatsapp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Check URL hash on page load
  function checkUrlHashForProperty() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#property-')) {
      const propId = hash.replace('#property-', '');
      showPropertyDetail(propId);
    }
  }

  // Favorites Management
  function toggleFavorite(propId) {
    const idx = favorites.indexOf(propId);
    if (idx === -1) {
      favorites.push(propId);
    } else {
      favorites.splice(idx, 1);
    }
    localStorage.setItem('aurum_favorites', JSON.stringify(favorites));
    updateCounters();
    renderProperties(properties);
    renderFavoritesDrawer();
  }

  function toggleCompare(propId) {
    const idx = compareList.indexOf(propId);
    if (idx === -1) {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 properties simultaneously.');
        return;
      }
      compareList.push(propId);
    } else {
      compareList.splice(idx, 1);
    }
    localStorage.setItem('aurum_compare', JSON.stringify(compareList));
    updateCounters();
    renderProperties(properties);
    renderCompareDrawer();
  }

  function updateCounters() {
    if (favCounterEl) favCounterEl.textContent = favorites.length;
    if (compareCounterEl) compareCounterEl.textContent = compareList.length;
  }

  // Open & Render Drawers
  function renderFavoritesDrawer() {
    const drawer = document.getElementById('favoritesDrawer');
    if (!drawer) return;
    const body = drawer.querySelector('.drawer-body');
    const favProps = properties.filter(p => favorites.includes(p.id));

    if (favProps.length === 0) {
      body.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🤍</div>
          <p>No saved properties yet.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">Click the heart icon on any listing to save it for later review.</p>
        </div>
      `;
      return;
    }

    body.innerHTML = favProps.map(p => `
      <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border-light); align-items: center;">
        <img src="${(p.images && p.images[0]) || ''}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.95rem; color: #FFF; line-height: 1.3; margin-bottom: 0.2rem;">${p.title}</h4>
          <div style="font-size: 0.85rem; color: var(--accent-champagne); font-weight: 600;">${p.price_display}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${p.locality}, ${p.city}</div>
        </div>
        <button onclick="window.RealEstateApp.toggleFavorite('${p.id}')" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 1.2rem;" title="Remove">&times;</button>
      </div>
    `).join('');
  }

  function renderCompareDrawer() {
    const drawer = document.getElementById('compareDrawer');
    if (!drawer) return;
    const body = drawer.querySelector('.drawer-body');
    const compProps = properties.filter(p => compareList.includes(p.id));

    if (compProps.length === 0) {
      body.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚖️</div>
          <p>No properties selected for comparison.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">Select up to 3 properties using the compare icon on listing cards.</p>
        </div>
      `;
      return;
    }

    body.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(${compProps.length}, 1fr); gap: 1rem;">
        ${compProps.map(p => `
          <div style="background: #181818; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
            <img src="${(p.images && p.images[0]) || ''}" style="width: 100%; height: 110px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 0.75rem;">
            <h4 style="font-size: 0.9rem; color: #FFF; margin-bottom: 0.4rem; line-height: 1.3;">${p.title}</h4>
            <div style="font-size: 1.1rem; color: var(--accent-champagne); font-weight: 700; margin-bottom: 0.5rem;">${p.price_display}</div>
            
            <div style="font-size: 0.8rem; color: var(--text-light-gray); display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem;">
              <div><strong>Location:</strong> ${p.locality}</div>
              <div><strong>Area:</strong> ${p.area_sqft} ${p.area_unit}</div>
              <div><strong>BHK:</strong> ${p.bedrooms > 0 ? p.bedrooms + ' BHK' : p.subcategory}</div>
              <div><strong>Status:</strong> ${p.possession_status}</div>
              <div><strong>RERA:</strong> ${p.rera_id ? 'Yes' : 'Clear Title'}</div>
            </div>

            <button class="btn btn-whatsapp btn-sm" style="width: 100%;" onclick="window.RealEstateForms.openInquiryModal('buy', ${JSON.stringify(p).replace(/"/g, '&quot;')})">
              Inquire
            </button>
            <button onclick="window.RealEstateApp.toggleCompare('${p.id}')" style="background: transparent; border: none; color: #999; font-size: 0.75rem; width: 100%; margin-top: 0.5rem; cursor: pointer;">
              Remove
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilters.category = btn.getAttribute('data-category');
        fetchProperties();
      });
    });

    // Transaction filter tabs
    document.querySelectorAll('[data-transaction]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-transaction]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilters.transaction = btn.getAttribute('data-transaction');
        fetchProperties();
      });
    });

    // Filter inputs
    const filterCity = document.getElementById('filterCity');
    if (filterCity) {
      filterCity.addEventListener('change', (e) => {
        currentFilters.city = e.target.value;
        fetchProperties();
      });
    }

    const filterSort = document.getElementById('filterSort');
    if (filterSort) {
      filterSort.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        fetchProperties();
      });
    }

    const filterBhk = document.getElementById('filterBhk');
    if (filterBhk) {
      filterBhk.addEventListener('change', (e) => {
        currentFilters.bedrooms = e.target.value;
        fetchProperties();
      });
    }

    const filterBudget = document.getElementById('filterBudget');
    if (filterBudget) {
      filterBudget.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val || val === 'all') {
          currentFilters.min_price = '';
          currentFilters.max_price = '';
        } else {
          const parts = val.split('-');
          currentFilters.min_price = parts[0] || '';
          currentFilters.max_price = parts[1] || '';
        }
        fetchProperties();
      });
    }

    // Free text search
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentFilters.search = e.target.value;
          fetchProperties();
        }, 300);
      });
    }

    // Favorites drawer toggles
    const favBtn = document.getElementById('openFavoritesBtn');
    const favDrawer = document.getElementById('favoritesDrawer');
    if (favBtn && favDrawer) {
      favBtn.addEventListener('click', () => {
        renderFavoritesDrawer();
        favDrawer.classList.add('open');
      });
      favDrawer.querySelector('.modal-close-btn')?.addEventListener('click', () => {
        favDrawer.classList.remove('open');
      });
    }

    // Compare drawer toggles
    const compBtn = document.getElementById('openCompareBtn');
    const compDrawer = document.getElementById('compareDrawer');
    if (compBtn && compDrawer) {
      compBtn.addEventListener('click', () => {
        renderCompareDrawer();
        compDrawer.classList.add('open');
      });
      compDrawer.querySelector('.modal-close-btn')?.addEventListener('click', () => {
        compDrawer.classList.remove('open');
      });
    }
  }

  // Reset Filters
  function resetFilters() {
    currentFilters = {
      category: 'all',
      subcategory: 'all',
      transaction: 'all',
      city: 'all',
      locality: '',
      min_price: '',
      max_price: '',
      bedrooms: 'all',
      furnishing: 'all',
      possession: 'all',
      verified: false,
      sort: 'featured',
      search: ''
    };
    if (searchInput) searchInput.value = '';
    const filterCity = document.getElementById('filterCity');
    if (filterCity) filterCity.value = 'all';
    const filterBhk = document.getElementById('filterBhk');
    if (filterBhk) filterBhk.value = 'all';
    const filterBudget = document.getElementById('filterBudget');
    if (filterBudget) filterBudget.value = 'all';

    document.querySelectorAll('[data-category]').forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'all'));
    document.querySelectorAll('[data-transaction]').forEach(b => b.classList.toggle('active', b.getAttribute('data-transaction') === 'all'));

    fetchProperties();
  }

  // Mortgage / EMI Calculator
  function setupEmiCalculator() {
    const loanSlider = document.getElementById('emiLoanAmount');
    const rateSlider = document.getElementById('emiInterestRate');
    const tenureSlider = document.getElementById('emiTenureYears');

    if (!loanSlider || !rateSlider || !tenureSlider) return;

    function calculate() {
      const P = parseFloat(loanSlider.value); // Principal in INR
      const annualRate = parseFloat(rateSlider.value);
      const years = parseFloat(tenureSlider.value);

      document.getElementById('emiLoanDisplay').textContent = (P >= 10000000) 
        ? `₹${(P / 10000000).toFixed(2)} Cr` 
        : `₹${(P / 100000).toFixed(0)} Lakh`;
      document.getElementById('emiRateDisplay').textContent = `${annualRate.toFixed(1)}%`;
      document.getElementById('emiTenureDisplay').textContent = `${years} Years`;

      const r = (annualRate / 12) / 100; // Monthly interest rate
      const n = years * 12; // Total monthly installments

      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - P;

      document.getElementById('emiResultAmount').textContent = `₹${Math.round(emi).toLocaleString('en-IN')}`;
      document.getElementById('emiTotalInterest').textContent = `₹${Math.round(totalInterest).toLocaleString('en-IN')}`;
      document.getElementById('emiTotalPayment').textContent = `₹${Math.round(totalPayment).toLocaleString('en-IN')}`;
    }

    loanSlider.addEventListener('input', calculate);
    rateSlider.addEventListener('input', calculate);
    tenureSlider.addEventListener('input', calculate);
    calculate();
  }

  // Setup FAQ Accordion
  function setupFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // Setup WhatsApp Floating Widget Menu
  function setupWhatsAppFloatingMenu() {
    const bubble = document.getElementById('whatsappFloatingBubble');
    const menu = document.getElementById('whatsappQuickMenu');
    if (!bubble || !menu) return;

    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== bubble) {
        menu.classList.remove('open');
      }
    });
  }

  // Global window export
  window.RealEstateApp = {
    fetchProperties,
    showPropertyDetail,
    toggleFavorite,
    toggleCompare,
    resetFilters
  };

})();
