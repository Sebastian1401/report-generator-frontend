export default function StationList() {
  console.log('[StationList] Component rendered');
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Station Management</h3>
      <p className="text-slate-500">Service stations (EDS) will be listed here.</p>
    </div>
  );
}