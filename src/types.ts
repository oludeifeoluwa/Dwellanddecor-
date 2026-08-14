export type ProductCategory = 
  | 'wall-hooks' 
  | 'led-lighting' 
  | 'desk-organizers' 
  | 'mini-planters' 
  | 'wall-decor' 
  | 'butterfly-decor'
  | 'study-accessories'
  | 'lifestyle-vanity'
  | 'organizers-storage'
  | 'wall-decor-collage';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  priceNGN: number;
  priceUSD: number;
  compareAtPriceNGN?: number;
  compareAtPriceUSD?: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages: string[];
  description: string;
  shortDescription: string;
  features: string[];
  specs: ProductSpec[];
  colorOptions: ProductColor[];
  sizeOptions?: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashDeal?: boolean;
  flashDiscountPercent?: number;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  installationType?: string; // e.g. "Damage-Free Adhesive", "Magnetic", "USB Powered"
}

export interface CartItem {
  id: string; // unique key combining product.id + color + size
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface FilterState {
  category: ProductCategory | 'all';
  minPriceUSD: number;
  maxPriceUSD: number;
  selectedColors: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  minRating: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export type OrderStatus = 'placed' | 'processing' | 'dispatched' | 'delivered';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  addressType: 'dorm' | 'apartment' | 'home' | 'office';
  university?: string;
  dormHall?: string;
  roomNumber?: string;
  address: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  paystackRef: string;
  date: string;
  items: CartItem[];
  subtotalNGN: number;
  discountNGN: number;
  shippingNGN: number;
  deliveryFeeNGN?: number;
  serviceFeeNGN?: number;
  fulfillmentType?: 'pickup' | 'delivery';
  ownerRoomAddress?: string;
  totalNGN: number;
  totalUSD: number;
  currency: 'NGN' | 'USD';
  status: OrderStatus;
  customer: CustomerInfo;
  paymentMethod: 'paystack_card' | 'paystack_bank' | 'paystack_ussd';
  trackingNumber: string;
  estimatedDeliveryDate: string;
  userId?: string;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  whatsappAlerts: boolean;
  orderUpdates: boolean;
  flashDeals: boolean;
  rewardPoints: boolean;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  university?: string;
  dormHall?: string;
  roomNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  rewardPoints: number;
  isStudentVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  notificationPreferences?: NotificationPreferences;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'deal' | 'points' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: ActiveTab;
  linkOrderId?: string;
  linkProductId?: string;
}

export type Currency = 'NGN' | 'USD';

export type ActiveTab = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'advisor' 
  | 'cart' 
  | 'wishlist' 
  | 'account' 
  | 'admin'
  | 'checkout'
  | 'order-confirmation';
