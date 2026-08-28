import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, Heart, CheckCircle2, Download, Printer, Share2, Shield } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { activeCertificate, setActiveCertificate, showToast } = useApp();

  if (!activeCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('success', 'Certificate Downloaded', `Certificate ${activeCertificate.certificateId} has been exported.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8 relative print:border-none print:shadow-none">
        {/* Top Control Bar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-sm text-slate-800">Life Saver Certificate of Appreciation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              Save PDF
            </button>
            <button
              onClick={() => setActiveCertificate(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 text-center bg-radial from-rose-50/40 via-white to-amber-50/20 border-8 border-double border-rose-200 m-4 rounded-xl relative">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
            <Heart className="w-96 h-96 text-red-600 fill-red-600" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Header Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 shadow-inner mb-2">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-red-600">
                LifeLink National Blood Network
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 font-serif">
                Certificate of Recognition
              </h2>
              <p className="text-sm text-slate-500 mt-1 italic">
                Presented with profound gratitude for voluntary humanitarian blood donation
              </p>
            </div>

            <div className="py-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">This is proudly awarded to</span>
              <h3 className="text-2xl sm:text-3xl font-black text-red-700 underline decoration-red-300 underline-offset-8 mt-2">
                {activeCertificate.donorName}
              </h3>
            </div>

            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              In deep appreciation of donating <strong className="text-slate-900">{activeCertificate.units} unit(s) of {activeCertificate.bloodGroup} blood</strong> at{' '}
              <strong className="text-slate-900">{activeCertificate.hospitalName}</strong>, helping preserve human life and support emergency trauma care.
            </p>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Certificate Number</span>
                <span className="font-mono font-bold text-slate-800">{activeCertificate.certificateId}</span>
              </div>
              <div className="text-center">
                <span className="text-slate-400 block text-[10px] uppercase">Date of Donation</span>
                <span className="font-semibold text-slate-800">{activeCertificate.donationDate}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="flex items-end justify-between pt-6 mt-4 border-t border-slate-200 text-center text-xs text-slate-600">
              <div className="space-y-1">
                <div className="h-9 border-b border-slate-400 w-36 mx-auto flex items-end justify-center pb-1 font-serif italic text-red-800 text-sm">
                  Dr. E. Harrison, MD
                </div>
                <p className="text-[11px] font-semibold text-slate-700">Chief Medical Officer</p>
                <p className="text-[10px] text-slate-400">Trauma Services</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-red-500 flex items-center justify-center p-1 text-[9px] font-bold text-red-600 uppercase tracking-tighter text-center">
                  Official Seal Verified
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-9 border-b border-slate-400 w-36 mx-auto flex items-end justify-center pb-1 font-serif italic text-red-800 text-sm">
                  LifeLink Council
                </div>
                <p className="text-[11px] font-semibold text-slate-700">National Registrar</p>
                <p className="text-[10px] text-slate-400">Donor Services Board</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
