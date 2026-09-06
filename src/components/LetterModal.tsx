import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  Award, 
  ShieldCheck, 
  Calendar, 
  User, 
  Download,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  FileDown,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { ApologyRequest } from '../types';
import { RECRUITERS, INFRACTION_LABELS } from '../data/initialData';
import { ApolloLogo } from './ApolloLogo';

interface LetterModalProps {
  request: ApologyRequest | null;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ request, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!request || !request.clearanceDetails) return null;

  const clearance = request.clearanceDetails;
  const recruiterInfo = RECRUITERS[clearance.clearedBy];
  const infraction = INFRACTION_LABELS[request.infractionType];

  const handleCopy = () => {
    navigator.clipboard.writeText(clearance.formalLetterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([clearance.formalLetterContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${clearance.letterReference}_Official_Clearance_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPDF = async () => {
    const letterElement = document.getElementById('printable-letter-document');
    if (!letterElement) return;

    setIsGeneratingPDF(true);
    try {
      // Small pause to ensure full paint before canvas capture
      await new Promise(resolve => setTimeout(resolve, 80));

      const canvas = await html2canvas(letterElement, {
        scale: 2, // High resolution for crisp letterhead and text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: Math.max(letterElement.scrollWidth, 1024),
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 10; // 10mm margin around letterhead
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = (canvas.height * printableWidth) / canvas.width;

      let heightLeft = printableHeight;
      let position = margin;

      // First page
      pdf.addImage(imgData, 'PNG', margin, position, printableWidth, printableHeight, undefined, 'FAST');
      heightLeft -= (pageHeight - margin * 2);

      // Subsequent pages if letter content exceeds single A4 sheet
      while (heightLeft > 0) {
        position = margin - (printableHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, printableWidth, printableHeight, undefined, 'FAST');
        heightLeft -= (pageHeight - margin * 2);
      }

      const sanitizedRef = clearance.letterReference.replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${sanitizedRef}_Apollo_Clearance_Letter.pdf`);
    } catch (error) {
      console.error('Error generating clearance letter PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none">
        
        {/* Modal Action Header (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Official NHT Clearance & Apology Acceptance Letter
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Ref: <strong className="text-slate-200 font-mono">{clearance.letterReference}</strong></span>
                <span>• Cleared by: <strong className="text-emerald-400">{clearance.clearedBy}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download text transcription"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.txt</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-70 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="Download official PDF with preserved Apollo Pharmacy letterhead, seals, and signatures"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Direct print using browser dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div id="printable-letter-document" className="p-8 sm:p-12 bg-white text-slate-900 font-serif relative">
          
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <GraduationCap className="w-96 h-96 text-slate-900" />
          </div>

          {/* Letterhead */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <ApolloLogo className="h-10 sm:h-12 w-auto" />
              <div>
                <div className="font-sans font-black tracking-wider text-base text-slate-950 uppercase">
                  Apollo Pharmacy Limited
                </div>
                <div className="font-sans text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
                  New Hire Training (NHT) • Talent Acquisition & Compliance Directorate
                </div>
              </div>
              <div className="font-sans text-xs text-slate-600">
                Corporate Office: Apollo Pharmacy Limited, Regional Corporate Office, Bangalore & Chennai
              </div>
            </div>

            <div className="font-sans text-right text-xs space-y-1 sm:self-auto">
              <div className="text-slate-500">Document Classification:</div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                OFFICIAL HR RECORD
              </span>
              <div className="font-mono text-xs font-semibold text-slate-700">
                Ref: {clearance.letterReference}
              </div>
            </div>
          </div>

          {/* Addressee & Dispatch Meta */}
          <div className="font-sans grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-8 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Issued To (Trainee):</div>
              <div className="font-bold text-sm text-slate-950">{request.employeeName}</div>
              <div>Employee ID: <strong className="font-mono">{request.employeeId}</strong></div>
              <div>NHT Batch: <strong>{request.nhtBatchCode}</strong></div>
              <div>Department: <strong>{request.department}</strong></div>
            </div>

            <div className="space-y-1 sm:text-right">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Endorsing Authority:</div>
              <div className="font-bold text-sm text-slate-950">{clearance.clearedBy}</div>
              <div>{recruiterInfo.title}</div>
              <div>Date of Issue: <strong>{clearance.clearedDate}</strong></div>
              <div>Copied To: Lead Instructor ({request.trainerName}), HR Operations & Payroll</div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="font-sans mb-6">
            <div className="bg-slate-50 border-l-4 border-slate-900 p-3.5 rounded-r-lg">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block mb-0.5">Subject:</span>
              <span className="font-bold text-sm text-slate-950">
                {clearance.resolutionType === 'accepted_cleared'
                  ? `Formal Disciplinary Clearance & Apology Acceptance for ${infraction.title}`
                  : `Formal Disciplinary Ruling & Conditional Acceptance (First Written Warning) for ${infraction.title}`
                }
              </span>
            </div>
          </div>

          {/* Executive Summary Cards (Print Friendly) */}
          <div className="font-sans grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-8">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium">Infraction Category</div>
              <div className="font-bold text-slate-900 mt-0.5">{infraction.title}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium">Occurrence Date</div>
              <div className="font-bold text-slate-900 mt-0.5">{request.incidentDate} at {request.incidentTime}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium">Resolution Status</div>
              <div className={`font-bold mt-0.5 ${clearance.resolutionType === 'accepted_cleared' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {clearance.resolutionType === 'accepted_cleared' ? 'Pardoned & Regularized' : 'Conditional Warning'}
              </div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium">Digital Verification Seal</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5 truncate">{clearance.officialSealNumber}</div>
            </div>
          </div>

          {/* Formal Letter Text Body */}
          <div className="font-sans text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4 mb-8 whitespace-pre-line bg-slate-50/50 p-6 rounded-xl border border-slate-200">
            {clearance.formalLetterContent}
          </div>

          {/* Terms & Guidance Grid */}
          <div className="font-sans text-xs mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">Attendance Regularization:</div>
              <p className="text-[11px] text-slate-600">{clearance.nhtAttendanceAction}</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">Mandatory Trainee Directive:</div>
              <p className="text-[11px] text-slate-600">{clearance.correctiveGuidance}</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">Training File Record:</div>
              <p className="text-[11px] text-slate-600">{clearance.probationImpact}</p>
            </div>
          </div>

          {/* Sign-off & Official Stamp Block */}
          <div className="font-sans pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Hologram-style Digital Seal */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-emerald-600 flex flex-col items-center justify-center text-center p-1 relative rotate-[-4deg]">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-0.5" />
                <span className="text-[8px] font-black uppercase text-emerald-800 tracking-tighter">
                  NHT COMPLIANCE
                </span>
                <span className="text-[7px] font-mono font-bold text-emerald-700">
                  VERIFIED SEAL
                </span>
              </div>

              <div className="text-xs space-y-0.5">
                <div className="font-mono text-[10px] text-slate-400">Security Hash & Seal:</div>
                <div className="font-mono font-bold text-slate-800 text-xs">{clearance.officialSealNumber}</div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authorized Signature Affixed by {clearance.clearedBy}</span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-right space-y-1 sm:self-auto self-end">
              <div className="font-serif italic text-lg font-bold text-indigo-950 font-signature tracking-wide">
                {clearance.clearedBy === 'Lokesh' ? 'Lokesh M.' : 'Mayappa K.'}
              </div>
              <div className="font-bold text-xs text-slate-900">{clearance.clearedBy}</div>
              <div className="text-[11px] text-slate-500">{recruiterInfo.title}</div>
              <div className="text-[10px] text-slate-400">Talent Acquisition & Employee Relations Desk</div>
            </div>

          </div>

          {/* Footer Notice */}
          <div className="font-sans text-[10px] text-slate-400 text-center mt-10 pt-4 border-t border-slate-100">
            This document has been executed digitally and validated under the New Hire Training Code of Conduct Regulations 2026. Any tampering with attendance records constitutes gross misconduct.
          </div>

        </div>

      </div>
    </div>
  );
};
