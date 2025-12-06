import React, { useState } from 'react';
import { Project, ProjectStatus, Client } from '../types';
import { Clock, CheckCircle, AlertCircle, Plus, Trash2, X, MoreHorizontal } from 'lucide-react';

interface ProjectBoardProps {
  projects: Project[];
  clients: Client[];
  onUpdateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  onAddProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects, clients, onUpdateProjectStatus, onAddProject, onDeleteProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    value: 0,
    deadline: '',
    description: '',
    clientId: ''
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';
  const columns = Object.values(ProjectStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.clientId || !newProject.title) return;

    const project: Project = {
      id: `p_${Date.now()}`,
      clientId: newProject.clientId,
      title: newProject.title,
      status: ProjectStatus.PLANNING,
      deadline: newProject.deadline || new Date().toISOString().split('T')[0],
      value: newProject.value || 0,
      description: newProject.description || ''
    };

    onAddProject(project);
    setNewProject({ title: '', value: 0, deadline: '', description: '', clientId: '' });
    setIsModalOpen(false);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch(status) {
        case ProjectStatus.PLANNING: return 'bg-blue-500';
        case ProjectStatus.IN_PROGRESS: return 'bg-amber-500';
        case ProjectStatus.REVIEW: return 'bg-purple-500';
        case ProjectStatus.COMPLETED: return 'bg-emerald-500';
        default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
       <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Project Board</h2>
            <p className="text-slate-500 text-sm mt-1">Track deliverables and deadlines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center gap-2 transition-all shadow-sm font-medium"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(status => (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 h-full">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`}></div>
                    <h3 className="font-bold text-slate-700 text-sm">{status}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                  {projects.filter(p => p.status === status).length}
                </span>
              </div>
              
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {projects.filter(p => p.status === status).map(project => (
                  <div key={project.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/50 hover:shadow-md transition-all cursor-pointer group relative">
                     {/* Delete Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Project"
                    >
                        <Trash2 size={16} />
                    </button>

                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md border border-teal-100">
                        ${project.value.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1 leading-tight">{project.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{getClientName(project.clientId)}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center text-xs text-slate-400 gap-1.5 font-medium">
                        <Clock size={12} />
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                      
                      {/* Quick Actions for Status */}
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                         {Object.values(ProjectStatus).filter(s => s !== status).map(s => (
                             <button 
                                key={s}
                                onClick={() => onUpdateProjectStatus(project.id, s)} 
                                className={`w-2 h-2 rounded-full bg-slate-200 hover:scale-125 transition-transform ${getStatusColor(s).replace('bg-', 'hover:bg-')}`} 
                                title={`Move to ${s}`}
                             />
                         ))}
                      </div>
                    </div>
                  </div>
                ))}
                {projects.filter(p => p.status === status).length === 0 && (
                   <div className="h-32 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs font-medium">No projects</p>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 animate-fade-in-up border border-slate-100">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="text-xl font-bold text-slate-800">Create New Project</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={20}/></button>
            </div>
           
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Title</label>
                <input 
                    required 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                    placeholder="e.g. SEO Campaign Q4"
                    value={newProject.title} 
                    onChange={e => setNewProject({...newProject, title: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Client</label>
                <select 
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    value={newProject.clientId}
                    onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                >
                    <option value="">Select a Client...</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Value ($)</label>
                    <input 
                        type="number"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                        value={newProject.value} 
                        onChange={e => setNewProject({...newProject, value: Number(e.target.value)})} 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline</label>
                    <input 
                        type="date"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                        value={newProject.deadline} 
                        onChange={e => setNewProject({...newProject, deadline: e.target.value})} 
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                    rows={3}
                    placeholder="Brief details about the project scope..."
                    value={newProject.description} 
                    onChange={e => setNewProject({...newProject, description: e.target.value})} 
                />
              </div>

              <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium shadow-md shadow-teal-100 transition-all">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;