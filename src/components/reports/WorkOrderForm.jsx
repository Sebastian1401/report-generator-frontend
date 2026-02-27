import { useState } from 'react';
import { Save, X, Calendar, FileText, MapPin, Plus, Trash2, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import TestPEMH from './tests/TestPEMH';
import TestPESC from './tests/TestPESC';
import TestPVSC from './tests/TestPVSC';
import TestPECC from './tests/TestPECC';
import TestPMC from './tests/TestPMC';

export default function WorkOrderForm({ onCancel, onSave }) {
    console.log('[WorkOrderForm] Component rendered');

    const mockStations = [
        { id: 1, name: 'EDS Principal' },
        { id: 2, name: 'EDS Norte' },
        { id: 3, name: 'EDS Sur' }
    ];

    const handleSmartClose = () => {
        if (viewMode.startsWith('TEST_')) {
            setViewMode('HUB');
            setCurrentTest(null);
        } else {
            onCancel();
        }
    };

    const [viewMode, setViewMode] = useState('CREATION');

    const [currentTest, setCurrentTest] = useState(null);

    const [formData, setFormData] = useState({
        id: null,
        station_id: '',
        station_name: '',
        date: new Date().toISOString().split('T')[0],
        observations: '',
        status: 'DRAFT',
        test_tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateDraft = (e) => {
        e.preventDefault();

        if (!formData.station_id) return alert('Select a station');
        if (!formData.date) return alert('Select a date');

        const station = mockStations.find(s => s.id === Number(formData.station_id));
        const newId = Date.now();

        const draftOrder = {
            ...formData,
            id: newId,
            station_id: Number(formData.station_id),
            station_name: station ? station.name : 'Unknown',
        };

        setFormData(draftOrder);
        setViewMode('HUB');
        console.log('[WorkOrderForm] Draft created, switched to HUB mode:', draftOrder);
    };

    const handleAddTest = (testType) => {
        if (!formData.test_tags.includes(testType)) {
            setFormData(prev => ({
                ...prev,
                test_tags: [...prev.test_tags, testType]
            }));
        }

        if (['PEMH', 'PESC', 'PVSC', 'PECC', 'PMC'].includes(testType)) {
            setCurrentTest(testType);
            setViewMode(`TEST_${testType}`);
        }
    };

    const handleSaveTest = (testData) => {
        console.log(`[WorkOrderForm] Received data for ${currentTest}:`, testData);

        setViewMode('HUB');
        setCurrentTest(null);
    };

    const handleFinish = () => {
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 max-w-4xl mx-auto mt-6 flex flex-col max-h-[90vh]">

            {/* HEADER COMPARTIDO */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">
                        {viewMode === 'CREATION' ? 'New Work Order' : `Work Order #${formData.id}`}
                    </h3>
                    {viewMode === 'HUB' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">
                            DRAFT MODE
                        </span>
                    )}
                </div>
                <button onClick={handleSmartClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="overflow-y-auto p-6">

                {/* --- VISTA 1: CREACIÓN (Solo visible al inicio) --- */}
                {viewMode === 'CREATION' && (
                    <form onSubmit={handleCreateDraft} className="space-y-6 max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center">
                                    <MapPin size={16} className="mr-2 text-slate-400" />
                                    Station *
                                </label>
                                <select
                                    name="station_id"
                                    value={formData.station_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                                    required
                                >
                                    <option value="">Select Station...</option>
                                    {mockStations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center">
                                    <Calendar size={16} className="mr-2 text-slate-400" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center">
                                <FileText size={16} className="mr-2 text-slate-400" />
                                Observations
                            </label>
                            <textarea
                                name="observations"
                                value={formData.observations}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                                placeholder="General notes about this work order..."
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button type="submit" className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                <Save size={18} />
                                <span>Create Draft & Open Hub</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* --- VISTA 2: HUB DE PRUEBAS (Visible tras crear Draft) --- */}
                {viewMode === 'HUB' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">

                        {/* Resumen de la Orden (Read-only) */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm">
                                    <MapPin className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{formData.station_name}</h4>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <Calendar size={14} /> {formData.date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-sm text-slate-500 max-w-xs italic">
                                "{formData.observations || 'No observations'}"
                            </div>
                        </div>

                        {/* Área de Pruebas */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Columna Izquierda: Botones de Acción */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Available Tests</h4>

                                <button onClick={() => handleAddTest('PECC')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-left">
                                    <div>
                                        <span className="font-bold text-slate-700 block group-hover:text-blue-600">PECC</span>
                                        <span className="text-xs text-slate-500">Prueba Estanqueidad Cajas</span>
                                    </div>
                                    <Plus size={20} className="text-slate-300 group-hover:text-blue-500" />
                                </button>

                                <button onClick={() => handleAddTest('PEMH')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-left">
                                    <div>
                                        <span className="font-bold text-slate-700 block group-hover:text-blue-600">PEMH</span>
                                        <span className="text-xs text-slate-500">Prueba Estanqueidad Manhole</span>
                                    </div>
                                    <Plus size={20} className="text-slate-300 group-hover:text-blue-500" />
                                </button>

                                <button onClick={() => handleAddTest('PESC')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-left">
                                    <div>
                                        <span className="font-bold text-slate-700 block group-hover:text-blue-600">PESC</span>
                                        <span className="text-xs text-slate-500">Prueba Estanqueidad Spill Container</span>
                                    </div>
                                    <Plus size={20} className="text-slate-300 group-hover:text-blue-500" />
                                </button>

                                <button onClick={() => handleAddTest('PVSC')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-left">
                                    <div>
                                        <span className="font-bold text-slate-700 block group-hover:text-blue-600">PVSC</span>
                                        <span className="text-xs text-slate-500">Prueba Vacio Spill Container</span>
                                    </div>
                                    <Plus size={20} className="text-slate-300 group-hover:text-blue-500" />
                                </button>

                                <button onClick={() => handleAddTest('PMC')} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-left">
                                    <div>
                                        <span className="font-bold text-slate-700 block group-hover:text-blue-600">PMC</span>
                                        <span className="text-xs text-slate-500">Medición Conductividad</span>
                                    </div>
                                    <Plus size={20} className="text-slate-300 group-hover:text-blue-500" />
                                </button>
                            </div>

                            {/* Columna Derecha: Lista de Pruebas Agregadas */}
                            <div className="lg:col-span-2 bg-slate-50/50 rounded-xl border border-slate-200 p-6 min-h-[300px]">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between items-center">
                                    <span>Registered Tests</span>
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{formData.test_tags.length}</span>
                                </h4>

                                {formData.test_tags.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <AlertCircle size={48} className="mb-2 opacity-20" />
                                        <p>No tests added yet.</p>
                                        <p className="text-sm">Select a test from the left menu.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.test_tags.map((tag, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center animate-in slide-in-from-bottom-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-10 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-800">{tag}</h5>
                                                        <p className="text-xs text-slate-500">Status: Pending Data</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg">
                                                        Edit Data
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer del Hub */}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                            <p className="text-sm text-slate-500">
                                * Remember to fill in the data for each test before finishing.
                            </p>
                            <button
                                onClick={handleFinish}
                                className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                <CheckCircle2 size={20} />
                                <span>Finish & Close Order</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* VIEW 3: TEST FORMS */}
                {viewMode === 'TEST_PEMH' && (
                    <TestPEMH stationId={formData.station_id} workOrderId={formData.id} onCancel={() => setViewMode('HUB')} onSave={handleSaveTest} />
                )}

                {viewMode === 'TEST_PESC' && (
                    <TestPESC stationId={formData.station_id} workOrderId={formData.id} onCancel={() => setViewMode('HUB')} onSave={handleSaveTest} />
                )}

                {viewMode === 'TEST_PVSC' && (
                    <TestPVSC stationId={formData.station_id} workOrderId={formData.id} onCancel={() => setViewMode('HUB')} onSave={handleSaveTest} />
                )}

                {viewMode === 'TEST_PECC' && (
                    <TestPECC stationId={formData.station_id} workOrderId={formData.id} onCancel={() => setViewMode('HUB')} onSave={handleSaveTest} />
                )}

                {viewMode === 'TEST_PMC' && (
                    <TestPMC stationId={formData.station_id} workOrderId={formData.id} onCancel={() => setViewMode('HUB')} onSave={handleSaveTest} />
                )}

            </div>
        </div>
    );
}