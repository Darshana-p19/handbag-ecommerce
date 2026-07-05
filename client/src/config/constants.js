// Global Constants for the entire application
export const CONFIG = {
  // API Configuration - UPDATED to use Render URL
  API_URL: 'https://handbag-ecommerce.onrender.com/api',
  SERVER_URL: 'https://handbag-ecommerce.onrender.com',
  
  // WhatsApp Configuration
  WHATSAPP_NUMBER: '919726482629',
  WHATSAPP_COUNTRY_CODE: '91',
  EXTRA_CHARGE: 80, // ₹80 extra charge
  
  // Business Info
  BUSINESS_NAME: 'J&P Collection',
  BUSINESS_DISPLAY_NAME: 'J&P Collection',
  BUSINESS_TAGLINE: 'Premium Handbags & Accessories',
  BUSINESS_EMAIL: 'jaiminaacharya555@gmail.com',
  BUSINESS_PHONE: '+91 97264 82629',
  BUSINESS_PHONE_RAW: '919726482629',
  BUSINESS_ADDRESS: 'Kadi, Gujarat, India',
  BUSINESS_CITY: 'Kadi',
  BUSINESS_STATE: 'Gujarat',
  BUSINESS_COUNTRY: 'India',
  WHATSAPP_WELCOME_MESSAGE: 'Welcome to J&P Collection!\nHello!\nThank you for contacting J&P Collection.\n\nWe will help you place your order quickly.',
  
  // Social Media Links
  SOCIAL_INSTAGRAM: 'https://www.instagram.com/jpcollection32',
  SOCIAL_INSTAGRAM_HANDLE: '@jpcollection32',
  SOCIAL_FACEBOOK: 'https://www.facebook.com/jpcollection',
  SOCIAL_YOUTUBE: 'https://www.youtube.com/@jpcollection',
  SOCIAL_WHATSAPP: 'https://wa.me/919726482629',
  
  // Business Hours
  BUSINESS_HOURS: '9:00 AM - 6:00 PM',
  BUSINESS_DAYS: 'Monday to Saturday',
  SUPPORT_HOURS: 'Mon-Sat 8am to 9pm',
  
  // Currency
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: 'Rs.',
  
  // ✅ FIXED: Use reliable placeholder images
  DEFAULT_PRODUCT_IMAGE: 'https://placehold.co/500x500/e8d5b7/8B7355?text=No+Image',
  PLACEHOLDER_IMAGE: 'https://placehold.co/300x300/e8d5b7/8B7355?text=Image+Not+Found',
  
  // Pagination
  ITEMS_PER_PAGE: 12,
  
  // Features
  FREE_SHIPPING_ABOVE: 999,
  RETURN_DAYS: 7,
  
  // FAQ - Frequently Asked Questions
  FAQS: [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for all unused products with original tags.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days. Express delivery available in 1-2 days.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 20 countries worldwide with competitive rates.'
    },
    {
      question: 'Are your products genuine?',
      answer: 'Absolutely! All our products are 100% genuine and come with authenticity cards.'
    }
  ],
  
  // Contact Info for Footer & Contact Page
  CONTACT_INFO: [
    { icon: 'phone', title: 'Phone', content: '+91 97264 82629', subtitle: 'Mon-Sat 8am to 9pm' },
    { icon: 'email', title: 'Email', content: 'jaiminaacharya555@gmail.com', subtitle: 'We reply within 24 hours' },
    { icon: 'location', title: 'Location', content: 'Kadi, Gujarat', subtitle: 'India' },
    { icon: 'clock', title: 'Business Hours', content: '9:00 AM - 6:00 PM', subtitle: 'Monday to Saturday' },
  ],
  
  // Footer Quick Links
  QUICK_LINKS: [
    { name: 'Home', to: '/' },
    { name: 'Products', to: '/products' },
    { name: 'About Us', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ],
  
  // Customer Service Links
  SERVICE_LINKS: [
    { name: 'Shipping Policy', to: '/shipping' },
    { name: 'Return Policy', to: '/returns' },
    { name: 'Privacy Policy', to: '/privacy' },
    { name: 'Terms of Service', to: '/terms' },
  ],
};

// Helper Functions
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return 'Rs.0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(price).replace('₹', 'Rs.');
};

export const calculateDiscount = (originalPrice, sellingPrice) => {
  if (!originalPrice || !sellingPrice || originalPrice <= sellingPrice) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
};

export const calculateSavings = (originalPrice, sellingPrice) => {
  if (!originalPrice || !sellingPrice) return 0;
  return originalPrice - sellingPrice;
};

// Get full image URL - UPDATED to handle Render URLs correctly
export const getImageUrl = (imagePath) => {
  if (!imagePath) return CONFIG.DEFAULT_PRODUCT_IMAGE;
  
  // ✅ If it's already a full URL, return it (this handles Render URLs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // ✅ If it's a path starting with /uploads, prepend SERVER_URL
  if (imagePath.startsWith('/uploads')) {
    return `${CONFIG.SERVER_URL}${imagePath}`;
  }
  
  // ✅ If it's just 'uploads/filename', prepend SERVER_URL
  if (imagePath.startsWith('uploads/')) {
    return `${CONFIG.SERVER_URL}/${imagePath}`;
  }
  
  // ✅ Default fallback
  return `${CONFIG.SERVER_URL}/uploads/${imagePath}`;
};

// WhatsApp Message
export const getWhatsAppMessage = (product, quantity = 1) => {
  const totalPrice = (product.price || 0) * quantity;
  const extraCharge = CONFIG.EXTRA_CHARGE;
  const grandTotal = totalPrice + extraCharge;
  
  let imageUrl = '';
  if (product.images && product.images.length > 0) {
    imageUrl = getImageUrl(product.images[0]);
  }
  
  let message = `${CONFIG.WHATSAPP_WELCOME_MESSAGE}\n\n`;
  message += `ORDER DETAILS\n`;
  message += `----------------------------------------\n`;
  message += `Product: ${product.title || 'Product'}\n`;
  
  if (imageUrl && imageUrl !== CONFIG.DEFAULT_PRODUCT_IMAGE) {
    message += `Image: ${imageUrl}\n`;
  }
  
  if (product.color && product.color !== 'Not specified') {
    message += `Color: ${product.color}\n`;
  }
  
  if (product.category && product.category !== 'Uncategorized') {
    message += `Category: ${product.category}\n`;
  }
  
  message += `\nPRICE BREAKDOWN\n`;
  message += `----------------------------------------\n`;
  message += `Price per item: ${formatPrice(product.price || 0)}\n`;
  
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = calculateDiscount(product.originalPrice, product.price);
    message += `MRP: ${formatPrice(product.originalPrice)}\n`;
    message += `Discount: ${discount}% OFF\n`;
    message += `You Save: ${formatPrice(product.originalPrice - product.price)} per item\n`;
  }
  
  message += `Quantity: ${quantity}\n`;
  message += `Subtotal: ${formatPrice(totalPrice)}\n`;
  message += `Shipping and Handling: ${formatPrice(extraCharge)}\n`;
  message += `----------------------------------------\n`;
  message += `GRAND TOTAL: ${formatPrice(grandTotal)}\n`;
  message += `----------------------------------------\n\n`;
  
  message += `PLEASE PROVIDE THE FOLLOWING DETAILS\n`;
  message += `----------------------------------------\n`;
  message += `Full Name:\n`;
  message += `Mobile Number:\n`;
  message += `Complete Address:\n`;
  message += `Pincode:\n`;
  message += `----------------------------------------\n\n`;
  
  message += `Please share your Name, Address, and Mobile Number to place your order.`;
  
  return message;
};

export const getWhatsAppUrl = (product, quantity = 1) => {
  const message = getWhatsAppMessage(product, quantity);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default CONFIG;