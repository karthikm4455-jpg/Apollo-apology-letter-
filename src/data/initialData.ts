import { ApologyRequest, RecruiterProfile, InfractionType } from '../types';

export const RECRUITERS: Record<'Lokesh' | 'Mayappa', RecruiterProfile> = {
  Lokesh: {
    name: 'Lokesh',
    title: 'Manager - TA Recruitment, Apollo Pharmacy Limited',
    email: 'lokesh.ta@apollopharmacy.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    signatureStamp: 'LOKESH_MGR_TA_APOLLO_2026',
    phone: '+91 98450 12384',
    badge: 'Manager - TA Recruitment',
    nhtDomain: 'Retail Pharmacists, Store Operations & Supply Chain Batches',
    organization: 'Apollo Pharmacy Limited'
  },
  Mayappa: {
    name: 'Mayappa',
    title: 'Senior Manager - TA Recruitment, Apollo Pharmacy Limited',
    email: 'mayappa.hr@apollopharmacy.org',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    signatureStamp: 'MAYAPPA_SR_MGR_TA_APOLLO_2026',
    phone: '+91 98450 98712',
    badge: 'Senior Manager - TA Recruitment',
    nhtDomain: 'Regional Pharmacy Operations, Retail Network & Corporate NHT Batches',
    organization: 'Apollo Pharmacy Limited'
  },
};

export const INFRACTION_LABELS: Record<InfractionType, { title: string; desc: string; badgeColor: string }> = {
  late_arrival: {
    title: 'Late Arrival to NHT Training',
    desc: 'Reporting past the mandatory 09:00 AM classroom door lockout or delayed after scheduled breaks.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  uninformed_leave: {
    title: 'Uninformed Leave / Absence Without Notice',
    desc: 'Failing to notify the NHT Lead Trainer and TA HR prior to missing a mandatory training module.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  training_hall_misbehavior: {
    title: 'Misbehavior & Indiscipline in Training Hall',
    desc: 'Disruptions including phone usage, side conversations, sleeping, leaving without pass, or disrespect.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  }
};

export const APOLOGY_LETTER_TEMPLATES: Record<InfractionType, (data: {
  employeeName: string;
  employeeId: string;
  nhtBatchCode: string;
  trainerName: string;
  trainingHall: string;
  incidentDate: string;
  incidentTime: string;
  specificDetails: string;
  reason: string;
  commitment: string;
  assignedRecruiter: string;
}) => string> = {
  late_arrival: (d) => 
`APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL LETTER OF APOLOGY FOR LATE ARRIVAL

Date: ${d.incidentDate || 'September 06, 2026'}
To:
${d.assignedRecruiter || 'TA Recruitment Desk'}
${d.assignedRecruiter === 'Mayappa' ? 'Senior Manager - TA Recruitment' : 'Manager - TA Recruitment'}
Apollo Pharmacy Limited

Through:
${d.trainerName || 'NHT Lead Trainer'}
Lead Instructor, NHT Batch: ${d.nhtBatchCode || 'NHT-APL-2026-Batch'}
Venue: ${d.trainingHall || 'Apollo Training Academy'}

Subject: Formal Apology & Explanation for Late Arrival on ${d.incidentDate || 'Training Session'}

Respected Sir,

I am writing this letter to formally offer my sincere and unreserved apology for arriving late to the New Hire Training (NHT) session at Apollo Pharmacy Limited held on ${d.incidentDate || 'the scheduled date'} at approximately ${d.incidentTime || '09:45 AM'}.

Incident Details:
${d.specificDetails || 'I reported 45 minutes past the mandatory 09:00 AM session commencement time.'}

Reason and Circumstances:
${d.reason || 'Due to an unforeseen transit disruption and public bus breakdown on my transit corridor, I was severely delayed despite having departed early from my residence. I regret that I did not foresee this bottleneck and did not dispatch an advance update.'}

I fully recognize that punctuality and patient-centric dedication are core tenets at Apollo Pharmacy Limited, and that NHT sets the foundation for store operations, pharmaceutical compliance, and professional discipline. My tardiness disrupted the morning instructional module and caused inconvenience to Trainer ${d.trainerName || 'my trainer'} and my batchmates.

Commitment and Remedial Action:
${d.commitment || 'I assure you that this was an isolated occurrence. I have reorganized my morning commute schedule to ensure I arrive at the training facility at least 25 minutes prior to the start of every session. I have also caught up on all missed classroom coursework during the afternoon self-study hour.'}

I humbly request you to accept my apology and grant clearance for my training attendance record. I submit myself to any supplementary learning tasks or counseling deemed necessary.

Respectfully submitted by:
Name: ${d.employeeName || 'Trainee Employee'}
Employee ID: ${d.employeeId || 'AP-EMP-2026-XXXX'}
Batch: ${d.nhtBatchCode || 'NHT-APL-2026'}`.trim(),

  uninformed_leave: (d) => 
`APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL LETTER OF EXPLANATION AND APOLOGY FOR UNINFORMED ABSENCE

Date: ${d.incidentDate || 'September 06, 2026'}
To:
${d.assignedRecruiter || 'TA Recruitment Desk'}
${d.assignedRecruiter === 'Mayappa' ? 'Senior Manager - TA Recruitment' : 'Manager - TA Recruitment'}
Apollo Pharmacy Limited

Through:
${d.trainerName || 'NHT Lead Trainer'}
Lead Instructor, Batch ${d.nhtBatchCode || 'NHT-APL-2026'}
Venue: ${d.trainingHall || 'Apollo Training Academy'}

Subject: Formal Apology for Uninformed Absence / Leave Without Prior Notice on ${d.incidentDate || 'Training Date'}

Respected Sir,

I, ${d.employeeName || 'Trainee'}, bearing Employee ID ${d.employeeId || 'AP-EMP-XXXX'}, currently undergoing New Hire Training at Apollo Pharmacy Limited in Batch ${d.nhtBatchCode || 'NHT-APL-2026'}, tender my profound apologies for being absent without prior written approval on ${d.incidentDate || 'the aforementioned date'}.

Nature of Non-Compliance:
${d.specificDetails || 'Absence from full-day NHT training module without sending prior notification email to the training desk or HR operations.'}

Circumstances Leading to Uninformed Leave:
${d.reason || 'I suffered an acute personal/health emergency which rendered me unable to contact the training coordinator in advance. However, I realize it was my strict obligation under employee guidelines to notify the team via phone or emergency portal as soon as practicable.'}

I am acutely aware of the strict NHT attendance requirement at Apollo Pharmacy Limited (100% mandatory compliance) and understand that taking uninformed leaves impacts batch progress and company onboarding policy.

Undertaking and Corrective Actions:
${d.commitment || 'I have attached the supporting documentary proof for your verification. I have collected the day’s learning modules and completed the mandatory practical assessments with my batch coordinator. I pledge that I will never take leave during NHT without formal prior authorization.'}

I earnestly request you to pardon this lapse and regularize my attendance on compassionate grounds.

Yours obediently,
${d.employeeName || 'Trainee Employee'}
Employee ID: ${d.employeeId || 'AP-EMP-2026-XXXX'}
Batch: ${d.nhtBatchCode || 'NHT-APL-2026'}`.trim(),

  training_hall_misbehavior: (d) => 
`APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL WRITTEN APOLOGY FOR INDISCIPLINE AND MISBEHAVIOR IN TRAINING HALL

Date: ${d.incidentDate || 'September 06, 2026'}
To:
${d.assignedRecruiter || 'TA Recruitment Desk'}
${d.assignedRecruiter === 'Mayappa' ? 'Senior Manager - TA Recruitment' : 'Manager - TA Recruitment'}
Apollo Pharmacy Limited

Through:
${d.trainerName || 'NHT Lead Trainer'}
Lead Instructor, Batch ${d.nhtBatchCode || 'NHT-APL-2026'}
Venue: ${d.trainingHall || 'Apollo Training Academy'}

Subject: Written Apology and Undertaking for Training Hall Misconduct on ${d.incidentDate || 'Training Session'}

Respected Sir,

I am addressing this letter to formally apologize for my inappropriate conduct and breach of classroom decorum during the NHT session held at Apollo Pharmacy Limited on ${d.incidentDate || 'the training day'}.

Summary of Infraction:
${d.specificDetails || 'Engagement in disruptive behavior inside the training hall (unauthorized mobile phone usage / side conversation during lecture / lack of classroom attentiveness).'}

Trainee Explanation and Acknowledgment:
${d.reason || 'I acknowledge without reservation that my behavior was unprofessional, disrespectful to the trainer, and distracted my fellow trainees. I allowed my attention to lapse and failed to uphold the high standards of discipline expected in corporate training.'}

Corrective Undertaking and Behavior Pledge:
${d.commitment || 'I have received verbal guidance from my trainer and strictly undertake to maintain flawless decorum henceforth. I will keep my mobile phone deposited in the designated classroom locker and remain completely focused on all instructional exercises. I understand that any recurrence will lead to direct termination of my employment contract.'}

I respectfully request you to accept this letter as my genuine remorse and grant me the opportunity to redeem my conduct during the remainder of the training cycle.

Humbly submitted,
${d.employeeName || 'Trainee Employee'}
Employee ID: ${d.employeeId || 'AP-EMP-2026-XXXX'}
Batch: ${d.nhtBatchCode || 'NHT-APL-2026'}`.trim()
};

export const INITIAL_APOLOGY_REQUESTS: ApologyRequest[] = [
  {
    id: 'APL-2026-101',
    referenceNumber: 'APL-2026-101',
    employeeName: 'Rahul Sharma',
    employeeId: 'AP-EMP-2026-4182',
    employeeEmail: 'rahul.sharma@apollopharmacy.org',
    employeePhone: '+91 98765 11223',
    department: 'Pharmacy Retail Operations & Patient Care',
    nhtBatchCode: 'NHT-APL-2026-04',
    trainerName: 'Rajesh Kumar',
    trainingHall: 'Hall 3A - Apollo Training Academy',
    infractionType: 'late_arrival',
    incidentDate: '2026-09-02',
    incidentTime: '09:42 AM',
    severity: 'first_offense',
    delayMinutes: 42,
    specificIncidentSummary: 'Arrived 42 minutes late after 09:00 AM door closure during Pharmacy Dispensing & Prescription Validation Module.',
    rootCauseReason: 'Sudden breakdown of the Purple Line metro transit corridor. Commuters were stalled on tracks for 35 minutes with no immediate alternate transit available.',
    formalLetterBody: `APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL LETTER OF APOLOGY FOR LATE ARRIVAL

Date: September 02, 2026
To: Lokesh, Manager - TA Recruitment, Apollo Pharmacy Limited
Through: Rajesh Kumar, Lead Instructor, NHT-APL-2026-04
Venue: Hall 3A - Apollo Training Academy

Subject: Apology for 42-Minute Late Arrival on Sept 02, 2026

Respected Sir,

I am writing this letter to tender my heartfelt apology for arriving late to our Apollo Pharmacy NHT classroom session today at 09:42 AM. Due to a major power failure on the metro transit line, the train was stranded between stations. 

I understand that timely arrival is imperative to maintain the strict standards of pharmaceutical training and patient-care readiness. I did not intend any disrespect to Trainer Rajesh or the batch. 

I have compensated for the lost 42 minutes by staying back after 06:00 PM to finish the prescription auditing exercise with my mentor. I have re-calibrated my morning departure time to buffer for potential transit delays.

I kindly request your approval and regularization of my attendance record.

Respectfully submitted,
Rahul Sharma (AP-EMP-2026-4182)`,
    correctiveCommitment: 'Adjusted morning departure by 40 minutes earlier; completed backfill assignment verified by Trainer Rajesh.',
    acknowledgedCodeOfConduct: true,
    assignedRecruiter: 'Lokesh',
    status: 'accepted_cleared',
    createdAt: '2026-09-02T10:15:00Z',
    updatedAt: '2026-09-02T15:30:00Z',
    attachments: [
      { id: 'att-1', name: 'Metro_Transit_Disruption_Notice.pdf', size: '420 KB', type: 'application/pdf' },
      { id: 'att-2', name: 'Trainer_Signoff_Backfill.pdf', size: '610 KB', type: 'application/pdf' }
    ],
    notes: [
      {
        id: 'n-1',
        author: 'Rahul Sharma',
        role: 'NHT Trainee',
        text: 'Submitted formal apology with public metro advisory bulletin attached.',
        date: '2026-09-02 10:15 AM'
      },
      {
        id: 'n-2',
        author: 'Lokesh',
        role: 'Manager - TA Recruitment, Apollo Pharmacy Limited',
        text: 'Verified transit delay notice. First instance recorded. Trainee completed evening backfill with Trainer Rajesh. Apology accepted and cleared.',
        date: '2026-09-02 03:30 PM'
      }
    ],
    clearanceDetails: {
      letterReference: 'NHT-APL-2026-1012-LOK',
      clearedBy: 'Lokesh',
      approverDesignation: 'Manager - TA Recruitment, Apollo Pharmacy Limited',
      clearedDate: '2026-09-02',
      resolutionType: 'accepted_cleared',
      disciplinaryRemarks: 'Apology accepted upon review of transit evidence and mentor sign-off. First-time infraction cleared with counseling.',
      formalLetterContent: `APOLLO PHARMACY LIMITED
OFFICIAL TALENT ACQUISITION DISCIPLINARY CLEARANCE & PARDON LETTER

Date: September 02, 2026
Reference: NHT-APL-2026-1012-LOK
To: Rahul Sharma (AP-EMP-2026-4182), Batch NHT-APL-2026-04
Copy To: Rajesh Kumar (Lead Trainer), HR Operations & Payroll, Apollo Pharmacy Limited

Subject: Disciplinary Clearance & Pardon for Late Arrival Infraction

Dear Rahul Sharma,

The Talent Acquisition & New Hire Training Directorate at Apollo Pharmacy Limited has reviewed your formal apology letter and supporting transit verification dated September 02, 2026 regarding your delayed arrival to the training hall.

Taking into consideration your exemplary pre-onboarding record, proactive backfill of the morning instructional curriculum, and absence of prior disciplinary entries, Manager - TA Recruitment Lokesh hereby grants:

OFFICIAL CLEARANCE & PARDON

Terms and Mandates:
1. The late incident is regularized as a pardoned single occurrence with no financial deduction.
2. Trainee must maintain a minimum 15-minute advance arrival buffer for all remaining NHT sessions.
3. 100% attendance compliance is required for formal certification and store placement release.

Authorized by:
Lokesh
Manager - TA Recruitment
Apollo Pharmacy Limited`,
      stamped: true,
      officialSealNumber: 'SEAL-LOK-APL-9014',
      nhtAttendanceAction: 'Attendance pardoned and regularized; no payroll LOP applied',
      correctiveGuidance: 'Trainee must arrive 15 minutes before 09:00 AM session daily',
      probationImpact: 'Clean slate maintained; clears NHT module'
    }
  },
  {
    id: 'APL-2026-102',
    referenceNumber: 'APL-2026-102',
    employeeName: 'Ananya Sen',
    employeeId: 'AP-EMP-2026-3190',
    employeeEmail: 'ananya.sen@apollopharmacy.org',
    employeePhone: '+91 98450 77881',
    department: 'Clinical Pharmacy & Drug Dispensing Operations',
    nhtBatchCode: 'NHT-APL-2026-11',
    trainerName: 'Sneha Iyer',
    trainingHall: 'Hall 1B - Apollo Training Academy',
    infractionType: 'training_hall_misbehavior',
    misbehaviorCategory: 'phone_usage',
    incidentDate: '2026-09-03',
    incidentTime: '02:30 PM',
    severity: 'repeated_instance',
    specificIncidentSummary: 'Repeated unauthorized smartphone usage beneath the desk during Scheduled Drug Dispensing & Regulatory Compliance lecture.',
    rootCauseReason: 'Receiving urgent messages regarding an apartment lease deposit; I mistakenly prioritized responding over the training guidelines.',
    formalLetterBody: `APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL WRITTEN APOLOGY FOR CLASSROOM INDISCIPLINE & PHONE USAGE

Date: September 03, 2026
To: Mayappa, Senior Manager - TA Recruitment, Apollo Pharmacy Limited
Through: Sneha Iyer, NHT Lead Trainer, Batch NHT-APL-2026-11
Venue: Hall 1B - Apollo Training Academy

Subject: Unreserved Apology for Misconduct and Phone Usage in Training Hall

Respected Sir,

I am writing this letter with sincere regret for my unacceptable behavior today at 02:30 PM in Hall 1B, during the Scheduled Drug Compliance module delivered by Trainer Sneha. 

Despite explicit rules prohibiting personal device usage inside the hall, I engaged in text messaging. I recognize this demonstrated disrespect toward the trainer, undermined classroom decorum, and violated Apollo Pharmacy training protocols.

I have surrendered my smartphone to the front desk depository and commit to leaving it in the designated mobile lockers for the remainder of NHT. I understand that our batch deals with patient safety and pharmaceutical dispensing where discipline and attentiveness are paramount.

I request your leniency and assure you that you will not observe any further lapses from me.

Yours humbly,
Ananya Sen (AP-EMP-2026-3190)`,
    correctiveCommitment: 'Voluntary surrender of mobile device to training coordinator every morning; 1-hour supplementary session completed on Pharmacy Regulatory Compliance.',
    acknowledgedCodeOfConduct: true,
    assignedRecruiter: 'Mayappa',
    status: 'conditional_warning',
    createdAt: '2026-09-03T16:00:00Z',
    updatedAt: '2026-09-04T11:20:00Z',
    attachments: [
      { id: 'att-3', name: 'Mobile_Locker_Surrender_Slip.pdf', size: '320 KB', type: 'application/pdf' },
      { id: 'att-4', name: 'Compliance_Security_Retest_Passed.pdf', size: '510 KB', type: 'application/pdf' }
    ],
    notes: [
      {
        id: 'n-3',
        author: 'Sneha Iyer',
        role: 'Lead Trainer',
        text: 'Reported to Mayappa due to strict floor policy regarding personal devices during pharmacy compliance training.',
        date: '2026-09-03 03:00 PM'
      },
      {
        id: 'n-4',
        author: 'Mayappa',
        role: 'Senior Manager - TA Recruitment, Apollo Pharmacy Limited',
        text: 'Conducted counseling session. Issued formal Conditional Written Warning with mandatory phone deposit protocol.',
        date: '2026-09-04 11:20 AM'
      }
    ],
    clearanceDetails: {
      letterReference: 'NHT-APL-2026-2041-MAY',
      clearedBy: 'Mayappa',
      approverDesignation: 'Senior Manager - TA Recruitment, Apollo Pharmacy Limited',
      clearedDate: '2026-09-04',
      resolutionType: 'conditional_warning',
      disciplinaryRemarks: 'Apology accepted on strict conditional terms. First written warning endorsed on training file. Zero tolerance for device infractions in pharmacy training.',
      formalLetterContent: `APOLLO PHARMACY LIMITED
OFFICIAL TALENT ACQUISITION CONDITIONAL CLEARANCE & FIRST WRITTEN WARNING

Date: September 04, 2026
Reference: NHT-APL-2026-2041-MAY
To: Ananya Sen (AP-EMP-2026-3190), Batch NHT-APL-2026-11
Copy To: Sneha Iyer (Lead Trainer), HR Disciplinary Desk, Apollo Pharmacy Limited

Subject: Formal Disciplinary Ruling - Conditional Acceptance with First Written Warning

Dear Ananya Sen,

The Talent Acquisition & Disciplinary Committee at Apollo Pharmacy Limited has evaluated the formal apology letter submitted by you in response to the training hall indiscipline incident (unauthorized device usage) on September 03, 2026.

While your prompt acknowledgment of wrongdoing and voluntary compliance retest are noted, Apollo Pharmacy pharmacy standards dictate that any digital distraction during compliance and prescription training carries serious operational risk.

DECISION: CONDITIONAL CLEARANCE WITH FIRST WRITTEN WARNING

Conditions Imposed:
1. Trainee is placed on 30-day heightened behavioral observation within the NHT training cycle.
2. Trainee must deposit personal mobile phone in the security locker prior to 08:50 AM daily.
3. Any subsequent violation of classroom decorum will result in immediate termination of the probationary appointment without notice.

Authorized by:
Mayappa
Senior Manager - TA Recruitment
Apollo Pharmacy Limited`,
      stamped: true,
      officialSealNumber: 'SEAL-MAY-APL-8821',
      nhtAttendanceAction: 'Warning endorsed on file; conditional continuation permitted',
      correctiveGuidance: 'Mandatory morning device surrender and daily sign-off with Lead Trainer Sneha',
      probationImpact: 'First written warning logged; probation subject to 30-day flawless conduct'
    }
  },
  {
    id: 'APL-2026-103',
    referenceNumber: 'APL-2026-103',
    employeeName: 'Karthik Nair',
    employeeId: 'AP-EMP-2026-5591',
    employeeEmail: 'karthik.nair@apollopharmacy.org',
    employeePhone: '+91 99887 66554',
    department: 'Supply Chain & Central Pharmacy Warehousing',
    nhtBatchCode: 'NHT-APL-2026-05',
    trainerName: 'Vikramaditya Deshmukh',
    trainingHall: 'Hall 4C - Logistics & Cold Chain Labs',
    infractionType: 'uninformed_leave',
    incidentDate: '2026-09-04',
    incidentTime: 'Full Day (09:00 AM - 06:00 PM)',
    severity: 'first_offense',
    missedDaysCount: 1,
    specificIncidentSummary: 'Complete absence on Day 6 (Cold Chain Storage & Insulin Handling Workshop) without prior email or intimation.',
    rootCauseReason: 'Severe food poisoning resulting in acute dehydration and immediate clinic admission at 06:30 AM. My phone battery died at the clinic, preventing me from sending an advance email before training start.',
    formalLetterBody: `APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL APOLOGY & EXPLANATION FOR UNINFORMED ABSENCE ON DAY 6

Date: September 05, 2026
To: Lokesh, Manager - TA Recruitment, Apollo Pharmacy Limited
Through: Vikramaditya Deshmukh, Logistics Lead Instructor, NHT-APL-2026-05
Venue: Hall 4C - Logistics & Cold Chain Labs

Subject: Uninformed Absence Apology & Medical Submission

Respected Sir,

I am writing to express my sincerest apologies for missing yesterday's full-day training session at Apollo Pharmacy Limited without prior notice. 

Early yesterday morning at 06:30 AM, I suffered severe gastroenteritis and was taken to Sanjeevani Medical Center for emergency IV hydration. Due to the urgency of medical attention and my phone discharging, I was unable to submit a timely absence intimation.

I understand that uninformed leaves cause administrative disruption and lead to missed critical cold-chain hands-on labs. I have attached my doctor’s prescription and discharge certificate.

I have already paired with my batchmate to review the storage protocols and will present my completed Insulin Handling assignment to Trainer Vikramaditya tomorrow morning.

I humbly request your compassion in excusing this emergency absence.

Sincerely,
Karthik Nair (AP-EMP-2026-5591)`,
    correctiveCommitment: 'Attached full medical discharge paperwork and IV clinic bill; caught up on Day 6 cold chain labs over the weekend.',
    acknowledgedCodeOfConduct: true,
    assignedRecruiter: 'Lokesh',
    status: 'pending_review',
    createdAt: '2026-09-05T08:30:00Z',
    updatedAt: '2026-09-05T08:30:00Z',
    attachments: [
      { id: 'att-5', name: 'Emergency_Clinic_Admission_Slip.pdf', size: '1.2 MB', type: 'application/pdf' },
      { id: 'att-6', name: 'Doctor_Prescription_Medical_Leave.pdf', size: '890 KB', type: 'application/pdf' }
    ],
    notes: [
      {
        id: 'n-5',
        author: 'Karthik Nair',
        role: 'NHT Trainee',
        text: 'Submitted apology with medical clinic proof attached. Awaiting review by Lokesh (Manager - TA Recruitment).',
        date: '2026-09-05 08:30 AM'
      }
    ]
  },
  {
    id: 'APL-2026-104',
    referenceNumber: 'APL-2026-104',
    employeeName: 'Divya Ranganathan',
    employeeId: 'AP-EMP-2026-6218',
    employeeEmail: 'divya.r@apollopharmacy.org',
    employeePhone: '+91 97654 32190',
    department: 'Customer Care & Pharmacy Helpline Support',
    nhtBatchCode: 'NHT-APL-2026-12',
    trainerName: 'Sunita Rao',
    trainingHall: 'Hall 2A - Training Wing',
    infractionType: 'late_arrival',
    incidentDate: '2026-09-05',
    incidentTime: '09:35 AM',
    severity: 'first_offense',
    delayMinutes: 35,
    specificIncidentSummary: 'Late entry by 35 minutes on Day 2 of Prescription Order Escalation & Empathy Simulation.',
    rootCauseReason: 'Access ID badge was not recognized at the main campus security turnstile due to a magnetic card encoding issue, requiring 25 minutes of manual re-badging at the visitor desk.',
    formalLetterBody: `APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL LETTER OF APOLOGY FOR LATE ARRIVAL - SECURITY BADGE ISSUE

Date: September 05, 2026
To: Mayappa, Senior Manager - TA Recruitment, Apollo Pharmacy Limited
Through: Sunita Rao, Lead Trainer, Batch NHT-APL-2026-12
Venue: Hall 2A - Training Wing

Subject: Apology and Explanation for Delayed Entry on September 05

Respected Sir,

Please accept my sincere apologies for arriving 35 minutes late to Hall 2A today at Apollo Pharmacy Training Wing. 

I reached the office premises at 08:40 AM, well before the scheduled start. However, my newly issued employee smart card was de-magnetized and failed to trigger the entry turnstiles. I had to wait in a security queue to obtain an incident pass from Security In-Charge.

I regret that this delayed my entrance to Sunita Ma'am's simulation exercise. I have retained the security validation slip and had my card permanently re-encoded.

I request you to kindly accept my explanation and regularize my swipe records.

Yours sincerely,
Divya Ranganathan (AP-EMP-2026-6218)`,
    correctiveCommitment: 'Security pass receipt verified; card re-encoded by IT Facilities; no further gate delays expected.',
    acknowledgedCodeOfConduct: true,
    assignedRecruiter: 'Mayappa',
    status: 'pending_review',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z',
    attachments: [
      { id: 'att-7', name: 'Security_Desk_Turnstile_Incident_Slip.pdf', size: '340 KB', type: 'application/pdf' }
    ],
    notes: [
      {
        id: 'n-6',
        author: 'Divya Ranganathan',
        role: 'NHT Trainee',
        text: 'Apology submitted with security pass receipt. Assigned to Mayappa (Senior Manager - TA Recruitment) for clearance.',
        date: '2026-09-05 10:00 AM'
      }
    ]
  },
  {
    id: 'APL-2026-105',
    referenceNumber: 'APL-2026-105',
    employeeName: 'Sameer Siddiqui',
    employeeId: 'AP-EMP-2026-7840',
    employeeEmail: 'sameer.s@apollopharmacy.org',
    employeePhone: '+91 91234 56789',
    department: 'Quality Assurance & Drug Inventory Systems',
    nhtBatchCode: 'NHT-APL-2026-04',
    trainerName: 'Rajesh Kumar',
    trainingHall: 'Hall 3A - Apollo Training Academy',
    infractionType: 'training_hall_misbehavior',
    misbehaviorCategory: 'sleeping_inattention',
    incidentDate: '2026-09-04',
    incidentTime: '03:15 PM',
    severity: 'first_offense',
    specificIncidentSummary: 'Found dozing off / inattentive at desk during Inventory Batch Expiry Tracking walkthrough.',
    rootCauseReason: 'Had an adverse allergic reaction to antihistamine medication taken for chronic dust allergy, which induced severe drowsiness after the lunch break.',
    formalLetterBody: `APOLLO PHARMACY LIMITED - NEW HIRE TRAINING (NHT)
FORMAL WRITTEN APOLOGY FOR CLASSROOM DROWSINESS & INATTENTION

Date: September 04, 2026
To: Lokesh, Manager - TA Recruitment, Apollo Pharmacy Limited
Through: Rajesh Kumar, Lead Instructor, Batch NHT-APL-2026-04
Venue: Hall 3A - Apollo Training Academy

Subject: Written Apology for Inattention / Sleeping During Lecture

Respected Sir,

I tender my sincere apologies for succumbing to drowsiness during the afternoon drug inventory tracking walkthrough today in Hall 3A. 

I understand how disrespectful this appeared to Trainer Rajesh and how it compromised classroom discipline. I had taken an allergy medication (Cetirizine) during lunch which had an intense sedative side effect that I did not anticipate. 

I have visited the Apollo clinic and obtained a non-drowsy alternative prescription. I have thoroughly reviewed the course module and completed all 15 audit exercises on the pharmacy management sandbox.

I pledge that this will never occur again and request your pardon.

Respectfully,
Sameer Siddiqui (AP-EMP-2026-7840)`,
    correctiveCommitment: 'Switched to non-drowsy medication; completed all audit homework; regular active participation pledged.',
    acknowledgedCodeOfConduct: true,
    assignedRecruiter: 'Lokesh',
    status: 'clarification_requested',
    clarificationNote: 'Please provide the doctor/clinic slip confirming the medication change, and obtain Trainer Rajesh’s sign-off on the completed inventory audit homework before clearance can be sanctioned.',
    createdAt: '2026-09-04T16:30:00Z',
    updatedAt: '2026-09-05T09:00:00Z',
    attachments: [
      { id: 'att-8', name: 'Inventory_Audit_Signoff.pdf', size: '750 KB', type: 'application/pdf' }
    ],
    notes: [
      {
        id: 'n-7',
        author: 'Sameer Siddiqui',
        role: 'NHT Trainee',
        text: 'Apology submitted explaining medication drowsiness.',
        date: '2026-09-04 04:30 PM'
      },
      {
        id: 'n-8',
        author: 'Lokesh',
        role: 'Manager - TA Recruitment, Apollo Pharmacy Limited',
        text: 'Clarification requested: Need clinic slip for non-drowsy prescription and trainer sign-off.',
        date: '2026-09-05 09:00 AM'
      }
    ]
  }
];
