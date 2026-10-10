/**
 * All 10 Dedicated Real Estate Inquiry Forms & WhatsApp Lead Routing
 * Direct Destination: +91 79728 89444
 */

(function () {
  const WHATSAPP_NUMBER = '917972889444';
  const WHATSAPP_DISPLAY = '+91 79728 89444';

  // Config for each inquiry form type
  const FORM_DEFINITIONS = {
    buy: {
      title: 'Inquire to Buy a Property',
      eyebrow: 'Buyer Assistance',
      icon: 'home',
      submitLabel: 'Submit & Open WhatsApp',
      renderFields: (prop) => `
        <input type="hidden" name="lead_type" value="buy">
        ${prop ? `<input type="hidden" name="property_id" value="${prop.id}"><input type="hidden" name="property_title" value="${prop.title}">` : ''}
        
        ${prop ? `
          <div style="background: rgba(116, 31, 56, 0.2); border: 1px solid rgba(215, 193, 160, 0.3); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--accent-champagne); font-weight: 600;">SELECTED PROPERTY:</div>
            <div style="font-size: 0.95rem; color: #FFF; font-weight: 600;">${prop.title}</div>
            <div style="font-size: 0.82rem; color: var(--text-light-gray);">ID: ${prop.id} | Price: ${prop.price_display} | ${prop.locality}, ${prop.city}</div>
          </div>
        ` : ''}

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Rajesh Sharma" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp / Mobile Number *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile (e.g. 9822012345)" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Email Address (Optional)</label>
            <input type="email" name="email" class="form-input" placeholder="rajesh@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Location / Locality</label>
            <input type="text" name="preferred_location" class="form-input" value="${prop ? prop.locality + ', ' + prop.city : ''}" placeholder="e.g. Koregaon Park, Baner">
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Property Category</label>
            <select name="category" class="form-select">
              <option value="Residential Apartments" ${prop && prop.category === 'residential' ? 'selected' : ''}>Residential Apartments</option>
              <option value="Luxury Villas & Bungalows">Luxury Villas & Bungalows</option>
              <option value="Penthouses">Penthouses</option>
              <option value="NA Plots & Land">NA Plots & Land</option>
              <option value="Commercial Showrooms / Offices">Commercial Showrooms / Offices</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Budget Range</label>
            <select name="budget" class="form-select">
              <option value="Under ₹1.00 Cr">Under ₹1.00 Cr</option>
              <option value="₹1.00 Cr - ₹2.50 Cr">₹1.00 Cr - ₹2.50 Cr</option>
              <option value="₹2.50 Cr - ₹5.00 Cr" selected>₹2.50 Cr - ₹5.00 Cr</option>
              <option value="₹5.00 Cr - ₹10.00 Cr">₹5.00 Cr - ₹10.00 Cr</option>
              <option value="Above ₹10.00 Cr">Above ₹10.00 Cr</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Preferred Configuration</label>
            <select name="bhk_config" class="form-select">
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK" selected>3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="5+ BHK / Villa">5+ BHK / Villa</option>
              <option value="Any / Plot">Any / Plot</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Home Loan Assistance Required?</label>
            <select name="loan_assistance" class="form-select">
              <option value="Yes, please assist with best bank rates">Yes, please assist</option>
              <option value="No, self-financing">No, self-financing</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Specific Requirements / Notes</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="Mention floor preference, vastu direction, possession timeframe, etc."></textarea>
        </div>
      `
    },

    sell: {
      title: 'List & Sell Your Property',
      eyebrow: 'Owner Mandate Services',
      submitLabel: 'Submit Mandate & Open WhatsApp',
      renderFields: () => `
        <input type="hidden" name="lead_type" value="sell">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Property Owner's Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Sunil Agarwal" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact Number *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile Number" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Property Exact Location / Society *</label>
            <input type="text" name="preferred_location" class="form-input" placeholder="e.g. Marvel Diva, Magarpatta Road, Pune" required>
          </div>
          <div class="form-group">
            <label class="form-label">Property Type</label>
            <select name="property_type" class="form-select">
              <option value="Apartment / Flat">Apartment / Flat</option>
              <option value="Bungalow / Villa">Bungalow / Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Commercial Shop / Office">Commercial Shop / Office</option>
              <option value="NA Land / Plot">NA Land / Plot</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Expected Selling Price (₹)</label>
            <input type="text" name="budget" class="form-input" placeholder="e.g. ₹3.50 Cr or ₹85 Lakh" required>
          </div>
          <div class="form-group">
            <label class="form-label">Carpet Area / Size</label>
            <input type="text" name="property_size" class="form-input" placeholder="e.g. 2,150 sq ft or 3 Guntha">
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Ownership & Documentation Status</label>
            <select name="doc_status" class="form-select">
              <option value="Clear Title & Ready Conveyance Deed">Clear Title & Ready Conveyance Deed</option>
              <option value="Under Bank Loan / Mortgage">Under Bank Loan / Mortgage</option>
              <option value="Co-operative Housing Society Share Cert">CHS Share Certificate</option>
              <option value="7/12 Extract Clear Title">7/12 Extract Clear Title</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Time to Contact</label>
            <select name="contact_time" class="form-select">
              <option value="Anytime on WhatsApp">Anytime on WhatsApp</option>
              <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
              <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Property Details & Key Highlights</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="Floor, age of property, furnishings included, parking count..."></textarea>
        </div>
      `
    },

    rent: {
      title: 'Find a Property on Rent',
      eyebrow: 'Tenant Concierge',
      submitLabel: 'Find Rentals & Open WhatsApp',
      renderFields: (prop) => `
        <input type="hidden" name="lead_type" value="rent">
        ${prop ? `<input type="hidden" name="property_id" value="${prop.id}"><input type="hidden" name="property_title" value="${prop.title}">` : ''}
        
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Priya Nair" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact Number *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile Number" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Preferred Locality *</label>
            <input type="text" name="preferred_location" class="form-input" value="${prop ? prop.locality : ''}" placeholder="e.g. Kalyani Nagar, Viman Nagar" required>
          </div>
          <div class="form-group">
            <label class="form-label">Monthly Rental Budget</label>
            <select name="budget" class="form-select">
              <option value="₹25,000 - ₹40,000 / mo">₹25,000 - ₹40,000 / mo</option>
              <option value="₹40,000 - ₹75,000 / mo" selected>₹40,000 - ₹75,000 / mo</option>
              <option value="₹75,000 - ₹1.50 Lakh / mo">₹75,000 - ₹1.50 Lakh / mo</option>
              <option value="Above ₹1.50 Lakh / mo (Luxury)">Above ₹1.50 Lakh / mo (Luxury)</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Configuration & Furnishing</label>
            <select name="furnishing_pref" class="form-select">
              <option value="Fully Furnished 2/3 BHK">Fully Furnished 2/3 BHK</option>
              <option value="Semi Furnished 2/3 BHK">Semi Furnished 2/3 BHK</option>
              <option value="Luxury Penthouse / Villa">Luxury Penthouse / Villa</option>
              <option value="Commercial Office Space">Commercial Office Space</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Move-in Timeline</label>
            <select name="timeline" class="form-select">
              <option value="Immediate (Within 7 Days)">Immediate (Within 7 Days)</option>
              <option value="Within 15 - 30 Days">Within 15 - 30 Days</option>
              <option value="Next Month">Next Month</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Specific Needs (Family / Working Professionals / Lease Term)</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="e.g. Looking for high floor apartment with 2 car parkings, pet friendly..."></textarea>
        </div>
      `
    },

    list_rental: {
      title: 'List Your Property for Rent',
      eyebrow: 'Landlord Advisory',
      submitLabel: 'List Rental & Open WhatsApp',
      renderFields: () => `
        <input type="hidden" name="lead_type" value="list_rental">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Owner Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Ramesh Joshi" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Property Location & Society *</label>
            <input type="text" name="preferred_location" class="form-input" placeholder="e.g. Lodha Belmondo, Pune" required>
          </div>
          <div class="form-group">
            <label class="form-label">Expected Monthly Rent (₹)</label>
            <input type="text" name="budget" class="form-input" placeholder="e.g. ₹65,000 / month" required>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Security Deposit</label>
            <input type="text" name="deposit" class="form-input" placeholder="e.g. ₹2,00,000 (3 months)">
          </div>
          <div class="form-group">
            <label class="form-label">Furnishing Status</label>
            <select name="furnishing" class="form-select">
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Property Description</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="Configuration, parking, amenities, bachelor or family preference..."></textarea>
        </div>
      `
    },

    commercial: {
      title: 'Commercial Real Estate Inquiry',
      eyebrow: 'Retail, Office & Industrial',
      submitLabel: 'Submit Commercial & Open WhatsApp',
      renderFields: (prop) => `
        <input type="hidden" name="lead_type" value="commercial">
        ${prop ? `<input type="hidden" name="property_id" value="${prop.id}"><input type="hidden" name="property_title" value="${prop.title}">` : ''}

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Contact / Company Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Alok Verma (Verma Logistics)" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Number *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Business Type / Nature</label>
            <input type="text" name="business_type" class="form-input" placeholder="e.g. IT Software, Retail Brand, Restaurant, Clinic">
          </div>
          <div class="form-group">
            <label class="form-label">Required Location *</label>
            <input type="text" name="preferred_location" class="form-input" value="${prop ? prop.locality : ''}" placeholder="e.g. Senapati Bapat Road, BKC Mumbai, Baner" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Commercial Asset Type</label>
            <select name="commercial_type" class="form-select">
              <option value="Grade-A Corporate Office">Grade-A Corporate Office</option>
              <option value="High-Street Retail Showroom">High-Street Retail Showroom</option>
              <option value="Commercial Shop">Commercial Shop</option>
              <option value="Industrial Warehouse / Godown">Industrial Warehouse / Godown</option>
              <option value="Co-Working Floor">Co-Working Floor</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Budget / Transaction</label>
            <select name="budget" class="form-select">
              <option value="Purchase (₹2 Cr - ₹5 Cr)">Purchase (₹2 Cr - ₹5 Cr)</option>
              <option value="Purchase (₹5 Cr - ₹15 Cr)">Purchase (₹5 Cr - ₹15 Cr)</option>
              <option value="Purchase (₹15 Cr+)">Purchase (₹15 Cr+)</option>
              <option value="Lease (₹1 Lakh - ₹3 Lakh/mo)">Lease (₹1 Lakh - ₹3 Lakh/mo)</option>
              <option value="Lease (₹3 Lakh - ₹10 Lakh/mo)">Lease (₹3 Lakh - ₹10 Lakh/mo)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Required Area & Specific Infrastructure</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="e.g. Need 4,000 sq ft carpet with 40 workstations, DG backup, visitor parking..."></textarea>
        </div>
      `
    },

    land: {
      title: 'Plots & Land Acquisition Inquiry',
      eyebrow: 'NA, Commercial & Farm Land',
      submitLabel: 'Inquire on Land & Open WhatsApp',
      renderFields: (prop) => `
        <input type="hidden" name="lead_type" value="land">
        ${prop ? `<input type="hidden" name="property_id" value="${prop.id}"><input type="hidden" name="property_title" value="${prop.title}">` : ''}

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Deepak Patil" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Number *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Preferred Land Location</label>
            <input type="text" name="preferred_location" class="form-input" value="${prop ? prop.locality : ''}" placeholder="e.g. Mulshi, Chakan, Karjat, Lonavala">
          </div>
          <div class="form-group">
            <label class="form-label">Land Category</label>
            <select name="land_type" class="form-select">
              <option value="Collector Sanctioned NA Residential Plot">Collector NA Residential Plot</option>
              <option value="Commercial NA Land (Highway Facing)">Commercial NA Land</option>
              <option value="Agricultural / Farm Land (Clear Title)">Agricultural / Farm Land</option>
              <option value="Industrial MIDC Plot">Industrial MIDC Plot</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Required Area / Size</label>
            <input type="text" name="required_area" class="form-input" placeholder="e.g. 3 Guntha, 1 Acre, 5,000 sq ft">
          </div>
          <div class="form-group">
            <label class="form-label">Investment Budget</label>
            <input type="text" name="budget" class="form-input" placeholder="e.g. ₹50 Lakh - ₹1.5 Cr">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Intended Use & Road Frontage Needs</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="e.g. Intend to build weekend farmhouse, require water connection, tar road access..."></textarea>
        </div>
      `
    },

    investment: {
      title: 'Real Estate Investment Advisory',
      eyebrow: 'High ROI & Capital Growth',
      submitLabel: 'Get Advisory & Open WhatsApp',
      renderFields: () => `
        <input type="hidden" name="lead_type" value="investment">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Investor Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Dr. Harish Mehta" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Investment Capital Allocation</label>
            <select name="budget" class="form-select">
              <option value="₹1.00 Cr - ₹2.50 Cr">₹1.00 Cr - ₹2.50 Cr</option>
              <option value="₹2.50 Cr - ₹5.00 Cr" selected>₹2.50 Cr - ₹5.00 Cr</option>
              <option value="₹5.00 Cr - ₹10.00 Cr">₹5.00 Cr - ₹10.00 Cr</option>
              <option value="₹10.00 Cr+ (HNWI / Institutional)">₹10.00 Cr+ (HNWI / Institutional)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Primary Objective</label>
            <select name="objective" class="form-select">
              <option value="High Rental Yield (Pre-leased Commercial)">High Rental Yield (Pre-leased Commercial)</option>
              <option value="Long-Term Capital Appreciation (Plots / Land)">Long-Term Capital Appreciation</option>
              <option value="Under-Construction Launch Multiplier">Under-Construction Launch Multiplier</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Investment Horizon</label>
            <select name="horizon" class="form-select">
              <option value="Short Term (2 - 3 Years)">Short Term (2 - 3 Years)</option>
              <option value="Medium Term (3 - 5 Years)" selected>Medium Term (3 - 5 Years)</option>
              <option value="Long Term (5 - 10+ Years)">Long Term (5 - 10+ Years)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Location / Cities</label>
            <input type="text" name="preferred_location" class="form-input" placeholder="e.g. Pune, Mumbai, Bangalore">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Portfolio Preferences & Timing</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="e.g. Looking for pre-leased retail with 7.5%+ rental yield and multinational tenant..."></textarea>
        </div>
      `
    },

    site_visit: {
      title: 'Schedule a VIP Site Visit',
      eyebrow: 'Private Viewing Appointment',
      submitLabel: 'Book Site Visit & Open WhatsApp',
      renderFields: (prop) => `
        <input type="hidden" name="lead_type" value="site_visit">
        ${prop ? `<input type="hidden" name="property_id" value="${prop.id}"><input type="hidden" name="property_title" value="${prop.title}">` : ''}

        ${prop ? `
          <div style="background: rgba(116, 31, 56, 0.2); border: 1px solid rgba(215, 193, 160, 0.3); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--accent-champagne); font-weight: 600;">PROPERTY FOR PRIVATE TOUR:</div>
            <div style="font-size: 0.95rem; color: #FFF; font-weight: 600;">${prop.title}</div>
            <div style="font-size: 0.82rem; color: var(--text-light-gray);">ID: ${prop.id} | Location: ${prop.locality}, ${prop.city}</div>
          </div>
        ` : `
          <div class="form-group">
            <label class="form-label">Property ID or Name</label>
            <input type="text" name="property_id" class="form-input" placeholder="e.g. REG-PUN-101 (The Grand Solitaire)">
          </div>
        `}

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Visitor Full Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Arvind Kulkarni" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Preferred Date *</label>
            <input type="date" name="visit_date" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Time Slot *</label>
            <select name="visit_time" class="form-select">
              <option value="Morning (10:30 AM - 12:30 PM)">Morning (10:30 AM - 12:30 PM)</option>
              <option value="Afternoon (2:00 PM - 4:00 PM)">Afternoon (2:00 PM - 4:00 PM)</option>
              <option value="Sunset Hour (4:30 PM - 6:30 PM)" selected>Sunset Hour (4:30 PM - 6:30 PM)</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Number of Visitors</label>
            <select name="visitor_count" class="form-select">
              <option value="1 - 2 Persons">1 - 2 Persons</option>
              <option value="3 - 4 Persons (Family)">3 - 4 Persons (Family)</option>
              <option value="5+ Persons">5+ Persons</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Chauffeured Pickup Required?</label>
            <select name="pickup_required" class="form-select">
              <option value="No, self-driving to property">No, self-driving</option>
              <option value="Yes, please arrange executive pickup">Yes, please arrange pickup</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Special Notes or Questions</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="Any specific wing, penthouse level, or documentation you wish to inspect..."></textarea>
        </div>
      `
    },

    home_loan: {
      title: 'Home Loan & Mortgage Advisory',
      eyebrow: 'Institutional Banking Partnerships',
      submitLabel: 'Check Loan Eligibility & Open WhatsApp',
      renderFields: () => `
        <input type="hidden" name="lead_type" value="home_loan">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Applicant Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. Rohit Bansal" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Target Property Budget (₹)</label>
            <input type="text" name="budget" class="form-input" placeholder="e.g. ₹2.50 Cr" required>
          </div>
          <div class="form-group">
            <label class="form-label">Approximate Loan Amount Required (₹)</label>
            <input type="text" name="loan_amount" class="form-input" placeholder="e.g. ₹1.80 Cr" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Employment Type</label>
            <select name="employment" class="form-select">
              <option value="Salaried (Corporate / MNC)">Salaried (Corporate / MNC)</option>
              <option value="Self-Employed Professional (Doctor, CA, Architect)">Self-Employed Professional</option>
              <option value="Business Owner / Partner">Business Owner / Partner</option>
              <option value="NRI (Non-Resident Indian)">NRI (Non-Resident Indian)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Property Location</label>
            <input type="text" name="preferred_location" class="form-input" placeholder="e.g. Pune / Mumbai">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Additional Banking Preference</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="Preferred banks (HDFC, SBI, ICICI), existing loans, tenure preference..."></textarea>
        </div>
      `
    },

    callback: {
      title: 'Request a Direct Callback',
      eyebrow: 'Personalized Advisory',
      submitLabel: 'Request Callback & Open WhatsApp',
      renderFields: () => `
        <input type="hidden" name="lead_type" value="callback">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" name="name" class="form-input" placeholder="e.g. S. Radhakrishnan" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Contact *</label>
            <input type="tel" name="phone" class="form-input" placeholder="10-digit Mobile" maxlength="10" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Inquiry Focus</label>
            <select name="preferred_location" class="form-select">
              <option value="Buying Luxury Residence">Buying Luxury Residence</option>
              <option value="Selling Mandate Valuation">Selling Mandate Valuation</option>
              <option value="Commercial Real Estate">Commercial Real Estate</option>
              <option value="NA Land & Plots">NA Land & Plots</option>
              <option value="NRI Real Estate Advisory">NRI Real Estate Advisory</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Callback Timing</label>
            <select name="callback_time" class="form-select">
              <option value="Within 15 Minutes">Within 15 Minutes</option>
              <option value="Today Morning (10 AM - 1 PM)">Today Morning (10 AM - 1 PM)</option>
              <option value="Today Evening (4 PM - 7 PM)">Today Evening (4 PM - 7 PM)</option>
              <option value="Weekend Appointment">Weekend Appointment</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">How can our principal advisory assist you?</label>
          <textarea name="message" class="form-textarea" rows="2" placeholder="Brief outline of your requirements..."></textarea>
        </div>
      `
    }
  };

  /**
   * Modal HTML Container
   */
  let modalEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.className = 'modal-overlay';
    modalEl.id = 'inquiryModalOverlay';
    modalEl.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <div>
            <div id="modalEyebrow" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-champagne); font-weight: 600;"></div>
            <h3 class="modal-title" id="modalTitle"></h3>
          </div>
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="inquiryActiveForm">
            <div id="modalFormFields"></div>
            
            <div style="margin-top: 1.25rem;">
              <label class="form-checkbox-label">
                <input type="checkbox" required checked name="consent">
                <span>I authorize Property Hub to contact me via WhatsApp and phone regarding verified property listings and real estate advisory. Your information is protected with strict confidentiality.</span>
              </label>
            </div>

            <div class="wa-notice-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" style="flex-shrink:0;">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <div>
                <strong>Direct WhatsApp Delivery Notice:</strong> Submitting this form prepares a formatted inquiry and immediately opens WhatsApp with <strong>+91 79728 89444</strong>. Please tap <strong>Send</strong> inside WhatsApp to transmit your message.
              </div>
            </div>

            <div id="formErrorMessage" style="display: none; background: rgba(220, 38, 38, 0.15); border: 1px solid #dc2626; color: #fca5a5; padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-top: 1rem;"></div>

            <div style="margin-top: 1.75rem; display: flex; gap: 0.75rem;">
              <button type="submit" class="btn btn-whatsapp" id="submitFormBtn" style="flex: 1; padding: 1rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
                </svg>
                <span id="submitBtnText">Open WhatsApp Inquiry</span>
              </button>
            </div>
          </form>

          <!-- Success / In-Progress Screen -->
          <div id="inquirySuccessScreen" style="display: none; text-align: center; padding: 2rem 1rem;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(37, 211, 102, 0.15); border: 2px solid #25D366; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #25D366; font-size: 1.8rem;">
              ✓
            </div>
            <h3 style="font-size: 1.6rem; color: #FFFFFF; margin-bottom: 0.75rem;">Connecting via WhatsApp</h3>
            <p style="color: var(--text-light-gray); font-size: 0.95rem; line-height: 1.7; max-width: 480px; margin: 0 auto 1.5rem;">
              Your inquiry has been logged in our secure system. WhatsApp is opening with our direct number <strong style="color: var(--accent-champagne);">+91 79728 89444</strong>. Remember to press <strong>Send</strong> inside WhatsApp!
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 380px; margin: 0 auto;">
              <a href="#" id="manualWaLink" target="_blank" class="btn btn-whatsapp" style="width: 100%;">
                Tap Here if WhatsApp Did Not Open Automatically
              </a>
              <button type="button" class="btn btn-dark" id="closeSuccessBtn" style="width: 100%;">
                Done / Back to Website
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    // Event listeners
    modalEl.querySelector('#modalCloseBtn').addEventListener('click', closeModal);
    modalEl.querySelector('#closeSuccessBtn').addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal();
    });

    // Form submit listener
    modalEl.querySelector('#inquiryActiveForm').addEventListener('submit', handleFormSubmit);

    return modalEl;
  }

  function openInquiryModal(formType = 'buy', propertyData = null) {
    const modal = ensureModal();
    const config = FORM_DEFINITIONS[formType] || FORM_DEFINITIONS.buy;

    // Reset screens
    modal.querySelector('#inquiryActiveForm').style.display = 'block';
    modal.querySelector('#inquirySuccessScreen').style.display = 'none';
    modal.querySelector('#formErrorMessage').style.display = 'none';

    // Set text
    modal.querySelector('#modalEyebrow').textContent = config.eyebrow;
    modal.querySelector('#modalTitle').textContent = config.title;
    modal.querySelector('#submitBtnText').textContent = config.submitLabel;

    // Render HTML fields
    modal.querySelector('#modalFormFields').innerHTML = config.renderFields(propertyData);

    // Set date input min to today if present
    const dateInput = modal.querySelector('input[type="date"]');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalEl) {
      modalEl.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Handle form submission: Save to SQLite backend & trigger WhatsApp
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errorBox = modalEl.querySelector('#formErrorMessage');
    errorBox.style.display = 'none';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate phone: 10 digits
    const cleanedPhone = data.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      errorBox.textContent = 'Please enter a valid 10-digit Indian mobile number.';
      errorBox.style.display = 'block';
      return;
    }

    const submitBtn = modalEl.querySelector('#submitFormBtn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    let waUrl = '';

    try {
      // 1. Submit lead to server API if available
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.whatsappUrl) {
          waUrl = result.whatsappUrl;
        }
      }
    } catch (networkErr) {
      console.warn('Backend server offline or static GitHub Pages mode:', networkErr);
    }

    // 2. Client-side fallback if backend not available (Static GitHub Pages)
    if (!waUrl) {
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
      const header = typeHeaders[data.lead_type] || '*Property Inquiry*';
      let waText = `${header}\nName: ${data.name}\nPhone: ${data.phone}\n`;
      if (data.preferred_location) waText += `Location: ${data.preferred_location}\n`;
      if (data.budget) waText += `Budget: ${data.budget}\n`;
      if (data.property_id) waText += `Property ID: ${data.property_id} (${data.property_title || ''})\n`;
      if (data.message) waText += `Note: ${data.message}\n`;
      waText += `\nPlease connect with me with available options.`;

      waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

      // Save to localStorage so leads aren't lost in static mode
      const savedLeads = JSON.parse(localStorage.getItem('property_hub_offline_leads') || '[]');
      savedLeads.push({ ...data, created_at: new Date().toISOString() });
      localStorage.setItem('property_hub_offline_leads', JSON.stringify(savedLeads));
    }

    // 3. Switch to success screen & launch WhatsApp
    modalEl.querySelector('#inquiryActiveForm').style.display = 'none';
    const successScreen = modalEl.querySelector('#inquirySuccessScreen');
    successScreen.style.display = 'block';
    modalEl.querySelector('#manualWaLink').href = waUrl;

    window.open(waUrl, '_blank'); finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  }

  // Attach to window
  window.RealEstateForms = {
    openInquiryModal,
    closeModal
  };

})();
