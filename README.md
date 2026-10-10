# Property Hub — Luxury Real Estate Advisory

A modern, premium, responsive real estate web application built with a **Black and Burgundy** luxury aesthetic, Indian market specifications (INR formatting, Lakhs/Crores, MahaRERA compliance, area in sq ft/guntha/acres), and direct WhatsApp lead routing to **+91 79728 89444**.

---

## 🏛️ Brand Identity & Color Theme

- **Primary Background**: Jet Black (`#090909`)
- **Secondary Background**: Charcoal Black (`#151515`)
- **Primary Accent**: Deep Burgundy (`#741F38`)
- **Secondary Accent**: Wine Burgundy (`#5B142B`)
- **Highlight Accent**: Soft Champagne (`#D7C1A0`)
- **Primary Text**: Pure White (`#FFFFFF`)
- **Secondary Text**: Light Gray (`#C9C9C9`)

---

## 📱 WhatsApp Lead Generation System

- **Primary Destination**: `+91 79728 89444` (`https://wa.me/917972889444`)
- **Context-Aware Prefills**: Every button and form dynamically creates an encoded message containing property ID, title, locality, asking price, and the exact URL.
- **Dual-Action Submissions**:
  1. Securely logs the lead into the backend SQLite CRM database (`/api/leads`).
  2. Opens WhatsApp directly with the pre-filled inquiry text for one-click sending.
  3. Displays a transparent confirmation modal reminding the client to tap **Send** inside WhatsApp.

---

## 🏰 All 10 Dedicated Customer Inquiry Forms

1. **Buy a Property**: Budget, preferred configurations (1-5+ BHK, Villa, Penthouse), loan assistance, timeline.
2. **Sell / List a Property**: Owner details, locality, property type, expected valuation, document status.
3. **Rent a Property**: Monthly budget, locality, furnishing requirements, move-in schedule.
4. **List Property for Rent**: Landlord details, expected rent, security deposit, tenant preferences.
5. **Commercial Real Estate Inquiry**: Business type, retail showroom or Grade-A office, carpet area, power backup needs.
6. **Plots & Land Acquisition**: Collector-sanctioned NA plots, farm lands, 7/12 extract preferences, road frontage.
7. **Real Estate Investment Advisory**: Capital allocation, rental yield focus, investment horizon (2-10 years).
8. **Schedule a Site Visit**: Preferred date, time slot, visitor count, chauffeured pickup requests.
9. **Home Loan & Mortgage Assistance**: Target budget, loan amount, salaried/business/NRI status, partner bank choices.
10. **Direct Callback Request**: Preferred callback window (within 15 minutes, morning, evening).

---

## ⚙️ Admin Dashboard & Property Management (`/admin`)

- **Secure Login**: Password-protected authentication with pbkdf2-hashed credentials.
  - **Default Username**: `admin`
  - **Default Password**: `admin@burgundy2026`
- **Property Management**:
  - Add new listings with full specs (Title, category, price, area, BHK, RERA ID, images, amenities).
  - Edit and delete properties.
  - Instant status toggle: `Available`, `Under Offer`, `Sold`, `Rented`.
  - Toggle `Featured` and `MahaRERA Verified` badges.
- **Lead Management CRM**:
  - View all inquiries across all 10 form categories.
  - Filter by status: `New`, `Contacted`, `Follow-up`, `Site Visit Scheduled`, `Converted`, `Closed`.
  - Add internal broker notes.
  - One-click **Export to CSV** for offline CRM and Excel reporting.
- **Website Settings**:
  - Dynamically modify WhatsApp number, phone, email, and live statistics without code changes.

---

## 🚀 How to Run Locally

### Using Antigravity's Built-in Node:
```powershell
& "C:\Users\SAINATH\AppData\Roaming\Antigravity\bin\agy-node.cmd" server.js
```

### Using Standard Node.js:
```bash
node server.js
```

The web server will start on:
- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **XML Sitemap**: [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)
- **Robots.txt**: [http://localhost:3000/robots.txt](http://localhost:3000/robots.txt)

---

## 📁 Project Architecture

```
luxury-real-estate/
├── server.js               # Node.js HTTP server, REST API & SQLite DB connection
├── db.js                   # SQLite database schema, pbkdf2 auth, and 20 seed luxury properties
├── package.json            # Manifest & run scripts
├── database.sqlite         # High-performance SQLite database (WAL mode)
├── public/
│   ├── index.html          # Main luxury real estate website SPA
│   ├── sitemap.xml         # SEO XML sitemap
│   ├── robots.txt          # Search engine crawler directives
│   ├── css/
│   │   └── style.css       # Black & Burgundy design system, animations & responsive styling
│   ├── js/
│   │   ├── app.js          # Core search & multi-filter engine, EMI calc, favorites, compare
│   │   ├── forms.js        # Form validation, lead dispatch & WhatsApp link generator
│   │   └── data.js         # Indian currency & area unit formatters
│   └── admin/
│       ├── index.html      # Admin portal container
│       ├── admin.css       # Admin dashboard luxury theme styling
│       └── admin.js        # Admin auth, property CRUD, lead CRM & CSV export
└── README.md               # Documentation & setup guide
```

---

## 🌐 How to Deploy to GitHub & GitHub Pages

This project is pre-configured with **automated GitHub Pages deployment** via `.github/workflows/deploy.yml`.

### Quick 3-Step Deployment:

1. **Create a GitHub Repository:**
   - Log into [GitHub](https://github.com) and click **New Repository** (e.g. name it `property-hub`).
   - Keep it **Public** (required for free GitHub Pages).

2. **Push the Project from your Machine:**
   If you have Git installed, run:
   ```bash
   cd C:\Users\SAINATH\.gemini\antigravity\scratch\luxury-real-estate
   git init
   git add .
   git commit -m "Deploy Property Hub Real Estate Website"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/property-hub.git
   git push -u origin main
   ```
   *(Alternatively, use [GitHub Desktop](https://desktop.github.com) to add this folder and publish to GitHub with one click).*

3. **Enable GitHub Pages:**
   - In your GitHub repository, navigate to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **`GitHub Actions`**.
   - GitHub Actions will automatically deploy your website live to:
     `https://<YOUR_GITHUB_USERNAME>.github.io/property-hub/`

