const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
};

export default StatCard;