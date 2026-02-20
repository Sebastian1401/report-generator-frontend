import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Panel Principal</h1>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-600">Bienvenido al sistema de gestión EDS.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'registration' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Registro de Datos</h1>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-600">Módulo de registro (Próxima implementación)...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}