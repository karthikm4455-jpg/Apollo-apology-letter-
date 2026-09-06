import React, { useState } from 'react';
import { 
  ApologyRequest, 
  InfractionType, 
  RecruiterName 
} from '../types';
import { 
  INFRACTION_LABELS, 
  RECRUITERS 
} from '../data/initialData';
import { 
  Shield, 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Award,
  Users,
  ShieldAlert,
  Building
} from 'lucide-react';

interface AdminLettersViewProps {
  requests: ApologyRequest[];
  onOpenLetter: (req: ApologyRequest) => void;
  onOpenDetails: (req: ApologyRequest) => void;
}

export const AdminLettersView: React.FC<AdminLettersViewProps> = ({
  requests,
  onOpenLetter,
  onOpenDetails,
}) => {
  // Filters
  const [recruiterFilter, setRecruiterFilter] = useState<'all' | RecruiterName>('all');
  const [infractionFilter, setInfractionFilter] = useState<'all' | InfractionType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'cleared' | 'warning' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics
  const totalLetters = requests.length;
  const clearedLetters = requests.filter(r => r.status === 'accepted_cleared').length;
  const warningLetters = requests.filter(r => r.status === 'conditional_warning').length;
  const lateCount = requests.filter(r => r.infractionType === 'late_arrival').length;
  const leaveCount = requests.filter(r => r.infractionType === 'uninformed_leave').length;
  const misbehaviorCount = requests.filter(r => r.infractionType === 'training_hall_misbehavior').length;
  const lokeshLettersCount = requests.filter(r => r.assignedRecruiter === 'Lokesh' && r.clearanceDetails).length;
  const mayappaLettersCount = requests.filter(r => r.assignedRecruiter === 'Mayappa' && r.clearanceDetails).length;

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    if (recruiterFilter !== 'all' && req.assignedRecruiter !== recruiterFilter) return false;
    if (infractionFilter !== 'all' && req.infractionType !== infractionFilter) return false;
    if (statusFilter === 'cleared' && req.status !== 'accepted_cleared') return false;
    if (statusFilter === 'warning' && req.status !== 'conditional_warning') return false;
    if (statusFilter === 'pending' && req.status !== 'pending_review') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = req.employeeName.toLowerCase().includes(q);
      const matchId = req.employeeId.toLowerCase().includes(q);
      const matchBatch = req.nhtBatchCode.toLowerCase().includes(q);
      const matchRef = req.referenceNumber.toLowerCase().includes(q);
      const matchLetterRef = req.clearanceDetails?.letterReference.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchBatch && !matchRef && !matchLetterRef) return false;
    }

    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Reference Number',
      'Letter Reference',
      'Employee Name',
      'Employee ID',
      'Department',
      'NHT Batch Code',
      'Lead Trainer',
      'Training Hall',
      'Infraction Type',
      'Incident Date',
      'Status',
      'Assigned Recruiter',
      'Cleared Date',
      'Attendance Action'
    ];

    const rows = filteredRequests.map(r => [
      r.referenceNumber,
      r.clearanceDetails?.letterReference || 'Pending',
      `"${r.employeeName}"`,
      r.employeeId,
      `"${r.department}"`,
      r.nhtBatchCode,
      `"${r.trainerName}"`,
      `"${r.trainingHall}"`,
      r.infractionType,
      r.incidentDate,
      r.status,
      r.assignedRecruiter,
      r.clearanceDetails?.clearedDate || 'N/A',
      `"${r.clearanceDetails?.nhtAttendanceAction || 'In Review'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NHT_Apology_Letters_Audit_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Central NHT Apology Letters & Compliance Repository
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Global repository of all written apologies, disciplinary rulings, and official clearance letters signed by TA HR Recruiters <strong>Lokesh</strong> and <strong>Mayappa</strong>.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 self-start md:self-auto transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master Audit Register (CSV)</span>
          </button>
        </div>

        {/* Aggregate KPI Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-slate-500 font-medium">Total Letters</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{totalLetters}</div>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
            <span className="text-amber-800 font-medium">⏰ Late Arrivals</span>
            <div className="text-xl font-bold text-amber-900 mt-1">{lateCount}</div>
          </div>
          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/70">
            <span className="text-rose-800 font-medium">🚫 Uninformed Leaves</span>
            <div className="text-xl font-bold text-rose-900 mt-1">{leaveCount}</div>
          </div>
          <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/70">
            <span className="text-purple-800 font-medium">⚠️ Hall Misconduct</span>
            <div className="text-xl font-bold text-purple-900 mt-1">{misbehaviorCount}</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70">
            <span className="text-emerald-800 font-medium">Pardoned & Cleared</span>
            <div className="text-xl font-bold text-emerald-900 mt-1">{clearedLetters}</div>
          </div>
          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200/70">
            <span className="text-indigo-800 font-medium">Written Warnings</span>
            <div className="text-xl font-bold text-indigo-900 mt-1">{warningLetters}</div>
          </div>
        </div>

        {/* Recruiter Attribution Breakdown */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-4">
            <span>Letters Stamped by <strong>Lokesh</strong>: <span className="font-bold text-slate-900">{lokeshLettersCount}</span></span>
            <span>Letters Stamped by <strong>Mayappa</strong>: <span className="font-bold text-slate-900">{mayappaLettersCount}</span></span>
          </div>
          <div className="text-[11px] text-slate-400">
            All clearances verifiable via corporate seal hash
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Recruiter Filter */}
          <select
            value={recruiterFilter}
            onChange={(e) => setRecruiterFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="all">All TA Recruiters (Lokesh & Mayappa)</option>
            <option value="Lokesh">Lokesh (Manager - TA Recruitment)</option>
            <option value="Mayappa">Mayappa (Senior Manager - TA Recruitment)</option>
          </select>

          {/* Infraction Filter */}
          <select
            value={infractionFilter}
            onChange={(e) => setInfractionFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="all">All Infraction Types</option>
            <option value="late_arrival">⏰ Late Arrival</option>
            <option value="uninformed_leave">🚫 Uninformed Leave</option>
            <option value="training_hall_misbehavior">⚠️ Hall Misbehavior</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="all">All Resolution Statuses</option>
            <option value="cleared">✅ Pardoned & Cleared</option>
            <option value="warning">⚠️ First Written Warning</option>
            <option value="pending">⏳ Pending Review</option>
          </select>

        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search trainee, batch, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-indigo-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Letters Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Official NHT Apology & Clearance Letters ({filteredRequests.length})
          </h3>
          <span className="text-xs text-slate-500">Live Enterprise Register</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRequests.map(req => {
            const infraction = INFRACTION_LABELS[req.infractionType];
            const hasLetter = req.clearanceDetails !== undefined;

            return (
              <div
                key={req.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                {/* Left Block */}
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {req.referenceNumber}
                    </span>
                    {hasLetter && (
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {req.clearanceDetails?.letterReference}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full font-semibold border ${infraction.badgeColor}`}>
                      {infraction.title}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900">
                    {req.employeeName} <span className="font-normal text-slate-500">({req.employeeId})</span>
                  </div>

                  <div className="text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    <span>Batch: <strong>{req.nhtBatchCode}</strong></span>
                    <span>• Trainer: <strong>{req.trainerName}</strong></span>
                    <span>• Hall: <strong>{req.trainingHall}</strong></span>
                    <span>• Date: {req.incidentDate}</span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <strong>Incident:</strong> {req.specificIncidentSummary}
                  </div>

                  {hasLetter && (
                    <div className="bg-emerald-50/80 border border-emerald-200 p-2 rounded-lg text-[11px] text-emerald-950 flex items-start gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Ruling by {req.clearanceDetails?.clearedBy}:</strong> {req.clearanceDetails?.disciplinaryRemarks}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Block Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-shrink-0">
                  <div className="text-right sm:mr-3">
                    <div className="text-[11px] font-semibold text-slate-700">
                      Reviewer: {req.assignedRecruiter}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {req.clearanceDetails?.clearedDate ? `Signed ${req.clearanceDetails.clearedDate}` : 'Pending Sign-off'}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDetails(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>

                  {hasLetter && (
                    <button
                      onClick={() => onOpenLetter(req)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Official Letter</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
