import { Database, FileText, ChevronRight } from 'lucide-react';

export default function HomeView({ setActiveTab }) {
  console.log('[HomeView] Component rendered');

  const modules = [
    {
      id: 'registration',
      title: 'Data Registration',
      description: 'Manage stations, tanks, products, and employee records.',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: ['Stations', 'Tanks', 'Products', 'Employees']
    },
    {
      id: 'reports',
      title: 'Reports Generation',
      description: 'Generate and export detailed shift and sales reports.',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      features: ['Daily Shift', 'Sales', 'Export PDF']
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Main Dashboard</h1>
        <p className="text-slate-500 mt-2">Select a module to begin.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${mod.bgColor} ${mod.color}`}>
                  <Icon size={24} />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">{mod.title}</h2>
              </div>
              
              <p className="text-slate-600 mb-6 flex-1">{mod.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {mod.features.map((feat, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full font-medium">
                    {feat}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => {
                  console.log(`[HomeView] Module selected: ${mod.id}`);
                  setActiveTab(mod.id);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <span>Open Module</span>
                <ChevronRight size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}