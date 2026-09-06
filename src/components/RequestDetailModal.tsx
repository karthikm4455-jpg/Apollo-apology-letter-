import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  Send,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Building,
  Award,
  ShieldAlert
} from 'lucide-react';
import { ApologyRequest, UserRole } from '../types';
import { INFRACTION_LABELS, RECRUITERS } from '../data/initialData';

interface RequestDetailModalProps {
  request: ApologyRequest | null;
  currentRole: UserRole;
  onClose: () => void;
  onOpenLetter: (request: ApologyRequest) => void;
  onAddNote: (requestId: string, text: string) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  currentRole,
  onClose,
  onOpenLetter,
  onAddNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');

  if (!request) return null;

  const infraction = INFRACTION_LABELS[request.infractionType];
  const hasLetter = request.clearanceDetails !== undefined;

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(request.id, newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              {request.referenceNumber}
            </span>
            <div>
              <h3 className="font-bold text-sm">
                NHT Apology Letter Dossier & Compliance Audit
              </h3>
              <p className="text-xs text-slate-400">
                {request.employeeName} ({request.employeeId}) • Batch {request.nhtBatchCode}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Infraction Header Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${infraction.badgeColor}`}>
                {infraction.title}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Occurred: {request.incidentDate} at {request.incidentTime}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-900">
              {request.specificIncidentSummary}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              <div><strong>Lead Trainer:</strong> {request.trainerName}</div>
              <div><strong>Hall Venue:</strong> {request.trainingHall}</div>
              <div><strong>Assigned Recruiter:</strong> {request.assignedRecruiter} ({RECRUITERS[request.assignedRecruiter]?.badge || 'TA Recruiter'})</div>
              <div><strong>Track:</strong> {request.department}</div>
            </div>
          </div>

          {/* Explanation & Remedial Undertaking */}
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                Trainee's Transparent Explanation:
              </div>
              <p className="text-slate-700 leading-relaxed text-xs">
                "{request.rootCauseReason}"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-900 text-[11px] uppercase tracking-wide">
                Trainee's Corrective Commitment & Remedy:
              </div>
              <p className="text-emerald-950 leading-relaxed text-xs">
                "{request.correctiveCommitment}"
              </p>
            </div>
          </div>

          {/* Attached Documents */}
          {request.attachments.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>Supporting Verification Proofs ({request.attachments.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {request.attachments.map(att => (
                  <div key={att.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate">{att.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-2">{att.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Drafted Letter */}
          <div>
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Submitted Apology Letter</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-line border border-slate-800 shadow-inner">
              {request.formalLetterBody}
            </div>
          </div>

          {/* Official Clearance Card (If Issued) */}
          {hasLetter && request.clearanceDetails && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-xs text-emerald-950">
                    Official Clearance Issued by Recruiter {request.clearanceDetails.clearedBy}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {request.clearanceDetails.letterReference}
                </span>
              </div>

              <div className="text-xs text-emerald-900">
                <strong>Disciplinary Remarks:</strong> "{request.clearanceDetails.disciplinaryRemarks}"
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-200/80">
                <span className="text-[11px] text-emerald-800">
                  Seal Number: <code className="font-mono font-bold">{request.clearanceDetails.officialSealNumber}</code>
                </span>
                <button
                  onClick={() => onOpenLetter(request)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" />
                  <span>View Printable Official Letter</span>
                </button>
              </div>
            </div>
          )}

          {/* Audit Trail & Notes */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                <span>Audit Trail & Dialogue History ({request.notes.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">Chronological Record</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {request.notes.map(note => (
                <div key={note.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {note.author} <span className="font-normal text-slate-500">({note.role})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Post Note Form */}
            <form onSubmit={handlePostNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={`Post a comment as ${currentRole}...`}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Note</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
