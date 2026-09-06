import React, { useState } from 'react';
import { 
  Lock, 
  UserCheck, 
  X, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  Info,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { RecruiterName, AuthSession } from '../types';
import { RECRUITERS } from '../data/initialData';
import { ApolloLogo } from './ApolloLogo';

interface ManagerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: AuthSession) => void;
  pendingCountLokesh: number;
  pendingCountMayappa: number;
  totalLettersCount: number;
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  pendingCountLokesh,
  pendingCountMayappa,
  totalLettersCount,
}) => {
  const [authCategory, setAuthCategory] = useState<'approver' | 'admin'>('approver');
  
  // Credentials Form State - Start empty without pre-filled values
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleApproverOneClick = (manager: RecruiterName) => {
    const profile = RECRUITERS[manager];
    onLogin({
      role: 'manager',
      manager,
      name: profile.name,
      title: profile.title,
      email: profile.email,
    });
    onClose();
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const idClean = loginId.trim().toLowerCase();
    const pwClean = password.trim();

    if (!idClean || !pwClean) {
      setErrorMessage('Please enter both Login ID and Password.');
      return;
    }

    // 1. Check Admin Login - Accepts Admin ID & Password
    if (
      idClean === 'admin' || 
      idClean === 'admin@apollopharmacy.org' || 
      idClean === 'compliance.admin' ||
      idClean.startsWith('admin')
    ) {
      if (pwClean.length >= 1) {
        onLogin({
          role: 'admin',
          name: 'HR Central Compliance Admin',
          title: 'Administrator - NHT Disciplinary & Compliance Desk',
          email: idClean.includes('@') ? idClean : 'admin@apollopharmacy.org',
        });
        onClose();
        return;
      } else {
        setErrorMessage('Please enter your Admin password.');
        return;
      }
    }

    // 2. Check Lokesh Approver
    if (
      idClean === 'lokesh' || 
      idClean === 'lokesh.ta' || 
      idClean === 'lokesh.ta@apollopharmacy.org'
    ) {
      if (pwClean.length >= 1) {
        const profile = RECRUITERS.Lokesh;
        onLogin({
          role: 'manager',
          manager: 'Lokesh',
          name: profile.name,
          title: profile.title,
          email: profile.email,
        });
        onClose();
        return;
      } else {
        setErrorMessage('Please enter your password for Lokesh.');
        return;
      }
    }

    // 3. Check Mayappa Approver
    if (
      idClean === 'mayappa' || 
      idClean === 'mayappa.hr' || 
      idClean === 'mayappa.hr@apollopharmacy.org' ||
      idClean === 'mayappa.ta@apollopharmacy.org'
    ) {
      if (pwClean.length >= 1) {
        const profile = RECRUITERS.Mayappa;
        onLogin({
          role: 'manager',
          manager: 'Mayappa',
          name: profile.name,
          title: profile.title,
          email: profile.email,
        });
        onClose();
        return;
      } else {
        setErrorMessage('Please enter your password for Mayappa.');
        return;
      }
    }

    setErrorMessage('Unrecognized Login ID. Please verify your approver or administrator credentials.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close modal and return to staff form"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <ApolloLogo className="h-8 w-auto filter brightness-0 invert" />
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold tracking-wide uppercase">
              Management & Admin Portal
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            NHT Disciplinary Desk Sign In
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Separate access portals for <strong>Approving Managers (Lokesh & Mayappa)</strong> and <strong>Central Administrator</strong>.
          </p>
        </div>

        {/* Notice for Staff / Trainees */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="text-xs text-emerald-900 leading-snug">
            <span className="font-bold">Staff / Trainee:</span> No login required to fill and submit apology letters!
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">

          {/* Portal Switcher: Approvers vs Admin */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              id="tab-approvers-btn"
              onClick={() => {
                setAuthCategory('approver');
                setLoginId('');
                setPassword('');
                setErrorMessage('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authCategory === 'approver'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Approver (Mayappa & Lokesh)</span>
            </button>

            <button
              type="button"
              id="tab-admin-btn"
              onClick={() => {
                setAuthCategory('admin');
                setLoginId('');
                setPassword('');
                setErrorMessage('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authCategory === 'admin'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Admin (All Letters)</span>
            </button>
          </div>

          {/* SECTION 1: APPROVER LOGINS (MAYAPPA & LOKESH) */}
          {authCategory === 'approver' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Approver to Sign In:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Scope: Review & Approval Only
                </span>
              </div>

              {/* Lokesh Card */}
              <div 
                id="login-lokesh-card"
                onClick={() => handleApproverOneClick('Lokesh')}
                className="group p-3.5 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center gap-3.5 bg-white shadow-2xs"
              >
                <img
                  src={RECRUITERS.Lokesh.avatar}
                  alt="Lokesh"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 group-hover:border-emerald-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-950">
                      Lokesh
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Manager – TA
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate font-mono text-[11px]">
                    lokesh.ta@apollopharmacy.org
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>Pending for review:</span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full text-[10px]">
                      {pendingCountLokesh}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mayappa Card */}
              <div 
                id="login-mayappa-card"
                onClick={() => handleApproverOneClick('Mayappa')}
                className="group p-3.5 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all cursor-pointer flex items-center gap-3.5 bg-white shadow-2xs"
              >
                <img
                  src={RECRUITERS.Mayappa.avatar}
                  alt="Mayappa"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 group-hover:border-indigo-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-950">
                      Mayappa
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      Senior Manager – TA
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate font-mono text-[11px]">
                    mayappa.hr@apollopharmacy.org
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>Pending for review:</span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full text-[10px]">
                      {pendingCountMayappa}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: ADMIN LOGIN (ALL LETTERS & CENTRAL COMPLIANCE) */}
          {authCategory === 'admin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Admin Sign In:
                </span>
                <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Full Authority
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900">
                    Central NHT Compliance Administrator
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Please enter your Administrator credentials below to access all archived records ({totalLettersCount} total letters) and regulatory oversight controls.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Credential Sign In Form */}
          <div className="border-t border-slate-200 pt-4">
            <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>{authCategory === 'admin' ? 'Enter Admin Credentials' : 'Sign In with Credentials'}</span>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {authCategory === 'admin' ? 'Admin Login ID / Email' : 'Login ID / Email Address'}
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={authCategory === 'admin' ? "Enter Admin ID (e.g. admin)" : "e.g. lokesh.ta@apollopharmacy.org"}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-blue-600 pr-10 font-mono"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{authCategory === 'admin' ? 'Verify & Sign In as Admin' : 'Verify & Sign In'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            NHT Disciplinary & Clearance Module • Apollo 2026
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel & Return to Staff Form
          </button>
        </div>

      </div>
    </div>
  );
};
