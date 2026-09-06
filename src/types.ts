export type UserRole = 'trainee' | 'recruiter_lokesh' | 'recruiter_mayappa' | 'admin';

export type RecruiterName = 'Lokesh' | 'Mayappa';

export type AuthSession = 
  | { role: 'manager'; manager: RecruiterName; name: string; title: string; email: string }
  | { role: 'admin'; name: string; title: string; email: string };

export type InfractionType = 
  | 'late_arrival' 
  | 'uninformed_leave' 
  | 'training_hall_misbehavior';

export type InfractionSeverity = 'first_offense' | 'repeated_instance' | 'critical_escalation';

export type ApologyStatus = 
  | 'pending_review' 
  | 'clarification_requested' 
  | 'accepted_cleared' 
  | 'conditional_warning' 
  | 'rejected_escalated';

export interface AuditNote {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface OfficialClearanceDetails {
  letterReference: string; // e.g., "NHT-APL-2026-0812-LOK"
  clearedBy: RecruiterName;
  approverDesignation: string; // e.g. "Senior Manager - Talent Acquisition Recruitment"
  clearedDate: string;
  resolutionType: 'accepted_cleared' | 'conditional_warning';
  disciplinaryRemarks: string;
  formalLetterContent: string;
  stamped: boolean;
  officialSealNumber: string;
  nhtAttendanceAction: string; // e.g., "Conditional Attendance Pardon Granted; Zero grace for remainder of NHT"
  correctiveGuidance: string; // e.g., "Must report 15 minutes before 09:00 AM session and submit daily sign-off"
  probationImpact: string; // e.g., "Recorded on Training File; clears upon 100% attendance during next 14 days"
}

export interface ApologyRequest {
  id: string;
  referenceNumber: string; // APL-2026-0104
  employeeName: string;
  employeeId: string; // e.g., EMP-2026-9481
  employeeEmail: string;
  employeePhone: string;
  department: string;
  nhtBatchCode: string; // e.g. NHT-2026-B08
  trainerName: string; // e.g. Rajesh Kumar
  trainingHall: string; // e.g. Hall 3B (Main Tech Tower)
  
  // Infraction details
  infractionType: InfractionType;
  incidentDate: string;
  incidentTime: string;
  severity: InfractionSeverity;
  
  // Specific infraction attributes
  delayMinutes?: number; // for late_arrival (e.g. 35 mins)
  missedDaysCount?: number; // for uninformed_leave (e.g. 1 day, 2 days)
  misbehaviorCategory?: 'phone_usage' | 'sleeping_inattention' | 'side_talking_disruption' | 'unauthorized_exit' | 'dress_code' | 'trainer_disrespect' | 'other';
  specificIncidentSummary: string;
  
  // Trainee's explanation & apology
  rootCauseReason: string; // Honest explanation of what happened
  formalLetterBody: string; // Full drafted formal apology letter
  correctiveCommitment: string; // Pledge & remedy taken by trainee
  acknowledgedCodeOfConduct: boolean;
  
  // Assigned Recruiter
  assignedRecruiter: RecruiterName;
  
  // Workflow
  status: ApologyStatus;
  createdAt: string;
  updatedAt: string;
  attachments: AttachmentItem[];
  notes: AuditNote[];
  
  // Post-review details
  clearanceDetails?: OfficialClearanceDetails;
  rejectionReason?: string;
  clarificationNote?: string;
}

export interface RecruiterProfile {
  name: RecruiterName;
  title: string;
  email: string;
  avatar: string;
  signatureStamp: string;
  phone: string;
  badge: string;
  nhtDomain: string;
  organization?: string;
}
