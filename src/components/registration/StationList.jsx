import { useState } from 'react';
import { Plus, Search, MapPin, Phone, User } from 'lucide-react';
import StationForm from './StationForm';

export default function StationList() {
  const [isCreating, setIsCreating] = useState(false);
  
  // Mock Data matching your Schema
  const [stations, setStations] = useState([
    {
      id: 1,
      name: 'EDS Principal',
      business_name: 'Inversiones Garcia SAS',
      address: 'Cra 45 # 22-10',
      city: 'Bogotá',
      nit: '900.555.123-1',
      contact_name: 'Sebastian Garcia',
      contact_phone: '3001234567',
      contact_position: 'Gerente'
    },
    {
      id: 2,
      name: 'EDS Norte',
      business_name: 'Inversiones Garcia SAS',
      address: 'Autonorte Km 20',
      city: 'Chía',
      nit: '900.555.123-1',
      contact_name: 'Carlos Perez',
      contact_phone: '3109876543',
      contact_position: 'Administrador'
    }
  ]);

  console.log(`[StationList] Rendered. Mode: ${isCreating ? 'Creating' : 'List'}`);

  const handleSave = (newStation) => {
    console.log('[StationList] Saving new station:', newStation);
    setStations([...stations, newStation]);
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <StationForm 
        onCancel={() => setIsCreating(false)} 
        onSave={handleSave} 
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Station Management</h2>
          <p className="text-slate-500">Manage your Service Stations (EDS) network.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Station</span>
        </button>
      </div>

      {/* Station Cards Grid (Responsive List) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div key={station.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <MapPin size={24} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Active
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{station.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{station.business_name} • {station.nit}</p>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center text-sm text-slate-600">
                <MapPin size={16} className="mr-2 text-slate-400" />
                <span>{station.address}, {station.city}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <User size={16} className="mr-2 text-slate-400" />
                <span>{station.contact_name} ({station.contact_position})</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone size={16} className="mr-2 text-slate-400" />
                <span>{station.contact_phone}</span>
              </div>
            </div>

            <button className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}