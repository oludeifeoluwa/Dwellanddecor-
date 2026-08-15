import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Order, ProductCategory, AppNotification, UserAccount } from '../types';
import { INITIAL_PRODUCTS as sampleProducts } from '../data/products';

type ShopContextType = {
  products: Product[];
  orders: Order[];
  currentUser: UserAccount | null;
  ownerRoomAddress: string;
  whatsappNumber: string;
  isManagerAuthenticated: boolean;
  adminEmail: string;

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

  useEffect(() => {
    try { localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products)); } catch (e) {}
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LS_ADMIN_KEY, isManagerAuthenticated ? 'true' : 'false');
    if (adminEmail) localStorage.setItem(LS_ADMIN_EMAIL, adminEmail);
  }, [isManagerAuthenticated, adminEmail]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    // Minimal toast: use window.alert for deployed convenience
    // In-app UI also shows toasts from AdminPanel via showToast usage
    // We'll still log to console
    // eslint-disable-next-line no-console
    console.info(`[toast:${type}] ${message}`);
    // Try to trigger in-app notification if available
    try {
      // no-op: AdminPanel reads showToast and triggers internal notification state
    } catch (_) {}
  };

  const formatPrice = (amountNGN: number, _amountUSD?: number) => `₦${amountNGN.toLocaleString()}`;

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

  // Delete a single product (local only). Use optimistic update.
  const deleteProduct = async (id: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      // If you had Firestore integration, you could call deleteDoc here. Repo has src/lib/firebase.ts export `db`.
      // We'll attempt to call Firestore delete if db is available to keep backend in sync.
      try {
        // dynamic import to avoid bundling issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const { db } = require('../lib/firebase');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const firestore = require('firebase/firestore');
        if (db && firestore && typeof firestore.deleteDoc === 'function') {
          const docRef = firestore.doc(db, 'products', id);
          await firestore.deleteDoc(docRef);
        }
      } catch (e) {
        // ignore if firebase not available
      }

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

      // Try batch delete in Firestore if available
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const { db } = require('../lib/firebase');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const firestore = require('firebase/firestore');
        if (db && firestore && typeof firestore.writeBatch === 'function') {
          const batch = firestore.writeBatch(db);
          toDelete.forEach(pd => batch.delete(firestore.doc(db, 'products', pd.id)));
          await batch.commit();
        }
      } catch (e) {
        // ignore
      }

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
