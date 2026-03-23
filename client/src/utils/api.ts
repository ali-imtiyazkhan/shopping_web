const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shopping-web-3jr0.onrender.com";
export const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  COUPON: `${API_BASE_URL}/api/coupon`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  CART: `${API_BASE_URL}/api/cart`,
  ADDRESS: `${API_BASE_URL}/api/address`,
  ORDER: `${API_BASE_URL}/api/order`,
};
