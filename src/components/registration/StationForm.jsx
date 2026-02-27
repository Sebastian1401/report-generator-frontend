import { useState } from 'react';
import { Save, X, ChevronDown, ChevronUp, Plus, Trash2, Edit2, Tag } from 'lucide-react';
import TankForm from './TankForm';
import DispenserForm from './DispenserForm';

export default function StationForm({ onCancel, onSave, initialData }) {
  console.log('[StationForm] Component rendered', initialData ? 'in EDIT mode' : 'in CREATE mode');

  const [formData, setFormData] = useState(initialData || {
    name: '',
    business_name: '',
    nit: '',
    address: '',
    city: '',
    contact_name: '',
    contact_phone: '',
    contact_position: '',
    tanks: [],
    dispensers: []
  });

  const [showTanks, setShowTanks] = useState(false);
  const [showDispensers, setShowDispensers] = useState(false);

  const [activeModal, setActiveModal] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const getFuelName = (id) => {
    const map = {
      1: 'Gasolina Corriente',
      2: 'Diesel',
      3: 'Gasolina Extra'
    };
    return map[id] || `Desconocido (${id})`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (type, index = null) => {
    setActiveModal(type);
    setEditingIndex(index);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingIndex(null);
  };

  const handleSaveNestedItem = (type, data) => {
    setFormData(prev => {
      const list = [...prev[type]];
      if (editingIndex !== null) {
        list[editingIndex] = data;
      } else {
        list.push(data);
      }
      return { ...prev, [type]: list };
    });
    closeModal();
  };

  const handleDeleteNestedItem = (type, index) => {
    setFormData(prev => {
      const list = [...prev[type]];
      list.splice(index, 1);
      return { ...prev, [type]: list };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[StationForm] Form submitted:', formData);
    
    if (initialData) {
      onSave(formData);
    } else {
      onSave({ ...formData, id: Date.now(), status: 'Active' });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800">
          {initialData ? 'Edit Station Details' : 'New Station Registration'}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Company Information */}
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-800 border-b pb-2">Company Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Station Name (Commercial) *</label>
                <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: EDS Central"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Business Name (Razón Social) *</label>
                <input
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: Inversiones Garcia SAS"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">NIT / Tax ID *</label>
                <input
                name="nit"
                required
                value={formData.nit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: 900.123.456-7"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">City *</label>
                <input
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: Bogotá"
                />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Address *</label>
                <input
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Ex: Cra 50 # 20-10"
                />
            </div>
            </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-2">
            <h4 className="text-md font-semibold text-slate-800 border-b pb-2">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Name</label>
                    <input
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Manager Name"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Position</label>
                    <input
                    name="contact_position"
                    value={formData.contact_position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Ex: Administrator"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Phone</label>
                    <input
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Ex: 300 123 4567"
                    />
                </div>
            </div>
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* SECTION: TANKS ACCORDION */}
        <div className="rounded-lg border border-slate-200 overflow-hidden mb-4">
          <button
            type="button"
            onClick={() => setShowTanks(!showTanks)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${showTanks ? 'bg-blue-500' : 'bg-slate-300'}`} />
              <span className="font-medium text-slate-700">Add Initial Tanks</span>
            </div>
            {showTanks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showTanks && (
            <div className="p-4 bg-white animate-in slide-in-from-top-2 border-t border-slate-200">
              {formData.tanks.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-4">No tanks added yet.</p>
              ) : (
                <div className="space-y-6 mb-4">
                  {formData.tanks.map((tank, idx) => {
                    const tankType = tank.compartments?.length > 1 ? 'Bicompartido' : 'Único';

                    return (
                      <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        {/* Cabecera del Tanque (Nombre + Detalles Inline) */}
                        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                          <div className="flex flex-wrap items-center gap-4">
                            <h5 className="font-bold text-slate-700">Tanque: {tank.code}</h5>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-600 font-medium">
                              <span className="bg-white px-2 py-1 rounded border border-slate-200">{tankType}</span>
                              {tank.material ? <span className="bg-white px-2 py-1 rounded border border-slate-200">{tank.material}</span> : null}
                              {tank.installation_type ? <span className="bg-white px-2 py-1 rounded border border-slate-200">{tank.installation_type}</span> : null}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button type="button" onClick={() => openModal('tanks', idx)} className="text-blue-600 hover:bg-blue-200 bg-white border border-slate-200 p-1.5 rounded transition-colors shadow-sm" title="Editar Tanque"><Edit2 size={16} /></button>
                            <button type="button" onClick={() => handleDeleteNestedItem('tanks', idx)} className="text-red-500 hover:bg-red-100 bg-white border border-slate-200 p-1.5 rounded transition-colors shadow-sm" title="Eliminar Tanque"><Trash2 size={16} /></button>
                          </div>
                        </div>

                        <div className="p-4 bg-white">
                          {/* Zona de Tags del Tanque */}
                          {tank.tags && tank.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {tank.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-full text-xs border border-slate-200 flex items-center">
                                  <Tag size={12} className="mr-1 text-slate-400" /> {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Tabla de Compartimentos con anchos fijos */}
                          <div className="overflow-hidden border border-slate-200 rounded-lg">
                            <table className="w-full text-sm text-left table-fixed">
                              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                  <th className="px-4 py-2 font-semibold w-2/12">Nomenclatura</th>
                                  <th className="px-4 py-2 font-semibold w-4/12">Producto</th>
                                  <th className="px-4 py-2 font-semibold w-3/12 text-right">Cap. Nominal</th>
                                  <th className="px-4 py-2 font-semibold w-3/12 text-right">Cap. Operacional</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {tank.compartments.map((c, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-4 py-2 font-bold text-slate-700 truncate">{c.code}</td>
                                    <td className="px-4 py-2 truncate">{getFuelName(c.fuel_type_id)}</td>
                                    <td className="px-4 py-2 text-right truncate">{c.capacity_nominal} Gal</td>
                                    <td className="px-4 py-2 text-right truncate">{c.capacity_operational} Gal</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <button type="button" onClick={() => openModal('tanks')} className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-100">
                <Plus size={16} /> <span>Add Tank</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION: DISPENSERS ACCORDION */}
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDispensers(!showDispensers)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${showDispensers ? 'bg-blue-500' : 'bg-slate-300'}`} />
              <span className="font-medium text-slate-700">Add Initial Dispensers</span>
            </div>
            {showDispensers ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showDispensers && (
            <div className="p-4 bg-white animate-in slide-in-from-top-2 border-t border-slate-200">
              {formData.dispensers.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-4">No dispensers added yet.</p>
              ) : (
                <div className="space-y-6 mb-4">
                  {formData.dispensers.map((disp, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      {/* Cabecera del Dispensador (Nombre + Detalles Inline) */}
                      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                        <div className="flex flex-wrap items-center gap-4">
                          <h5 className="font-bold text-slate-700">Dispensador: {disp.dispenser_number}</h5>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-600 font-medium">
                            {disp.brand && <span className="bg-white px-2 py-1 rounded border border-slate-200">{disp.brand}</span>}
                            {disp.model && <span className="bg-white px-2 py-1 rounded border border-slate-200">{disp.model}</span>}
                            {disp.serial && <span className="bg-white px-2 py-1 rounded border border-slate-200">S/N: {disp.serial}</span>}
                            {disp.island && <span className="bg-white px-2 py-1 rounded border border-slate-200">Isla: {disp.island}</span>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button type="button" onClick={() => openModal('dispensers', idx)} className="text-blue-600 hover:bg-blue-200 bg-white border border-slate-200 p-1.5 rounded transition-colors shadow-sm" title="Editar Dispensador"><Edit2 size={16} /></button>
                          <button type="button" onClick={() => handleDeleteNestedItem('dispensers', idx)} className="text-red-500 hover:bg-red-100 bg-white border border-slate-200 p-1.5 rounded transition-colors shadow-sm" title="Eliminar Dispensador"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        {/* Zona de Tags del Dispensador */}
                        {disp.tags && disp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {disp.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-full text-xs border border-slate-200 flex items-center">
                                <Tag size={12} className="mr-1 text-slate-400" /> {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tabla de Mangueras con anchos fijos */}
                        <div className="overflow-hidden border border-slate-200 rounded-lg">
                          <table className="w-full text-sm text-left table-fixed">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                              <tr>
                                <th className="px-4 py-2 font-semibold w-2/12 text-center">Manguera</th>
                                <th className="px-4 py-2 font-semibold w-3/12">Producto</th>
                                <th className="px-4 py-2 font-semibold w-3/12">NII</th>
                                <th className="px-4 py-2 font-semibold w-4/12">Etiquetas</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {disp.hoses.map((h, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-2 font-bold text-slate-700 text-center truncate">{h.position}</td>
                                  <td className="px-4 py-2 truncate">{getFuelName(h.fuel_type_id)}</td>
                                  <td className="px-4 py-2 text-slate-500 truncate">{h.nii || '-'}</td>
                                  <td className="px-4 py-2">
                                    {h.tags && h.tags.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {h.tags.map(t => (
                                          <span key={t} className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm text-xs truncate max-w-full">
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    ) : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => openModal('dispensers')} className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-100">
                <Plus size={16} /> <span>Add Dispenser</span>
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
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
            <span>{initialData ? 'Update Station' : 'Save Station'}</span>
          </button>
        </div>
      </form>

      {/* OVERLAY */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl relative my-auto">
            {activeModal === 'tanks' && (
              <TankForm
                isNested={true}
                initialData={editingIndex !== null ? formData.tanks[editingIndex] : null}
                onSave={(data) => handleSaveNestedItem('tanks', data)}
                onCancel={closeModal}
              />
            )}
            {activeModal === 'dispensers' && (
              <DispenserForm
                isNested={true}
                initialData={editingIndex !== null ? formData.dispensers[editingIndex] : null}
                onSave={(data) => handleSaveNestedItem('dispensers', data)}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}