import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { Product, Order, ProductCategory, AppNotification, UserAccount, CartItem, FilterState, ActiveTab, CustomerInfo, Review } from '../types';
import { INITIAL_PRODUCTS as sampleProducts } from '../data/products';
import { auth, db } from '../lib/firebase';

type ShopContextType = {
  products: Product[];
  filteredProducts: Product[];
  orders: Order[];
  lastPlacedOrder: Order | null;
  currentUser: UserAccount | null;
  ownerRoomAddress: string;
  whatsappNumber: string;
  isManagerAuthenticated: boolean;
  adminEmail: string;
  currency: 'NGN' | 'USD';
  exchangeRateUSD: number;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { fullName: string; email: string; university?: string; dormHall?: string; roomNumber?: string }, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;

  // cart & UI state
  cart: CartItem[];
  addToCart: (item: CartItem | Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
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
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  selectedProductId: string | null;
  selectedProduct: Product | null;
  selectProduct: (id: string) => void;

  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;

  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;

  filters: FilterState;
  resetFilters: () => void;
  // Support both setFilter({ ... }) and setFilter('key', value) and functional updater
  setFilter: (arg1: Partial<FilterState> | ((prev: FilterState) => FilterState) | keyof FilterState, arg2?: any) => void;

  // checkout / paystack
  isPaystackOpen: boolean;
  setIsPaystackOpen: (open: boolean) => void;
  pendingCheckoutOrder: Order | null;
  initiateCheckout: (customer: CustomerInfo, deliveryFeeNGN: number, discountNGN: number, fulfillmentType: 'pickup' | 'delivery', serviceFeeNGN: number) => void;
  handlePaystackPaymentSuccess: (reference: string) => void;

  // actions
  addCustomProduct: (p: Omit<Product, 'id'>) => void;
  updateProductStock: (id: string, stockCount: number, inStock?: boolean) => void;
  deleteProduct: (id: string) => Promise<void>;
  deleteAllOutOfStockProducts: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
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

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem('hd_orders_v2');
      if (raw) return JSON.parse(raw) as Order[];
    } catch {}
    return [];
  });
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem('hd_reviews_v2');
      if (raw) return JSON.parse(raw) as Review[];
    } catch {}
    return [];
  });
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [ownerRoomAddress, setOwnerRoomAddress] = useState<string>(localStorage.getItem('hd_owner_room_address') || 'Queen Elizabeth Hall, Room 204, Block A');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(localStorage.getItem('hd_whatsapp_number') || '2348123456789');

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState<boolean>(localStorage.getItem(LS_ADMIN_KEY) === 'true');
  const [adminEmail, setAdminEmail] = useState<string>(localStorage.getItem(LS_ADMIN_EMAIL) || '');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const raw = localStorage.getItem('hd_notifications_v2');
      if (raw) return JSON.parse(raw) as AppNotification[];
    } catch {}
    return [
      {
        id: 'welcome-notice',
        title: 'Welcome to Dwell & Decor',
        message: 'New product drops and campus pickup updates appear here.',
        type: 'system',
        timestamp: new Date().toLocaleDateString(),
        read: false,
        linkTab: 'shop'
      }
    ];
  });

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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isPaystackOpen, setIsPaystackOpen] = useState<boolean>(false);
  const [pendingCheckoutOrder, setPendingCheckoutOrder] = useState<Order | null>(null);

  const currency: 'NGN' | 'USD' = 'NGN';
  const exchangeRateUSD = 1500;
  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId) ?? null, [products, selectedProductId]);
  const toastTimeoutRef = useRef<number | null>(null);

  const resetFilters = () => {
    _setFilters(DEFAULT_FILTERS);
  };

  const filteredProducts = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    let items = [...products];

    if (filters.category !== 'all') {
      items = items.filter(product => product.category === filters.category);
    }

    if (filters.onSaleOnly) {
      items = items.filter(product => Boolean(product.isFlashDeal || product.flashDiscountPercent));
    }

    if (filters.inStockOnly) {
      items = items.filter(product => product.inStock && Number(product.stockCount) > 0);
    }

    if (filters.minRating > 0) {
      items = items.filter(product => Number(product.rating) >= Number(filters.minRating));
    }

    if (filters.selectedColors.length > 0) {
      const selected = new Set(filters.selectedColors);
      items = items.filter(product =>
        product.colorOptions.some(color => selected.has(color.name))
      );
    }

    if (query) {
      items = items.filter(product => {
        const haystack = [
          product.name,
          product.categoryName,
          product.description,
          product.shortDescription,
          ...(product.tags || []),
          ...(product.features || [])
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    items = items.filter(product => Number(product.priceUSD) <= Number(filters.maxPriceUSD));

    switch (filters.sortBy) {
      case 'price-low':
        items.sort((a, b) => Number(a.priceUSD) - Number(b.priceUSD));
        break;
      case 'price-high':
        items.sort((a, b) => Number(b.priceUSD) - Number(a.priceUSD));
        break;
      case 'rating':
        items.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'newest':
        items.sort((a, b) => Number(b.isNewArrival ? 1 : 0) - Number(a.isNewArrival ? 1 : 0));
        break;
      case 'featured':
      default:
        items.sort((a, b) => {
          const aScore = (a.isBestSeller ? 3 : 0) + (a.isFlashDeal ? 2 : 0) + (a.isNewArrival ? 1 : 0);
          const bScore = (b.isBestSeller ? 3 : 0) + (b.isFlashDeal ? 2 : 0) + (b.isNewArrival ? 1 : 0);
          return bScore - aScore || Number(b.rating) - Number(a.rating);
        });
        break;
    }

    return items;
  }, [products, filters]);

  useEffect(() => {
    try { localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products)); } catch (e) {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('hd_orders_v2', JSON.stringify(orders)); } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('hd_reviews_v2', JSON.stringify(reviews)); } catch (e) {}
  }, [reviews]);

  useEffect(() => {
    try { localStorage.setItem('hd_notifications_v2', JSON.stringify(notifications)); } catch (e) {}
  }, [notifications]);

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

  useEffect(() => {
    if (!notification) return;
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setNotification(null), 2600);
    return () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, [notification]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    // eslint-disable-next-line no-console
    console.info(`[toast:${type}] ${message}`);
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user: UserAccount = {
      id: `demo-user-${Date.now()}`,
      fullName: email.split('@')[0].replace(/[._-]/g, ' ') || 'Student user',
      email,
      university: 'Demo Campus',
      dormHall: 'Demo Hall',
      roomNumber: '101',
      rewardPoints: 0,
      isStudentVerified: true,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast('Signed in successfully', 'success');
  };

  const signup = async (
    data: { fullName: string; email: string; university?: string; dormHall?: string; roomNumber?: string },
    password: string,
  ) => {
    if (!data?.email || !password) {
      throw new Error('Email and password are required.');
    }

    const user: UserAccount = {
      id: `demo-user-${Date.now()}`,
      fullName: data.fullName || data.email.split('@')[0],
      email: data.email,
      university: data.university,
      dormHall: data.dormHall,
      roomNumber: data.roomNumber,
      rewardPoints: 0,
      isStudentVerified: true,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast('Account created successfully', 'success');
  };

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        return;
      }

      const user: UserAccount = {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Google User',
        email: firebaseUser.email || '',
        rewardPoints: 0,
        isStudentVerified: true,
        createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
      };

      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      showToast('Google sign-in is not available because Firebase Auth is not configured.', 'warning');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const user: UserAccount = {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Google User',
        email: firebaseUser.email || '',
        rewardPoints: 0,
        isStudentVerified: true,
        createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
      };

      setCurrentUser(user);
      setIsAuthModalOpen(false);
      showToast(`Signed in with Google as ${user.fullName}`, 'success');
    } catch (error: any) {
      console.error('Google sign-in failed', error);
      const message = error?.message || 'Google sign-in failed.';
      showToast(message, 'warning');
    }
  };

  const formatPrice = (amountNGN: number, _amountUSD?: number) => `₦${amountNGN.toLocaleString()}`;

  // Cart helpers - accept either a CartItem or a Product (convenience)
  const addToCart = (item: CartItem | Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    const cartItem: CartItem = ("product" in (item as any))
      ? { ...(item as CartItem), quantity: typeof quantity === 'number' && quantity > 0 ? quantity : (item as CartItem).quantity || 1, selectedColor: selectedColor || (item as CartItem).selectedColor, selectedSize: selectedSize || (item as CartItem).selectedSize }
      : {
          id: `${(item as Product).id}-${selectedColor || 'standard'}-${selectedSize || 'default'}`,
          product: item as Product,
          quantity: Math.max(1, quantity),
          selectedColor,
          selectedSize,
        };

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

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addReview = (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      helpfulCount: 0,
      verifiedPurchase: review.verifiedPurchase ?? true,
    };

    setReviews(prev => {
      const updatedReviews = [newReview, ...prev];
      setProducts(currProducts => currProducts.map(product => {
        if (product.id !== review.productId) return product;
        const productReviews = updatedReviews.filter(r => r.productId === product.id);
        const averageRating = productReviews.reduce((total, entry) => total + entry.rating, 0) / productReviews.length;
        return {
          ...product,
          rating: Number(averageRating.toFixed(1)),
          reviewCount: productReviews.length,
        };
      }));
      return updatedReviews;
    });
    showToast('Review submitted successfully', 'success');
    setIsReviewModalOpen(false);
  };

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

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
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

  const logout = () => {
    if (auth) {
      void firebaseSignOut(auth);
    }
    setCurrentUser(null);
    setIsAuthModalOpen(false);
    showToast('Signed out successfully', 'info');
  };

  const initiateCheckout = (
    customer: CustomerInfo,
    deliveryFeeNGN: number,
    discountNGN: number,
    fulfillmentType: 'pickup' | 'delivery',
    serviceFeeNGN: number
  ) => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    const subtotalNGN = cart.reduce((sum, item) => sum + item.product.priceNGN * item.quantity, 0);
    const totalNGN = subtotalNGN - discountNGN + deliveryFeeNGN + serviceFeeNGN;
    const order: Order = {
      id: `HD-${Date.now()}`,
      paystackRef: `PST-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      subtotalNGN,
      discountNGN,
      shippingNGN: deliveryFeeNGN,
      deliveryFeeNGN,
      serviceFeeNGN,
      fulfillmentType,
      ownerRoomAddress,
      totalNGN,
      totalUSD: Number((totalNGN / exchangeRateUSD).toFixed(2)),
      currency: 'NGN',
      status: 'placed',
      customer,
      paymentMethod: 'paystack_card',
      trackingNumber: `DW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      userId: currentUser?.id,
    };

    setOrders(prev => [order, ...prev]);
    setLastPlacedOrder(order);
    setPendingCheckoutOrder(order);
    setIsPaystackOpen(true);
    setCart([]);
    setActiveTab('checkout');
    showToast('Checkout started', 'success');
  };

  const handlePaystackPaymentSuccess = (reference: string) => {
    if (!pendingCheckoutOrder) return;
    setOrders(prev => prev.map(order => order.id === pendingCheckoutOrder.id ? { ...order, paystackRef: reference, status: 'processing' } : order));
    setLastPlacedOrder({ ...pendingCheckoutOrder, paystackRef: reference, status: 'processing' });
    setIsPaystackOpen(false);
    setPendingCheckoutOrder(null);
    setActiveTab('order-confirmation');
    showToast('Payment confirmed! Order placed successfully.', 'success');
  };

  // Delete a single product locally and permanently from Firestore
  const deleteProduct = async (id: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (selectedProductId === id) setSelectedProductId(null);

      if (db) {
        await deleteDoc(doc(db, 'products', id));
      }

      setCart(prev => prev.filter(ci => ci.product.id !== id));
      setWishlist(prev => prev.filter(pid => pid !== id));
      setNotifications(prev => [
        { id: `deleted-${Date.now()}`, title: 'Product removed', message: 'A product was removed from the storefront.', type: 'system', timestamp: new Date().toLocaleDateString(), read: false, linkTab: 'admin' },
        ...prev,
      ]);

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

      if (db && toDelete.length > 0) {
        const batch = writeBatch(db);
        toDelete.forEach(pd => {
          batch.delete(doc(db, 'products', pd.id));
        });
        await batch.commit();
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

  const value: ShopContextType = {
    products,
    filteredProducts,
    orders,
    lastPlacedOrder,
    currentUser,
    ownerRoomAddress,
    whatsappNumber,
    isManagerAuthenticated,
    adminEmail,
    currency,
    exchangeRateUSD,
    login,
    signup,
    loginWithGoogle,
    logout,

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
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,

    wishlist,
    toggleWishlist,
    isInWishlist,

    selectedProductId,
    selectedProduct,
    selectProduct,

    reviews,
    addReview,
    isReviewModalOpen,
    setIsReviewModalOpen,
    notification,

    filters,
    setFilter,
    resetFilters,

    isPaystackOpen,
    setIsPaystackOpen,
    pendingCheckoutOrder,
    initiateCheckout,
    handlePaystackPaymentSuccess,

    addCustomProduct,
    updateProductStock,
    deleteProduct,
    deleteAllOutOfStockProducts,
    updateOrderStatus,
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
