const SupportResponseCard = ({ support }) => {
  if (!support) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Support Response</h2>
      <p className="text-slate-700">{support.supportResponse}</p>
    </div>
  );
};

export default SupportResponseCard;