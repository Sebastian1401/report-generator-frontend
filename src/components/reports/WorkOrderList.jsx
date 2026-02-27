import { useState, useRef, useEffect } from 'react';
import { Plus, Search, X, ChevronDown, MapPin, Calendar, FileText, ClipboardList } from 'lucide-react';
import WorkOrderForm from './WorkOrderForm';

export default function WorkOrderList() {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);

    const mockStations = [
        { id: 1, name: 'EDS Principal', address: 'Cra 45 # 22-10' },
        { id: 2, name: 'EDS Norte', address: 'Autonorte Km 20' },
        { id: 3, name: 'EDS Sur', address: 'Av Boyaca # 50' },
    ];

    const [workOrders, setWorkOrders] = useState([
        {
            id: 101,
            station_id: 1,
            station_name: 'EDS Principal',
            date: '2023-10-25',
            status: 'DRAFT',
            test_tags: ['PECC', 'PEMH'],
            observations: 'Revisión anual programada.'
        },
        {
            id: 102,
            station_id: 1,
            station_name: 'EDS Principal',
            date: '2023-11-01',
            status: 'COMPLETED',
            test_tags: ['PECC'],
            observations: 'Todo ok.'
        }
    ]);

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

    const handleSave = (newPayload) => {
        console.log('[WorkOrderList] Saving Final Order:', newPayload);
        setWorkOrders([newPayload, ...workOrders]);
        setIsCreating(false);
    };

    const visibleOrders = selectedStation
        ? workOrders.filter(wo => wo.station_id === selectedStation.id)
        : [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    if (isCreating) {
        return <WorkOrderForm onCancel={() => setIsCreating(false)} onSave={handleSave} />;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Reports Generation</h2>
                    <p className="text-slate-500">Create Work Orders and register field tests.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>New Work Order</span>
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="mb-8 max-w-xl relative" ref={searchRef}>
                <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Station</label>
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

            {/* ORDERS LIST */}
            {selectedStation ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-semibold text-slate-800">Orders for {selectedStation.name}</h3>
                        <span className="text-xs font-medium bg-white border px-2 py-1 rounded-full text-slate-500">{visibleOrders.length} Records</span>
                    </div>

                    {visibleOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs uppercase text-slate-500 bg-slate-50/50">
                                        <th className="px-6 py-3 font-semibold">ID</th>
                                        <th className="px-6 py-3 font-semibold">Date</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Tests (Tags)</th>
                                        <th className="px-6 py-3 font-semibold">Observations</th>
                                        <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visibleOrders.map((wo) => (
                                        <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">#{wo.id}</td>
                                            <td className="px-6 py-4 text-slate-600 flex items-center">
                                                <Calendar size={14} className="mr-2 text-slate-400" />
                                                {wo.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(wo.status)}`}>
                                                    {wo.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {wo.test_tags.length > 0 ? wo.test_tags.map((tag, i) => (
                                                        <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 text-[10px] font-bold">
                                                            {tag}
                                                        </span>
                                                    )) : <span className="text-slate-400 text-xs italic">No tests</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm max-w-xs truncate" title={wo.observations}>
                                                {wo.observations || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Open</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            No work orders found for this station.
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Select a Station</h3>
                    <p className="text-slate-500">Please select a station to view its work orders.</p>
                </div>
            )}
        </div>
    );
}