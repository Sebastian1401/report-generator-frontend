import { useState, useRef, useEffect } from 'react';
import { Plus, Cylinder, Droplet, Search, X, ChevronDown, MapPin } from 'lucide-react';
import TankForm from './TankForm';

export default function TankList() {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);

    const mockStations = [
        { id: 1, name: 'EDS Principal', address: 'Cra 45 # 22-10' },
        { id: 2, name: 'EDS Norte', address: 'Autonorte Km 20' },
        { id: 3, name: 'EDS Sur', address: 'Av Boyaca # 50' },
    ];

    const [tanks, setTanks] = useState([
        {
            "code": "432",
            "type": "Unico",
            "material": "ASTM A36",
            "installation_type": "Subterraneo",
            "tags": ["blanco", "vlv_sobrellenado"],
            "station_id": 1,
            "id": 11,
            "compartments": [
                { "code": "2", "capacity_nominal": "10000.00", "capacity_operational": "9902.00", "id": 2, "fuel_type_id": 2 }
            ]
        },
        {
            "code": "433",
            "type": "Unico",
            "material": "ASTM A36",
            "installation_type": "Subterraneo",
            "tags": ["blanco"],
            "station_id": 1,
            "id": 12,
            "compartments": [
                { "code": "3", "capacity_nominal": "10000.00", "capacity_operational": "9903.00", "id": 3, "fuel_type_id": 1 }
            ]
        },
        {
            "code": "T-Norte-1",
            "type": "Unico",
            "material": "Fiberglass",
            "installation_type": "Subterraneo",
            "tags": [],
            "station_id": 2,
            "id": 10,
            "compartments": [
                { "code": "1", "capacity_nominal": "5000.00", "capacity_operational": "4800.00", "id": 1, "fuel_type_id": 3 }
            ]
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [editingTank, setEditingTank] = useState(null);
    const searchRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
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
        console.log(`[TankList] Station filtered by: ${station.name}`);
    };

    const clearSelection = () => {
        setSelectedStation(null);
        setSearchQuery('');
        setIsSearchOpen(true);
    };

    const getFuelInfo = (id) => {
        const fuels = {
            1: { name: 'Gasolina Corriente', color: 'bg-red-500 text-red-700' },
            2: { name: 'Diesel', color: 'bg-yellow-400 text-yellow-700' },
            3: { name: 'Gasolina Extra', color: 'bg-blue-800 text-blue-700' }
        };
        return fuels[id] || { name: 'Unknown', color: 'bg-gray-100 text-gray-500' };
    };

    const handleSave = (newTankPayload) => {
        console.log('[TankList] Received payload:', newTankPayload);

        if (editingTank) {
            setTanks(tanks.map(t => t.id === newTankPayload.id ? newTankPayload : t));
        } else {
            setTanks([...tanks, newTankPayload]);
        }

        setIsCreating(false);
        setEditingTank(null);
    };

    const visibleTanks = selectedStation
        ? tanks.filter(t => t.station_id === selectedStation.id)
        : [];

    if (isCreating || editingTank) {
        return (
            <TankForm
                initialData={editingTank}
                onCancel={() => { setIsCreating(false); setEditingTank(null); }}
                onSave={handleSave}
            />
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Tank Management</h2>
                    <p className="text-slate-500">Select a station to manage its tanks.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>New Tank</span>
                </button>
            </div>

            {/* --- BUSCADOR DE ESTACIONES --- */}
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
                        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
                        placeholder="Search station by name..."
                    />

                    {searchQuery && (
                        <button
                            onClick={clearSelection}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Dropdown de Resultados: Eliminada la restricción !selectedStation */}
                {isSearchOpen && searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        {filteredStations.length > 0 ? (
                            filteredStations.map((station) => (
                                <button
                                    key={station.id}
                                    onClick={() => handleSelectStation(station)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between group border-b border-slate-50 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-slate-800 group-hover:text-blue-700">{station.name}</p>
                                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                                            <MapPin size={12} className="mr-1" />
                                            {station.address}
                                        </p>
                                    </div>
                                    {/* Mostrar check si esta es la estación activa */}
                                    {selectedStation?.id === station.id && (
                                        <ChevronDown size={16} className="text-blue-600 -rotate-90" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                No stations found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- GRID DE TANQUES --- */}
            {selectedStation ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-700">
                            Tanks at <span className="text-blue-600">{selectedStation.name}</span>
                        </h3>
                        <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {visibleTanks.length} found
                        </span>
                    </div>

                    {visibleTanks.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {visibleTanks.map((tank) => (
                                <div key={tank.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col hover:border-blue-300 transition-colors">

                                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                                                <Cylinder size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">Tank {tank.code}</h3>
                                                <div className="flex space-x-2 mt-1">
                                                    {tank.tags && tank.tags.map((tag, i) => (
                                                        <span key={i} className="text-[10px] uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded block mb-1">
                                                {tank.type}
                                            </span>
                                            <span className="text-xs text-slate-400">{tank.material}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Compartments</p>

                                        {tank.compartments.map((comp, idx) => {
                                            const fuelInfo = getFuelInfo(comp.fuel_type_id);
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-1.5 rounded-full ${fuelInfo.color}`}>
                                                            <Droplet size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-700">{comp.code}</p>
                                                            <p className="text-xs text-slate-500">{fuelInfo.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-bold text-slate-700">
                                                            {Number(comp.capacity_nominal).toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-slate-500 ml-1">Gal</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-xs text-slate-400">Install: {tank.installation_type}</span>
                                        <button
                                            onClick={() => setEditingTank(tank)}
                                            className="text-sm text-blue-600 font-medium hover:underline"
                                        >
                                            Edit Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Cylinder size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No tanks found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mt-1">
                                There are no tanks registered for <strong>{selectedStation.name}</strong> yet.
                            </p>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="mt-4 text-blue-600 font-medium hover:underline"
                            >
                                Register the first tank
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* --- EMPTY STATE (Sin selección) --- */
                <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Select a Station</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2">
                        Please search and select a Service Station (EDS) from the list above to view and manage its tanks.
                    </p>
                </div>
            )}
        </div>
    );
}