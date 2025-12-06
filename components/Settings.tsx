import React, { useState } from 'react';
import { ServiceOption } from '../types';
import { Plus, Trash2, Package, Sparkles } from 'lucide-react';

interface SettingsProps {
  services: ServiceOption[];
  onAddService: (service: ServiceOption) => void;
  onDeleteService: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ services, onAddService, onDeleteService }) => {
  const [newService, setNewService] = useState<Partial<ServiceOption>>({
    name: '', description: '', priceEstimate: 0
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.name && newService.priceEstimate) {
      onAddService({
        id: `srv_${Date.now()}`,
        name: newService.name,
        description: newService.description || '',
        priceEstimate: Number(newService.priceEstimate)
      });
      setNewService({ name: '', description: '', priceEstimate: 0 });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
         <h2 className="text-3xl font-bold text-slate-800">Agency Settings</h2>
         <p className="text-slate-500 mt-1">Configure your service offerings and customization options.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Package size={20} /></div>
          Service Offerings
        </h3>
        <p className="text-slate-500 mb-8 max-w-2xl text-sm leading-relaxed">
            Define the specific services and packages <strong>ecowebagency</strong> offers. 
            These options will appear when tagging new leads or creating proposals.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* List of Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Services</h4>
            {services.map(service => (
              <div key={service.id} className="group flex items-start justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-all">
                <div>
                  <h4 className="font-bold text-slate-800">{service.name}</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-snug">{service.description}</p>
                  <div className="mt-3 inline-block px-2 py-1 bg-white rounded border border-slate-200 text-xs font-semibold text-teal-700">
                    Est. ${service.priceEstimate.toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteService(service.id)}
                  className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Service"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Service Form */}
          <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200/60 h-fit">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500"/> Add Custom Offering
            </h4>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Service Name</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                  placeholder="e.g. Technical SEO Audit"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white resize-none"
                  value={newService.description}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                  placeholder="What is included in this service?"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Starting Price ($)</label>
                <input 
                  required
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  value={newService.priceEstimate || ''}
                  onChange={e => setNewService({...newService, priceEstimate: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-200"
              >
                <Plus size={18} /> Add Service
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;