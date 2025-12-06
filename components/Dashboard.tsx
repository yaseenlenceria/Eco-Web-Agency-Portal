import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Client, Project, ClientStatus } from '../types';
import { Users, Phone, DollarSign, Briefcase, Clock, ArrowRight, Zap, TrendingUp, CheckCircle } from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  projects: Project[];
}

const COLORS = ['#0d9488', '#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1']; // Teal Palette

const Dashboard: React.FC<DashboardProps> = ({ clients, projects }) => {
  const totalClients = clients.length;
  const callsMade = clients.reduce((acc, client) => acc + client.interactions.filter(i => i.type === 'Call').length, 0);
  const activeProjects = projects.filter(p => p.status !== 'Completed').length;
  const estimatedRevenue = projects.reduce((acc, p) => acc + p.value, 0);

  const today = new Date();
  const callQueue = clients.filter(c => {
    if (c.status === ClientStatus.CLOSED || c.status === ClientStatus.LOST) return false;
    if (!c.lastContacted) return true;
    const lastDate = new Date(c.lastContacted);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 14;
  });

  const statusData = Object.values(ClientStatus).map(status => ({
    name: status,
    value: clients.filter(c => c.status === status).length
  }));

  const revenueData = [
    { name: 'Projects', value: estimatedRevenue },
    { name: 'Pipeline', value: estimatedRevenue * 1.5 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
          <h2 className="text-3xl font-bold text-slate-800">Agency Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Clients</p>
            <p className="text-2xl font-bold text-slate-800">{totalClients}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Calls Logged</p>
            <p className="text-2xl font-bold text-slate-800">{callsMade}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Projects</p>
            <p className="text-2xl font-bold text-slate-800">{activeProjects}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Est. Revenue</p>
            <p className="text-2xl font-bold text-slate-800">${estimatedRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Call Queue Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[420px]">
            <h3 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><Zap size={16}/></div> 
                Recommended Action
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {callQueue.length > 0 ? (
                    callQueue.map(client => (
                        <div key={client.id} className="p-4 bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all group">
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">{client.name}</div>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-wide">
                                   Follow Up
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">{client.company}</div>
                            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                <Clock size={10}/> {client.lastContacted ? `Last contacted ${client.lastContacted}` : 'No prior contact'}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                             <CheckCircle size={20} className="text-teal-500" />
                         </div>
                        <p className="font-medium text-sm">All caught up!</p>
                        <p className="text-xs">No pending actions.</p>
                    </div>
                )}
            </div>
            <button className="w-full mt-4 py-2.5 text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                View Prospect List <ArrowRight size={14}/>
            </button>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[420px] flex flex-col">
                <h3 className="text-lg font-bold mb-6 text-slate-700 flex items-center gap-2">
                     <div className="p-1.5 bg-teal-100 text-teal-600 rounded-lg"><TrendingUp size={16}/></div> 
                     Revenue Projection
                </h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" fill="#0d9488" radius={[8, 8, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
        
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Client Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

    </div>
  );
};

export default Dashboard;