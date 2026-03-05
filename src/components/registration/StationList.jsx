import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, User, RefreshCw } from 'lucide-react';
import StationForm from './StationForm';
import api from '../../services/api';

export default function StationList() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/stations'); 
      setStations(response.data.data); 
    } catch (error) {
      console.error('No se pudieron cargar las estaciones', error);
      setStations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  console.log(`[StationList] Rendered. Mode: ${isCreating ? 'Creating' : editingStation ? 'Editing' : 'List'}`);

  const handleSave = () => {
    fetchStations();
    setIsCreating(false);
    setEditingStation(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingStation(null);
  };

  if (isCreating || editingStation) {
    return (
      <StationForm 
        initialData={editingStation} 
        onCancel={handleCancel} 
        onSave={handleSave} 
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <RefreshCw className="animate-spin mb-4" size={32} />
        <p>Cargando estaciones desde la base de datos...</p>
      </div>
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

            <button className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
              onClick={() => setEditingStation(station)}>
              Edit Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}