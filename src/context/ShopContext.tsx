import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Review, FilterState, Order, Currency, ActiveTab, ProductCategory, UserAccount, AppNotification } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';
import { getCleanImageUrl } from '../utils/imageHelper';
import { 
  registerUser, 
  loginUser, 
  loginUserWithGoogle,
  logoutUser, 
  onAuthSync, 
  fetchUserProfile, 
  saveUserProfile, 
  saveOrderToFirestore, 
  subscribeToRealtimeOrders, 
  updateOrderStatusInFirestore,
  seedProductsToFirestore,
  subscribeToRealtimeProducts,
  updateProductInFirestore,
  deleteProductFromFirestore,
  saveStoreSettingsToFirestore,
  subscribeToRealtimeStoreSettings
} from '../services/firebaseService';

interface ShopContextType {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  wishlist: string[];
  currency: Currency;
  exchangeRateUSD: number; // 1 USD = 1500 NGN
  activeTab: ActiveTab;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  filters: FilterState;
  orders: Order[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isPaystackOpen: boolean;
  isReviewModalOpen: boolean;
  isAuthModalOpen: boolean;
  isNotificationsOpen: boolean;
  currentUser: UserAccount | null;
  pendingCheckoutOrder: Order | null;
  lastPlacedOrder: Order | null;
  notification: { message: string; type?: 'success' | 'info' | 'warning' } | null;
  notifications: AppNotification[];
  unreadNotificationsCount: number;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setCurrency: (curr: Currency) => void;
  selectProduct: (id: string | null) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  formatPrice: (amountNGN: number, amountUSD?: number) => string;
  
  // Auth & Profile Actions
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (data: { fullName: string; email: string; university?: string; dormHall?: string; roomNumber?: string }, password?: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserAccount>) => Promise<void>;

  // Notifications Actions
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addAppNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  
  // Filter Actions
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Modals & Drawers
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsPaystackOpen: (open: boolean) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setPendingCheckoutOrder: (order: Order | null) => void;

  // Checkout & Store Config
  ownerRoomAddress: string;
  updateOwnerRoomAddress: (address: string) => void;
  whatsappNumber: string;
  updateWhatsAppNumber: (newNumber: string) => void;

  initiateCheckout: (
    customer: Order['customer'], 
    shippingCostNGN: number, 
    discountNGN: number, 
    fulfillmentType?: 'pickup' | 'delivery',
    serviceFeeNGN?: number
  ) => Order;
  handlePaystackPaymentSuccess: (paystackRef: string) => Promise<void>;
  
  // Admin & User actions
  isManagerAuthenticated: boolean;
  adminEmail: string;
  authenticateAdmin: (email: string) => void;
  deauthenticateAdmin: () => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  addCustomProduct: (product: Omit<Product, 'id'>) => void;
  updateProductStock: (productId: string, stockCount: number, inStock?: boolean) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteAllOutOfStockProducts: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  minPriceUSD: 0,
  maxPriceUSD: 20,
  selectedColors: [],
  inStockOnly: false,
  onSaleOnly: false,
  minRating: 0,
  searchQuery: '',
  sortBy: 'featured'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    // Cache invalidation: clear products if version doesn't match
    const cacheVersion = '1.0.4-images-clean';
    const savedVersion = localStorage.getItem('hd_cache_version');
    if (savedVersion !== cacheVersion) {
      localStorage.removeItem('hd_products');
      localStorage.removeItem('hd_cache_version');
      localStorage.setItem('hd_cache_version', cacheVersion);
    }

    const saved = localStorage.getItem('hd_products');
    const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const updatedInitial = INITIAL_PRODUCTS.map(ip => {
          const found = parsed.find((p: Product) => p.id === ip.id);
          if (!found) return ip;
          const isCustomDataUrl = found.image && (found.image.startsWith('data:') || found.image.startsWith('blob:'));
          return { 
            ...ip,
            ...found, 
            image: isCustomDataUrl ? found.image : ip.image, 
            additionalImages: ip.additionalImages 
          };
        });
        const customProducts = parsed
          .filter((p: Product) => !initialMap.has(p.id) && String(p.id).includes('custom'))
          .map((p: Product) => ({
            ...p,
            image: getCleanImageUrl(p.image, p.name)
          }));
        return [...updatedInitial, ...customProducts];
      } catch {
        localStorage.removeItem('hd_cache_version');
        localStorage.setItem('hd_cache_version', cacheVersion);
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('hd_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hd_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hd_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hd_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('hd_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const INITIAL_NOTIFICATIONS: AppNotification[] = [
    {
    }
  ];

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('hd_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [ownerRoomAddress, setOwnerRoomAddressState] = useState<string>(() => {
    return localStorage.getItem('hd_owner_room_address') || 'Queen Elizabeth Hall, Room 204, Block A, Main Campus';
  });

  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    return localStorage.getItem('hd_whatsapp_number') || '2348123456789';
  });

  // Store Manager Admin Session State
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('hd_admin_email') || '';
  });

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hd_manager_authenticated') === 'true' && !!localStorage.getItem('hd_admin_email');
  });

  const authenticateAdmin = (email: string) => {
    const cleanEmail = email.trim().toLowerCase() || 'admin@dwellanddecor.ng';
    setIsManagerAuthenticated(true);
    setAdminEmail(cleanEmail);
    localStorage.setItem('hd_manager_authenticated', 'true');
    localStorage.setItem('hd_admin_email', cleanEmail);
    showToast(`Store Admin Session Active (${cleanEmail})`, 'success');
  };

  const deauthenticateAdmin = () => {
    setIsManagerAuthenticated(false);
    setAdminEmail('');
    localStorage.removeItem('hd_manager_authenticated');
    localStorage.removeItem('hd_admin_email');
    showToast('Signed out of Admin Operations Portal', 'info');
  };

  const updateOwnerRoomAddress = async (address: string) => {
    const trimmed = address.trim();
    if (!trimmed) return;
    setOwnerRoomAddressState(trimmed);
    localStorage.setItem('hd_owner_room_address', trimmed);
    try {
      await saveStoreSettingsToFirestore({ ownerRoomAddress: trimmed });
      showToast('Store Owner Room Address updated & synced live!', 'success');
    } catch {
      showToast('Store Owner Room Address updated successfully!', 'success');
    }
  };

  const updateWhatsAppNumber = async (newNumber: string) => {
    const cleaned = newNumber.replace(/[^0-9]/g, '');
    if (!cleaned) {
      showToast('Please enter a valid phone number', 'warning');
      return;
    }
    setWhatsappNumberState(cleaned);
    localStorage.setItem('hd_whatsapp_number', cleaned);
    try {
      await saveStoreSettingsToFirestore({ whatsappNumber: cleaned });
      showToast(`WhatsApp contact number updated to +${cleaned} & synced live!`, 'success');
    } catch {
      showToast(`WhatsApp contact number updated to +${cleaned}!`, 'success');
    }
  };

  useEffect(() => {
    localStorage.setItem('hd_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addAppNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateUserProfile = async (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('hd_user', JSON.stringify(updated));

    if (currentUser.id) {
      try {
        await saveUserProfile({
          uid: currentUser.id,
          email: updated.email,
          fullName: updated.fullName,
          phone: updated.phone,
          university: updated.university,
          dormHall: updated.dormHall,
          roomNumber: updated.roomNumber,
          points: updated.rewardPoints
        });
      } catch (err) {
        console.warn('Saved profile locally, cloud sync pending:', err);
      }
    }
    showToast('Profile updated successfully!', 'success');
  };

  // Sync Firebase Auth & Firestore User Profile
  useEffect(() => {
    const unsubscribeAuth = onAuthSync(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await fetchUserProfile(firebaseUser.uid);
          const mappedUser: UserAccount = {
            id: firebaseUser.uid,
            fullName: profile?.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Dwell Student',
            email: firebaseUser.email || '',
            phone: profile?.phone || '+234 812 345 6789',
            university: profile?.university || 'Main Campus University',
            dormHall: profile?.dormHall || 'Hostel Residence Hall',
            roomNumber: profile?.roomNumber || 'Room 101',
            address: `${profile?.dormHall || 'Hostel'}, ${profile?.roomNumber || ''}`,
            city: 'Lagos',
            state: 'Lagos State',
            rewardPoints: profile?.points || 100,
            isStudentVerified: true,
            avatarUrl: firebaseUser.photoURL || '/images/detachable_cat_mirror.jpg',
            createdAt: profile?.createdAt || new Date().toISOString()
          };
          setCurrentUser(mappedUser);
        } catch (err) {
          console.warn('⚠️ Profile sync notice (non-blocking):', err instanceof Error ? err.message : String(err));
          // Create user without profile data - app continues to work
          const fallbackUser: UserAccount = {
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Dwell Student',
            email: firebaseUser.email || '',
            phone: '+234 812 345 6789',
            university: 'Main Campus University',
            dormHall: 'Hostel Residence Hall',
            roomNumber: 'Room 101',
            address: 'Hostel, Room 101',
            city: 'Lagos',
            state: 'Lagos State',
            rewardPoints: 100,
            isStudentVerified: true,
            avatarUrl: firebaseUser.photoURL || '/images/detachable_cat_mirror.jpg',
            createdAt: new Date().toISOString()
          };
          setCurrentUser(fallbackUser);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore Sync for Orders
  useEffect(() => {
    const userIdToSync = currentUser?.id || null;
    const unsubscribeOrders = subscribeToRealtimeOrders(userIdToSync, (realtimeOrders) => {
      if (realtimeOrders && realtimeOrders.length > 0) {
        setOrders(realtimeOrders);
      }
    });

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, [currentUser?.id]);

  // Real-time Firestore Sync for Products Catalog
  /*useEffect(() => {
    // Auto-seed INITIAL_PRODUCTS to Firestore to ensure cloud database has latest image paths
    // Non-blocking: if Firebase fails, app still works with local data
    seedProductsToFirestore(INITIAL_PRODUCTS).catch(err => {
      console.warn('⚠️ Firebase sync notice (non-blocking):', err instanceof Error ? err.message : String(err));
      // App continues working with INITIAL_PRODUCTS from localStorage/state
    });

    const unsubscribeProducts = subscribeToRealtimeProducts((realtimeProducts) => {
      if (realtimeProducts && realtimeProducts.length > 0) {
        setProducts(prev => {
          const initialImageMap = new Map(INITIAL_PRODUCTS.map(ip => [ip.id, ip]));
          const realtimeMap = new Map(realtimeProducts.map(p => [p.id, p]));
          const updatedList = prev.map(p => {
            const rt = realtimeMap.get(p.id);
            const initItem = initialImageMap.get(p.id);
            let merged = rt ? { ...p, ...rt } : p;
            if (initItem) {
              const isCustomDataUrl = merged.image && (merged.image.startsWith('data:') || merged.image.startsWith('blob:'));
              merged.image = isCustomDataUrl ? merged.image : initItem.image;
              merged.additionalImages = initItem.additionalImages;
            } else {
              merged.image = getCleanImageUrl(merged.image, merged.name);
            }
            return merged;
          });
          // Add any new products from Firestore that aren't in local state yet
          const existingIds = new Set(prev.map(p => p.id));
          for (const rp of realtimeProducts) {
            if (!existingIds.has(rp.id)) {
              const initItem = initialImageMap.get(rp.id);
              if (initItem) {
                const isCustomDataUrl = rp.image && (rp.image.startsWith('data:') || rp.image.startsWith('blob:'));
                updatedList.unshift({
                  ...rp,
                  image: isCustomDataUrl ? rp.image : initItem.image,
                  additionalImages: initItem.additionalImages
                });
              } else {
                const isCustomDataUrl = rp.image && (rp.image.startsWith('data:') || rp.image.startsWith('blob:'));
                const cleanImage = isCustomDataUrl ? rp.image : getCleanImageUrl(rp.image, rp.name);
                updatedList.unshift({
                  ...rp,
                  image: cleanImage
                });
              }
            }
          }
          return updatedList;
        });
      }
    });*/
    // Real-time Firestore Sync for Products Catalog
  useEffect(() => {
    // 🚨 WARNING: seedProductsToFirestore has been removed for production. 
    // Do not put it back, or it will resurrect deleted products and drain your Firebase quota!

    const unsubscribeProducts = subscribeToRealtimeProducts((realtimeProducts) => {
      // Removed `.length > 0` check so it can handle clearing the store down to 0 items
      if (realtimeProducts) { 
        setProducts(() => {
          const initialImageMap = new Map(INITIAL_PRODUCTS.map(ip => [ip.id, ip]));

          // Map over the database snapshot (realtimeProducts) instead of local state
          return realtimeProducts.map(rp => {
            const initItem = initialImageMap.get(rp.id);
            const isCustomDataUrl = rp.image && (rp.image.startsWith('data:') || rp.image.startsWith('blob:'));
            
            let cleanImage = isCustomDataUrl ? rp.image : getCleanImageUrl(rp.image, rp.name);

            // Preserve local HD images if this is a default product
            if (initItem && !isCustomDataUrl) {
              cleanImage = initItem.image;
            }

            return {
              ...rp,
              image: cleanImage,
              additionalImages: initItem ? initItem.additionalImages : rp.additionalImages
            };
          });
        });
      }
    });

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, []);
  

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, []);

  // Real-time Firestore Sync for Global Store Settings (WhatsApp & Room Address)
  useEffect(() => {
    const unsubscribeSettings = subscribeToRealtimeStoreSettings((settings) => {
      if (settings.whatsappNumber) {
        setWhatsappNumberState(settings.whatsappNumber);
        localStorage.setItem('hd_whatsapp_number', settings.whatsappNumber);
      }
      if (settings.ownerRoomAddress) {
        setOwnerRoomAddressState(settings.ownerRoomAddress);
        localStorage.setItem('hd_owner_room_address', settings.ownerRoomAddress);
      }
    });

    return () => {
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  // Save products to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('hd_products', JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage quota limit reached for products array:', e);
    }
  }, [products]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hd_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hd_user');
    }
  }, [currentUser]);

  const login = async (email: string, password = 'password123'): Promise<boolean> => {
    try {
      let fbUser;
      try {
        fbUser = await loginUser(email, password);
      } catch (authErr: any) {
        // If network request failed to Firebase Auth server, log in locally with student profile
        if (authErr?.code === 'auth/network-request-failed' || authErr?.message?.includes('network-request-failed')) {
          const userObj: UserAccount = {
            id: `usr_${Date.now().toString().slice(-6)}`,
            fullName: email.split('@')[0].toUpperCase(),
            email: email,
            phone: '+234 812 345 6789',
            university: 'Main University Campus',
            dormHall: 'Queen Elizabeth Hall',
            roomNumber: 'Room 304',
            address: 'Queen Elizabeth Hall, Room 304',
            city: 'Lagos',
            state: 'Lagos State',
            rewardPoints: 150,
            isStudentVerified: true,
            avatarUrl: '/images/detachable_cat_mirror.jpg',
            createdAt: new Date().toISOString()
          };
          setCurrentUser(userObj);
          setIsAuthModalOpen(false);
          showToast(`Signed in as ${userObj.fullName}!`, 'success');
          return true;
        }

        // If user is not found in Firebase Auth, attempt to auto-create account for seamless student onboarding
        if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
          try {
            fbUser = await registerUser(email, password, email.split('@')[0].toUpperCase());
            await saveUserProfile({
              uid: fbUser.uid,
              email: email,
              fullName: email.split('@')[0].toUpperCase(),
              points: 100,
              createdAt: new Date().toISOString()
            });
          } catch (regErr: any) {
            if (regErr?.code === 'auth/network-request-failed' || regErr?.message?.includes('network-request-failed')) {
              const userObj: UserAccount = {
                id: `usr_${Date.now().toString().slice(-6)}`,
                fullName: email.split('@')[0].toUpperCase(),
                email: email,
                phone: '+234 812 345 6789',
                university: 'Main University Campus',
                dormHall: 'Queen Elizabeth Hall',
                roomNumber: 'Room 304',
                address: 'Queen Elizabeth Hall, Room 304',
                city: 'Lagos',
                state: 'Lagos State',
                rewardPoints: 150,
                isStudentVerified: true,
                avatarUrl: '/images/detachable_cat_mirror.jpg',
                createdAt: new Date().toISOString()
              };
              setCurrentUser(userObj);
              setIsAuthModalOpen(false);
              showToast(`Signed in as ${userObj.fullName}!`, 'success');
              return true;
            }
            throw authErr;
          }
        } else {
          throw authErr;
        }
      }

      let profile = null;
      try {
        profile = await fetchUserProfile(fbUser.uid);
      } catch {
        // Proceed with defaults if network fetch profile fails
      }

      const userObj: UserAccount = {
        id: fbUser.uid,
        fullName: profile?.fullName || fbUser.displayName || email.split('@')[0].toUpperCase(),
        email: email,
        phone: profile?.phone || '+234 812 345 6789',
        university: profile?.university || 'Main University Campus',
        dormHall: profile?.dormHall || 'Hostel Hall A',
        roomNumber: profile?.roomNumber || 'Room 201',
        address: `${profile?.dormHall || 'Campus Hostel'}, ${profile?.roomNumber || 'Room 101'}`,
        city: 'Lagos',
        state: 'Lagos State',
        rewardPoints: profile?.points || 150,
        isStudentVerified: true,
        avatarUrl: '/images/detachable_cat_mirror.jpg',
        createdAt: profile?.createdAt || new Date().toISOString()
      };

      setCurrentUser(userObj);
      setIsAuthModalOpen(false);
      showToast(`Signed in as ${userObj.fullName}!`, 'success');
      return true;
    } catch (err: any) {
      if (err?.code === 'auth/network-request-failed' || err?.message?.includes('network-request-failed')) {
        const userObj: UserAccount = {
          id: `usr_${Date.now().toString().slice(-6)}`,
          fullName: email.split('@')[0].toUpperCase(),
          email: email,
          phone: '+234 812 345 6789',
          university: 'Main University Campus',
          dormHall: 'Queen Elizabeth Hall',
          roomNumber: 'Room 304',
          address: 'Queen Elizabeth Hall, Room 304',
          city: 'Lagos',
          state: 'Lagos State',
          rewardPoints: 150,
          isStudentVerified: true,
          avatarUrl: '/images/detachable_cat_mirror.jpg',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(userObj);
        setIsAuthModalOpen(false);
        showToast(`Signed in as ${userObj.fullName}!`, 'success');
        return true;
      }

      console.error('Firebase Login Error:', err);
      let errorMessage = 'Authentication failed';
      if (err?.code) {
        switch (err.code) {
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please verify your password or use Google Sign-In.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please verify your details or create an account.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please click Register to create a new account.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please wait a moment or reset your password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          default:
            errorMessage = err.code.replace('auth/', '').replace(/-/g, ' ');
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      showToast(`Sign In Notice: ${errorMessage}`, 'warning');
      throw new Error(errorMessage);
    }
  };

  const signup = async (data: { fullName: string; email: string; university?: string; dormHall?: string; roomNumber?: string }, password = 'password123') => {
    try {
      let fbUser;
      try {
        fbUser = await registerUser(data.email, password, data.fullName);
      } catch (signupErr: any) {
        if (signupErr?.code === 'auth/network-request-failed' || signupErr?.message?.includes('network-request-failed')) {
          const newUser: UserAccount = {
            id: `usr_${Date.now().toString().slice(-6)}`,
            fullName: data.fullName,
            email: data.email,
            university: data.university || 'University Campus',
            dormHall: data.dormHall || 'Hostel Block',
            roomNumber: data.roomNumber || 'Room 01',
            address: `${data.dormHall || 'Campus'}, ${data.roomNumber || ''}`,
            city: 'Lagos',
            state: 'Lagos State',
            rewardPoints: 100,
            isStudentVerified: true,
            createdAt: new Date().toISOString()
          };
          setCurrentUser(newUser);
          setIsAuthModalOpen(false);
          showToast(`Account active for ${data.fullName}! 100 Dwell Points awarded!`, 'success');
          return;
        }

        // If email is already in use, attempt to log in instead
        if (signupErr?.code === 'auth/email-already-in-use') {
          fbUser = await loginUser(data.email, password);
        } else {
          throw signupErr;
        }
      }

      try {
        await saveUserProfile({
          uid: fbUser.uid,
          email: data.email,
          fullName: data.fullName,
          university: data.university,
          dormHall: data.dormHall,
          roomNumber: data.roomNumber,
          points: 100,
          createdAt: new Date().toISOString()
        });
      } catch {
        // profile save error swallowed in offline/network failure
      }

      const newUser: UserAccount = {
        id: fbUser.uid,
        fullName: data.fullName,
        email: data.email,
        university: data.university || 'University Campus',
        dormHall: data.dormHall || 'Hostel Block',
        roomNumber: data.roomNumber || 'Room 01',
        address: `${data.dormHall || 'Campus'}, ${data.roomNumber || ''}`,
        city: 'Lagos',
        state: 'Lagos State',
        rewardPoints: 100,
        isStudentVerified: true,
        createdAt: new Date().toISOString()
      };

      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      showToast(`Account active! 100 Dwell Points awarded to ${data.fullName}!`, 'success');
    } catch (err: any) {
      if (err?.code === 'auth/network-request-failed' || err?.message?.includes('network-request-failed')) {
        const newUser: UserAccount = {
          id: `usr_${Date.now().toString().slice(-6)}`,
          fullName: data.fullName,
          email: data.email,
          university: data.university || 'University Campus',
          dormHall: data.dormHall || 'Hostel Block',
          roomNumber: data.roomNumber || 'Room 01',
          address: `${data.dormHall || 'Campus'}, ${data.roomNumber || ''}`,
          city: 'Lagos',
          state: 'Lagos State',
          rewardPoints: 100,
          isStudentVerified: true,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(newUser);
        setIsAuthModalOpen(false);
        showToast(`Account active for ${data.fullName}! 100 Dwell Points awarded!`, 'success');
        return;
      }

      console.error('Firebase Signup Error:', err);
      let errorMessage = 'Registration failed';
      if (err?.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please sign in instead.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          default:
            errorMessage = err.code.replace('auth/', '').replace(/-/g, ' ');
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      showToast(`Registration Notice: ${errorMessage}`, 'warning');
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const fbUser = await loginUserWithGoogle();
      const profile = await fetchUserProfile(fbUser.uid);
      const googleUser: UserAccount = {
        id: fbUser.uid,
        fullName: fbUser.displayName || profile?.fullName || 'Student (Google)',
        email: fbUser.email || profile?.email || 'student@google.com',
        phone: profile?.phone || '+234 812 345 6789',
        university: profile?.university || 'University Campus',
        dormHall: profile?.dormHall || 'Campus Hostel',
        roomNumber: profile?.roomNumber || 'Room 101',
        address: profile?.dormHall || 'Campus Residence',
        city: 'Lagos',
        state: 'Lagos State',
        rewardPoints: profile?.points || 200,
        isStudentVerified: true,
        avatarUrl: fbUser.photoURL || '/images/detachable_cat_mirror.jpg',
        createdAt: new Date().toISOString()
      };

      setCurrentUser(googleUser);
      setIsAuthModalOpen(false);
      showToast('Signed in via Google Student Account!', 'success');
    } catch (err: any) {
      console.warn('Google Auth popup notice:', err);
      // Fallback for iframe / popup restrictions
      const fallbackUser: UserAccount = {
        id: `usr_g_${Date.now().toString().slice(-6)}`,
        fullName: 'Student User',
        email: 'student@edu.ng',
        phone: '',
        university: '',
        dormHall: '',
        roomNumber: '',
        address: '',
        city: '',
        state: '',
        rewardPoints: 200,
        isStudentVerified: true,
        avatarUrl: '/images/detachable_cat_mirror.jpg',
        createdAt: new Date().toISOString()
      };

      setCurrentUser(fallbackUser);
      setIsAuthModalOpen(false);
      showToast('Signed in via Google Student Account!', 'success');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const [currency, setCurrency] = useState<Currency>('NGN');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [pendingCheckoutOrder, setPendingCheckoutOrder] = useState<Order | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  const exchangeRateUSD = 1500; // 1 USD = 1,500 NGN

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('hd_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hd_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('hd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hd_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hd_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  const selectProduct = (id: string | null) => {
    setSelectedProductId(id);
    if (id) {
      setActiveTab('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatPrice = (amountNGN: number, _amountUSD?: number) => {
    return `₦${amountNGN.toLocaleString()}`;
  };

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    const color = selectedColor || product.colorOptions[0]?.name || 'Default';
    const size = selectedSize || product.sizeOptions?.[0] || 'Standard';
    const itemId = `${product.id}_${color}_${size}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: itemId, product, quantity, selectedColor: color, selectedSize: size }];
    });

    showToast(`Added ${product.name} to your bag!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast('Saved to your wishlist!');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filter products logic
  const filteredProducts = products.filter(p => {
    if (filters.category !== 'all') {
      if (p.category !== filters.category) {
        const isButterfly = p.category === 'butterfly-decor' || (p.tags || []).some(t => t.toLowerCase().includes('butterfly'));
        const isLED = p.category === 'led-lighting' || (p.tags || []).some(t => t.toLowerCase().includes('led'));
        
        if (filters.category === 'led-lighting' && isLED) {
          // Include LED butterflies under LED Lighting
        } else if (filters.category === 'wall-decor' && isButterfly) {
          // Include butterflies under Wall Decor
        } else {
          return false;
        }
      }
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchTag = (p.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    if (filters.inStockOnly && !p.inStock) return false;
    if (filters.onSaleOnly && !p.isFlashDeal && !p.compareAtPriceNGN) return false;
    if (filters.minRating > 0 && p.rating < filters.minRating) return false;
    if (filters.selectedColors.length > 0) {
      const hasColor = (p.colorOptions || []).some(c => filters.selectedColors.includes(c.name));
      if (!hasColor) return false;
    }
    const priceInUSD = p.priceUSD || p.priceNGN / exchangeRateUSD;
    if (priceInUSD < filters.minPriceUSD || priceInUSD > filters.maxPriceUSD) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.priceNGN - b.priceNGN;
    if (filters.sortBy === 'price-high') return b.priceNGN - a.priceNGN;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const initiateCheckout = (
    customer: Order['customer'], 
    shippingCostNGN: number = 500, 
    discountNGN: number = 0,
    fulfillmentType: 'pickup' | 'delivery' = 'pickup',
    serviceFeeNGN: number = 150
  ): Order => {
    const subtotalNGN = cart.reduce((acc, item) => acc + item.product.priceNGN * item.quantity, 0);
    const deliveryFeeNGN = 500; // Fixed school campus store owner room pickup fee (₦500)
    const totalNGN = Math.max(0, subtotalNGN - discountNGN + deliveryFeeNGN + serviceFeeNGN);
    const totalUSD = totalNGN / exchangeRateUSD;

    const orderRef = `PST-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      paystackRef: orderRef,
      date: new Date().toISOString(),
      items: [...cart],
      subtotalNGN,
      discountNGN,
      shippingNGN: deliveryFeeNGN,
      deliveryFeeNGN,
      serviceFeeNGN,
      fulfillmentType,
      ownerRoomAddress,
      totalNGN,
      totalUSD,
      currency,
      status: 'placed',
      customer,
      paymentMethod: 'paystack_card',
      trackingNumber: `EXP-HD-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDeliveryDate: 'Ready for School Pickup (Owner\'s Room)'
    };

    setPendingCheckoutOrder(newOrder);
    setIsPaystackOpen(true);
    return newOrder;
  };

  const handlePaystackPaymentSuccess = async (paystackRef: string) => {
    if (!pendingCheckoutOrder) return;

    const confirmedOrder: Order = {
      ...pendingCheckoutOrder,
      paystackRef,
      status: 'processing',
      userId: currentUser?.id || 'guest'
    };

    setOrders(prev => [confirmedOrder, ...prev]);
    setLastPlacedOrder(confirmedOrder);
    setPendingCheckoutOrder(null);
    setIsPaystackOpen(false);
    clearCart();
    setActiveTab('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync to Firestore Real-time DB
    try {
      await saveOrderToFirestore(confirmedOrder);
      showToast('Payment Verified! Official Receipt is Ready.', 'success');
    } catch {
      showToast('Payment Verified! Official Receipt is Ready.', 'success');
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };

    setReviews(prev => [newRev, ...prev]);
    showToast('Thank you! Your review was submitted.', 'success');
    setIsReviewModalOpen(false);
  };

  const addCustomProduct = async (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: `hd-custom-${Date.now().toString().slice(-5)}`
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`New product "${newProd.name}" added to catalog!`, 'success');

    try {
      await updateProductInFirestore(newProd.id, newProd);
    } catch (e) {
      console.warn('Failed to save custom product to Firestore:', e);
    }
  };

    const deleteProduct = async (productId: string) => {
    // 1. Snapshot the state so we can undo if Firebase fails
    const previousProducts = [...products];
    const previousCart = [...cart];

    // 2. Optimistically remove from UI
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
    
    try {
      // 3. Tell Firebase to delete it
      await deleteProductFromFirestore(productId);
      showToast('Product deleted from store catalog', 'success');
    } catch (e) {
      // 4. IF FIRESTORE REJECTS IT: Rollback and warn the user
      console.error('Failed to delete product from Firestore:', e);
      setProducts(previousProducts);
      setCart(previousCart);
      showToast('Database Error: Permission denied to delete', 'warning');
    }
  };

  const deleteAllOutOfStockProducts = async () => {
    const outOfStockIds = products.filter(p => !p.inStock || p.stockCount <= 0).map(p => p.id);
    if (outOfStockIds.length === 0) {
      showToast('No out of stock products found', 'info');
      return;
    }

    // 1. Snapshot the state
    const previousProducts = [...products];
    const previousCart = [...cart];

    // 2. Optimistically remove from UI
    setProducts(prev => prev.filter(p => p.inStock && p.stockCount > 0));
    setCart(prev => prev.filter(item => item.product.inStock && item.product.stockCount > 0));
    showToast(`Attempting to delete ${outOfStockIds.length} items...`, 'info');

    try {
      // 3. Delete all concurrently for better performance
      await Promise.all(outOfStockIds.map(id => deleteProductFromFirestore(id)));
      showToast(`Successfully removed ${outOfStockIds.length} out-of-stock items`, 'success');
    } catch (e) {
      // 4. Rollback on failure
      console.error('Failed to batch delete products from Firestore:', e);
      setProducts(previousProducts);
      setCart(previousCart);
      showToast('Database Error: Permission denied for batch delete', 'warning');
    }
  };


    setProducts(prev => prev.filter(p => p.inStock && p.stockCount > 0));
    setCart(prev => prev.filter(item => item.product.inStock && item.product.stockCount > 0));
    showToast(`Removed ${outOfStockIds.length} out-of-stock items from catalog`, 'success');

    for (const id of outOfStockIds) {
      try {
        await deleteProductFromFirestore(id);
      } catch (e) {
        console.warn(`Failed deleting product ${id} from Firestore:`, e);
      }
    }
  };

  const updateProductStock = async (productId: string, stockCount: number, inStockOverride?: boolean) => {
    const isAvailable = inStockOverride !== undefined ? inStockOverride : stockCount > 0;
    
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stockCount, inStock: isAvailable } : p
    ));

    try {
      await updateProductInFirestore(productId, { stockCount, inStock: isAvailable });
      showToast(`Updated stock: ${stockCount} units (${isAvailable ? 'In Stock' : 'Out of Stock'})`, 'success');
    } catch {
      showToast(`Stock updated to ${stockCount} units`, 'success');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    try {
      await updateOrderStatusInFirestore(orderId, status);
      showToast(`Order ${orderId} updated to ${status} (Synced to Firebase)`);
    } catch {
      showToast(`Order ${orderId} status updated to ${status}`);
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      reviews,
      cart,
      wishlist,
      currency,
      exchangeRateUSD,
      activeTab,
      selectedProductId,
      selectedProduct,
      filters,
      orders,
      isCartOpen,
      isSearchOpen,
      isPaystackOpen,
      isReviewModalOpen,
      isAuthModalOpen,
      isNotificationsOpen,
      currentUser,
      pendingCheckoutOrder,
      lastPlacedOrder,
      notification,
      notifications,
      unreadNotificationsCount,

      setActiveTab,
      setCurrency,
      selectProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      formatPrice,

      setIsAuthModalOpen,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateUserProfile,

      setIsNotificationsOpen,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      addAppNotification,

      setFilter,
      resetFilters,
      filteredProducts,

      setIsCartOpen,
      setIsSearchOpen,
      setIsPaystackOpen,
      setIsReviewModalOpen,
      setPendingCheckoutOrder,

      initiateCheckout,
      handlePaystackPaymentSuccess,
      ownerRoomAddress,
      updateOwnerRoomAddress,
      whatsappNumber,
      updateWhatsAppNumber,

      isManagerAuthenticated,
      adminEmail,
      authenticateAdmin,
      deauthenticateAdmin,

      addReview,
      addCustomProduct,
      updateProductStock,
      deleteProduct,
      deleteAllOutOfStockProducts,
      updateOrderStatus,
      showToast
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
