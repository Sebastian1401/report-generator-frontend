import { useState } from 'react';
import { MapPin, Cylinder, Fuel } from 'lucide-react';
import StationList from './registration/StationList';
import TankList from './registration/TankList';
import DispenserList from './registration/DispenserList';

export default function RegistrationView() {
  const [activeSubTab, setActiveSubTab] = useState('stations');

  console.log(`[RegistrationView] Rendered. Active sub-tab: ${activeSubTab}`);

  const tabs = [
    { id: 'stations', label: 'Stations', icon: MapPin },
    { id: 'tanks', label: 'Tanks', icon: Cylinder },
    { id: 'dispensers', label: 'Dispensers', icon: Fuel },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Data Registration</h1>
        <p className="text-slate-500 mt-2">Manage the infrastructure of your station network.</p>
      </div>

      {/* Tabs de Navegación Interna */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-fit mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log(`[RegistrationView] Switched to sub-tab: ${tab.id}`);
                setActiveSubTab(tab.id);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Renderizado Condicional del Contenido */}
      <div className="mt-4">
        {activeSubTab === 'stations' && <StationList />}
        {activeSubTab === 'tanks' && <TankList />}
        {activeSubTab === 'dispensers' && <DispenserList />}
      </div>
    </div>
  );
}