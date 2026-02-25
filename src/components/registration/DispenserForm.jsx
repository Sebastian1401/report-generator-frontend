import { useState } from 'react';
import { Save, X, Plus, X as XIcon, Fuel, GripVertical } from 'lucide-react';

export default function DispenserForm({ onCancel, onSave }) {
  console.log('[DispenserForm] Component rendered');

  const mockStations = [
    { id: 1, name: 'EDS Principal' },
    { id: 2, name: 'EDS Norte' },
    { id: 3, name: 'EDS Sur' }
  ];

  // Definimos los tags automáticos en el mock de combustibles
  const mockFuelTypes = [
    { id: 1, name: 'Gasolina Corriente', color: 'bg-red-500', tags: ['mg_roja', 'corriente'] },
    { id: 2, name: 'Diesel', color: 'bg-yellow-400', tags: ['mg_amarilla', 'diesel'] },
    { id: 3, name: 'Gasolina Extra', color: 'bg-blue-800 text-white', tags: ['mg_azul', 'extra'] },
  ];

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    station_id: '',
    dispenser_number: '',
    island: '',
    brand: '',
    model: '',
    serial: '',
    nii: '',
    tags: [],
    hoses: []
  });

  // Estado local para la UI
  const [hoseCount, setHoseCount] = useState(''); // String vacío para evitar el "0" inicial
  const [tagInput, setTagInput] = useState('');
  const [hoseTagInputs, setHoseTagInputs] = useState({});

  // --- LÓGICA DE CAMPOS SIMPLES ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE GENERACIÓN DE MANGUERAS ---
  const handleHoseCountChange = (e) => {
    const val = e.target.value;
    
    // Si borra todo, dejamos el estado vacío visualmente pero no alteramos el array (o podrías limpiarlo si prefieres)
    if (val === '') {
        setHoseCount('');
        return; 
    }

    const count = parseInt(val);
    setHoseCount(count);

    // Ajustar el array de mangueras
    setFormData(prev => {
      const currentHoses = [...prev.hoses];
      if (count > currentHoses.length) {
        // Agregar nuevas mangueras
        for (let i = currentHoses.length; i < count; i++) {
          currentHoses.push({
            position: i + 1,
            nii: '',
            fuel_type_id: '',
            tags: []
          });
        }
      } else {
        // Recortar mangueras si el numero baja
        currentHoses.length = count;
      }
      return { ...prev, hoses: currentHoses };
    });
  };

  const handleHoseChange = (index, field, value) => {
    const updatedHoses = [...formData.hoses];
    updatedHoses[index] = { ...updatedHoses[index], [field]: value };

    // --- LÓGICA DE TAGS AUTOMÁTICOS ---
    if (field === 'fuel_type_id') {
        const selectedFuel = mockFuelTypes.find(f => f.id === Number(value));
        
        if (selectedFuel) {
            const newTags = selectedFuel.tags;

            // 1. Agregar tags a la MANGUERA (Evitar duplicados locales)
            const currentHoseTags = new Set(updatedHoses[index].tags || []);
            newTags.forEach(tag => currentHoseTags.add(tag));
            updatedHoses[index].tags = Array.from(currentHoseTags);

            // 2. Agregar tags al DISPENSADOR (Evitar duplicados globales)
            setFormData(prev => {
                const currentDispenserTags = new Set(prev.tags || []);
                newTags.forEach(tag => currentDispenserTags.add(tag));
                
                return { 
                    ...prev, 
                    hoses: updatedHoses, 
                    tags: Array.from(currentDispenserTags) 
                };
            });
            return; // Retornamos aquí porque ya hicimos el setFormData dentro del bloque
        }
    }

    setFormData(prev => ({ ...prev, hoses: updatedHoses }));
  };

  // --- LÓGICA DE TAGS (DISPENSADOR) ---
  const addDispenserTag = () => {
    if (tagInput.trim()) {
      // Evitar duplicados
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeDispenserTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  // --- LÓGICA DE TAGS (MANGUERAS) ---
  const addHoseTag = (hoseIndex) => {
    const text = hoseTagInputs[hoseIndex];
    if (text && text.trim()) {
      const updatedHoses = [...formData.hoses];
      const currentTags = updatedHoses[hoseIndex].tags || [];
      
      if (!currentTags.includes(text.trim())) {
          updatedHoses[hoseIndex].tags = [...currentTags, text.trim()];
          setFormData(prev => ({ ...prev, hoses: updatedHoses }));
      }
      setHoseTagInputs(prev => ({ ...prev, [hoseIndex]: '' }));
    }
  };

  const removeHoseTag = (hoseIndex, tagToRemove) => {
    const updatedHoses = [...formData.hoses];
    updatedHoses[hoseIndex].tags = updatedHoses[hoseIndex].tags.filter(t => t !== tagToRemove);
    setFormData(prev => ({ ...prev, hoses: updatedHoses }));
  };

  const handleHoseTagInput = (hoseIndex, value) => {
    setHoseTagInputs(prev => ({ ...prev, [hoseIndex]: value }));
  };

  // --- SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.station_id) return alert('Select a station');
    if (!formData.dispenser_number) return alert('Enter dispenser number');
    if (formData.hoses.length === 0) return alert('Add at least one hose');

    const payload = {
      ...formData,
      dispenser_number: Number(formData.dispenser_number),
      station_id: Number(formData.station_id),
      hoses: formData.hoses.map(h => ({
        ...h,
        fuel_type_id: Number(h.fuel_type_id)
      }))
    };

    console.log('[DispenserForm] Payload ready:', payload);
    onSave({ ...payload, id: Date.now() });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800">New Dispenser Registration</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* SECTION 1: UBICACIÓN Y BÁSICOS */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Location & Basic Info</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Station *</label>
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
              <label className="text-sm font-medium text-slate-700">Dispenser Number *</label>
              <input
                type="number"
                name="dispenser_number"
                value={formData.dispenser_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: 1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Island ID</label>
              <input
                name="island"
                value={formData.island}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: ISL-01"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DATOS TÉCNICOS */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Technical Specifications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ex: Wayne" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Model</label>
              <input name="model" value={formData.model} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ex: Helix 5000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Serial Number</label>
              <input name="serial" value={formData.serial} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ex: SN123456" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">NII (Dispenser)</label>
              <input 
                name="nii" 
                value={formData.nii} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="Ex: 98765" 
                /* Removed required */
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: DISPENSER TAGS */}
        <div>
           <label className="text-sm font-medium text-slate-700 mb-2 block">Dispenser Tags</label>
           <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => removeDispenserTag(tag)} className="ml-2 text-slate-400 hover:text-red-500"><XIcon size={12} /></button>
                </span>
              ))}
              <div className="flex items-center">
                <input 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDispenserTag())}
                  className="px-2 py-1 bg-transparent border-none focus:ring-0 text-sm w-32 placeholder-slate-400"
                  placeholder="Add tag..."
                />
                <button type="button" onClick={addDispenserTag} className="text-blue-600 hover:bg-blue-50 rounded-full p-1"><Plus size={16} /></button>
              </div>
           </div>
        </div>

        <div className="border-t border-slate-100"></div>

        {/* SECTION 4: HOSES CONFIGURATION */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Fuel size={16} className="mr-2" />
              Hoses Configuration
            </h4>
            <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
               <label className="text-sm font-semibold text-blue-800">Total Hoses:</label>
               <input 
                 type="number" 
                 min="1" 
                 max="16"
                 value={hoseCount}
                 onChange={handleHoseCountChange}
                 className="w-16 px-2 py-1 border border-blue-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
          </div>

          <div className="space-y-4">
            {formData.hoses.map((hose, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in slide-in-from-left-2">
                {/* Posición Visual */}
                <div className="flex items-center justify-center md:flex-col md:justify-start md:w-12 border-b md:border-b-0 md:border-r border-slate-200 pb-2 md:pb-0 md:pr-4">
                   <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
                      <GripVertical size={20} />
                   </div>
                   <span className="text-xs font-bold text-slate-500 mt-1">{hose.position}</span>
                </div>

                {/* Campos de la Manguera */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Fuel Product *</label>
                      <select
                        value={hose.fuel_type_id}
                        onChange={(e) => handleHoseChange(index, 'fuel_type_id', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                      >
                        <option value="">Select Fuel...</option>
                        {mockFuelTypes.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">NII (Hose)</label>
                      <input
                        value={hose.nii}
                        onChange={(e) => handleHoseChange(index, 'nii', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Ex: H-101"
                        /* Removed required */
                      />
                   </div>

                   {/* Tags de Manguera */}
                   <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Hose Tags</label>
                      <div className="flex flex-wrap gap-2 items-center">
                         {hose.tags && hose.tags.map((tag, tIdx) => (
                           <span key={tIdx} className="flex items-center bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                             {tag}
                             <button type="button" onClick={() => removeHoseTag(index, tag)} className="ml-1 hover:text-red-500"><XIcon size={10} /></button>
                           </span>
                         ))}
                         <div className="flex items-center space-x-1">
                           <input
                             value={hoseTagInputs[index] || ''}
                             onChange={(e) => handleHoseTagInput(index, e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHoseTag(index))}
                             className="w-24 px-2 py-0.5 text-xs border border-slate-300 rounded focus:border-blue-500 outline-none"
                             placeholder="+ Tag"
                           />
                           <button type="button" onClick={() => addHoseTag(index)} className="text-blue-600 hover:bg-blue-100 p-0.5 rounded"><Plus size={14} /></button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
            {formData.hoses.length === 0 && (
               <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Set the number of hoses to start configuration.
               </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
          <button type="submit" className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Save size={18} />
            <span>Save Dispenser</span>
          </button>
        </div>
      </form>
    </div>
  );
}