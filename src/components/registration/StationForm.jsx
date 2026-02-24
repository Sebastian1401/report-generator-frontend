import { useState } from 'react';
import { Save, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function StationForm({ onCancel, onSave }) {
  console.log('[StationForm] Component rendered');

  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    nit: '',
    address: '',
    city: '',
    contact_name: '',
    contact_phone: '',
    contact_position: ''
  });

  const [showTanks, setShowTanks] = useState(false);
  const [showDispensers, setShowDispensers] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[StationForm] Form submitted:', formData);
    
    // Simulate API call
    onSave({ ...formData, id: Date.now(), status: 'Active' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800">New Station Registration</h3>
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

        {/* Optional Section: Tanks */}
        <div className="rounded-lg border border-slate-200 overflow-hidden">
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
            <div className="p-4 bg-white animate-in slide-in-from-top-2">
                <p className="text-sm text-slate-500 italic">Tank configuration form will appear here...</p>
            </div>
            )}
        </div>

        {/* Optional Section: Dispensers */}
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
            <div className="p-4 bg-white animate-in slide-in-from-top-2">
                <p className="text-sm text-slate-500 italic">Dispenser configuration form will appear here...</p>
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
            <span>Save Station</span>
          </button>
        </div>
      </form>
    </div>
  );
}