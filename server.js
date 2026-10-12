const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const crypto = require('node:crypto');
const { db, hashPassword, verifyPassword } = require('./db.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.csv': 'text/csv; charset=UTF-8'
};

// In-memory token store for admin authentication
const activeTokens = new Map();

function generateToken(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeTokens.set(token, { user, expiresAt });
  return token;
}

function verifyToken(token) {
  if (!token) return null;
  const session = activeTokens.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeTokens.delete(token);
    return null;
  }
  return session.user;
}

// Helpers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

function getAuthUser(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return verifyToken(parts[1]);
  }
  return null;
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    return res.end();
  }

  try {
    // ==========================================
    // PUBLIC API ENDPOINTS
    // ==========================================

    // GET /api/settings
    if (pathname === '/api/settings' && method === 'GET') {
      const rows = db.prepare('SELECT key, value FROM site_settings').all();
      const settings = {};
      for (const row of rows) {
        settings[row.key] = row.value;
      }
      return sendJson(res, 200, { success: true, settings });
    }

    // GET /api/categories
    if (pathname === '/api/categories' && method === 'GET') {
      const categories = db.prepare('SELECT * FROM categories ORDER BY id ASC').all();
      return sendJson(res, 200, { success: true, categories });
    }

    // GET /api/properties
    if (pathname === '/api/properties' && method === 'GET') {
      const q = parsedUrl.query;
      let sql = 'SELECT * FROM properties WHERE 1=1';
      const params = [];

      // Category filter
      if (q.category && q.category !== 'all') {
        sql += ' AND category = ?';
        params.push(q.category);
      }

      // Subcategory filter
      if (q.subcategory && q.subcategory !== 'all') {
        sql += ' AND subcategory = ?';
        params.push(q.subcategory);
      }

      // Transaction type filter
      if (q.transaction && q.transaction !== 'all') {
        sql += ' AND transaction_type = ?';
        params.push(q.transaction);
      }

      // City filter
      if (q.city && q.city !== 'all') {
        sql += ' AND LOWER(city) = LOWER(?)';
        params.push(q.city);
      }

      // Locality filter
      if (q.locality) {
        sql += ' AND LOWER(locality) LIKE LOWER(?)';
        params.push(`%${q.locality}%`);
      }

      // Budget min / max
      if (q.min_price) {
        sql += ' AND price >= ?';
        params.push(Number(q.min_price));
      }
      if (q.max_price) {
        sql += ' AND price <= ?';
        params.push(Number(q.max_price));
      }

      // Area min / max
      if (q.min_area) {
        sql += ' AND area_sqft >= ?';
        params.push(Number(q.min_area));
      }
      if (q.max_area) {
        sql += ' AND area_sqft <= ?';
        params.push(Number(q.max_area));
      }

      // Bedrooms
      if (q.bedrooms && q.bedrooms !== 'all') {
        const bhk = Number(q.bedrooms);
        if (bhk >= 5) {
          sql += ' AND bedrooms >= 5';
        } else {
          sql += ' AND bedrooms = ?';
          params.push(bhk);
        }
      }

      // Furnishing
      if (q.furnishing && q.furnishing !== 'all') {
        sql += ' AND LOWER(furnishing) = LOWER(?)';
        params.push(q.furnishing);
      }

      // Possession Status
      if (q.possession && q.possession !== 'all') {
        sql += ' AND LOWER(possession_status) = LOWER(?)';
        params.push(q.possession);
      }

      // Verified filter
      if (q.verified === '1' || q.verified === 'true') {
        sql += ' AND verified = 1';
      }

      // Featured filter
      if (q.featured === '1' || q.featured === 'true') {
        sql += ' AND featured = 1';
      }

      // Status filter (Default is show all except Sold/Rented unless requested)
      if (q.status && q.status !== 'all') {
        sql += ' AND status = ?';
        params.push(q.status);
      } else if (!q.include_sold && !q.status) {
        // By default, return Available properties first
      }

      // Free text search
      if (q.search && q.search.trim()) {
        const term = `%${q.search.trim().toLowerCase()}%`;
        sql += ' AND (LOWER(title) LIKE ? OR LOWER(locality) LIKE ? OR LOWER(city) LIKE ? OR LOWER(pincode) LIKE ? OR LOWER(description) LIKE ? OR LOWER(id) LIKE ?)';
        params.push(term, term, term, term, term, term);
      }

      // Sorting
      if (q.sort === 'price_asc') {
        sql += ' ORDER BY price ASC';
      } else if (q.sort === 'price_desc') {
        sql += ' ORDER BY price DESC';
      } else if (q.sort === 'area_asc') {
        sql += ' ORDER BY area_sqft ASC';
      } else if (q.sort === 'area_desc') {
        sql += ' ORDER BY area_sqft DESC';
      } else {
        // Default newest + featured first
        sql += ' ORDER BY featured DESC, created_at DESC';
      }

      // Pagination
      const limit = q.limit ? parseInt(q.limit, 10) : 50;
      const offset = q.offset ? parseInt(q.offset, 10) : 0;
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const properties = db.prepare(sql).all(...params);

      // Parse JSON fields
      const formatted = properties.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        amenities: JSON.parse(p.amenities || '[]')
      }));

      // Count query
      return sendJson(res, 200, {
        success: true,
        count: formatted.length,
        properties: formatted
      });
    }

    // GET /api/properties/:id
    if (pathname.startsWith('/api/properties/') && method === 'GET') {
      const propId = decodeURIComponent(pathname.replace('/api/properties/', ''));
      const prop = db.prepare('SELECT * FROM properties WHERE id = ? OR slug = ?').get(propId, propId);
      if (!prop) {
        return sendJson(res, 404, { success: false, error: 'Property not found' });
      }

      prop.images = JSON.parse(prop.images || '[]');
      prop.amenities = JSON.parse(prop.amenities || '[]');

      // Similar properties (same category, different id)
      const similar = db.prepare('SELECT * FROM properties WHERE category = ? AND id != ? LIMIT 3').all(prop.category, prop.id).map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        amenities: JSON.parse(p.amenities || '[]')
      }));

      return sendJson(res, 200, { success: true, property: prop, similar });
    }

    // POST /api/leads - Public Lead Submission
    if (pathname === '/api/leads' && method === 'POST') {
      const body = await parseBody(req);
      const {
        lead_type = 'general',
        name,
        phone,
        email = '',
        property_id = '',
        property_title = '',
        budget = '',
        preferred_location = '',
        message = ''
      } = body;

      // Validation
      if (!name || !name.trim()) {
        return sendJson(res, 400, { success: false, error: 'Full name is required.' });
      }
      if (!phone || !phone.trim() || phone.replace(/\D/g, '').length < 10) {
        return sendJson(res, 400, { success: false, error: 'Valid 10-digit mobile number is required.' });
      }

      const stmt = db.prepare(`
        INSERT INTO leads (lead_type, name, phone, email, property_id, property_title, budget, preferred_location, message, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
      `);

      const info = stmt.run(
        lead_type,
        name.trim(),
        phone.trim(),
        email.trim(),
        property_id.trim(),
        property_title.trim(),
        budget.trim(),
        preferred_location.trim(),
        message.trim(),
        'Automated lead capture from web inquiry form'
      );

      // Build WhatsApp prefilled message
      const targetPhone = '917972889444';
      let waText = '';

      if (property_id) {
        waText = `*Property Inquiry [${property_id}]*\n` +
          `Property: ${property_title || property_id}\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          (email ? `Email: ${email}\n` : '') +
          (message ? `Note: ${message}\n` : '') +
          `Page: http://localhost:${PORT}/#property-${property_id}\n\n` +
          `Please share floor plans, brochure, and schedule a private viewing.`;
      } else {
        const typeHeaders = {
          buy: '*Buyer Inquiry*',
          sell: '*Seller Property Inquiry*',
          rent: '*Rental Inquiry*',
          list_rental: '*List Property for Rent*',
          commercial: '*Commercial Real Estate Inquiry*',
          land: '*Plots & Land Inquiry*',
          investment: '*Real Estate Investment Inquiry*',
          site_visit: '*Site Visit Request*',
          home_loan: '*Home Loan Assistance Inquiry*',
          callback: '*General Callback Request*'
        };
        const header = typeHeaders[lead_type] || '*Real Estate Inquiry*';
        waText = `${header}\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          (preferred_location ? `Location: ${preferred_location}\n` : '') +
          (budget ? `Budget: ${budget}\n` : '') +
          (message ? `Message: ${message}\n` : '') +
          `\nPlease connect with me with available options.`;
      }

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

      return sendJson(res, 201, {
        success: true,
        message: 'Lead registered successfully.',
        leadId: Number(info.lastInsertRowid),
        whatsappUrl
      });
    }

    // ==========================================
    // ADMIN AUTHENTICATION
    // ==========================================

    // POST /api/admin/login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const { username, password } = await parseBody(req);
      if (!username || !password) {
        return sendJson(res, 400, { success: false, error: 'Username and password required' });
      }

      const user = db.prepare('SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?)').get(username);
      if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
        return sendJson(res, 401, { success: false, error: 'Invalid credentials. Please verify your admin username and password.' });
      }

      const token = generateToken({ id: user.id, username: user.username, full_name: user.full_name });
      return sendJson(res, 200, {
        success: true,
        token,
        user: { id: user.id, username: user.username, full_name: user.full_name }
      });
    }

    // GET /api/admin/me
    if (pathname === '/api/admin/me' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJson(res, 401, { success: false, error: 'Unauthorized session' });
      }
      return sendJson(res, 200, { success: true, user });
    }

    // ==========================================
    // PROTECTED ADMIN ENDPOINTS
    // ==========================================

    // Middleware check for admin endpoints below
    if (pathname.startsWith('/api/admin/')) {
      const user = getAuthUser(req);
      if (!user) {
        return sendJson(res, 401, { success: false, error: 'Admin authentication required.' });
      }

      // GET /api/admin/stats
      if (pathname === '/api/admin/stats' && method === 'GET') {
        const totalProps = db.prepare('SELECT COUNT(*) as count FROM properties').get().count;
        const availableProps = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'Available'").get().count;
        const soldProps = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'Sold'").get().count;
        const rentedProps = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'Rented'").get().count;
        const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
        const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'New'").get().count;
        const siteVisits = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Site Visit Scheduled'").get().count;
        const convertedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Converted'").get().count;

        const leadsByType = db.prepare('SELECT lead_type, COUNT(*) as count FROM leads GROUP BY lead_type').all();

        return sendJson(res, 200, {
          success: true,
          stats: {
            totalProps,
            availableProps,
            soldProps,
            rentedProps,
            totalLeads,
            newLeads,
            siteVisits,
            convertedLeads,
            leadsByType
          }
        });
      }

      // GET /api/admin/leads
      if (pathname === '/api/admin/leads' && method === 'GET') {
        const q = parsedUrl.query;
        let sql = 'SELECT * FROM leads WHERE 1=1';
        const params = [];

        if (q.status && q.status !== 'all') {
          sql += ' AND status = ?';
          params.push(q.status);
        }
        if (q.type && q.type !== 'all') {
          sql += ' AND lead_type = ?';
          params.push(q.type);
        }
        if (q.search) {
          const term = `%${q.search.trim().toLowerCase()}%`;
          sql += ' AND (LOWER(name) LIKE ? OR LOWER(phone) LIKE ? OR LOWER(email) LIKE ? OR LOWER(property_title) LIKE ?)';
          params.push(term, term, term, term);
        }

        sql += ' ORDER BY created_at DESC';
        const leads = db.prepare(sql).all(...params);
        return sendJson(res, 200, { success: true, count: leads.length, leads });
      }

      // GET /api/admin/leads/export (CSV)
      if (pathname === '/api/admin/leads/export' && method === 'GET') {
        const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
        const headers = ['Lead ID', 'Date & Time', 'Lead Type', 'Client Name', 'Phone', 'Email', 'Property ID', 'Property Title', 'Budget', 'Preferred Location', 'Status', 'Inquiry Message', 'Broker Notes'];
        
        let csvContent = headers.join(',') + '\n';
        for (const l of leads) {
          const row = [
            l.id,
            `"${l.created_at}"`,
            `"${l.lead_type}"`,
            `"${(l.name || '').replace(/"/g, '""')}"`,
            `"${l.phone}"`,
            `"${l.email || ''}"`,
            `"${l.property_id || ''}"`,
            `"${(l.property_title || '').replace(/"/g, '""')}"`,
            `"${(l.budget || '').replace(/"/g, '""')}"`,
            `"${(l.preferred_location || '').replace(/"/g, '""')}"`,
            `"${l.status}"`,
            `"${(l.message || '').replace(/"/g, '""')}"`,
            `"${(l.notes || '').replace(/"/g, '""')}"`
          ];
          csvContent += row.join(',') + '\n';
        }

        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=UTF-8',
          'Content-Disposition': `attachment; filename="RealEstate_Leads_${Date.now()}.csv"`
        });
        return res.end(csvContent);
      }

      // PATCH /api/admin/leads/:id
      if (pathname.startsWith('/api/admin/leads/') && method === 'PATCH') {
        const leadId = parseInt(pathname.replace('/api/admin/leads/', ''), 10);
        const { status, notes } = await parseBody(req);

        let updateSql = 'UPDATE leads SET ';
        const updateParams = [];
        const setClauses = [];

        if (status !== undefined) {
          setClauses.push('status = ?');
          updateParams.push(status);
        }
        if (notes !== undefined) {
          setClauses.push('notes = ?');
          updateParams.push(notes);
        }

        if (setClauses.length === 0) {
          return sendJson(res, 400, { success: false, error: 'Nothing to update' });
        }

        updateSql += setClauses.join(', ') + ' WHERE id = ?';
        updateParams.push(leadId);

        db.prepare(updateSql).run(...updateParams);
        const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
        return sendJson(res, 200, { success: true, lead: updated });
      }

      // POST /api/admin/properties (Create)
      if (pathname === '/api/admin/properties' && method === 'POST') {
        const body = await parseBody(req);
        const id = body.id || `REG-${body.category ? body.category.substring(0, 3).toUpperCase() : 'RES'}-${Math.floor(100 + Math.random() * 900)}`;
        const slug = (body.title || id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const insert = db.prepare(`
          INSERT INTO properties (
            id, title, slug, category, subcategory, transaction_type, price, price_display, price_per_sqft,
            city, locality, pincode, address, area_sqft, area_builtup, area_plot, area_unit,
            bedrooms, bathrooms, balconies, parking, furnishing, possession_status, possession_date,
            age_of_property, floor_info, rera_id, verified, featured, status, images, floor_plan_image,
            video_tour_url, description, amenities, maintenance_charges, deposit_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(
          id,
          body.title || 'Untitled Luxury Property',
          slug,
          body.category || 'residential',
          body.subcategory || 'Apartment',
          body.transaction_type || 'Buy',
          Number(body.price || 0),
          body.price_display || `₹${body.price}`,
          Number(body.price_per_sqft || 0),
          body.city || 'Pune',
          body.locality || 'Prime Location',
          body.pincode || '',
          body.address || '',
          Number(body.area_sqft || 0),
          Number(body.area_builtup || 0),
          Number(body.area_plot || 0),
          body.area_unit || 'sq ft',
          Number(body.bedrooms || 0),
          Number(body.bathrooms || 0),
          Number(body.balconies || 0),
          Number(body.parking || 0),
          body.furnishing || 'Unfurnished',
          body.possession_status || 'Ready to Move',
          body.possession_date || 'Immediate',
          body.age_of_property || 'New Property',
          body.floor_info || '',
          body.rera_id || '',
          body.verified ? 1 : 0,
          body.featured ? 1 : 0,
          body.status || 'Available',
          JSON.stringify(Array.isArray(body.images) ? body.images : [body.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80']),
          body.floor_plan_image || '',
          body.video_tour_url || '',
          body.description || '',
          JSON.stringify(Array.isArray(body.amenities) ? body.amenities : []),
          body.maintenance_charges || '',
          body.deposit_amount || ''
        );

        const created = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
        return sendJson(res, 201, { success: true, property: created });
      }

      // PUT /api/admin/properties/:id (Update)
      if (pathname.startsWith('/api/admin/properties/') && method === 'PUT') {
        const propId = decodeURIComponent(pathname.replace('/api/admin/properties/', ''));
        const body = await parseBody(req);

        const update = db.prepare(`
          UPDATE properties SET
            title = ?, category = ?, subcategory = ?, transaction_type = ?,
            price = ?, price_display = ?, price_per_sqft = ?, city = ?, locality = ?,
            pincode = ?, address = ?, area_sqft = ?, area_builtup = ?, area_plot = ?, area_unit = ?,
            bedrooms = ?, bathrooms = ?, balconies = ?, parking = ?, furnishing = ?,
            possession_status = ?, possession_date = ?, age_of_property = ?, floor_info = ?,
            rera_id = ?, verified = ?, featured = ?, status = ?, images = ?,
            floor_plan_image = ?, video_tour_url = ?, description = ?, amenities = ?,
            maintenance_charges = ?, deposit_amount = ?
          WHERE id = ?
        `);

        update.run(
          body.title,
          body.category,
          body.subcategory,
          body.transaction_type,
          Number(body.price || 0),
          body.price_display,
          Number(body.price_per_sqft || 0),
          body.city,
          body.locality,
          body.pincode,
          body.address,
          Number(body.area_sqft || 0),
          Number(body.area_builtup || 0),
          Number(body.area_plot || 0),
          body.area_unit,
          Number(body.bedrooms || 0),
          Number(body.bathrooms || 0),
          Number(body.balconies || 0),
          Number(body.parking || 0),
          body.furnishing,
          body.possession_status,
          body.possession_date,
          body.age_of_property,
          body.floor_info,
          body.rera_id,
          body.verified ? 1 : 0,
          body.featured ? 1 : 0,
          body.status,
          JSON.stringify(Array.isArray(body.images) ? body.images : [body.image_url]),
          body.floor_plan_image,
          body.video_tour_url,
          body.description,
          JSON.stringify(Array.isArray(body.amenities) ? body.amenities : []),
          body.maintenance_charges,
          body.deposit_amount,
          propId
        );

        const updated = db.prepare('SELECT * FROM properties WHERE id = ?').get(propId);
        return sendJson(res, 200, { success: true, property: updated });
      }

      // DELETE /api/admin/properties/:id
      if (pathname.startsWith('/api/admin/properties/') && method === 'DELETE') {
        const propId = decodeURIComponent(pathname.replace('/api/admin/properties/', ''));
        db.prepare('DELETE FROM properties WHERE id = ?').run(propId);
        return sendJson(res, 200, { success: true, message: `Property ${propId} deleted successfully` });
      }

      // PUT /api/admin/settings
      if (pathname === '/api/admin/settings' && method === 'PUT') {
        const settings = await parseBody(req);
        const updateSetting = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
        for (const [k, v] of Object.entries(settings)) {
          updateSetting.run(k, String(v));
        }
        return sendJson(res, 200, { success: true, message: 'Settings saved' });
      }
    }

    // ==========================================
    // SEO: SITEMAP & ROBOTS
    // ==========================================
    if (pathname === '/sitemap.xml' && method === 'GET') {
      const props = db.prepare('SELECT id, slug, created_at FROM properties').all();
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      xml += `  <url><loc>http://localhost:${PORT}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
      xml += `  <url><loc>http://localhost:${PORT}/#buy</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      xml += `  <url><loc>http://localhost:${PORT}/#commercial</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      xml += `  <url><loc>http://localhost:${PORT}/#land</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      xml += `  <url><loc>http://localhost:${PORT}/#rental</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      for (const p of props) {
        xml += `  <url><loc>http://localhost:${PORT}/#property-${p.id}</loc><lastmod>${p.created_at ? p.created_at.split(' ')[0] : '2026-10-10'}</lastmod><priority>0.7</priority></url>\n`;
      }
      xml += `</urlset>`;

      res.writeHead(200, { 'Content-Type': 'application/xml; charset=UTF-8' });
      return res.end(xml);
    }

    if (pathname === '/robots.txt' && method === 'GET') {
      const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: http://localhost:${PORT}/sitemap.xml\n`;
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end(robots);
    }

    // ==========================================
    // STATIC FILE SERVING
    // ==========================================
    let filePath = '';
    if (pathname === '/' || pathname === '/index.html') {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    } else if (pathname === '/admin' || pathname === '/admin/') {
      filePath = path.join(PUBLIC_DIR, 'admin', 'index.html');
    } else {
      filePath = path.join(PUBLIC_DIR, pathname);
    }

    // Security check: prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Access Denied');
    }

    // Check file existence
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback to index.html for client routing
        const fallback = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(fallback, (err2, content) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err3, data) => {
        if (err3) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Internal Server Error');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

  } catch (error) {
    console.error('Server error:', error);
    sendJson(res, 500, { success: false, error: 'Internal server error', details: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Property Hub Real Estate Website Online`);
  console.log(` Port: ${PORT}`);
  console.log(` URL:  http://localhost:${PORT}`);
  console.log(` Admin URL: http://localhost:${PORT}/admin`);
  console.log(` WhatsApp Number: +91 79728 89444`);
  console.log(`=======================================================`);
});
