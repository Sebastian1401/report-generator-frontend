import { useState, useRef, useEffect } from 'react';
import { Plus, Search, X, ChevronDown, MapPin, Fuel, Tag, Zap } from 'lucide-react';
import DispenserForm from './DispenserForm';

export default function DispenserList() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const mockStations = [
    { id: 1, name: 'EDS Principal', address: 'Cra 45 # 22-10' },
    { id: 2, name: 'EDS Norte', address: 'Autonorte Km 20' },
    { id: 3, name: 'EDS Sur', address: 'Av Boyaca # 50' },
  ];

  // MOCK DATA: Basado en tu respuesta de API (incluyendo IDs repetidos en mangueras que mencionaste)
  const [dispensers, setDispensers] = useState([
    {      
      "dispenser_number": 1,
      "island": "1",
      "brand": "Gilbarco",
      "model": "Encore 500",
      "serial": "123123",
      "nii": "098098",
      "station_id": 1, // Asignado a EDS Principal para demo
      "tags": ["mg_roja", "mg_amarilla"],
      "id": 1,
      "hoses": [
        { "position": 1, "nii": "0987", "tags": ["mg_roja"], "id": 1, "fuel_type_id": 1 },
        { "position": 2, "nii": "0988", "tags": ["mg_amarilla"], "id": 2, "fuel_type_id": 2 },
        { "position": 3, "nii": "289161", "tags": ["cm_rojo", "corriente"], "id": 3, "fuel_type_id": 1 },
        { "position": 4, "nii": "289162", "tags": ["cm_amarillo", "diesel"], "id": 4, "fuel_type_id": 2 }
      ]
    },
    {
      "dispenser_number": 2,
      "island": "2",
      "brand": "Wayne",
      "model": "SH22",
      "serial": "7876213",
      "nii": "289167",
      "station_id": 1, // Asignado a EDS Principal para demo
      "tags": ["cm_amarillo", "cm_rojo", "diesel", "corriente"],
      "id": 2,
      "hoses": [
        { "position": 1, "nii": "456", "tags": ["mg_roja"], "id": 5, "fuel_type_id": 1 },
        { "position": 2, "nii": "765", "tags": null, "id": 6, "fuel_type_id": 2 }
      ]
    }
  ]);

  // --- LÓGICA DE BUSCADOR (Reutilizada) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  const filteredStations = mockStations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    setSearchQuery(station.name);
    setIsSearchOpen(false);
  };
  // ----------------------------------------

  const getFuelInfo = (id) => {
    const fuels = {
      1: { name: 'Corriente', color: 'bg-red-500 border-red-600' },
      2: { name: 'Diesel', color: 'bg-yellow-400 border-yellow-500' },
      3: { name: 'Extra', color: 'bg-slate-800 text-white border-slate-900' }
    };
    return fuels[id] || { name: 'Unknown', color: 'bg-gray-300' };
  };

  const handleSave = (newPayload) => {
    console.log('[DispenserList] Adding:', newPayload);
    // Adaptador rápido para visualizarlo en la lista mock
    setDispensers([...dispensers, newPayload]);
    setIsCreating(false);
  };

  const visibleDispensers = selectedStation
    ? dispensers.filter(d => d.station_id === selectedStation.id)
    : [];

  if (isCreating) {
    return <DispenserForm onCancel={() => setIsCreating(false)} onSave={handleSave} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Dispenser Management</h2>
          <p className="text-slate-500">Manage pumps and hoses configuration.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Dispenser</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 max-w-xl relative" ref={searchRef}>
        <label className="block text-sm font-medium text-slate-700 mb-2">Find Station</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                    if (!e.target.value) setSelectedStation(null);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                placeholder="Search station..."
            />
            {searchQuery && (
                <button onClick={() => { setSelectedStation(null); setSearchQuery(''); setIsSearchOpen(true); }} className="absolute inset-y-0 right-0 pr-3 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            )}
        </div>
        {isSearchOpen && searchQuery && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredStations.map((station) => (
                    <button key={station.id} onClick={() => handleSelectStation(station)} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between border-b border-slate-50 last:border-0 group">
                        <div>
                            <p className="font-medium text-slate-800 group-hover:text-blue-700">{station.name}</p>
                            <p className="text-xs text-slate-500 flex items-center mt-0.5"><MapPin size={12} className="mr-1" />{station.address}</p>
                        </div>
                        {selectedStation?.id === station.id && <ChevronDown size={16} className="text-blue-600 -rotate-90" />}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* DISPENSER GRID */}
      {selectedStation ? (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Dispensers at <span className="text-blue-600">{selectedStation.name}</span></h3>
                <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{visibleDispensers.length} found</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               {visibleDispensers.map((dispenser) => (
                 <div key={dispenser.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col hover:border-blue-300 transition-colors">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                       <div className="flex items-center space-x-4">
                          <div className="bg-blue-600 text-white p-3 rounded-lg font-bold text-xl w-12 h-12 flex items-center justify-center">
                             {dispenser.dispenser_number}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-800">{dispenser.brand} | {dispenser.model}</h3>
                             <p className="text-xs text-slate-500">Island: {dispenser.island}</p>
                             <div className="flex flex-wrap gap-1 mt-1">
                                {dispenser.tags && dispenser.tags.map((t, i) => (
                                   <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded border border-slate-200">{t}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="text-right text-xs text-slate-500 space-y-1">
                          <p><span className="font-semibold">NII:</span> {dispenser.nii}</p>
                          <p><span className="font-semibold">S/N:</span> {dispenser.serial}</p>
                       </div>
                    </div>

                    {/* Hoses List */}
                    <div className="space-y-2 flex-1">
                       <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hoses ({dispenser.hoses.length})</p>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dispenser.hoses.map((hose, hIdx) => {
                             const fuel = getFuelInfo(hose.fuel_type_id);
                             return (
                               <div key={hIdx} className="flex items-center p-2 rounded-lg border border-slate-100 bg-slate-50 relative overflow-hidden group">
                                  <div className={`w-3 h-full absolute left-0 top-0 bottom-0 ${fuel.color}`}></div>
                                  <div className="ml-4 flex-1">
                                     <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-700">{hose.position}</span>
                                        <span className="text-[10px] bg-white border px-1 rounded text-slate-500">NII: {hose.nii}</span>
                                     </div>
                                     <p className="text-xs text-slate-500 truncate">{fuel.name}</p>
                                     {hose.tags && hose.tags.length > 0 && (
                                       <div className="flex gap-1 mt-1">
                                          {hose.tags.map((t, ti) => <span key={ti} className="text-[9px] bg-white px-1 rounded text-slate-400 border border-slate-100"><Tag size={8} className="inline mr-0.5"/>{t}</span>)}
                                       </div>
                                     )}
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                       <button className="text-sm text-blue-600 font-medium hover:underline">Edit Configuration</button>
                    </div>
                 </div>
               ))}
            </div>
        </>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
           <Zap size={48} className="mx-auto text-slate-300 mb-4" />
           <h3 className="text-lg font-semibold text-slate-700">Select a Station</h3>
           <p className="text-slate-500">Select a station to manage dispensers.</p>
        </div>
      )}
    </div>
  );
}