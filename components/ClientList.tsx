import React, { useState } from 'react';
import { Client, ClientStatus, ServiceOption, Interaction } from '../types';
import { Plus, Search, Phone, Edit2, Trash2, Mail, MessageSquare, X, Calendar, ExternalLink, Globe, FileText, Sparkles, Clipboard, Loader2 } from 'lucide-react';
import { generateColdCallScript, parseLeadData } from '../services/geminiService';

interface ClientListProps {
  clients: Client[];
  services: ServiceOption[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, services, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  // Client Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '', company: '', industry: '', email: '', phone: '', website: '', projectNotes: '', status: ClientStatus.LEAD, interestedServices: []
  });

  // Call Log Modal State
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [clientToCall, setClientToCall] = useState<Client | null>(null);
  const [callNote, setCallNote] = useState('');
  
  // AI Script Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Paste/Import Modal State
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);


  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: selectedClient ? selectedClient.id : `c_${Date.now()}`,
      name: formData.name || 'Unknown',
      company: formData.company || 'Unknown Company',
      industry: formData.industry || '',
      email: formData.email || '',
      phone: formData.phone || '',
      website: formData.website || '',
      projectNotes: formData.projectNotes || '',
      status: formData.status as ClientStatus,
      interestedServices: formData.interestedServices || [],
      interactions: selectedClient ? selectedClient.interactions : [],
      lastContacted: selectedClient ? selectedClient.lastContacted : undefined,
    };

    if (selectedClient) {
      onUpdateClient(newClient);
    } else {
      onAddClient(newClient);
    }
    closeModal();
  };

  const openModal = (client?: Client) => {
    if (client) {
      setSelectedClient(client);
      setFormData(client);
    } else {
      setSelectedClient(null);
      setFormData({ 
        name: '', company: '', industry: '', 
        email: '', phone: '', website: '', 
        projectNotes: '', 
        status: ClientStatus.LEAD, 
        interestedServices: [] 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleGenerateScript = async (client: Client) => {
    setAiModalOpen(true);
    setIsGenerating(true);
    setGeneratedScript('Generating personalized script based on audit notes...');
    const script = await generateColdCallScript(client, services);
    setGeneratedScript(script);
    setIsGenerating(false);
  };

  const openCallModal = (client: Client) => {
    setClientToCall(client);
    setCallNote('');
    setIsCallModalOpen(true);
  };

  const handleSaveCall = () => {
    if (!clientToCall) return;

    const interaction: Interaction = {
      id: `i_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Call',
      notes: callNote || 'No notes added.'
    };

    const updatedClient = {
      ...clientToCall,
      lastContacted: interaction.date,
      interactions: [...clientToCall.interactions, interaction]
    };

    onUpdateClient(updatedClient);
    setIsCallModalOpen(false);
    setClientToCall(null);
  };

  const handleImportLead = async () => {
    if (!pasteContent.trim()) return;
    setIsParsing(true);
    try {
      const parsedData = await parseLeadData(pasteContent);
      const newClient: Client = {
        id: `c_${Date.now()}`,
        name: parsedData.name || 'Unknown',
        company: parsedData.company || 'Unknown Company',
        industry: parsedData.industry || 'General',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        website: parsedData.website || '',
        projectNotes: parsedData.projectNotes || 'Imported via text paste.',
        status: ClientStatus.LEAD,
        interestedServices: [],
        interactions: [],
        lastContacted: undefined
      };
      
      onAddClient(newClient);
      setIsPasteModalOpen(false);
      setPasteContent('');
    } catch (error) {
      console.error("Failed to import client", error);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Prospects & Clients</h2>
          <p className="text-slate-500 text-sm mt-1">Manage collected leads and track outreach progress.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsPasteModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
            >
                <Clipboard size={18} /> Import Lead
            </button>
            <button 
                onClick={() => openModal()}
                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
            >
                <Plus size={20} /> Add New Lead
            </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search company, name, or industry..." 
            className="w-full pl-11 pr-4 py-3 border-none bg-transparent focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-auto w-px bg-slate-100 mx-2 hidden md:block"></div>
        <select 
          className="px-6 py-3 border-none bg-transparent focus:outline-none text-slate-600 font-medium cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Business Info</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Website & Scope</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                            {client.company.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{client.company}</div>
                            <div className="text-sm text-slate-500">{client.name}</div>
                            <div className="text-[10px] text-slate-400 mt-1 inline-block bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{client.industry}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="space-y-1.5">
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={14} className="text-slate-400"/> {client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400"/> {client.email}
                        </div>
                      )}
                      {(!client.phone && !client.email) && <span className="text-xs text-slate-400 italic">No contact info</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="mb-2">
                       {client.website ? (
                         <a href={client.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium hover:underline">
                           <Globe size={14}/> {client.website.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ExternalLink size={10}/>
                         </a>
                       ) : (
                         <span className="text-sm text-slate-400 flex items-center gap-1.5"><Globe size={14}/> No Website</span>
                       )}
                    </div>
                    {client.projectNotes && (
                      <div className="text-sm text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50 relative">
                        <span className="font-bold text-[10px] text-amber-600/80 block mb-1 uppercase tracking-wide">Audit Notes</span>
                        {client.projectNotes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5
                      ${client.status === ClientStatus.LEAD ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                        client.status === ClientStatus.CLOSED ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        client.status === ClientStatus.LOST ? 'bg-red-50 text-red-700 border border-red-100' : 
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                          client.status === ClientStatus.LEAD ? 'bg-blue-500' : 
                          client.status === ClientStatus.CLOSED ? 'bg-emerald-500' :
                          client.status === ClientStatus.LOST ? 'bg-red-500' : 'bg-amber-500'
                      }`}></span>
                      {client.status}
                    </span>
                    <div className="mt-2 text-xs text-slate-400 pl-1">
                       {client.lastContacted ? `Updated: ${client.lastContacted}` : 'New Entry'}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleGenerateScript(client)}
                        title="AI Sales Script"
                        className="p-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                      >
                        <Sparkles size={16} />
                      </button>
                      <button 
                        onClick={() => openCallModal(client)}
                        title="Log Interaction"
                        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <Phone size={16} />
                      </button>
                      <button 
                        onClick={() => openModal(client)}
                        title="Edit Details"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteClient(client.id)}
                        title="Remove"
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                        <Search size={48} className="text-slate-200 mb-4"/>
                        <p>No leads found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paste Import Modal */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg"><Clipboard size={20} className="text-slate-600"/></div>
                    Import from Text
                </h3>
                <button onClick={() => setIsPasteModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                  <X size={20} />
                </button>
             </div>
             <p className="text-sm text-slate-500 mb-4">
                 Paste raw text from a chat, email, or document below. The AI will automatically extract client details and create a new lead.
             </p>
             <textarea 
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none h-48 resize-none text-slate-700 bg-slate-50 mb-4"
                placeholder="e.g. 'Found a new lead: Mike form BuilderCorp. Phone is 555-0192. They need a new website because their current one is not mobile friendly.'"
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                autoFocus
             />
             <div className="flex justify-end gap-3">
                 <button onClick={() => setIsPasteModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                 <button 
                    onClick={handleImportLead}
                    disabled={isParsing || !pasteContent.trim()}
                    className="px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-medium shadow-lg shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {isParsing ? <><Loader2 size={18} className="animate-spin"/> Analyzing...</> : <><Sparkles size={18} className="text-teal-400"/> Create Lead</>}
                 </button>
             </div>
          </div>
        </div>
      )}

      {/* Add/Edit Client Modal (Lead Collection Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fade-in-up max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <div>
                   <h3 className="text-2xl font-bold text-slate-800">{selectedClient ? 'Edit Lead' : 'Add Lead from Maps'}</h3>
                   <p className="text-sm text-slate-500">Enter details collected from Google Maps or other sources.</p>
               </div>
               <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Business Info */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div> Business Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                    <input required placeholder="e.g. Joe's Pizza" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry / Category</label>
                    <input required placeholder="e.g. Restaurant" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                      <input placeholder="https://..." className="w-full pl-10 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Contact Person
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                    <input placeholder="e.g. Joe Smith" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                    <input placeholder="(555) 000-0000" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input type="email" placeholder="joe@example.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Section 3: Audit & Status */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-teal-600"/> Opportunity / Audit Notes
                </label>
                <textarea 
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none h-28 resize-none text-slate-700"
                    placeholder="Describe what needs to be done. E.g. 'Website is non-responsive. No SSL certificate. Needs local SEO optimization for [City].'"
                    value={formData.projectNotes}
                    onChange={e => setFormData({...formData, projectNotes: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Status</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ClientStatus})}>
                      {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Interested Services</label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                      {services.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            const current = formData.interestedServices || [];
                            const exists = current.includes(s.id);
                            setFormData({
                              ...formData,
                              interestedServices: exists ? current.filter(id => id !== s.id) : [...current, s.id]
                            });
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${formData.interestedServices?.includes(s.id) ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium shadow-md shadow-teal-200 transition-all">Save Prospect</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Call Modal */}
      {isCallModalOpen && clientToCall && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Log Interaction</h3>
              <button onClick={() => setIsCallModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100">
                Logging call with <strong className="text-slate-900">{clientToCall.name}</strong> from <strong className="text-slate-900">{clientToCall.company}</strong>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Outcome / Notes</label>
                <textarea 
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-36 resize-none text-slate-700"
                  placeholder="e.g. Called and spoke to reception. They are interested in a website redesign."
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  autoFocus
                />
              </div>
              
              <button 
                onClick={handleSaveCall}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex justify-center items-center gap-2 shadow-md shadow-emerald-100 transition-all"
              >
                <Phone size={18} /> Save Interaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fade-in-up border border-slate-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
              <span className="text-violet-600"><Sparkles size={24}/></span> Gemini Sales Assistant
            </h3>
            <div className="bg-slate-50 p-6 rounded-xl min-h-[200px] text-slate-700 whitespace-pre-line border border-slate-200 max-h-[60vh] overflow-y-auto leading-relaxed">
              {generatedScript}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                disabled={isGenerating}
                onClick={() => setAiModalOpen(false)} 
                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 shadow-lg font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;