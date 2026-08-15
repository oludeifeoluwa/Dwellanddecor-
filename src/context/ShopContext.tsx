import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Order, ProductCategory, AppNotification, UserAccount, CartItem, FilterState, ActiveTab } from '../types';
import { INITIAL_PRODUCTS as sampleProducts } from '../data/products';

type ShopContextType = {
  products: Product[];
  orders: Order[];
  currentUser: UserAccount | null;
  ownerRoomAddress: string;
  whatsappNumber: string;
  isManagerAuthenticated: boolean;
  adminEmail: string;

  // cart & UI state
  cart: CartItem[];
  addToCart: (item: CartItem | Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  unreadNotificationsCount: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  selectedProductId: string | null;
  selectProduct: (id: string) => void;

  filters: FilterState;
  // Support both setFilter({ ... }) and setFilter('key', value) and functional updater
  setFilter: (arg1: Partial<FilterState> | ((prev: FilterState) => FilterState) | keyof FilterState, arg2?: any) => void;

  // actions
  addCustomProduct: (p: Omit<Product, 'id'>) => void;
  updateProductStock: (id: string, stockCount: number, inStock?: boolean) => void;
  deleteProduct: (id: string) => Promise<void>;
  deleteAllOutOfStockProducts: () => Promise<void>;
  formatPrice: (amountNGN: number, amountUSD?: number) => string;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  authenticateAdmin: (email: string) => void;
  deauthenticateAdmin: () => void;
  updateOwnerRoomAddress: (addr: string) => void;
  updateWhatsAppNumber: (num: string) => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LS_PRODUCTS_KEY = 'hd_products_v2';
const LS_ADMIN_KEY = 'hd_manager_authenticated_v2';
const LS_ADMIN_EMAIL = 'hd_admin_email_v2';
const LS_CART_KEY = 'hd_cart_v2';
const LS_WISHLIST_KEY = 'hd_wishlist_v2';
const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  minPriceUSD: 0,
  maxPriceUSD: 10000,
  selectedColors: [],
  inStockOnly: false,
  onSaleOnly: false,
  minRating: 0,
  searchQuery: '',
  sortBy: 'featured'
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or fallback to provided sampleProducts
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(LS_PRODUCTS_KEY);
      if (raw) return JSON.parse(raw) as Product[];
    } catch (e) {
      // ignore
    }
    // fallback: map sampleProducts to ensure id exists
    return (sampleProducts as Product[]).map(p => ({ ...p }));
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [ownerRoomAddress, setOwnerRoomAddress] = useState<string>(localStorage.getItem('hd_owner_room_address') || 'Queen Elizabeth Hall, Room 204, Block A');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(localStorage.getItem('hd_whatsapp_number') || '2348123456789');

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState<boolean>(localStorage.getItem(LS_ADMIN_KEY) === 'true');
  const [adminEmail, setAdminEmail] = useState<string>(localStorage.getItem(LS_ADMIN_EMAIL) || '');

  // UI & cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_CART_KEY);
      if (raw) return JSON.parse(raw) as CartItem[];
    } catch {}
    return [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { const raw = localStorage.getItem(LS_WISHLIST_KEY); if (raw) return JSON.parse(raw) as string[]; } catch {};
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('shop');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  const [filters, _setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products)); } catch (e) {}
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LS_ADMIN_KEY, isManagerAuthenticated ? 'true' : 'false');
    if (adminEmail) localStorage.setItem(LS_ADMIN_EMAIL, adminEmail);
  }, [isManagerAuthenticated, adminEmail]);

  useEffect(() => {
    try { localStorage.setItem(LS_CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(wishlist)); } catch (e) {}
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    // Minimal toast: use console and optional UI hooks
    // eslint-disable-next-line no-console
    console.info(`[toast:${type}] ${message}`);
  };

  const formatPrice = (amountNGN: number, _amountUSD?: number) => `₦${amountNGN.toLocaleString()}`;

  // Cart helpers - accept either a CartItem or a Product (convenience)
  const addToCart = (item: CartItem | Product) => {
    const cartItem: CartItem = ("product" in (item as any))
      ? (item as CartItem)
      : { id: (item as Product).id, product: item as Product, quantity: 1 };

    setCart(prev => {
      const exists = prev.find(i => i.id === cartItem.id);
      if (exists) {
        return prev.map(i => i.id === cartItem.id ? { ...i, quantity: i.quantity + cartItem.quantity } : i);
      }
      return [cartItem, ...prev];
    });
    showToast('Added to cart', 'success');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast('Removed from cart', 'info');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i));
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(p => p !== productId) : [productId, ...prev]);
    showToast('Wishlist updated', 'info');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Filters - support multiple call styles to match existing callers
  const setFilter = (arg1: Partial<FilterState> | ((prev: FilterState) => FilterState) | keyof FilterState, arg2?: any) => {
    if (typeof arg1 === 'function') {
      _setFilters(prev => (arg1 as (p: FilterState) => FilterState)(prev));
      return;
    }

    if (typeof arg1 === 'string') {
      // called as setFilter('category', 'led-lighting')
      const key = arg1 as keyof FilterState;
      _setFilters(prev => ({ ...prev, [key]: arg2 } as FilterState));
      return;
    }

    // called with an object
    _setFilters(prev => ({ ...prev, ...(arg1 as Partial<FilterState>) }));
  };

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
    setActiveTab('product-detail');
  };

  const addCustomProduct = (p: Omit<Product, 'id'>) => {
    const id = `custom-${Date.now().toString().slice(-6)}`;
    const newP: Product = { ...p, id } as Product;
    setProducts(prev => [newP, ...prev]);
    showToast('Custom product added', 'success');
  };

  const updateProductStock = (id: string, stockCount: number, inStock?: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stockCount, inStock: typeof inStock === 'boolean' ? inStock : stockCount > 0 } : p));
    showToast('Product stock updated', 'info');
  };

  // Delete a single product (local + attempt Firestore)
  const deleteProduct = async (id: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      try {
        const { db } = require('../lib/firebase');
        const firestore = require('firebase/firestore');
        if (db && firestore && typeof firestore.deleteDoc === 'function') {
          const docRef = firestore.doc(db, 'products', id);
          await firestore.deleteDoc(docRef);
        }
      } catch (e) {
        // ignore
      }

      // also remove from cart & wishlist
      setCart(prev => prev.filter(ci => ci.product.id !== id));
      setWishlist(prev => prev.filter(pid => pid !== id));

      showToast('Product removed from store', 'success');
    } catch (err) {
      console.error('deleteProduct error', err);
      showToast('Failed to delete product', 'warning');
    }
  };

  const deleteAllOutOfStockProducts = async () => {
    try {
      const toDelete = products.filter(p => !p.inStock || (typeof p.stockCount === 'number' && p.stockCount <= 0));
      if (toDelete.length === 0) {
        showToast('No out-of-stock products to delete', 'info');
        return;
      }
      const remaining = products.filter(p => p.inStock && (!p.stockCount || p.stockCount > 0));
      setProducts(remaining);

      try {
        const { db } = require('../lib/firebase');
        const firestore = require('firebase/firestore');
        if (db && firestore && typeof firestore.writeBatch === 'function') {
          const batch = firestore.writeBatch(db);
          toDelete.forEach(pd => batch.delete(firestore.doc(db, 'products', pd.id)));
          await batch.commit();
        }
      } catch (e) {
        // ignore
      }

      // clean cart & wishlist
      const delIds = new Set(toDelete.map(d => d.id));
      setCart(prev => prev.filter(ci => !delIds.has(ci.product.id)));
      setWishlist(prev => prev.filter(pid => !delIds.has(pid)));

      showToast(`${toDelete.length} out-of-stock product(s) deleted`, 'success');
    } catch (err) {
      console.error('deleteAllOutOfStockProducts error', err);
      showToast('Failed to purge out-of-stock products', 'warning');
    }
  };

  const authenticateAdmin = (email: string) => {
    setIsManagerAuthenticated(true);
    setAdminEmail(email);
    localStorage.setItem(LS_ADMIN_KEY, 'true');
    localStorage.setItem(LS_ADMIN_EMAIL, email);
    showToast('Admin authenticated', 'success');
  };

  const deauthenticateAdmin = () => {
    setIsManagerAuthenticated(false);
    setAdminEmail('');
    localStorage.removeItem(LS_ADMIN_KEY);
    localStorage.removeItem(LS_ADMIN_EMAIL);
    showToast('Admin signed out', 'info');
  };

  const updateOwnerRoomAddress = (addr: string) => {
    setOwnerRoomAddress(addr);
    localStorage.setItem('hd_owner_room_address', addr);
    showToast('Owner room address updated', 'success');
  };

  const updateWhatsAppNumber = (num: string) => {
    setWhatsappNumber(num);
    localStorage.setItem('hd_whatsapp_number', num);
    showToast('WhatsApp number updated', 'success');
  };

  const value: ShopContextType = {
    products,
    orders,
    currentUser,
    ownerRoomAddress,
    whatsappNumber,
    isManagerAuthenticated,
    adminEmail,

    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    isCartOpen,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    isSearchOpen,
    setIsSearchOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,

    wishlist,
    toggleWishlist,
    isInWishlist,

    selectedProductId,
    selectProduct,

    filters,
    setFilter,

    addCustomProduct,
    updateProductStock,
    deleteProduct,
    deleteAllOutOfStockProducts,
    formatPrice,
    showToast,
    authenticateAdmin,
    deauthenticateAdmin,
    updateOwnerRoomAddress,
    updateWhatsAppNumber,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
};
