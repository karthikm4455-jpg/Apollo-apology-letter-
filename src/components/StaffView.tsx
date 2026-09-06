import React, { useState, useEffect } from 'react';
import { 
  ApologyRequest, 
  InfractionType, 
  RecruiterName, 
  AttachmentItem 
} from '../types';
import { 
  INFRACTION_LABELS, 
  APOLOGY_LETTER_TEMPLATES, 
  RECRUITERS 
} from '../data/initialData';
import { 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Paperclip, 
  FileText, 
  CheckCircle2, 
  Upload, 
  X, 
  Building, 
  ShieldAlert, 
  Award, 
  HelpCircle,
  Eye,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';

interface StaffViewProps {
  requests: ApologyRequest[];
  onSubmitRequest: (reqData: Omit<ApologyRequest, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'notes' | 'status'>) => void;
  onOpenLetter: (req: ApologyRequest) => void;
  onOpenDetails: (req: ApologyRequest) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  requests,
  onSubmitRequest,
  onOpenLetter,
  onOpenDetails,
}) => {
  // Form State - Empty by default for trainee to fill their own details
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [department, setDepartment] = useState('');
  const [nhtBatchCode, setNhtBatchCode] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [trainingHall, setTrainingHall] = useState('');

  // Infraction Selection
  const [infractionType, setInfractionType] = useState<InfractionType>('late_arrival');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [severity, setSeverity] = useState<'first_offense' | 'repeated_instance' | 'critical_escalation'>('first_offense');
  
  // Specific attributes
  const [delayMinutes, setDelayMinutes] = useState<number | ''>('');
  const [missedDaysCount, setMissedDaysCount] = useState<number | ''>('');
  const [misbehaviorCategory, setMisbehaviorCategory] = useState<'phone_usage' | 'sleeping_inattention' | 'side_talking_disruption' | 'unauthorized_exit' | 'dress_code' | 'trainer_disrespect' | 'other'>('phone_usage');
  const [specificIncidentSummary, setSpecificIncidentSummary] = useState('');

  // Letter & Explanation
  const [rootCauseReason, setRootCauseReason] = useState('');
  const [formalLetterBody, setFormalLetterBody] = useState('');
  const [correctiveCommitment, setCorrectiveCommitment] = useState('');
  const [assignedRecruiter, setAssignedRecruiter] = useState<RecruiterName>('Lokesh');
  const [acknowledgedCodeOfConduct, setAcknowledgedCodeOfConduct] = useState(false);

  // Attachments
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [newFileName, setNewFileName] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'draft' | 'history'>('draft');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isEditingLetter, setIsEditingLetter] = useState(false);

  // Reset form handler
  const handleResetForm = () => {
    setEmployeeName('');
    setEmployeeId('');
    setEmployeeEmail('');
    setEmployeePhone('');
    setDepartment('');
    setNhtBatchCode('');
    setTrainerName('');
    setTrainingHall('');
    setInfractionType('late_arrival');
    setIncidentDate('');
    setIncidentTime('');
    setSeverity('first_offense');
    setDelayMinutes('');
    setMissedDaysCount('');
    setMisbehaviorCategory('phone_usage');
    setSpecificIncidentSummary('');
    setRootCauseReason('');
    setFormalLetterBody('');
    setCorrectiveCommitment('');
    setAcknowledgedCodeOfConduct(false);
    setAttachments([]);
    setNewFileName('');
    setIsEditingLetter(false);
  };

  // Auto-generate template letter
  const handleGenerateTemplate = () => {
    let specificDetailText = specificIncidentSummary;
    if (infractionType === 'late_arrival') {
      if (delayMinutes && incidentTime) {
        specificDetailText = `I arrived ${delayMinutes} minutes late (at ${incidentTime}) past the 09:00 AM classroom start time.`;
      } else if (delayMinutes) {
        specificDetailText = `I arrived ${delayMinutes} minutes late past the 09:00 AM classroom start time.`;
      } else if (incidentTime) {
        specificDetailText = `I arrived late at ${incidentTime} past the 09:00 AM classroom start time.`;
      } else {
        specificDetailText = specificIncidentSummary || 'I arrived late past the scheduled training session commencement.';
      }
    } else if (infractionType === 'uninformed_leave') {
      specificDetailText = `I was absent for ${missedDaysCount || 1} day(s) on ${incidentDate || 'the training date'} without prior written notice to the NHT training desk.`;
    } else if (infractionType === 'training_hall_misbehavior') {
      const catMap: Record<string, string> = {
        phone_usage: 'Unauthorized mobile phone usage during trainer instruction',
        sleeping_inattention: 'Falling asleep / drowsiness at the training desk during class',
        side_talking_disruption: 'Engaging in side conversations and disrupting training decorum',
        unauthorized_exit: 'Leaving the training hall during session without instructor pass',
        dress_code: 'Non-compliance with corporate business casual dress code',
        trainer_disrespect: 'Inappropriate or argumentative tone with training instructor',
        other: 'Classroom indiscipline incident'
      };
      specificDetailText = specificIncidentSummary 
        ? `${catMap[misbehaviorCategory] || 'Classroom indiscipline'}. ${specificIncidentSummary}`
        : `${catMap[misbehaviorCategory] || 'Classroom indiscipline'}.`;
    }

    const templateFn = APOLOGY_LETTER_TEMPLATES[infractionType];
    const generated = templateFn({
      employeeName: employeeName.trim(),
      employeeId: employeeId.trim(),
      nhtBatchCode: nhtBatchCode.trim(),
      trainerName: trainerName.trim(),
      trainingHall: trainingHall.trim(),
      incidentDate: incidentDate.trim(),
      incidentTime: incidentTime.trim(),
      specificDetails: specificDetailText,
      reason: rootCauseReason.trim(),
      commitment: correctiveCommitment.trim(),
      assignedRecruiter
    });

    setFormalLetterBody(generated);
  };

  // Add dummy attachment
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const item: AttachmentItem = {
      id: `att-${Date.now()}`,
      name: newFileName.endsWith('.pdf') || newFileName.endsWith('.jpg') || newFileName.endsWith('.png') ? newFileName : `${newFileName}.pdf`,
      size: `${Math.floor(150 + Math.random() * 800)} KB`,
      type: 'application/pdf'
    };
    setAttachments(prev => [...prev, item]);
    setNewFileName('');
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let letterToSend = formalLetterBody.trim();
    if (!letterToSend) {
      let specificDetailText = specificIncidentSummary;
      if (infractionType === 'late_arrival') {
        specificDetailText = delayMinutes 
          ? `I arrived ${delayMinutes} minutes late (at ${incidentTime || 'delayed time'}) past the classroom start time.`
          : (incidentTime ? `I arrived late at ${incidentTime}.` : 'I arrived late past the scheduled training start time.');
      } else if (infractionType === 'uninformed_leave') {
        specificDetailText = `I was absent for ${missedDaysCount || 1} day(s) on ${incidentDate || 'the training session'} without prior written notice.`;
      } else if (infractionType === 'training_hall_misbehavior') {
        specificDetailText = specificIncidentSummary || 'Classroom indiscipline incident during training module.';
      }

      letterToSend = APOLOGY_LETTER_TEMPLATES[infractionType]({
        employeeName: employeeName.trim(),
        employeeId: employeeId.trim(),
        nhtBatchCode: nhtBatchCode.trim(),
        trainerName: trainerName.trim(),
        trainingHall: trainingHall.trim(),
        incidentDate: incidentDate.trim(),
        incidentTime: incidentTime.trim(),
        specificDetails: specificDetailText,
        reason: rootCauseReason.trim(),
        commitment: correctiveCommitment.trim(),
        assignedRecruiter
      });
    }

    onSubmitRequest({
      employeeName: employeeName.trim(),
      employeeId: employeeId.trim(),
      employeeEmail: employeeEmail.trim() || `${employeeId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'trainee'}@apollopharmacy.org`,
      employeePhone: employeePhone.trim() || '+91 90000 00000',
      department: department.trim() || 'Retail Pharmacy Operations',
      nhtBatchCode: nhtBatchCode.trim(),
      trainerName: trainerName.trim() || 'NHT Lead Trainer',
      trainingHall: trainingHall.trim() || 'Apollo Training Academy',
      infractionType,
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      incidentTime: incidentTime || '09:00 AM',
      severity,
      delayMinutes: infractionType === 'late_arrival' ? (typeof delayMinutes === 'number' ? delayMinutes : undefined) : undefined,
      missedDaysCount: infractionType === 'uninformed_leave' ? (typeof missedDaysCount === 'number' ? missedDaysCount : undefined) : undefined,
      misbehaviorCategory: infractionType === 'training_hall_misbehavior' ? misbehaviorCategory : undefined,
      specificIncidentSummary: specificIncidentSummary.trim(),
      rootCauseReason: rootCauseReason.trim(),
      formalLetterBody: letterToSend,
      correctiveCommitment: correctiveCommitment.trim(),
      acknowledgedCodeOfConduct,
      assignedRecruiter,
      attachments
    });

    setIsSuccessMessage(true);
    handleResetForm();
    setTimeout(() => {
      setIsSuccessMessage(false);
      setActiveTab('history');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                New Hire Training (NHT) Compliance
              </span>
              <span className="text-slate-400 text-xs">• Mandatory 100% Attendance Policy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Trainee Apology Letter & Disciplinary Clearance Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit formal written explanations for late arrivals, uninformed absences, and training hall conduct. Letters are reviewed and cleared by TA HR Recruiters <strong>Lokesh</strong> or <strong>Mayappa</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'draft'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Draft Apology Letter</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>My Submissions ({requests.length})</span>
            </button>
          </div>
        </div>
      </div>

      {isSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center gap-3 text-emerald-900 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">Apology Letter Successfully Submitted!</div>
            <div className="text-xs text-emerald-700">
              Your formal explanation has been routed to TA HR Recruiter {assignedRecruiter} for review and official letter clearance.
            </div>
          </div>
        </div>
      )}

      {/* Main Content Areas */}
      {activeTab === 'draft' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Column */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Step 1: Select Infraction Category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-base font-bold text-slate-900">Why are you submitting this apology?</h3>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                Choose the reason that applies to your situation.
              </p>

              {/* Infraction Type Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div
                  onClick={() => {
                    setInfractionType('late_arrival');
                  }}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    infractionType === 'late_arrival'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    {infractionType === 'late_arrival' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-slate-900">Late Arrival</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Arrived after the 09:00 AM classroom start or post-break.
                  </div>
                </div>

                <div
                  onClick={() => {
                    setInfractionType('uninformed_leave');
                  }}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    infractionType === 'uninformed_leave'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    {infractionType === 'uninformed_leave' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-slate-900">Uninformed Absence</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Missed training session without 48-hour prior intimation.
                  </div>
                </div>

                <div
                  onClick={() => {
                    setInfractionType('training_hall_misbehavior');
                  }}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    infractionType === 'training_hall_misbehavior'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    {infractionType === 'training_hall_misbehavior' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-slate-900">Classroom Misconduct</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Mobile phone distraction, sleeping, dress code, or disruption.
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 2: Incident Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="text-sm font-bold text-slate-900">Incident Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Date of Incident *
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>

                  {infractionType === 'late_arrival' && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Arrival Time & Delay *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 09:35 AM"
                          value={incidentTime}
                          onChange={(e) => setIncidentTime(e.target.value)}
                          required
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="5"
                            max="300"
                            placeholder="30"
                            value={delayMinutes}
                            onChange={(e) => setDelayMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-20 text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600 text-center"
                          />
                          <span className="text-[11px] text-slate-500 whitespace-nowrap">mins late</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {infractionType === 'uninformed_leave' && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Number of Training Days Missed *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="1"
                          value={missedDaysCount}
                          onChange={(e) => setMissedDaysCount(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-24 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                        />
                        <span className="text-xs text-slate-500">
                          day(s) missed without intimation
                        </span>
                      </div>
                    </div>
                  )}

                  {infractionType === 'training_hall_misbehavior' && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Specific Issue Type *
                      </label>
                      <select
                        value={misbehaviorCategory}
                        onChange={(e) => setMisbehaviorCategory(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                      >
                        <option value="phone_usage">📱 Mobile Phone Usage during Class</option>
                        <option value="sleeping_inattention">😴 Drowsiness / Sleeping at Desk</option>
                        <option value="side_talking_disruption">🗣️ Side Talking / Classroom Disruption</option>
                        <option value="unauthorized_exit">🚪 Leaving Room without Permission</option>
                        <option value="dress_code">👔 Business Grooming / Dress Code Issue</option>
                        <option value="trainer_disrespect">⚠️ Insubordination or Disrespect</option>
                        <option value="other">📌 Other Training Hall Disruption</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Offense Frequency
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="severityRadio"
                        checked={severity === 'first_offense'}
                        onChange={() => setSeverity('first_offense')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>First Offense (First time occurrence)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="severityRadio"
                        checked={severity === 'repeated_instance'}
                        onChange={() => setSeverity('repeated_instance')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Repeated Offense</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3: Explanation & Prevention in Simple Words */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="text-base font-bold text-slate-900">Your Explanation & Commitment</h3>
                </div>
                <p className="text-xs text-slate-500 ml-8">
                  State the honest reason in your own words. The system automatically incorporates this into your formal apology letter.
                </p>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-800 mb-1">
                      1. Why did this incident happen? (Honest Reason) *
                    </label>
                    <textarea
                      rows={2}
                      value={rootCauseReason}
                      onChange={(e) => setRootCauseReason(e.target.value)}
                      required
                      placeholder="e.g., Heavy rain caused severe traffic stoppage on the outer ring road, resulting in a 35-minute delay..."
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-600 leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Be transparent. Honest explanations are treated with fairness by Apollo management.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-800 mb-1">
                      2. What will you do to make sure this does not happen again? *
                    </label>
                    <textarea
                      rows={2}
                      value={correctiveCommitment}
                      onChange={(e) => setCorrectiveCommitment(e.target.value)}
                      required
                      placeholder="e.g., I will leave home 40 minutes earlier each day and meet my trainer to complete any missed training modules..."
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-600 leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      State your specific plan to guarantee punctuality and compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Trainee Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="text-sm font-bold text-slate-900">Trainee Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Trainee Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Employee ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. APL-2026-4182"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">NHT Batch Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. NHT-APL-2026-04"
                      value={nhtBatchCode}
                      onChange={(e) => setNhtBatchCode(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Training Hall / Venue *</label>
                    <input
                      type="text"
                      placeholder="e.g. Training Academy Hall 3 - Apollo Bangalore"
                      value={trainingHall}
                      onChange={(e) => setTrainingHall(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul.sharma@apollopharmacy.org"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 11223"
                      value={employeePhone}
                      onChange={(e) => setEmployeePhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Lead Trainer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={trainerName}
                      onChange={(e) => setTrainerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Department / Stream</label>
                    <input
                      type="text"
                      placeholder="e.g. Retail Pharmacy Operations"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Select Reviewing Manager */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">5</span>
                  <h3 className="text-base font-bold text-slate-900">Select Reviewing Manager</h3>
                </div>
                <p className="text-xs text-slate-500 ml-8 mb-3">
                  Choose which Talent Acquisition Manager should review your apology and issue your clearance letter.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setAssignedRecruiter('Lokesh')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                      assignedRecruiter === 'Lokesh'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={RECRUITERS.Lokesh.avatar} alt="Lokesh" className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">Lokesh</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                          Manager
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">{RECRUITERS.Lokesh.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{RECRUITERS.Lokesh.nhtDomain}</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setAssignedRecruiter('Mayappa')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                      assignedRecruiter === 'Mayappa'
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={RECRUITERS.Mayappa.avatar} alt="Mayappa" className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">Mayappa</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                          Senior Manager
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">{RECRUITERS.Mayappa.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{RECRUITERS.Mayappa.nhtDomain}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6: Generated Formal Letter Preview */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">6</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Your Official Letter of Apology</h3>
                      <p className="text-[11px] text-slate-500">Auto-formatted for Apollo Pharmacy Limited</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingLetter(!isEditingLetter)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isEditingLetter ? 'View Formatted Preview' : 'Customize Letter Text'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateTemplate}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 transition-colors"
                      title="Regenerate from current form values"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sync Form into Letter</span>
                    </button>
                  </div>
                </div>

                {isEditingLetter ? (
                  <textarea
                    rows={10}
                    value={formalLetterBody}
                    onChange={(e) => setFormalLetterBody(e.target.value)}
                    placeholder="Official apology letter will appear here. You can also write or edit directly..."
                    className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-300 bg-white focus:outline-blue-600 leading-relaxed text-slate-800"
                  />
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto shadow-inner">
                    {formalLetterBody || (
                      <div className="py-6 text-center font-sans">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700 text-xs">Official Letter Draft</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                          Fill in your details above and click <span className="font-semibold text-indigo-600">"Sync Form into Letter"</span> to generate your personalized apology letter, or it will be formatted upon submission.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 7: Optional Proof & Undertaking */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>Attach Supporting Proof (Optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Transit slip, medical note, or receipt</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Document name (e.g., Metro_Delay_Notice.pdf)"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add File</span>
                  </button>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-1.5">
                    {attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-medium text-slate-700">{att.name}</span>
                          <span className="text-[11px] text-slate-400">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Code of Conduct Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgedCodeOfConduct}
                    onChange={(e) => setAcknowledgedCodeOfConduct(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs text-amber-950 leading-relaxed">
                    <strong>Trainee Undertaking:</strong> I confirm that the explanation provided above is truthful and authentic. I acknowledge that 100% attendance, punctuality, and professional decorum are mandatory for completing New Hire Training at Apollo Pharmacy.
                  </div>
                </label>
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Apology to {assignedRecruiter}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Guidelines & Process Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* How Clearance Works Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>How Clearance Works</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <span className="font-semibold text-slate-800">Submit Apology</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Fill in your reason and commitment in the form on the left.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <span className="font-semibold text-slate-800">Manager Review</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{assignedRecruiter} evaluates your apology letter and incident background.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <span className="font-semibold text-slate-800">Get Official Clearance</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Once approved, download your stamped clearance letter from the Submissions tab.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* NHT Policy Quick Reference */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Building className="w-4 h-4 text-blue-600" />
                <span>NHT Attendance Guidelines</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>09:00 AM Classroom Lockout</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Training hall doors close promptly at 09:00 AM. Trainees arriving after 09:00 AM require clearance to re-enter.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Prior Leave Intimation</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Any planned absence requires 48 hours prior notice to your lead trainer and HR operations.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>Mobile Phones in Lockers</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Phones must remain silent or deposited in classroom storage lockers during lectures and labs.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* History & Status Tracking Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              My Submitted Apology Letters & Clearance Record
            </h3>
            <span className="text-xs text-slate-500">
              Showing {requests.length} logged record(s)
            </span>
          </div>

          <div className="space-y-3">
            {requests.map(req => {
              const infraction = INFRACTION_LABELS[req.infractionType];
              const isCleared = req.status === 'accepted_cleared' || req.status === 'conditional_warning';
              
              return (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {req.referenceNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${infraction.badgeColor}`}>
                        {infraction.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        • Batch: <strong>{req.nhtBatchCode}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'accepted_cleared' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pardon & Clearance Approved</span>
                        </span>
                      )}
                      {req.status === 'conditional_warning' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Conditional Clearance (1st Warning)</span>
                        </span>
                      )}
                      {req.status === 'clarification_requested' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Clarification Requested</span>
                        </span>
                      )}
                      {req.status === 'pending_review' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Under Review by {req.assignedRecruiter}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-8 space-y-2">
                      <div className="text-slate-800 font-semibold">
                        {req.specificIncidentSummary}
                      </div>
                      <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] leading-relaxed">
                        <strong className="text-slate-700">Explanation:</strong> "{req.rootCauseReason}"
                      </div>
                      {req.clarificationNote && (
                        <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg text-blue-900 text-[11px]">
                          <strong>Note from {req.assignedRecruiter}:</strong> {req.clarificationNote}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                      <div><strong>Trainee:</strong> {req.employeeName} ({req.employeeId})</div>
                      <div><strong>Instructor:</strong> {req.trainerName}</div>
                      <div><strong>Venue:</strong> {req.trainingHall}</div>
                      <div><strong>Occurrence:</strong> {req.incidentDate} at {req.incidentTime}</div>
                      <div><strong>Assigned TA HR:</strong> {req.assignedRecruiter}</div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="text-[11px] text-slate-400">
                      Submitted on: {new Date(req.createdAt).toLocaleDateString()} • {req.attachments.length} proof document(s)
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenDetails(req)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Audit Dossier</span>
                      </button>

                      {isCleared && req.clearanceDetails && (
                        <button
                          onClick={() => onOpenLetter(req)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Official Clearance Letter</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
