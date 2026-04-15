import React from "react";
import { Link } from "react-router-dom";

const CrisisAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-2xl dark:border-rose-900/50 dark:bg-slate-900 animate-in zoom-in-95 duration-300">
        
        {/* Top Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600" />

        <div className="p-8 text-center">

          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 shadow-inner dark:bg-rose-900/30">
            <span className="text-4xl animate-pulse">❤️‍🩹</span>
          </div>

          {/* Title */}
          <h2 className="mt-6 font-serif text-2xl font-bold text-slate-800 dark:text-white">
            You are not alone.
          </h2>

          {/* Message */}
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            It looks like you might be going through a difficult moment.  
            Please remember — support is always available, and you deserve help.
          </p>

          {/* Divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

          {/* Helplines */}
          <div className="space-y-4 text-left">

            {/* CCC */}
            <Helpline
              title="CCC Line (Sri Lanka)"
              subtitle="Free • Confidential • 24/7"
              number="1333"
            />

            {/* National */}
            <Helpline
              title="National Mental Health Helpline"
              subtitle="Professional Support"
              number="1926"
            />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            
            <Link
              to="/support"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Support
            </Link>

            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              I'm Okay
            </button>
          </div>

          {/* Small footer text */}
          <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
            Seeking help is a sign of strength 💙
          </p>
        </div>
      </div>
    </div>
  );
};

// 🔥 Reusable Helpline Component
const Helpline = ({ title, subtitle, number }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-rose-200 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-rose-800/50">
      <div>
        <p className="font-semibold text-slate-800 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <a
        href={`tel:${number}`}
        className="rounded-xl bg-rose-100 px-4 py-2 font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400"
      >
        📞 {number}
      </a>
    </div>
  );
};

export default CrisisAlertModal;