import React from "react";
import { Link } from "react-router-dom";

const CrisisAlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-rose-200/70 bg-white shadow-2xl dark:border-rose-900/40 dark:bg-slate-950">
        <div className="h-2 w-full bg-gradient-to-r from-rose-400 via-pink-500 to-red-500" />

        <div className="p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 shadow-inner dark:bg-rose-950/50">
            <span className="text-4xl">❤️‍🩹</span>
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            You are not alone
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Your message suggests you may be going through a difficult moment.
            Please reach out to someone you trust or contact a support line below.
          </p>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

          <div className="space-y-3 text-left">
            <Helpline
              title="CCC Line Sri Lanka"
              subtitle="Free, confidential support"
              number="1333"
            />

            <Helpline
              title="Mental Health Helpline"
              subtitle="Professional mental health support"
              number="1926"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/support"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Support
            </Link>

            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              I’m safe for now
            </button>
          </div>

          <p className="mt-5 text-[11px] leading-5 text-slate-400 dark:text-slate-500">
            This alert is not a medical diagnosis. In an immediate emergency,
            contact local emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

const Helpline = ({ title, subtitle, number }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-rose-200 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-rose-800/50">
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <a
        href={`tel:${number}`}
        className="shrink-0 rounded-xl bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
      >
        📞 {number}
      </a>
    </div>
  );
};

export default CrisisAlertModal;