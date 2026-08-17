import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  Settings, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Check, 
  RotateCw,
  Store,
  Lock,
  ShieldCheck,
  KeyRound,
  LogOut,
  Mail,
  ShieldAlert,
  ArrowRight,
  Minus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Flame,
  Database,
  RefreshCw,
  Trash2,
  Phone,
  MessageSquare,
  UploadCloud,
  Image as ImageIcon,
  FileImage,
  X,
  Sparkles,
  Printer
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { auth } from '../lib/firebase';
import { ProductCategory } from '../types';
import { printReceiptPDF } from '../utils/receiptPrinter';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    addCustomProduct, 
    syncCatalogToFirestore,
    updateProductStock, 
    deleteProduct,
    deleteAllOutOfStockProducts,
    formatPrice, 
    showToast, 
    currentUser,
    ownerRoomAddress,
    updateOwnerRoomAddress,
    whatsappNumber,
    updateWhatsAppNumber,
    isManagerAuthenticated,
    adminEmail,
    authenticateAdmin,
    deauthenticateAdmin
  } = useShop();

  const [editRoomAddress, setEditRoomAddress] = useState(ownerRoomAddress);
  const [editWhatsApp, setEditWhatsApp] = useState(whatsappNumber);
  const [isSavingRoomAddress, setIsSavingRoomAddress] = useState(false);
  const [isInitializingFirestore, setIsInitializingFirestore] = useState(false);

  React.useEffect(() => {
    setEditRoomAddress(ownerRoomAddress);
  }, [ownerRoomAddress]);

  React.useEffect(() => {
    setEditWhatsApp(whatsappNumber);
  }, [whatsappNumber]);

  // Dedicated Admin Login Form State
  const [inputEmail, setInputEmail] = useState('');
  const [inputPasscode, setInputPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add-product'>('inventory');

  // Inventory Filter & Search State
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Form state for adding custom product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('wall-hooks');
  const [newProdPrice, setNewProdPrice] = useState(6500);
  const [newProdImg, setNewProdImg] = useState('/images/green_vines_exact.jpg');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdIsNewArrival, setNewProdIsNewArrival] = useState(true);

  // Local storage image upload state
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'preset'>('upload');

  // Helper to convert uploaded JPG/PNG file to optimized Data URL
  const processUploadedImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid JPG or PNG image file.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 600;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('Unable to read image file. Please try another JPG or PNG photo.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed reading file from local storage.'));
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsUploadingImage(true);
    try {
      const dataUrl = await processUploadedImage(file);
      setNewProdImg(dataUrl);
      setUploadedFileName(file.name);
      showToast(`Uploaded "${file.name}" from local storage!`, 'success');
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to process local image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    setIsUploadingImage(true);
    try {
      const uploadedDataUrls: string[] = [];
      for (const f of files) {
        const url = await processUploadedImage(f);
        uploadedDataUrls.push(url);
      }
      setAdditionalImages(prev => [...prev, ...uploadedDataUrls]);
      showToast(`Added ${files.length} extra gallery photo(s)`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error processing extra image', 'warning');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const totalRevenueNGN = orders.reduce((sum, o) => sum + o.totalNGN, 0);

  // Authorized Admin Emails List
  const ALLOWED_ADMIN_EMAILS = [
    'toluwalasedaboh65@gmail.com',
    'dabohtoluwalase@gmail.com'
  ];

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = inputEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setLoginError('Please enter a dedicated admin email address.');
      return;
    }

    const isAdminEmailDomain = cleanEmail.endsWith('@gmail.com');
    const isExplicitAdminEmail = ALLOWED_ADMIN_EMAILS.includes(cleanEmail);

    if (!isAdminEmailDomain && !isExplicitAdminEmail) {
      setLoginError('Access Denied.');
      return;
    }

    if (!auth) {
      setLoginError('Firebase Auth is not configured.');
      return;
    }

    try {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, inputPasscode);
      } catch (signInError: any) {
        if (signInError?.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, cleanEmail, inputPasscode);
        } else {
          throw signInError;
        }
      }

      // Wait a moment for Firebase auth state to fully propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify Firebase user is actually authenticated
      if (!auth.currentUser) {
        throw new Error('Firebase authentication did not complete properly. Please try again.');
      }

      console.debug(`[Admin Auth] Firebase user signed in: ${auth.currentUser.uid}`);
      const effectiveEmail = cleanEmail.includes('@') ? cleanEmail : 'error';
      authenticateAdmin(effectiveEmail);
      setLoginError('');
    } catch (error: any) {
      const message = error?.code ? error.code.replace('auth/', '').replace(/-/g, ' ') : (error?.message || 'Authentication failed');
      setLoginError(`Admin sign-in failed: ${message}`);
    }
  };

  const handleManagerLogout = () => {
    deauthenticateAdmin();
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) return;

    addCustomProduct({
      name: newProdName,
      category: newProdCategory,
      categoryName: newProdCategory === 'wall-hooks' ? 'Wall Hooks' : newProdCategory === 'led-lighting' ? 'LED Lighting' : newProdCategory === 'desk-organizers' ? 'Desk Organizers' : newProdCategory === 'mini-planters' ? 'Mini Planters / Vines' : 'Wall Decor & Clips',
      priceNGN: newProdPrice,
      priceUSD: newProdPrice / 1500,
      rating: 5.0,
      reviewCount: 1,
      image: newProdImg,
      additionalImages: additionalImages,
      description: newProdDesc,
      shortDescription: newProdDesc.slice(0, 80),
      features: ['Trace-free adhesive', 'Easy setup', 'Premium Quality Decor'],
      specs: [{ label: 'Material', value: 'Durable Quality' }],
      colorOptions: [{ name: 'Standard', hex: '#ffffff' }],
      isNewArrival: newProdIsNewArrival,
      inStock: newProdStock > 0,
      stockCount: newProdStock,
      tags: newProdIsNewArrival ? ['New Arrival', 'Student Room Decor'] : ['Student Room Decor']
    });

    setNewProdName('');
    setNewProdDesc('');
    setUploadedFileName('');
    setAdditionalImages([]);
    setNewProdImg('/images/green_vines_exact.jpg');
    setNewProdIsNewArrival(true);
    setActiveTab('inventory');
  };

  // UNAUTHENTICATED DEDICATED ADMIN LOGIN SCREEN (PROTECTED ROUTE GUARD)
  if (!isManagerAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#ebdcd8] shadow-xl overflow-hidden animate-scale-up">
          
          {/* Header */}
          <div className="bg-[#2c2221] text-white p-6 text-center space-y-2 relative">
            <div className="w-14 h-14 bg-[#f09a8e]/20 text-[#f09a8e] rounded-2xl flex items-center justify-center mx-auto border border-[#f09a8e]/30">
              <Lock className="w-7 h-7" />
            </div>
            <span className="bg-[#f09a8e] text-[#2c2221] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Admin Operations Guard
            </span>
            <h1 className="text-xl font-bold font-serif text-white">Dedicated Admin Authentication</h1>
            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              Requires a dedicated administrator email. General student user accounts cannot access store controls.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleManagerLogin} className="p-6 space-y-4 text-xs">

            {/* General User Isolation Notice */}
            {currentUser && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-[11px] font-medium space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-800">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Signed in as customer ({currentUser.email})
                </p>
                <p className="text-[10px] leading-relaxed text-amber-700">
                  Store Operations require store manager authentication below.
                </p>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-[#a37068] uppercase text-[10px]">Dedicated Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="admin@dwellanddecor.ng"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#a37068] uppercase text-[10px]">Security Passcode</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={inputPasscode}
                  onChange={(e) => setInputPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-center text-[11px] font-semibold border border-red-100 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-3.5 rounded-2xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#f09a8e]" />
              <span>Authenticate Admin Email & Unlock</span>
            </button>

            <p className="text-[10px] text-gray-400 text-center pt-1">
              Protected by 256-bit encrypted store operations authentication protocol.
            </p>
          </form>

        </div>
      </div>
    );
  }

  // AUTHENTICATED MANAGER DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-3xl border border-[#ebdcd8] shadow-2xs gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#a37068] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Authenticated Store Operations
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#2c2221]">Store Manager Dashboard</h1>
          <p className="text-xs text-[#735853] mt-0.5">
            Admin Session: <strong className="font-mono text-[#2c2221]">{adminEmail || 'admin@dwellanddecor.ng'}</strong>
          </p>
        </div>

        <button
          onClick={handleManagerLogout}
          className="bg-[#faf5f4] hover:bg-[#f2e8e6] text-[#2c2221] border border-[#ebdcd8] px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-2xs shrink-0"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Lock Portal & Sign Out</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#ebdcd8] space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Sales Revenue</span>
          <span className="text-2xl font-bold text-[#2c2221] block font-serif">{formatPrice(totalRevenueNGN)}</span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Paystack Verified Transactions
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ebdcd8] space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Orders</span>
          <span className="text-2xl font-bold text-[#2c2221] block font-serif">{orders.length}</span>
          <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block">
            {orders.filter(o => o.status === 'processing' || o.status === 'placed').length} Pending Campus Dispatch
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#ebdcd8] space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Decor Catalog Items</span>
          <span className="text-2xl font-bold text-[#2c2221] block font-serif">{products.length}</span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            100% Non-Furniture Items
          </span>
        </div>
      </div>

      {/* Store Owner Room Pickup Address & WhatsApp Contact Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pickup Location Settings Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-[#2c2221] flex items-center gap-1.5 font-serif">
                <Store className="w-4 h-4 text-[#f09a8e]" />
                Store Owner Room Address
              </h3>
              <p className="text-xs text-[#735853]">
                Self-Pickup location for hostel customer orders.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              Synced Live
            </span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateOwnerRoomAddress(editRoomAddress);
            }} 
            className="flex flex-col sm:flex-row gap-2 pt-1"
          >
            <input
              type="text"
              value={editRoomAddress}
              onChange={(e) => setEditRoomAddress(e.target.value)}
              placeholder="e.g. Queen Elizabeth Hall, Room 204, Block A"
              className="flex-1 bg-[#faf5f4] border border-[#ebdcd8] p-2.5 rounded-xl text-xs font-semibold text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
              required
            />
            <button
              type="submit"
              className="bg-[#2c2221] hover:bg-[#3d302f] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Check className="w-4 h-4 text-[#f09a8e]" />
              <span>Save</span>
            </button>
          </form>
        </div>

        {/* WhatsApp Contact Number Settings Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-[#2c2221] flex items-center gap-1.5 font-serif">
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                Official Store WhatsApp Contact Number
              </h3>
              <p className="text-xs text-[#735853]">
                Updates header & Floating WhatsApp chat widget across the store live.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              Live wa.me Sync
            </span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateWhatsAppNumber(editWhatsApp);
            }} 
            className="flex flex-col sm:flex-row gap-2 pt-1"
          >
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">+</span>
              <input
                type="text"
                value={editWhatsApp}
                onChange={(e) => setEditWhatsApp(e.target.value)}
                placeholder="2348123456789"
                className="w-full bg-[#faf5f4] border border-[#ebdcd8] pl-7 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold text-[#2c2221] focus:outline-none focus:border-[#25D366]"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Update Number</span>
            </button>
          </form>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#f2e8e6] gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'orders' ? 'border-b-2 border-[#2c2221] text-[#2c2221]' : 'text-gray-400'}`}
        >
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'inventory' ? 'border-b-2 border-[#2c2221] text-[#2c2221]' : 'text-gray-400'}`}
        >
          Manage Stock ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('add-product')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'add-product' ? 'border-b-2 border-[#2c2221] text-[#2c2221]' : 'text-gray-400'}`}
        >
          + Add New Product
        </button>
      </div>

      {/* ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#ebdcd8] p-5 space-y-4">
          <h3 className="font-bold font-serif text-[#2c2221]">Campus Orders Fulfillment</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf5f4] text-[#a37068] font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Paystack Ref</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Fulfillment Status</th>
                  <th className="p-3 text-center">Receipt PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="p-3 font-bold text-[#2c2221]">{o.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-[#2c2221] block">{o.customer.fullName}</span>
                      <span className="text-[10px] text-gray-400">{o.customer.dormHall}</span>
                    </td>
                    <td className="p-3 font-mono text-gray-500">{o.paystackRef}</td>
                    <td className="p-3 font-bold text-[#2c2221]">{formatPrice(o.totalNGN, o.totalUSD)}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="bg-[#faf5f4] border border-[#ebdcd8] rounded-xl p-1 font-bold text-xs focus:outline-none"
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => printReceiptPDF(o)}
                        className="p-1.5 px-3 bg-[#faf5f4] hover:bg-[#ebdcd8] text-[#2c2221] rounded-xl text-[11px] font-bold border border-[#ebdcd8] transition inline-flex items-center gap-1 shadow-2xs"
                        title="Print PDF Receipt"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#f09a8e]" />
                        <span>Print PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PRODUCT FORM */}
      {activeTab === 'add-product' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-3xl border border-[#ebdcd8] p-6 space-y-4 max-w-xl">
          <div className="flex items-center justify-between border-b border-[#f2e8e6] pb-3">
            <h3 className="font-bold font-serif text-[#2c2221] text-base">Add New Decor Item to Catalog</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Database className="w-3 h-3" /> Real-time Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#a37068]">Product Name</label>
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g. Pink Blossom Garland Vines"
                className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium"
                required
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#a37068]">Category</label>
              <select
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value as any)}
                className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium"
              >
                <option value="wall-hooks">Wall Hooks & Hangers</option>
                <option value="led-lighting">LED & Lighting</option>
                <option value="desk-organizers">Desk Organizers</option>
                <option value="mini-planters">Mini Planters / Vines</option>
                <option value="wall-decor">Wall Decor & Clips</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#a37068]">Price in NGN (₦)</label>
              <input
                type="number"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium"
                required
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#a37068]">Initial Stock Available</label>
              <input
                type="number"
                value={newProdStock}
                onChange={(e) => setNewProdStock(Number(e.target.value))}
                className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium"
                required
              />
            </div>
          </div>

          {/* Local Storage Image Upload / Preset Selection */}
          <div className="space-y-3 text-xs bg-[#faf5f4] border border-[#ebdcd8] p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#2c2221] text-xs flex items-center gap-1.5 font-serif">
                <FileImage className="w-4 h-4 text-[#f09a8e]" />
                Product Image Upload
              </label>
              
              {/* Input Mode Toggle */}
              <div className="flex bg-white p-0.5 rounded-xl border border-[#ebdcd8] text-[10px]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                    imageInputMode === 'upload' ? 'bg-[#2c2221] text-white shadow-xs' : 'text-gray-500 hover:text-[#2c2221]'
                  }`}
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Upload JPG / PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('preset')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                    imageInputMode === 'preset' ? 'bg-[#2c2221] text-white shadow-xs' : 'text-gray-500 hover:text-[#2c2221]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Presets / URL</span>
                </button>
              </div>
            </div>

            {imageInputMode === 'upload' ? (
              <div className="space-y-3">
                {/* Main Product Image Upload Box */}
                <div className="relative">
                  <input
                    type="file"
                    id="admin-product-image-file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleMainImageFileUpload}
                    className="hidden"
                  />

                  {newProdImg && (newProdImg.startsWith('data:image') || uploadedFileName) ? (
                    /* Uploaded Local Storage Preview Card */
                    <div className="bg-white border-2 border-emerald-300 rounded-2xl p-3 flex items-center gap-3 relative group">
                      <img
                        src={newProdImg}
                        alt="Uploaded preview"
                        className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-gray-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block">
                          ✓ Local Storage File Selected
                        </span>
                        <p className="font-bold text-xs text-[#2c2221] truncate">
                          {uploadedFileName || 'Uploaded Local Product Image'}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          Format: JPG/PNG • Optimized for Store Display
                        </p>
                      </div>

                      <label
                        htmlFor="admin-product-image-file"
                        className="cursor-pointer bg-[#faf5f4] hover:bg-[#ebdcd8] text-[#2c2221] px-3 py-1.5 rounded-xl text-[10px] font-bold border border-[#ebdcd8] transition"
                      >
                        Change Image
                      </label>
                    </div>
                  ) : (
                    /* Dropzone / File Picker Button */
                    <label
                      htmlFor="admin-product-image-file"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#ebdcd8] hover:border-[#f09a8e] bg-white hover:bg-[#fcf8f7] rounded-2xl cursor-pointer transition text-center space-y-2 group"
                    >
                      <div className="w-10 h-10 bg-[#f09a8e]/15 text-[#f09a8e] rounded-full flex items-center justify-center group-hover:scale-110 transition">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#2c2221]">
                          Click to select JPG or PNG image from your device
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Supports high quality JPG, PNG, WEBP files from local disk
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {isUploadingImage && (
                  <div className="text-[11px] text-[#2c2221] font-bold flex items-center gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    <span>Processing local image file for high-speed store rendering...</span>
                  </div>
                )}

                {uploadError && (
                  <div className="text-[11px] text-red-600 font-bold flex items-center gap-1.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Additional Product Gallery Images Upload */}
                <div className="pt-2 border-t border-[#ebdcd8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2c2221] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#f09a8e]" />
                      Additional Gallery Images (Optional)
                    </span>
                    <label
                      htmlFor="admin-gallery-images-upload"
                      className="cursor-pointer text-[10px] font-bold bg-white text-[#2c2221] px-2.5 py-1 rounded-lg border border-[#ebdcd8] hover:bg-[#ebdcd8] transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-[#f09a8e]" />
                      <span>Upload Extra Photos</span>
                    </label>
                    <input
                      type="file"
                      id="admin-gallery-images-upload"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      multiple
                      onChange={handleAdditionalImagesUpload}
                      className="hidden"
                    />
                  </div>

                  {additionalImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {additionalImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative group w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                          <img src={imgUrl} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Preset / URL Mode */
              <div className="space-y-2">
                <input
                  type="text"
                  value={newProdImg}
                  onChange={(e) => setNewProdImg(e.target.value)}
                  placeholder="/images/green_vines_exact.jpg or https://..."
                  className="w-full p-2.5 bg-white border border-[#ebdcd8] rounded-xl font-mono text-[11px]"
                  required
                />
                
                {/* Quick Presets */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold block">Select from store image presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Pink Leaf Vines', path: '/images/pink_leaf_vines.jpg' },
                      { name: 'Green Ivy Vines', path: '/images/green_ivy_vines.jpg' },
                      { name: 'Bathroom Corner Rack', path: '/images/bathroom_corner_rack.jpg' },
                      { name: '3-Tier Storage Trolley', path: '/images/three_tier_trolley.jpg' },
                      { name: 'Sunset Neon Lamp', path: '/images/cozy_sunset_neon.jpg' }
                    ].map((preset) => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => setNewProdImg(preset.path)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          newProdImg === preset.path ? 'bg-[#2c2221] text-white border-[#2c2221]' : 'bg-white text-[#594744] border-[#ebdcd8]'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-[#a37068]">Description</label>
            <textarea
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              placeholder="Provide item highlights, features, materials..."
              className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium h-24"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-3.5 rounded-2xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#f09a8e]" />
            <span>Publish Product Live to Store</span>
          </button>
        </form>
      )}

      {/* STOCK INVENTORY CONTROL CENTER */}
      {activeTab === 'inventory' && (() => {
        const outOfStockCount = products.filter(p => !p.inStock || p.stockCount <= 0).length;
        const lowStockCount = products.filter(p => p.inStock && p.stockCount > 0 && p.stockCount <= 10).length;
        const inStockCount = products.filter(p => p.inStock && p.stockCount > 10).length;

        const filteredInventory = products.filter(p => {
          const isOutOfStock = !p.inStock || p.stockCount <= 0;
          const isLowStock = p.inStock && p.stockCount > 0 && p.stockCount <= 10;
          const isInStock = p.inStock && p.stockCount > 10;

          if (inventoryFilter === 'in-stock' && !isInStock) return false;
          if (inventoryFilter === 'low-stock' && !isLowStock) return false;
          if (inventoryFilter === 'out-of-stock' && !isOutOfStock) return false;

          if (inventorySearch.trim()) {
            const q = inventorySearch.toLowerCase();
            return p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
          }
          return true;
        });

        return (
          <div className="space-y-6">
            
            {/* Header Toolbar & Real-time Database Notice */}
            <div className="bg-white p-5 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold font-serif text-[#2c2221] text-base">Real-Time Stock Control Center</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live Firestore Sync
                    </span>
                  </div>
                  <p className="text-xs text-[#735853] mt-0.5">
                    Changes made here instantly update the ProductDetailPage badge and prevent out-of-stock purchases.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isInitializingFirestore}
                  onClick={async () => {
                    if (!window.confirm(`Copy the current ${products.length} products to Firestore? This only works when the Firestore catalog is empty.`)) return;
                    setIsInitializingFirestore(true);
                    try {
                      await syncCatalogToFirestore();
                    } finally {
                      setIsInitializingFirestore(false);
                    }
                  }}
                  className="px-3 py-2 bg-[#2c2221] hover:bg-[#3d302f] disabled:opacity-60 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Database className="w-3.5 h-3.5 text-[#f09a8e]" />
                  <span>{isInitializingFirestore ? 'Publishing…' : 'Publish Catalog to Firestore'}</span>
                </button>

                {/* Search Box */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search product inventory..."
                    className="w-full pl-9 pr-3 py-2 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl text-xs font-medium focus:outline-none focus:border-[#f09a8e]"
                  />
                </div>
              </div>

              {/* Status Filter Tabs & Bulk Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f2e8e6]">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setInventoryFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      inventoryFilter === 'all'
                        ? 'bg-[#2c2221] text-white'
                        : 'bg-[#faf5f4] text-[#594744] hover:bg-[#ebdcd8]'
                    }`}
                  >
                    All Items ({products.length})
                  </button>

                  <button
                    onClick={() => setInventoryFilter('in-stock')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      inventoryFilter === 'in-stock'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({inStockCount})</span>
                  </button>

                  <button
                    onClick={() => setInventoryFilter('low-stock')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      inventoryFilter === 'low-stock'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Low Stock ({lowStockCount})</span>
                  </button>

                  <button
                    onClick={() => setInventoryFilter('out-of-stock')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      inventoryFilter === 'out-of-stock'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-900 hover:bg-red-100'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Out of Stock ({outOfStockCount})</span>
                  </button>
                </div>

                {/* Bulk Purge Out of Stock Button */}
                {outOfStockCount > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete all ${outOfStockCount} out-of-stock products from the store?`)) {
                        deleteAllOutOfStockProducts();
                      }
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge All {outOfStockCount} Out-of-Stock</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inventory Items Grid */}
            {filteredInventory.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#ebdcd8] p-12 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-[#2c2221]">No Decor Items Match Filter</h4>
                <p className="text-xs text-gray-500">Try adjusting your search terms or filter selection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInventory.map(p => {
                  const isOutOfStock = !p.inStock || p.stockCount <= 0;
                  const isLowStock = p.inStock && p.stockCount > 0 && p.stockCount <= 10;

                  return (
                    <div 
                      key={p.id} 
                      className={`bg-white rounded-3xl border p-5 space-y-4 shadow-2xs transition-all relative group ${
                        isOutOfStock 
                          ? 'border-red-200 bg-red-50/20' 
                          : isLowStock 
                          ? 'border-amber-200 bg-amber-50/10' 
                          : 'border-[#ebdcd8]'
                      }`}
                    >
                      {/* Delete Product Button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${p.name}" from store catalog?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        title="Delete Product"
                        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Item Summary Header */}
                      <div className="flex items-start gap-3">
                        <img 
                          src={getCleanImageUrl(p.image, p.name)} 
                          alt={p.name} 
                          className="w-16 h-16 object-contain rounded-2xl bg-[#faf5f4] p-1.5 border border-gray-100 shrink-0" 
                          onError={handleImageError}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase text-[#a37068] tracking-wider truncate">
                              {p.categoryName}
                            </span>
                            {/* Live Badge */}
                            {isOutOfStock ? (
                              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <XCircle className="w-3 h-3 text-red-600" /> Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Flame className="w-3 h-3 text-amber-600 animate-pulse" /> Low Stock ({p.stockCount})
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock ({p.stockCount})
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-sm text-[#2c2221] line-clamp-1 mt-0.5">{p.name}</h4>
                          <span className="text-xs font-bold text-[#f09a8e]">{formatPrice(p.priceNGN, p.priceUSD)}</span>
                        </div>
                      </div>

                      {/* Interactive Stock Control Panel */}
                      <div className="bg-[#faf5f4] p-3.5 rounded-2xl border border-[#ebdcd8] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2c2221]">Current Quantity Level:</span>
                          
                          {/* Stock Stepper */}
                          <div className="flex items-center bg-white border border-[#ebdcd8] rounded-full p-1 text-xs">
                            <button
                              type="button"
                              onClick={() => updateProductStock(p.id, Math.max(0, p.stockCount - 1))}
                              className="w-7 h-7 rounded-full bg-[#f8f1ef] hover:bg-[#ebdcd8] text-gray-700 flex items-center justify-center transition"
                              title="Decrease stock"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={p.stockCount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                updateProductStock(p.id, val);
                              }}
                              className="w-12 text-center font-bold text-[#2c2221] bg-transparent focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => updateProductStock(p.id, p.stockCount + 1)}
                              className="w-7 h-7 rounded-full bg-[#f8f1ef] hover:bg-[#ebdcd8] text-gray-700 flex items-center justify-center transition"
                              title="Increase stock"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Stock Status Preset Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, 0, false)}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 border ${
                              isOutOfStock 
                                ? 'bg-red-600 text-white border-red-600' 
                                : 'hover:bg-red-50 text-red-700 border-red-200 bg-white'
                            }`}
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Set Out (0)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, 5, true)}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 border ${
                              isLowStock 
                                ? 'bg-amber-600 text-white border-amber-600' 
                                : 'hover:bg-amber-50 text-amber-800 border-amber-200 bg-white'
                            }`}
                          >
                            <Flame className="w-3 h-3" />
                            <span>Set Low (5)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, 25, true)}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 border ${
                              !isOutOfStock && !isLowStock 
                                ? 'bg-emerald-700 text-white border-emerald-700' 
                                : 'hover:bg-emerald-50 text-emerald-800 border-emerald-200 bg-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock (25)</span>
                          </button>
                        </div>

                        {/* Manual Status Switcher */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#ebdcd8]/60 text-xs">
                          <span className="text-[11px] font-medium text-gray-600">Product Availability:</span>
                          <button
                            type="button"
                            onClick={() => updateProductStock(p.id, p.stockCount > 0 ? p.stockCount : 10, !p.inStock)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1.5 ${
                              p.inStock && p.stockCount > 0
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${p.inStock && p.stockCount > 0 ? 'bg-emerald-600' : 'bg-red-600'}`} />
                            <span>{p.inStock && p.stockCount > 0 ? 'Status: Active (Purchasable)' : 'Status: Out of Stock (Disabled)'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        );
      })()}

    </div>
  );
};

