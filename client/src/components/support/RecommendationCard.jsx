const RecommendationCard = ({ support }) => {
  if (!support) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">
        Recommendations
      </h2>

      <div className="space-y-3">
        {(support.recommendations || []).map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-blue-100 px-4 py-3 text-blue-700 transition-colors duration-300 dark:bg-slate-700 dark:text-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;