import { useState } from 'react';
import Sidebar from './Sidebar';
import HomeView from './HomeView';
import RegistrationView from './RegistrationView';
import WorkOrderList from './reports/WorkOrderList';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();

  console.log(`[DashboardLayout] Component rendered. Current active tab: ${activeTab}, User: ${user?.username}`);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {/* Home View */}
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        
        {/* Registration Module */}
        {activeTab === 'registration' && <RegistrationView />}

        {/* reports Module */}
        {activeTab === 'reports' && <WorkOrderList />}

        {/* Protected Settings View */}
        {activeTab === 'settings' && user?.role === 'admin' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">System Settings</h1>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Administrator Panel</h2>
              <p className="text-slate-600">This area is restricted to administrators only. Global system parameters are configured here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}