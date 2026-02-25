import { useState } from 'react';
import { Save, X, ToggleLeft, ToggleRight, Cylinder, Tag, Plus, Trash2 } from 'lucide-react';

export default function TankForm({ onCancel, onSave }) {
  console.log('[TankForm] Component rendered');

  const mockStations = [
    { id: 1, name: 'EDS Principal' },
    { id: 2, name: 'EDS Norte' }
  ];

  const mockFuelTypes = [
    { id: 1, name: 'Gasolina Corriente', color: 'bg-yellow-400' },
    { id: 2, name: 'Gasolina Extra', color: 'bg-red-500' },
    { id: 3, name: 'Diesel', color: 'bg-slate-800 text-white' },
  ];

  const [formData, setFormData] = useState({
    code: '',
    type: 'Horizontal',
    material: 'Steel',
    installation_type: 'Underground',
    tags: [], // Array de strings
    station_id: '',
    compartments: [
      { code: '', capacity_nominal: '', capacity_operational: '', fuel_type_id: '' }
    ]
  });

  const [isDual, setIsDual] = useState(false);
  
  // Estado para la UI de Tags
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  // Helpers de formato numérico
  const formatNumber = (value) => {
    if (value === '' || value === undefined) return '';
    const number = Number(value.toString().replace(/[^0-9.]/g, ''));
    return number.toLocaleString('en-US'); 
  };

  const parseNumber = (value) => value.replace(/,/g, '');

  const handleTankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompartmentChange = (index, field, value) => {
    const updatedCompartments = [...formData.compartments];
    const cleanValue = (field === 'capacity_nominal' || field === 'capacity_operational')
      ? parseNumber(value)
      : value;

    updatedCompartments[index] = {
      ...updatedCompartments[index],
      [field]: cleanValue
    };
    setFormData(prev => ({ ...prev, compartments: updatedCompartments }));
  };

  // --- LÓGICA DE TAGS ---
  const handleAddTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar submit del formulario
      handleAddTag();
    }
  };
  // ----------------------

  const toggleDualMode = () => {
    setIsDual(!isDual);
    if (!isDual) {
      setFormData(prev => ({
        ...prev,
        compartments: [
          ...prev.compartments,
          { code: '', capacity_nominal: '', capacity_operational: '', fuel_type_id: '' }
        ]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        compartments: [prev.compartments[0]]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
        ...formData,
        compartments: formData.compartments.map(c => ({
            ...c,
            capacity_nominal: Number(c.capacity_nominal),
            capacity_operational: Number(c.capacity_operational)
        }))
    };

    console.log('[TankForm] Payload ready for API:', payload);
    
    if (!formData.station_id || !formData.code) {
      alert('Please fill in Station and Tank Code.');
      return;
    }

    onSave({ ...payload, id: Date.now() });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800">New Tank Registration</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* SECTION 1: TANK PHYSICAL DETAILS */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <Cylinder size={16} className="mr-2" />
            Tank Specifications
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Station *</label>
              <select
                name="station_id"
                value={formData.station_id}
                onChange={handleTankChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                required
              >
                <option value="">Select Station...</option>
                {mockStations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tank Code *</label>
              <input
                name="code"
                value={formData.code}
                onChange={handleTankChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: T-01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Material</label>
              <select
                name="material"
                value={formData.material}
                onChange={handleTankChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="Steel">Steel (Acero)</option>
                <option value="Fiberglass">Fiberglass (Fibra)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Installation</label>
              <select
                name="installation_type"
                value={formData.installation_type}
                onChange={handleTankChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="Underground">Underground (Subterráneo)</option>
                <option value="Aboveground">Aboveground (Aéreo)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleTankChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="Horizontal">Horizontal</option>
                <option value="Vertical">Vertical</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: TAGS MANAGEMENT */}
        <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Tags / Labels</label>
            <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                {formData.tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-full text-sm shadow-sm">
                        <Tag size={14} className="mr-2 text-slate-400" />
                        {tag}
                        <button 
                            type="button" 
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-slate-400 hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}

                {!isAddingTag ? (
                    <button
                        type="button"
                        onClick={() => setIsAddingTag(true)}
                        className="flex items-center space-x-1 px-3 py-1 rounded-full border border-dashed border-slate-400 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-500 text-sm transition-colors"
                    >
                        <Plus size={14} />
                        <span>Add Tag</span>
                    </button>
                ) : (
                    <div className="flex items-center animate-in fade-in slide-in-from-left-2">
                        <input
                            autoFocus
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            onBlur={() => {
                                if(!currentTag) setIsAddingTag(false);
                            }}
                            className="px-3 py-1 border border-blue-500 rounded-l-full focus:outline-none text-sm w-32"
                            placeholder="Type tag..."
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-r-full hover:bg-blue-700"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Keywords used for searching and filtering (e.g., "blanco", "vlv_sobrellenado").</p>
        </div>

        <div className="border-t border-slate-100"></div>

        {/* SECTION 3: COMPARTMENTS */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Compartment Configuration</h4>
            
            <button
              type="button"
              onClick={toggleDualMode}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${
                isDual 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-sm font-medium">Dual Compartment</span>
              {isDual ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>

          <div className="space-y-6">
            {formData.compartments.map((comp, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative animate-in slide-in-from-left-2">
                <div className="absolute top-0 right-0 p-2">
                  <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-200 rounded">
                    Compartment #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Nomenclature / Code</label>
                    <input
                      value={comp.code}
                      onChange={(e) => handleCompartmentChange(index, 'code', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      placeholder={`Ex: ${index + 1}A`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Product</label>
                    <select
                      value={comp.fuel_type_id}
                      onChange={(e) => handleCompartmentChange(index, 'fuel_type_id', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm bg-white"
                      required
                    >
                      <option value="">Select Fuel...</option>
                      {mockFuelTypes.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Nominal Cap. (Gal)</label>
                    <input
                      type="text"
                      value={formatNumber(comp.capacity_nominal)}
                      onChange={(e) => handleCompartmentChange(index, 'capacity_nominal', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Ex: 10,000"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Operational Cap. (Gal)</label>
                    <input
                      type="text"
                      value={formatNumber(comp.capacity_operational)}
                      onChange={(e) => handleCompartmentChange(index, 'capacity_operational', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Ex: 9,800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={18} />
            <span>Save Tank</span>
          </button>
        </div>
      </form>
    </div>
  );
}