import { useState } from 'react';
import Sidebar from './Sidebar';
import HomeView from './HomeView';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();

  console.log(`[DashboardLayout] Component rendered. Current active tab: ${activeTab}, User: ${user?.username}`);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        
        {activeTab === 'registration' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Registro de Datos</h1>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-600">Módulo de registro (Próxima implementación)...</p>
            </div>
          </div>
        )}

        {/* Protected Settings View */}
        {activeTab === 'settings' && user?.role === 'admin' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Ajustes del Sistema</h1>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Panel de Administrador</h2>
              <p className="text-slate-600">Esta área está restringida únicamente para usuarios con rol de administrador. Aquí se configurarán parámetros globales del sistema EDS.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
