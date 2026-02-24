export default function TankList() {
  console.log('[TankList] Component rendered');
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Tank Management</h3>
      <p className="text-slate-500">The storage tanks associated with each EDS will be listed here.</p>
    </div>
  );
}