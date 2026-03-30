import React from "react";
import { Link } from "react-router-dom";

const CrisisAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 animate-in zoom-in-95 duration-300 border border-rose-100 dark:border-rose-900/50">
        
        {/* Top Accent Line */}
        <div className="h-2 w-full bg-gradient-to-r from-rose-400 to-pink-500"></div>

        <div className="p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
            <span className="text-3xl">❤️‍🩹</span>
          </div>

          <h2 className="mt-6 text-center font-serif text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            You are not alone.
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            We noticed you might be going through a really tough time right now. Please remember that there is always help available, and things can get better.
          </p>

          <div className="mt-8 space-y-4">
            {/* Sri Lanka CCC Line */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-rose-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-rose-800/50">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">CCC Line (Sri Lanka)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Free, Confidential, 24/7</p>
              </div>
              <a href="tel:1333" className="rounded-xl bg-rose-100 px-4 py-2 font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400">
                📞 1333
              </a>
            </div>

            {/* National Mental Health Helpline */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-rose-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-rose-800/50">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">National Helpline</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mental Health Support</p>
              </div>
              <a href="tel:1926" className="rounded-xl bg-rose-100 px-4 py-2 font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400">
                📞 1926
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link 
              to="/support" 
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Get App Support
            </Link>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              I'm Okay, Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlertModal;