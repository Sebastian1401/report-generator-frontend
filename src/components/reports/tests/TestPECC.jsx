import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Clock, Ruler, Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import TestWrapper from './TestWrapper';

export default function TestPECC({ stationId, workOrderId, onCancel, onSave, initialData }) {
    console.log('[TestPECC] Component initialized');

    const initialDispensers = [
        { id: 1, code: "Dispenser 1", brand: "Gilbarco", model: "Encore 500" },
        { id: 2, code: "Dispenser 2", brand: "Wayne", model: "Helix 5000" }
    ];

    const [readings, setReadings] = useState(() => {
        if (initialData && Array.isArray(initialData)) {
            const mapped = {};
            initialData.forEach(item => {
                mapped[item.dispenser_id] = {
                    start_time: item.start_time || '',
                    end_time: item.end_time || '',
                    initial_height: item.initial_height || '',
                    final_height: item.final_height || ''
                };
            });
            return mapped;
        }
        return {};
    });

    const [excludedDispenserIds, setExcludedDispenserIds] = useState(() => {
        if (initialData && Array.isArray(initialData)) {
            const includedIds = initialData.map(item => item.dispenser_id);
            return initialDispensers
                .filter(d => !includedIds.includes(d.id))
                .map(d => d.id);
        }
        return [];
    });

    useEffect(() => {
        if (!initialData) {
            const initialReadings = {};
            initialDispensers.forEach(disp => {
                initialReadings[disp.id] = {
                    start_time: '',
                    end_time: '',
                    initial_height: '',
                    final_height: ''
                };
            });
            setReadings(initialReadings);
        }
    }, [initialData]);

    const handleInputChange = (dispId, field, value) => {
        setReadings(prev => ({
            ...prev,
            [dispId]: { ...prev[dispId], [field]: value }
        }));
    };

    const toggleDispenserExclusion = (dispId) => {
        setExcludedDispenserIds(prev =>
            prev.includes(dispId) ? prev.filter(id => id !== dispId) : [...prev, dispId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = [];
        let hasErrors = false;

        initialDispensers.forEach(disp => {
            if (excludedDispenserIds.includes(disp.id)) return;

            const data = readings[disp.id];

            if (!data.start_time || !data.end_time || data.initial_height === '' || data.final_height === '') {
                console.error(`[TestPECC] Error: Missing data for Dispenser ID ${disp.id}`, data);
                hasErrors = true;
            }

            payload.push({
                work_order_id: workOrderId,
                dispenser_id: disp.id,
                start_time: data.start_time,
                end_time: data.end_time,
                initial_height: Number(data.initial_height),
                final_height: Number(data.final_height)
            });
        });

        if (hasErrors) {
            console.error('[TestPECC] Payload generation aborted due to missing fields.');
            alert('Por favor complete todos los campos de los dispensadores activos.');
            return;
        }

        console.log('[TestPECC] Payload generated successfully:', payload);
        onSave(payload);
    };

    const activeDispensers = initialDispensers.filter(d => !excludedDispenserIds.includes(d.id));
    const hiddenDispensers = initialDispensers.filter(d => excludedDispenserIds.includes(d.id));

    const restoreButtons = hiddenDispensers.length > 0 ? (
        hiddenDispensers.map(d => (
            <button key={d.id} type="button" onClick={() => toggleDispenserExclusion(d.id)} className="flex items-center text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors">
                <RotateCcw size={12} className="mr-1" /> Restore {d.code || `Pos ${d.position}`}
            </button>
        ))
    ) : null;

    return (
        <TestWrapper
            title="PECC Test Registration"
            subtitle="Prueba Estanqueidad Cajas Contenedoras (Dispensadores)"
            onCancel={onCancel}
            onSubmit={handleSubmit}
            isSubmitDisabled={activeDispensers.length === 0}
            submitText="Save Data"
            headerActions={restoreButtons}
        >
            {activeDispensers.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-slate-500">All dispensers have been excluded.</p>
                </div>
            ) : (
                activeDispensers.map(disp => (
                    <div key={disp.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 w-1 h-4 rounded-full"></div>
                                <h3 className="font-bold text-slate-700">{disp.code}</h3>
                                <span className="text-xs text-slate-400 bg-white border px-2 py-0.5 rounded-full">{disp.brand} | {disp.model}</span>
                            </div>
                            <button type="button" onClick={() => toggleDispenserExclusion(disp.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Exclude this dispenser"><Trash2 size={16} /></button>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 flex items-center"><Clock size={12} className="mr-1" /> Start Time</label>
                                <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none" value={readings[disp.id]?.start_time || ''} onChange={(e) => handleInputChange(disp.id, 'start_time', e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 flex items-center"><Clock size={12} className="mr-1" /> End Time</label>
                                <input type="time" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none" value={readings[disp.id]?.end_time || ''} onChange={(e) => handleInputChange(disp.id, 'end_time', e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 flex items-center"><Ruler size={12} className="mr-1" /> Initial Height (mm)</label>
                                <input type="number" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none" placeholder="0.00" value={readings[disp.id]?.initial_height || ''} onChange={(e) => handleInputChange(disp.id, 'initial_height', e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 flex items-center"><Ruler size={12} className="mr-1" /> Final Height (mm)</label>
                                <input type="number" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-900 text-white focus:ring-1 focus:ring-blue-500 outline-none" placeholder="0.00" value={readings[disp.id]?.final_height || ''} onChange={(e) => handleInputChange(disp.id, 'final_height', e.target.value)} required />
                            </div>
                        </div>
                    </div>
                ))
            )}

        </TestWrapper>
    );
}