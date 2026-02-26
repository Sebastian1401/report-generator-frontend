import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Zap, Trash2, RotateCcw, AlertCircle } from 'lucide-react';

export default function TestPMC({ stationId, workOrderId, onCancel, onSave }) {
  console.log('[TestPMC] Component initialized');

  // MOCK DATA: Dispensadores y Mangueras
  const initialDispensers = [
    {
      id: 1,
      code: "Dispenser 1",
      hoses: [
        { id: 101, position: 1, fuel: "Corriente", color: "bg-red-100 text-red-800 border-red-200", tags: ["mg_roja", "corriente"] },
        { id: 102, position: 2, fuel: "Diesel", color: "bg-yellow-100 text-yellow-800 border-yellow-200", tags: ["mg_amarilla", "diesel"] }
      ]
    },
    {
      id: 2,
      code: "Dispenser 2",
      hoses: [
        { id: 201, position: 1, fuel: "Extra", color: "bg-blue-100 text-blue-800 border-blue-200", tags: ["mg_azul", "extra"] }
      ]
    }
  ];

  const [readings, setReadings] = useState({});
  const [excludedDispenserIds, setExcludedDispenserIds] = useState([]);
  const [excludedHoseIds, setExcludedHoseIds] = useState([]);

  useEffect(() => {
    const initialReadings = {};
    initialDispensers.forEach(disp => {
        disp.hoses.forEach(hose => {
            initialReadings[hose.id] = { resistance_ohms: '' };
        });
    });
    setReadings(initialReadings);
  }, []);

  const handleInputChange = (hoseId, value) => {
    setReadings(prev => ({
        ...prev,
        [hoseId]: { resistance_ohms: value }
    }));
  };

  const toggleDispenserExclusion = (dispId) => setExcludedDispenserIds(prev => prev.includes(dispId) ? prev.filter(id => id !== dispId) : [...prev, dispId]);
  const toggleHoseExclusion = (hoseId) => setExcludedHoseIds(prev => prev.includes(hoseId) ? prev.filter(id => id !== hoseId) : [...prev, hoseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    
    // Arrays temporales para armar el payload
    const payloadDispensers = [];
    const collectedTags = new Set(); // Set para evitar duplicados automáticamente

    initialDispensers.forEach(disp => {
        if (excludedDispenserIds.includes(disp.id)) return;

        const hoseResults = [];

        disp.hoses.forEach(hose => {
            if (excludedHoseIds.includes(hose.id)) return;

            const data = readings[hose.id];
            
            if (data.resistance_ohms === '') {
                console.error(`[TestPMC] Error: Missing Ohms for Hose ID ${hose.id} in ${disp.code}`, data);
                hasErrors = true;
            }

            hoseResults.push({
                hose_id: hose.id,
                resistance_ohms: Number(data.resistance_ohms)
            });

            // Recolectar tags de esta manguera
            if (hose.tags) {
                hose.tags.forEach(tag => collectedTags.add(tag));
            }
        });

        // Solo agregamos el dispensador si tiene al menos una manguera probada
        if (hoseResults.length > 0) {
            payloadDispensers.push({
                dispenser_id: disp.id,
                hose_results: hoseResults
            });
        }
    });

    if (hasErrors) {
        console.error('[TestPMC] Payload generation aborted due to missing fields.');
        alert('Por favor ingrese la resistencia (Ohmios) para todas las mangueras activas.');
        return;
    }

    // Armar el objeto final anidado
    const finalPayload = {
        work_order_id: workOrderId,
        tags: Array.from(collectedTags), // Convertir Set a Array
        dispensers: payloadDispensers
    };

    console.log('[TestPMC] Payload generated successfully:', finalPayload);
    onSave(finalPayload);
  };

  const activeDispensers = initialDispensers.filter(d => !excludedDispenserIds.includes(d.id));
  const hiddenDispensers = initialDispensers.filter(d => excludedDispenserIds.includes(d.id));

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><ArrowLeft size={20} /></button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">PMC Test Registration</h2>
                    <p className="text-sm text-slate-500">Prueba Medición de Conductividad (Mangueras)</p>
                </div>
            </div>
            {hiddenDispensers.length > 0 && (
                <div className="flex gap-2">
                    {hiddenDispensers.map(d => (
                        <button key={d.id} onClick={() => toggleDispenserExclusion(d.id)} className="flex items-center text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors">
                            <RotateCcw size={12} className="mr-1" /> Restore {d.code}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {activeDispensers.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-slate-500">All dispensers have been excluded.</p>
                </div>
            ) : (
                activeDispensers.map(disp => {
                    const visibleHoses = disp.hoses.filter(h => !excludedHoseIds.includes(h.id));
                    const hiddenHoses = disp.hoses.filter(h => excludedHoseIds.includes(h.id));

                    return (
                        <div key={disp.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-600 w-1 h-4 rounded-full"></div>
                                        <h3 className="font-bold text-slate-700">{disp.code}</h3>
                                    </div>
                                    {hiddenHoses.length > 0 && (
                                        <div className="flex gap-2">
                                            {hiddenHoses.map(hose => (
                                                <button key={hose.id} type="button" onClick={() => toggleHoseExclusion(hose.id)} className="text-[10px] flex items-center bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full hover:bg-slate-300 transition-colors">
                                                    <RotateCcw size={10} className="mr-1" /> Pos {hose.position}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button type="button" onClick={() => toggleDispenserExclusion(disp.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Exclude entire dispenser"><Trash2 size={16} /></button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {visibleHoses.length > 0 ? visibleHoses.map(hose => (
                                    <div key={hose.id} className="p-4 hover:bg-slate-50/50 transition-colors group relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-500">Pos {hose.position}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wide ${hose.color}`}>{hose.fuel}</span>
                                            <button type="button" onClick={() => toggleHoseExclusion(hose.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1" title="Exclude this hose"><Trash2 size={14} /></button>
                                        </div>
                                        
                                        <div className="flex-1 md:max-w-xs">
                                            <label className="text-xs font-semibold text-slate-500 flex items-center mb-1"><Zap size={12} className="mr-1" /> Resistance (Ohms)</label>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none" 
                                                placeholder="0.00" 
                                                value={readings[hose.id]?.resistance_ohms || ''} 
                                                onChange={(e) => handleInputChange(hose.id, e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                )) : <div className="p-4 text-center text-sm text-slate-400 italic">All hoses excluded from this dispenser.</div>}
                            </div>
                        </div>
                    );
                })
            )}

            <div className="flex justify-end pt-4 border-t border-slate-200">
                <button type="submit" disabled={activeDispensers.length === 0} className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"><Save size={18} /><span>Save PMC Data</span></button>
            </div>
        </form>
    </div>
  );
}