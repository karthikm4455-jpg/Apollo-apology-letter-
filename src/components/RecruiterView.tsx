import React, { useState } from 'react';
import { 
  ApologyRequest, 
  RecruiterName, 
  InfractionType 
} from '../types';
import { 
  RECRUITERS, 
  INFRACTION_LABELS 
} from '../data/initialData';
import { 
  UserCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  Eye, 
  ArrowRightLeft, 
  Paperclip, 
  Filter, 
  ShieldAlert, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface RecruiterViewProps {
  activeRecruiter: RecruiterName;
  onSwitchRecruiter: (recruiter: RecruiterName) => void;
  requests: ApologyRequest[];
  onApproveRequest: (
    requestId: string,
    approver: RecruiterName,
    resolutionType: 'accepted_cleared' | 'conditional_warning',
    disciplinaryRemarks: string,
    attendanceAction: string,
    correctiveGuidance: string,
    probationImpact: string
  ) => void;
  onRejectRequest: (requestId: string, reason: string) => void;
  onRequestClarification: (requestId: string, note: string) => void;
  onReassignRecruiter: (requestId: string, newRecruiter: RecruiterName) => void;
  onOpenLetter: (req: ApologyRequest) => void;
  onOpenDetails: (req: ApologyRequest) => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  activeRecruiter,
  onSwitchRecruiter,
  requests,
  onApproveRequest,
  onRejectRequest,
  onRequestClarification,
  onReassignRecruiter,
  onOpenLetter,
  onOpenDetails,
}) => {
  const profile = RECRUITERS[activeRecruiter];

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'cleared' | 'clarification'>('all');
  const [infractionFilter, setInfractionFilter] = useState<'all' | InfractionType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Active Decision Modal State
  const [decisionModalRequest, setDecisionModalRequest] = useState<ApologyRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'accepted_cleared' | 'conditional_warning'>('accepted_cleared');
  const [disciplinaryRemarks, setDisciplinaryRemarks] = useState('');
  const [attendanceAction, setAttendanceAction] = useState('Pardoned and regularized; no payroll deduction');
  const [correctiveGuidance, setCorrectiveGuidance] = useState('Report 15 minutes before 09:00 AM classroom lockout');
  const [probationImpact, setProbationImpact] = useState('Clean slate maintained on training file upon 100% completion of remaining modules');

  // Clarification / Rejection modals
  const [clarificationModalReq, setClarificationModalReq] = useState<ApologyRequest | null>(null);
  const [clarificationNote, setClarificationNote] = useState('');
  
  const [rejectionModalReq, setRejectionModalReq] = useState<ApologyRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter requests for active recruiter
  const recruiterRequests = requests.filter(req => req.assignedRecruiter === activeRecruiter);

  const filteredRequests = recruiterRequests.filter(req => {
    // Status filter
    if (statusFilter === 'pending' && req.status !== 'pending_review') return false;
    if (statusFilter === 'cleared' && req.status !== 'accepted_cleared' && req.status !== 'conditional_warning') return false;
    if (statusFilter === 'clarification' && req.status !== 'clarification_requested') return false;

    // Infraction filter
    if (infractionFilter !== 'all' && req.infractionType !== infractionFilter) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = req.employeeName.toLowerCase().includes(q);
      const matchId = req.employeeId.toLowerCase().includes(q);
      const matchBatch = req.nhtBatchCode.toLowerCase().includes(q);
      const matchTrainer = req.trainerName.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchBatch && !matchTrainer) return false;
    }

    return true;
  });

  const pendingCount = recruiterRequests.filter(r => r.status === 'pending_review').length;
  const clearedCount = recruiterRequests.filter(r => r.status === 'accepted_cleared' || r.status === 'conditional_warning').length;

  const openApproveModal = (req: ApologyRequest) => {
    setDecisionModalRequest(req);
    if (req.infractionType === 'late_arrival') {
      setDecisionType('accepted_cleared');
      setDisciplinaryRemarks(`First-time late arrival of ${req.delayMinutes || 30} mins pardoned upon review of transit circumstances. Trainee has compensated with Lead Trainer.`);
      setAttendanceAction('Pardoned and regularized; no payroll deduction applied');
      setCorrectiveGuidance('Trainee must arrive 15 minutes before 09:00 AM classroom lockout daily');
      setProbationImpact('Clean slate maintained on training file upon 100% attendance during next 14 days');
    } else if (req.infractionType === 'uninformed_leave') {
      setDecisionType('accepted_cleared');
      setDisciplinaryRemarks('Emergency medical absence pardoned upon verification of clinical documentation. Backfill homework completed with trainer.');
      setAttendanceAction('Leave regularized on compassionate grounds; compensatory assessment passed');
      setCorrectiveGuidance('Emergency portal contact protocol must be strictly observed in any future contingency');
      setProbationImpact('Regularized on NHT attendance ledger');
    } else {
      setDecisionType('conditional_warning');
      setDisciplinaryRemarks('Training hall decorum breach reviewed. Apology accepted with First Written Warning. 30-day heightened supervision applied.');
      setAttendanceAction('First Written Warning endorsed; conditional continuation permitted');
      setCorrectiveGuidance('Mandatory mobile device surrender in classroom lockbox prior to 08:50 AM daily');
      setProbationImpact('First written warning logged on file; any subsequent misconduct will lead to termination');
    }
  };

  const handleConfirmDecision = () => {
    if (!decisionModalRequest) return;
    onApproveRequest(
      decisionModalRequest.id,
      activeRecruiter,
      decisionType,
      disciplinaryRemarks,
      attendanceAction,
      correctiveGuidance,
      probationImpact
    );
    setDecisionModalRequest(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Recruiter Header & Profile Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {profile.name} — TA HR Recruiter Clearance Desk
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {profile.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.title} • {profile.email} • Domain: <span className="font-medium text-slate-700">{profile.nhtDomain}</span>
              </p>
            </div>
          </div>

          {/* Quick Toggle between Lokesh and Mayappa */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-medium px-2">Recruiter:</span>
            <button
              id="switch-to-lokesh-btn"
              onClick={() => onSwitchRecruiter('Lokesh')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRecruiter === 'Lokesh'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white/70'
              }`}
            >
              <span>Lokesh (Tech)</span>
              {requests.filter(r => r.assignedRecruiter === 'Lokesh' && r.status === 'pending_review').length > 0 && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
                  {requests.filter(r => r.assignedRecruiter === 'Lokesh' && r.status === 'pending_review').length}
                </span>
              )}
            </button>
            <button
              id="switch-to-mayappa-btn"
              onClick={() => onSwitchRecruiter('Mayappa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRecruiter === 'Mayappa'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white/70'
              }`}
            >
              <span>Mayappa (Ops)</span>
              {requests.filter(r => r.assignedRecruiter === 'Mayappa' && r.status === 'pending_review').length > 0 && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
                  {requests.filter(r => r.assignedRecruiter === 'Mayappa' && r.status === 'pending_review').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-xs text-slate-500 font-medium">Total Queue (Assigned)</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{recruiterRequests.length}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80">
            <div className="text-xs text-amber-800 font-medium">Pending Review</div>
            <div className="text-xl font-bold text-amber-900 mt-0.5">{pendingCount}</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/80">
            <div className="text-xs text-emerald-800 font-medium">Cleared / Letters Issued</div>
            <div className="text-xl font-bold text-emerald-900 mt-0.5">{clearedCount}</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200/80">
            <div className="text-xs text-indigo-800 font-medium">Digital Signature Stamp</div>
            <div className="text-[11px] font-mono font-semibold text-indigo-900 mt-1 truncate">
              {profile.signatureStamp}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded font-medium ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              All ({recruiterRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded font-medium ${statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'}`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('cleared')}
              className={`px-2.5 py-1 rounded font-medium ${statusFilter === 'cleared' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
            >
              Cleared ({clearedCount})
            </button>
          </div>

          {/* Infraction Category Filter */}
          <select
            value={infractionFilter}
            onChange={(e) => setInfractionFilter(e.target.value as any)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="all">All Infraction Categories</option>
            <option value="late_arrival">⏰ Late Arrival</option>
            <option value="uninformed_leave">🚫 Uninformed Leave</option>
            <option value="training_hall_misbehavior">⚠️ Hall Misbehavior</option>
          </select>

        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search by trainee, batch, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Apology Requests Queue */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Apology Letters In This Filter</h3>
          <p className="text-xs text-slate-500 mt-1">
            All submitted apologies assigned to {activeRecruiter} matching your filter have been addressed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const infraction = INFRACTION_LABELS[req.infractionType];
            const isPending = req.status === 'pending_review';
            const isCleared = req.status === 'accepted_cleared' || req.status === 'conditional_warning';

            return (
              <div
                key={req.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-4 ${
                  isPending ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                }`}
              >
                
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {req.referenceNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${infraction.badgeColor}`}>
                      {infraction.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {req.employeeName} ({req.employeeId})
                    </span>
                    <span className="text-xs text-slate-500">
                      • Batch: <strong className="text-slate-700">{req.nhtBatchCode}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'pending_review' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Needs Your Review</span>
                      </span>
                    )}
                    {req.status === 'accepted_cleared' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pardon & Clearance Issued</span>
                      </span>
                    )}
                    {req.status === 'conditional_warning' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cleared with 1st Warning</span>
                      </span>
                    )}
                    {req.status === 'clarification_requested' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Clarification Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                  
                  {/* Left Column: Infraction & Explanation */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="font-semibold text-slate-900 text-xs flex items-center justify-between">
                        <span>Incident: {req.specificIncidentSummary}</span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          {req.incidentDate} at {req.incidentTime}
                        </span>
                      </div>
                      
                      {req.infractionType === 'late_arrival' && (
                        <div className="text-[11px] text-amber-900 font-medium">
                          ⏰ Tardiness: <strong>{req.delayMinutes} minutes late</strong> past 09:00 AM lockout
                        </div>
                      )}
                      {req.infractionType === 'uninformed_leave' && (
                        <div className="text-[11px] text-rose-900 font-medium">
                          🚫 Uninformed Absence: <strong>{req.missedDaysCount} training day(s)</strong> unexcused
                        </div>
                      )}
                      {req.infractionType === 'training_hall_misbehavior' && (
                        <div className="text-[11px] text-purple-900 font-medium">
                          ⚠️ Hall Infraction: <strong>{req.misbehaviorCategory?.replace(/_/g, ' ').toUpperCase()}</strong>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-700 pt-1 border-t border-slate-200">
                        <strong>Trainee's Reason:</strong> "{req.rootCauseReason}"
                      </div>
                      <div className="text-[11px] text-emerald-800 font-medium">
                        <strong>Remedial Pledge:</strong> "{req.correctiveCommitment}"
                      </div>
                    </div>

                    {/* Attached Verification Proofs */}
                    {req.attachments.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-600">Attached Proofs:</span>
                        {req.attachments.map(att => (
                          <span
                            key={att.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] border border-slate-200"
                          >
                            <Paperclip className="w-3 h-3 text-slate-500" />
                            <span>{att.name}</span>
                            <span className="text-slate-400 text-[10px]">({att.size})</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Formal Letter Preview Accordion or Excerpt */}
                    <div className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono leading-relaxed max-h-32 overflow-y-auto border border-slate-800">
                      <div className="text-slate-400 font-bold mb-1 text-[10px]">
                        TRAINEE'S FORMAL APOLOGY LETTER EXCERPT:
                      </div>
                      {req.formalLetterBody}
                    </div>
                  </div>

                  {/* Right Column: Instructor & Academic Info */}
                  <div className="lg:col-span-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-600">
                    <div className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1.5">
                      Classroom & Training Registry
                    </div>
                    <div><strong>Lead Instructor:</strong> {req.trainerName}</div>
                    <div><strong>Venue:</strong> {req.trainingHall}</div>
                    <div><strong>Department:</strong> {req.department}</div>
                    <div><strong>Contact:</strong> {req.employeeEmail}</div>
                    <div><strong>Phone:</strong> {req.employeePhone}</div>
                    <div><strong>Code of Conduct Pledge:</strong> {req.acknowledgedCodeOfConduct ? '✅ Acknowledged' : '❌ Pending'}</div>

                    {/* Reassign Recruiter Shortcut */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Reassign:</span>
                      <button
                        onClick={() => onReassignRecruiter(req.id, activeRecruiter === 'Lokesh' ? 'Mayappa' : 'Lokesh')}
                        className="text-[11px] font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                        <span>Transfer to {activeRecruiter === 'Lokesh' ? 'Mayappa' : 'Lokesh'}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDetails(req)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Audit & History ({req.notes.length})</span>
                    </button>

                    {isCleared && req.clearanceDetails && (
                      <button
                        onClick={() => onOpenLetter(req)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Stamped Official Letter</span>
                      </button>
                    )}
                  </div>

                  {/* Recruiter Decision Buttons */}
                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setClarificationModalReq(req);
                          setClarificationNote('Please submit the clinic prescription / trainer confirmation note before clearance can be authorized.');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        Request Clarification
                      </button>

                      <button
                        onClick={() => {
                          setRejectionModalReq(req);
                          setRejectionReason('Trainee failed to provide valid cause for unnotified absence; referred to Disciplinary Committee.');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                      >
                        Escalate / Reject
                      </button>

                      <button
                        onClick={() => openApproveModal(req)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept & Issue Clearance Letter</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Decision / Approval Modal */}
      {decisionModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Grant Formal Apology Acceptance & Official Clearance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trainee: <strong>{decisionModalRequest.employeeName}</strong> ({decisionModalRequest.employeeId}) • Batch: {decisionModalRequest.nhtBatchCode}
                </p>
              </div>
              <button
                onClick={() => setDecisionModalRequest(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Decision Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Official HR Decision Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setDecisionType('accepted_cleared')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    decisionType === 'accepted_cleared'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pardon & Full Regularization</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Accept apology with counseling; clean slate retained with no payroll deduction.
                  </div>
                </div>

                <div
                  onClick={() => setDecisionType('conditional_warning')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    decisionType === 'conditional_warning'
                      ? 'border-amber-600 bg-amber-50 text-amber-950'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Conditional (First Written Warning)</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Accept apology on strict conditional probation with official written warning.
                  </div>
                </div>
              </div>
            </div>

            {/* Disciplinary Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Recruiter Clearance Remarks (Included in Corporate Letter) *
              </label>
              <textarea
                rows={3}
                value={disciplinaryRemarks}
                onChange={(e) => setDisciplinaryRemarks(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:outline-emerald-600 leading-relaxed"
              />
            </div>

            {/* Attendance & Payroll Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  NHT Attendance Action *
                </label>
                <input
                  type="text"
                  value={attendanceAction}
                  onChange={(e) => setAttendanceAction(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Corrective Guidance for Trainee *
                </label>
                <input
                  type="text"
                  value={correctiveGuidance}
                  onChange={(e) => setCorrectiveGuidance(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Digital Stamp Sign-off Badge */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Signing Authority: {activeRecruiter}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Digital Seal: <code className="font-mono text-emerald-700 font-bold">{profile.signatureStamp}</code>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Auto-Stamped Upon Approval</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDecisionModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate & Affix Official Clearance Letter</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Clarification Modal */}
      {clarificationModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Request Clarification from Trainee
            </h3>
            <p className="text-xs text-slate-500">
              Specify what additional document or explanation is needed from {clarificationModalReq.employeeName}.
            </p>
            <textarea
              rows={3}
              value={clarificationNote}
              onChange={(e) => setClarificationNote(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-blue-600"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setClarificationModalReq(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRequestClarification(clarificationModalReq.id, clarificationNote);
                  setClarificationModalReq(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Send Clarification Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection / Escalation Modal */}
      {rejectionModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Escalate to NHT Disciplinary Committee
            </h3>
            <p className="text-xs text-slate-500">
              Document reasons why this apology is rejected or escalated to HR operations.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-rose-600"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalReq(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRejectRequest(rejectionModalReq.id, rejectionReason);
                  setRejectionModalReq(null);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
