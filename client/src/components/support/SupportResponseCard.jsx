const SupportResponseCard = ({ support }) => {
  if (!support) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">
        Support Response
      </h2>

      <p className="text-slate-700 dark:text-slate-300">
        {support.supportResponse}
      </p>
    </div>
  );
};

export default SupportResponseCard;