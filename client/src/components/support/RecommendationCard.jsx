const RecommendationCard = ({ support }) => {
  if (!support) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Recommendations</h2>

      <div className="space-y-3">
        {(support.recommendations || []).map((item, index) => (
          <div key={index} className="rounded-xl bg-blue-100 px-4 py-3 text-blue-700">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;