export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  COUPON: `${API_BASE_URL}/api/coupon`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  CART: `${API_BASE_URL}/api/cart`,
  ADDRESS: `${API_BASE_URL}/api/address`,
  ORDER: `${API_BASE_URL}/api/order`,
};
