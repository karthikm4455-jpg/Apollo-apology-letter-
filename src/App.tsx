/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ApologyRequest, 
  RecruiterName, 
  UserRole, 
  OfficialClearanceDetails,
  AuthSession
} from './types';
import { INITIAL_APOLOGY_REQUESTS, RECRUITERS, INFRACTION_LABELS } from './data/initialData';
import { Header } from './components/Header';
import { StaffView } from './components/StaffView';
import { RecruiterView } from './components/RecruiterView';
import { AdminLettersView } from './components/AdminLettersView';
import { LetterModal } from './components/LetterModal';
import { RequestDetailModal } from './components/RequestDetailModal';
import { ManagerLoginModal } from './components/ManagerLoginModal';

const STORAGE_KEY = 'APOLLO_NHT_APOLOGY_REQUESTS_V3';
const AUTH_SESSION_KEY = 'APOLLO_AUTH_SESSION_V4';

export default function App() {
  // Load requests from localStorage or fallback to starter data
  const [requests, setRequests] = useState<ApologyRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse stored requests', e);
    }
    return INITIAL_APOLOGY_REQUESTS;
  });

  // Auth Session: Approvers (Lokesh & Mayappa) or Admin. If null, user is in public Trainee/Staff mode (no login needed).
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_SESSION_KEY);
      if (saved) {
        const parsed: AuthSession = JSON.parse(saved);
        if (parsed && (parsed.role === 'manager' || parsed.role === 'admin')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read auth session', e);
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Role and Navigation
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (authSession?.role === 'manager') {
      return authSession.manager === 'Lokesh' ? 'recruiter_lokesh' : 'recruiter_mayappa';
    }
    if (authSession?.role === 'admin') {
      return 'admin';
    }
    return 'trainee';
  });

  const [activeView, setActiveView] = useState<'trainee' | 'recruiter' | 'admin'>(() => {
    if (authSession?.role === 'admin') return 'admin';
    if (authSession?.role === 'manager') return 'recruiter';
    return 'trainee';
  });

  const [activeRecruiter, setActiveRecruiter] = useState<RecruiterName>(() => {
    if (authSession?.role === 'manager') return authSession.manager;
    return 'Lokesh';
  });

  // Modals
  const [selectedLetterRequest, setSelectedLetterRequest] = useState<ApologyRequest | null>(null);
  const [selectedDetailRequest, setSelectedDetailRequest] = useState<ApologyRequest | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to persist requests', e);
    }
  }, [requests]);

  // Login & Session Management
  const handleAuthLogin = (session: AuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }

    if (session.role === 'manager') {
      setActiveRecruiter(session.manager);
      setCurrentRole(session.manager === 'Lokesh' ? 'recruiter_lokesh' : 'recruiter_mayappa');
      setActiveView('recruiter'); // Approvers only need to give approval
    } else {
      setCurrentRole('admin');
      setActiveView('admin'); // Admin sees all letters & compliance registry
    }
  };

  const handleLogout = () => {
    setAuthSession(null);
    setCurrentRole('trainee');
    setActiveView('trainee');
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchManager = (manager: RecruiterName) => {
    setActiveRecruiter(manager);
    if (authSession?.role === 'manager') {
      const profile = RECRUITERS[manager];
      const updated: AuthSession = {
        role: 'manager',
        manager,
        name: profile.name,
        title: profile.title,
        email: profile.email,
      };
      setAuthSession(updated);
      setCurrentRole(manager === 'Lokesh' ? 'recruiter_lokesh' : 'recruiter_mayappa');
      try {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 1. Trainee Submits New Apology Letter
  const handleSubmitRequest = (
    newReqData: Omit<ApologyRequest, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'notes' | 'status'>
  ) => {
    const nextNum = requests.length + 106;
    const reqId = `APL-2026-${String(nextNum).padStart(3, '0')}`;
    const nowStr = new Date().toISOString();
    const infractionInfo = INFRACTION_LABELS[newReqData.infractionType];

    const createdReq: ApologyRequest = {
      ...newReqData,
      id: reqId,
      referenceNumber: reqId,
      status: 'pending_review',
      createdAt: nowStr,
      updatedAt: nowStr,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: newReqData.employeeName,
          role: 'NHT Trainee',
          text: `Formal apology letter submitted for ${infractionInfo.title}. Addressed to TA HR Recruiter ${newReqData.assignedRecruiter}. Cause: "${newReqData.rootCauseReason.slice(0, 100)}..."`,
          date: new Date().toLocaleString()
        }
      ]
    };

    setRequests(prev => [createdReq, ...prev]);
  };

  // 2. Recruiter Approves Apology & Generates Official Clearance Letter
  const handleApproveRequest = (
    requestId: string,
    approver: RecruiterName,
    resolutionType: 'accepted_cleared' | 'conditional_warning',
    disciplinaryRemarks: string,
    attendanceAction: string,
    correctiveGuidance: string,
    probationImpact: string
  ) => {
    const approverProfile = RECRUITERS[approver];
    const letterCodeSuffix = approver.slice(0, 3).toUpperCase();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const letterReference = `NHT-APL-2026-${randomSeq}-${letterCodeSuffix}`;
    const sealCode = `SEAL-${letterCodeSuffix}-NHT-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const infractionInfo = INFRACTION_LABELS[req.infractionType];
      const isCleared = resolutionType === 'accepted_cleared';

      const formalLetterContent = `APOLLO PHARMACY LIMITED
OFFICIAL TALENT ACQUISITION & NEW HIRE TRAINING DISCIPLINARY CLEARANCE LETTER

Date: ${todayFormatted}
Reference: ${letterReference}
To: ${req.employeeName} (Employee ID: ${req.employeeId})
NHT Batch Code: ${req.nhtBatchCode} | Department: ${req.department}
Through: Lead Trainer ${req.trainerName} (Venue: ${req.trainingHall})

Subject: Formal Disciplinary Ruling & Apology Clearance for ${infractionInfo.title}

Dear ${req.employeeName},

The Talent Acquisition & New Hire Training Directorate at Apollo Pharmacy Limited has evaluated your written explanation, formal apology letter, and remedial commitments dated ${req.incidentDate} regarding the infraction summary noted below:

• Infraction Classification: ${infractionInfo.title}
• Occurrence Details: ${req.specificIncidentSummary}
• Date & Time: ${req.incidentDate} at ${req.incidentTime}
• Trainee Explanation: "${req.rootCauseReason}"
• Trainee Undertaking: "${req.correctiveCommitment}"

OFFICIAL DISCIPLINARY RULING:
${isCleared ? 'FULL PARDON & ATTENDANCE REGULARIZATION GRANTED' : 'CONDITIONAL CLEARANCE WITH FIRST WRITTEN WARNING'}

Recruiter Endorsement & Remarks:
"${disciplinaryRemarks}"

Binding Operational Terms:
1. NHT Attendance Action: ${attendanceAction}
2. Mandatory Trainee Directive: ${correctiveGuidance}
3. Training & File Record: ${probationImpact}

This document constitutes formal Talent Acquisition authorization for New Hire Training records at Apollo Pharmacy Limited, confirming that the disciplinary entry has been reviewed, counseled, and cleared under corporate guidelines.

Authorized by:
${approver}
${approverProfile.title}
Apollo Pharmacy Limited`;

      const clearanceDetails: OfficialClearanceDetails = {
        letterReference,
        clearedBy: approver,
        approverDesignation: approverProfile.title,
        clearedDate: todayFormatted,
        resolutionType,
        disciplinaryRemarks,
        formalLetterContent,
        stamped: true,
        officialSealNumber: sealCode,
        nhtAttendanceAction: attendanceAction,
        correctiveGuidance,
        probationImpact
      };

      const updatedNotes = [
        ...req.notes,
        {
          id: `note-${Date.now()}`,
          author: approver,
          role: approverProfile.title,
          text: `Apology reviewed and sanctioned (${resolutionType === 'accepted_cleared' ? 'Pardoned & Cleared' : 'First Written Warning'}). Official Letter issued: ${letterReference}. Remarks: "${disciplinaryRemarks}"`,
          date: new Date().toLocaleString()
        }
      ];

      return {
        ...req,
        status: resolutionType === 'accepted_cleared' ? ('accepted_cleared' as const) : ('conditional_warning' as const),
        clearanceDetails,
        notes: updatedNotes,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // 3. Recruiter Requests Clarification
  const handleRequestClarification = (requestId: string, note: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        status: 'clarification_requested' as const,
        clarificationNote: note,
        notes: [
          ...req.notes,
          {
            id: `note-${Date.now()}`,
            author: activeRecruiter,
            role: 'TA HR Recruiter',
            text: `Clarification Requested: "${note}"`,
            date: new Date().toLocaleString()
          }
        ],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // 4. Recruiter Rejects / Escalates Apology
  const handleRejectRequest = (requestId: string, reason: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        status: 'rejected_escalated' as const,
        rejectionReason: reason,
        notes: [
          ...req.notes,
          {
            id: `note-${Date.now()}`,
            author: activeRecruiter,
            role: 'TA HR Recruiter',
            text: `Apology Rejected / Escalated to Disciplinary Board. Reason: "${reason}"`,
            date: new Date().toLocaleString()
          }
        ],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // 5. Reassign Recruiter between Lokesh and Mayappa
  const handleReassignRecruiter = (requestId: string, newRecruiter: RecruiterName) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        assignedRecruiter: newRecruiter,
        notes: [
          ...req.notes,
          {
            id: `note-${Date.now()}`,
            author: activeRecruiter,
            role: 'TA HR Recruiter',
            text: `Apology review transferred from ${req.assignedRecruiter} to ${newRecruiter}.`,
            date: new Date().toLocaleString()
          }
        ],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // 6. Add Audit Note
  const handleAddNote = (requestId: string, text: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        notes: [
          ...req.notes,
          {
            id: `note-${Date.now()}`,
            author: currentRole === 'trainee' ? req.employeeName : (currentRole === 'admin' ? 'HR Administrator' : activeRecruiter),
            role: currentRole === 'trainee' ? 'NHT Trainee' : (currentRole === 'admin' ? 'HR Admin' : 'TA Recruiter'),
            text,
            date: new Date().toLocaleString()
          }
        ]
      };
    }));
  };

  // Counts for Badges
  const pendingCountLokesh = requests.filter(r => r.assignedRecruiter === 'Lokesh' && r.status === 'pending_review').length;
  const pendingCountMayappa = requests.filter(r => r.assignedRecruiter === 'Mayappa' && r.status === 'pending_review').length;
  const totalLettersCount = requests.filter(r => r.clearanceDetails !== undefined).length;

  // Role-based view enforcement
  // Staff only see trainee view.
  // Approvers (Lokesh & Mayappa) only see Give Approval Queue and Trainee Form.
  // Admin sees All Letters, Approvals oversight, and Trainee Form.
  let effectiveView: 'trainee' | 'recruiter' | 'admin' = 'trainee';
  if (authSession?.role === 'admin') {
    effectiveView = activeView;
  } else if (authSession?.role === 'manager') {
    effectiveView = activeView === 'admin' ? 'recruiter' : activeView;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation & Session Header */}
      <Header
        authSession={authSession}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onSwitchManager={handleSwitchManager}
        pendingCountLokesh={pendingCountLokesh}
        pendingCountMayappa={pendingCountMayappa}
        totalLettersCount={totalLettersCount}
        activeView={effectiveView}
        setActiveView={setActiveView}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {effectiveView === 'trainee' && (
          <StaffView
            requests={requests}
            onSubmitRequest={handleSubmitRequest}
            onOpenLetter={(req) => setSelectedLetterRequest(req)}
            onOpenDetails={(req) => setSelectedDetailRequest(req)}
          />
        )}

        {effectiveView === 'recruiter' && (
          <RecruiterView
            activeRecruiter={activeRecruiter}
            onSwitchRecruiter={handleSwitchManager}
            requests={requests}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onRequestClarification={handleRequestClarification}
            onReassignRecruiter={handleReassignRecruiter}
            onOpenLetter={(req) => setSelectedLetterRequest(req)}
            onOpenDetails={(req) => setSelectedDetailRequest(req)}
          />
        )}

        {effectiveView === 'admin' && (
          <AdminLettersView
            requests={requests}
            onOpenLetter={(req) => setSelectedLetterRequest(req)}
            onOpenDetails={(req) => setSelectedDetailRequest(req)}
          />
        )}

      </main>

      {/* Approver & Admin Sign In Modal */}
      <ManagerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleAuthLogin}
        pendingCountLokesh={pendingCountLokesh}
        pendingCountMayappa={pendingCountMayappa}
        totalLettersCount={totalLettersCount}
      />

      {/* Official Clearance Letter Modal (Printable & Exportable) */}
      <LetterModal
        request={selectedLetterRequest}
        onClose={() => setSelectedLetterRequest(null)}
      />

      {/* Apology Request Detail & Audit Trail Modal */}
      <RequestDetailModal
        request={selectedDetailRequest}
        currentRole={currentRole}
        onClose={() => setSelectedDetailRequest(null)}
        onOpenLetter={(req) => {
          setSelectedDetailRequest(null);
          setSelectedLetterRequest(req);
        }}
        onAddNote={handleAddNote}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700">NHT Training Apology & Clearance Desk</span> — Handling Late Arrivals, Uninformed Leaves & Training Hall Decorum with Recruiter Sign-off (Lokesh & Mayappa).
          </div>
          <div className="text-slate-400 text-[11px]">
            New Hire Training Regulations & Disciplinary Standard 2026
          </div>
        </div>
      </footer>

    </div>
  );
}
