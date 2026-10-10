/**
 * Data Helpers & Indian Currency Formatters
 */

const WHATSAPP_NUMBER = '917972889444';
const WHATSAPP_DISPLAY = '+91 79728 89444';

/**
 * Format Indian Rupee currency (Lakhs & Crores)
 * e.g., 42500000 -> "₹4.25 Cr", 8500000 -> "₹85.00 Lakh", 75000 -> "₹75,000 / mo"
 */
function formatINR(amount, isRental = false) {
  if (!amount || isNaN(amount)) return 'Price on Request';
  const num = Number(amount);

  if (isRental) {
    return '₹' + num.toLocaleString('en-IN') + ' / mo';
  }

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  } else if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2);
    return `₹${lakh} Lakh`;
  } else {
    return '₹' + num.toLocaleString('en-IN');
  }
}

/**
 * Full Indian formatted number string
 * e.g., 42500000 -> "₹4,25,00,000"
 */
function formatFullINR(amount) {
  if (!amount || isNaN(amount)) return 'Price on Request';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Format Area with units
 */
function formatArea(sqft, unit = 'sq ft') {
  if (!sqft) return 'N/A';
  if (unit === 'acres') {
    const acres = (sqft / 43560).toFixed(2);
    return `${acres} Acres (${sqft.toLocaleString('en-IN')} sq ft)`;
  }
  if (unit === 'guntha') {
    const guntha = (sqft / 1089).toFixed(1);
    return `${guntha} Guntha (${sqft.toLocaleString('en-IN')} sq ft)`;
  }
  return `${Number(sqft).toLocaleString('en-IN')} ${unit}`;
}

/**
 * Clean phone for WhatsApp link
 */
function cleanPhone(phone) {
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

window.RealEstateData = {
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
  formatINR,
  formatFullINR,
  formatArea,
  cleanPhone
};
