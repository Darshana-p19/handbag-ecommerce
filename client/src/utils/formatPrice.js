export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getWhatsAppMessage = (product) => {
  return `Hi! I'm interested in buying:\n\n*${product.title}*\n💰 Price: ₹${product.price}\n📦 Category: ${product.category}\n\nPlease share more details.`;
};

export const getWhatsAppUrl = (product, phoneNumber = '919XXXXXXXXX') => {
  const message = getWhatsAppMessage(product);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};