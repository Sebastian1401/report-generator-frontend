import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Clock, Ruler, Trash2, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TestPEMH({ stationId, workOrderId, onCancel, onSave }) {
  
  // MOCK DATA: (Mantener tu lógica de carga de tanques)
  const initialTanks = [
    {
      id: 10,
      code: "T-1",
      compartments: [
        { id: 101, name: "Diesel", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      ]
    },
    {
      id: 20,
      code: "T-2",
      compartments: [
        { id: 201, name: "Gasolina Corriente", color: "bg-red-100 text-red-800 border-red-200" },
        { id: 202, name: "Gasolina Extra", color: "bg-blue-100 text-blue-800 border-blue-200" }
      ]
    }
  ];

  const [readings, setReadings] = useState({});
  const [excludedTankIds, setExcludedTankIds] = useState([]);
  
  // NUEVO: Estado para excluir compartimentos individuales
  const [excludedCompIds, setExcludedCompIds] = useState([]);

  useEffect(() => {
    // ... (Tu lógica de inicialización se mantiene igual)
    const initialReadings = {};
    initialTanks.forEach(tank => {
        tank.compartments.forEach(comp => {
            initialReadings[comp.id] = {
                start_time: '',
                end_time: '',
                initial_height: '',
                final_height: ''
            };
        });
    });
    setReadings(initialReadings);
  }, []);

  const handleInputChange = (compartmentId, field, value) => {
    setReadings(prev => ({
        ...prev,
        [compartmentId]: { ...prev[compartmentId], [field]: value }
    }));
  };

  const toggleTankExclusion = (tankId) => {
    setExcludedTankIds(prev => 
        prev.includes(tankId) ? prev.filter(id => id !== tankId) : [...prev, tankId]
    );
  };

  // NUEVO: Función para excluir/restaurar compartimentos
  const toggleCompExclusion = (compId) => {
    setExcludedCompIds(prev => 
        prev.includes(compId) ? prev.filter(id => id !== compId) : [...prev, compId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = [];

    initialTanks.forEach(tank => {
        if (excludedTankIds.includes(tank.id)) return;

        tank.compartments.forEach(comp => {
            // NUEVO: Validar si el compartimento específico está excluido
            if (excludedCompIds.includes(comp.id)) return;

            const data = readings[comp.id];
            payload.push({
                work_order_id: workOrderId,
                tank_id: tank.id,
                compartment_id: comp.id,
                start_time: data.start_time,
                end_time: data.end_time,
                initial_height: Number(data.initial_height),
                final_height: Number(data.final_height)
            });
        });
    });

    console.log('[TestPEMH] Payload generated:', payload);
    onSave(payload);
  };

  const activeTanks = initialTanks.filter(t => !excludedTankIds.includes(t.id));
  const hiddenTanks = initialTanks.filter(t => excludedTankIds.includes(t.id));

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">PEMH Test Registration</h2>
                    <p className="text-sm text-slate-500">Prueba de Estanqueidad de Manholes</p>
                </div>
            </div>
            
            {hiddenTanks.length > 0 && (
                <div className="flex gap-2">
                    {hiddenTanks.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => toggleTankExclusion(t.id)}
                            className="flex items-center text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors"
                        >
                            <RotateCcw size={12} className="mr-1" />
                            Restore {t.code}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {activeTanks.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-slate-500">All tanks have been excluded.</p>
                </div>
            ) : (
                activeTanks.map(tank => {
                    // Filtrar compartimentos visibles
                    const visibleComps = tank.compartments.filter(c => !excludedCompIds.includes(c.id));
                    const hiddenComps = tank.compartments.filter(c => excludedCompIds.includes(c.id));

                    return (
                        <div key={tank.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            {/* CABECERA TANQUE */}
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-600 w-1 h-4 rounded-full"></div>
                                        <h3 className="font-bold text-slate-700">Tank {tank.code}</h3>
                                    </div>
                                    
                                    {/* Botones para restaurar compartimentos ocultos */}
                                    {hiddenComps.length > 0 && (
                                        <div className="flex gap-2">
                                            {hiddenComps.map(comp => (
                                                <button
                                                    key={comp.id}
                                                    type="button"
                                                    onClick={() => toggleCompExclusion(comp.id)}
                                                    className="text-[10px] flex items-center bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full hover:bg-slate-300 transition-colors"
                                                >
                                                    <RotateCcw size={10} className="mr-1" />
                                                    {comp.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="button" 
                                    onClick={() => toggleTankExclusion(tank.id)}
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                                    title="Exclude entire tank"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* LISTA COMPARTIMENTOS */}
                            <div className="divide-y divide-slate-100">
                                {visibleComps.length > 0 ? (
                                    visibleComps.map(comp => (
                                        <div key={comp.id} className="p-4 hover:bg-slate-50/50 transition-colors group relative">
                                            
                                            {/* Header del Compartimento */}
                                            <div className="mb-3 flex justify-between items-center">
                                                <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wide ${comp.color}`}>
                                                    {comp.name}
                                                </span>
                                                
                                                {/* NUEVO: Botón eliminar compartimento */}
                                                <button 
                                                    type="button"
                                                    onClick={() => toggleCompExclusion(comp.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                                                    title="Exclude this compartment"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {/* Inputs */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 flex items-center">
                                                        <Clock size={12} className="mr-1" /> Start Time
                                                    </label>
                                                    <input 
                                                        type="time" 
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none" // Estilo dark para inputs según tu imagen
                                                        value={readings[comp.id]?.start_time || ''}
                                                        onChange={(e) => handleInputChange(comp.id, 'start_time', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 flex items-center">
                                                        <Clock size={12} className="mr-1" /> End Time
                                                    </label>
                                                    <input 
                                                        type="time" 
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                                        value={readings[comp.id]?.end_time || ''}
                                                        onChange={(e) => handleInputChange(comp.id, 'end_time', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 flex items-center">
                                                        <Ruler size={12} className="mr-1" /> Initial Height (mm)
                                                    </label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                                        placeholder="0.00"
                                                        value={readings[comp.id]?.initial_height || ''}
                                                        onChange={(e) => handleInputChange(comp.id, 'initial_height', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-500 flex items-center">
                                                        <Ruler size={12} className="mr-1" /> Final Height (mm)
                                                    </label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                                        placeholder="0.00"
                                                        value={readings[comp.id]?.final_height || ''}
                                                        onChange={(e) => handleInputChange(comp.id, 'final_height', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-400 italic">
                                        All compartments excluded from this tank.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}

            <div className="flex justify-end pt-4 border-t border-slate-200">
                <button 
                    type="submit" 
                    className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Save size={18} />
                    <span>Save PEMH Data</span>
                </button>
            </div>
        </form>
    </div>
  );
}