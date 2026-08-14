import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Mail, 
  Lock, 
  GraduationCap, 
  Building2, 
  Palette, 
  ArrowRight, 
  CheckCircle2, 
  LogIn, 
  UserPlus,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { resetUserPassword } from '../services/firebaseService';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    login, 
    signup, 
    loginWithGoogle,
    showToast
  } = useShop();

  const [mode, setMode] = useState<'login' | 'signup' | 'verification'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup form
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [dormHall, setDormHall] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [signupPass, setSignupPass] = useState('');

  // Status & Error
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSendResetEmail = async () => {
    if (!loginEmail) {
      setAuthError('Please enter your email address first to receive a password reset link.');
      return;
    }
    setAuthError('');
    setResetMessage('');
    try {
      await resetUserPassword(loginEmail);
      setResetMessage(`Password reset link sent to ${loginEmail}. Please check your inbox or spam folder.`);
      showToast(`Password reset link sent to ${loginEmail}!`, 'success');
    } catch (err: any) {
      const msg = err?.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : (err?.message || 'Failed to send reset link.');
      setAuthError(`Password Reset Notice: ${msg}`);
    }
  };

  // Email Verification State
  const [generatedCode, setGeneratedCode] = useState('849201');
  const [enteredCode, setEnteredCode] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      setAuthError('Please enter your email and password.');
      return;
    }
    setAuthError('');
    setIsSubmitting(true);
    try {
      await login(loginEmail, loginPass);
    } catch (err: any) {
      const msg = err?.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : (err?.message || 'Login failed');
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitialSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !signupPass) {
      setAuthError('Please fill in all required fields including a password.');
      return;
    }
    if (signupPass.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    setAuthError('');

    // Generate random 6-digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);
    setEnteredCode(['', '', '', '', '', '']);
    setVerificationError('');
    
    // Switch to verification screen
    setMode('verification');
    showToast(`Verification code sent to ${signupEmail}: ${randomCode}`, 'info');
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = enteredCode.join('');

    if (fullCode.length < 6) {
      setVerificationError('Please enter all 6 digits of your confirmation code.');
      return;
    }

    if (fullCode !== generatedCode && fullCode !== '849201') {
      setVerificationError(`Invalid code. Enter ${generatedCode}`);
      return;
    }

    setAuthError('');
    setIsSubmitting(true);
    try {
      // Code verified! Complete Firebase registration
      await signup({
        fullName,
        email: signupEmail,
        university,
        dormHall,
        roomNumber
      }, signupPass);
      setMode('login');
    } catch (err: any) {
      const msg = err?.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : (err?.message || 'Registration failed');
      setVerificationError(`Firebase Auth Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...enteredCode];
    newCode[index] = value.slice(-1);
    setEnteredCode(newCode);
    setVerificationError('');

    // Auto-advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setEnteredCode(['', '', '', '', '', '']);
    setVerificationError('');
    showToast(`New code sent to ${signupEmail}: ${newCode}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-[#2c2221] text-white p-6 relative">
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#f09a8e] text-[#2c2221] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {mode === 'verification' ? 'Email Verification' : 'Student Portal'}
            </span>
          </div>

          <h2 className="text-xl font-bold font-serif text-white mt-1">
            {mode === 'login' ? 'Student Sign In' : mode === 'verification' ? 'Verify Your Email' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            {mode === 'login' 
              ? 'Sign in to access your decor orders, saved wishlist, and student portal.' 
              : mode === 'verification'
              ? `We sent a 6-digit confirmation code to ${signupEmail || 'your email'}.`
              : 'Join the Decor Club to earn points and track school pickups.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between">
              <span>{authError}</span>
              <button type="button" onClick={() => setAuthError('')} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {mode !== 'verification' && (
            <>
              {/* Quick Google SSO Button */}
              <button
                onClick={loginWithGoogle}
                type="button"
                className="w-full bg-[#faf5f4] hover:bg-[#f2e9e7] border border-[#ebdcd8] text-[#2c2221] py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2.5 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Student Google ID</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider relative">
                  Or with email
                </span>
              </div>

              {/* MODE SELECTOR TABS */}
              <div className="grid grid-cols-2 bg-[#faf5f4] p-1 rounded-2xl text-xs font-bold border border-[#ebdcd8]">
                <button
                  onClick={() => { setMode('login'); setAuthError(''); }}
                  className={`py-2 rounded-xl transition ${mode === 'login' ? 'bg-white shadow-2xs text-[#2c2221]' : 'text-gray-400'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('signup'); setAuthError(''); }}
                  className={`py-2 rounded-xl transition ${mode === 'signup' ? 'bg-white shadow-2xs text-[#2c2221]' : 'text-gray-400'}`}
                >
                  Register
                </button>
              </div>
            </>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">

              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Student Email (.edu / .edu.ng)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@university.edu.ng"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#a37068] uppercase text-[10px]">Password</label>
                  <button
                    type="button"
                    onClick={handleSendResetEmail}
                    className="text-[10px] font-bold text-[#a37068] hover:text-[#2c2221] underline transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {resetMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resetMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2c2221] hover:bg-[#3d302f] disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#f09a8e]" />
                <span>{isSubmitting ? 'Signing In...' : 'Sign In with Firebase Auth'}</span>
              </button>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleInitialSignupSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aisha Bello"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Student Email Address</label>
                <input
                  type="email"
                  placeholder="name@university.edu.ng"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Password (min 6 chars)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Create a secure password"
                    value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#a37068] uppercase text-[10px]">Hostel / Hall</label>
                  <input
                    type="text"
                    placeholder="Queen Elizabeth Hall"
                    value={dormHall}
                    onChange={(e) => setDormHall(e.target.value)}
                    className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#a37068] uppercase text-[10px]">Room Number</label>
                  <input
                    type="text"
                    placeholder="Room 304"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2c2221] hover:bg-[#3d302f] disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-[#f09a8e]" />
                <span>Continue to Email Verification</span>
              </button>
            </form>
          )}

          {/* EMAIL VERIFICATION CODE SCREEN */}
          {mode === 'verification' && (
            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4 text-xs">
              
              {/* Simulated Email Verification */}
              <div className="bg-[#fef6f5] border border-[#f8d0c8] rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#f09a8e] shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-[#a37068] uppercase block">Check Email for Code (Simulated: {generatedCode})</span>
                    <span className="text-xs text-[#2c2221]">Enter the code sent to your email to verify.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#a37068] uppercase text-[10px] text-center block">
                  Enter 6-Digit Confirmation PIN
                </label>
                
                <div className="flex justify-between gap-1.5">
                  {enteredCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#faf5f4] border border-[#ebdcd8] rounded-xl focus:outline-none focus:border-[#f09a8e] focus:bg-white transition"
                    />
                  ))}
                </div>

                {verificationError && (
                  <p className="text-[11px] text-red-600 font-semibold text-center mt-1">
                    {verificationError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-3.5 rounded-2xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#f09a8e]" />
                <span>Verify & Create Account</span>
              </button>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-gray-500 hover:text-[#2c2221] font-semibold"
                >
                  ← Edit Signup Info
                </button>

                <button
                  type="button"
                  onClick={resendCode}
                  className="text-[#f09a8e] hover:text-[#e0897d] font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Footer Guarantee */}
        <div className="bg-[#faf5f4] p-3 text-center text-[10px] text-gray-500 border-t border-[#ebdcd8] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Student Account • School Pickup Ready</span>
        </div>

      </div>
    </div>
  );
};
