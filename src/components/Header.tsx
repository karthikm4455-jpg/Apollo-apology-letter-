import React from 'react';
import { 
  UserCheck, 
  Shield, 
  FileText, 
  Lock, 
  LogOut, 
  ArrowRightLeft,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { RecruiterName, AuthSession } from '../types';
import { RECRUITERS } from '../data/initialData';
import { ApolloLogo } from './ApolloLogo';

interface HeaderProps {
  authSession: AuthSession | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onSwitchManager: (manager: RecruiterName) => void;
  pendingCountLokesh: number;
  pendingCountMayappa: number;
  totalLettersCount: number;
  activeView: 'trainee' | 'recruiter' | 'admin';
  setActiveView: (view: 'trainee' | 'recruiter' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  authSession,
  onOpenLoginModal,
  onLogout,
  onSwitchManager,
  pendingCountLokesh,
  pendingCountMayappa,
  totalLettersCount,
  activeView,
  setActiveView,
}) => {
  const isManager = authSession?.role === 'manager';
  const isAdmin = authSession?.role === 'admin';
  const currentManagerName = isManager ? authSession.manager : null;
  const currentManagerProfile = currentManagerName ? RECRUITERS[currentManagerName] : null;
  const currentPendingCount = currentManagerName === 'Lokesh' ? pendingCountLokesh : pendingCountMayappa;
  const totalPending = pendingCountLokesh + pendingCountMayappa;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      
      {/* 1. TOP SESSION BANNER FOR APPROVER (Lokesh or Mayappa) */}
      {isManager && currentManagerProfile && (
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Authenticated Approver:</span>
              <img 
                src={currentManagerProfile.avatar} 
                alt={currentManagerProfile.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-600"
              />
              <span className="font-bold text-white">
                {currentManagerProfile.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Approver • {currentManagerProfile.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline text-[11px]">Switch Approver:</span>
              
              {currentManagerName === 'Lokesh' ? (
                <button
                  id="switch-to-mayappa-header-btn"
                  onClick={() => onSwitchManager('Mayappa')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                  title="Switch to Mayappa's approval queue"
                >
                  <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
                  <span>Switch to Mayappa</span>
                  {pendingCountMayappa > 0 && (
                    <span className="bg-amber-400 text-slate-950 font-bold px-1 rounded-full text-[10px]">
                      {pendingCountMayappa}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  id="switch-to-lokesh-header-btn"
                  onClick={() => onSwitchManager('Lokesh')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                  title="Switch to Lokesh's approval queue"
                >
                  <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                  <span>Switch to Lokesh</span>
                  {pendingCountLokesh > 0 && (
                    <span className="bg-amber-400 text-slate-950 font-bold px-1 rounded-full text-[10px]">
                      {pendingCountLokesh}
                    </span>
                  )}
                </button>
              )}

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                id="approver-logout-btn"
                onClick={onLogout}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/40 transition-colors flex items-center gap-1.5"
                title="Sign out to return to staff view"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOP SESSION BANNER FOR ADMIN */}
      {isAdmin && (
        <div className="bg-indigo-950 text-indigo-100 px-4 py-2 text-xs border-b border-indigo-900">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-indigo-300">Master Administrator:</span>
              <span className="font-bold text-white">
                HR Central Compliance Admin
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                admin@apollopharmacy.org
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="admin-logout-btn"
                onClick={onLogout}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/40 transition-colors flex items-center gap-1.5"
                title="Sign out to return to staff view"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <ApolloLogo className="h-9 sm:h-11 w-auto" />
            <div className="hidden sm:block h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  NHT Compliance Portal
                </h1>
                <p className="text-[11px] text-slate-500 mt-1">
                  Apollo Pharmacy Limited • New Hire Training Attendance & Decorum Desk
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            
            {/* APPROVER VIEW: Mayappa & Lokesh ONLY NEED TO GIVE APPROVAL */}
            {isManager && (
              <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  id="nav-recruiter-view-btn"
                  onClick={() => setActiveView('recruiter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                    activeView === 'recruiter'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Give clearance & approve apology letters"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Give Approval Queue</span>
                  {currentPendingCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {currentPendingCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-trainee-preview-btn"
                  onClick={() => setActiveView('trainee')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeView === 'trainee'
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View what trainees see when submitting apologies"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trainee Form</span>
                </button>
              </nav>
            )}

            {/* ADMIN VIEW: Master Compliance, All Letters, Oversight */}
            {isAdmin && (
              <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  id="nav-admin-view-btn"
                  onClick={() => setActiveView('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeView === 'admin'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>All Letters ({totalLettersCount})</span>
                </button>

                <button
                  id="nav-admin-approvals-btn"
                  onClick={() => setActiveView('recruiter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeView === 'recruiter'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Inspect pending review queues"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approvals Queue</span>
                  {totalPending > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {totalPending}
                    </span>
                  )}
                </button>

                <button
                  id="nav-admin-trainee-form-btn"
                  onClick={() => setActiveView('trainee')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeView === 'trainee'
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View trainee apology form"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trainee Form</span>
                </button>
              </nav>
            )}

            {/* PUBLIC STAFF VIEW (No Login Required) */}
            {!authSession && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Staff / Trainee Form • <strong>No Login Required</strong></span>
                </div>

                {/* Sign In Button for Approvers & Admin */}
                <button
                  id="open-login-modal-btn"
                  onClick={onOpenLoginModal}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 hover:shadow-sm"
                  title="Approver & Admin Sign In"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Approver / Admin Sign In</span>
                  {totalPending > 0 && (
                    <span className="bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                      {totalPending}
                    </span>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
