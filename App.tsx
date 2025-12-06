import React, { useState } from 'react';
import { ViewState, Client, Project, ServiceOption, ProjectStatus } from './types';
import { MOCK_CLIENTS, MOCK_PROJECTS, INITIAL_SERVICES } from './constants';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ProjectBoard from './components/ProjectBoard';
import Settings from './components/Settings';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConvexClientProvider } from './contexts/ConvexProvider';
import { LayoutDashboard, Users, Briefcase, Settings as SettingsIcon, Menu, X, Leaf, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Global State
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [services, setServices] = useState<ServiceOption[]>(INITIAL_SERVICES);

  // Handlers
  const handleAddClient = (client: Client) => setClients([...clients, client]);
  const handleUpdateClient = (client: Client) => setClients(clients.map(c => c.id === client.id ? client : c));
  const handleDeleteClient = (id: string) => setClients(clients.filter(c => c.id !== id));

  const handleUpdateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status } : p));
  };

  const handleAddProject = (project: Project) => setProjects([...projects, project]);
  const handleDeleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const handleAddService = (service: ServiceOption) => setServices([...services, service]);
  const handleDeleteService = (id: string) => setServices(services.filter(s => s.id !== id));

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
        ${activeView === view 
          ? 'bg-teal-600 text-white shadow-md shadow-teal-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      `}
    >
      <Icon size={20} className={`${activeView === view ? 'text-teal-100' : 'text-slate-500 group-hover:text-teal-400'}`} />
      <span className="font-medium tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white p-6 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-900/50">
              <Leaf size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">Eco Web Agency</h1>
              <p className="text-xs text-teal-400 font-medium tracking-widest uppercase">Portal</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="CLIENTS" icon={Users} label="Clients" />
            <NavItem view="PROJECTS" icon={Briefcase} label="Projects" />
            <NavItem view="SETTINGS" icon={SettingsIcon} label="Settings" />
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || 'User'} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{user.name || user.email}</p>
              <p className="text-xs text-slate-500">{user.role || 'User'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
             <Leaf size={20} className="text-teal-600"/>
             <span className="font-bold text-slate-800">Eco Web Agency</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-600">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeView === 'DASHBOARD' && <Dashboard clients={clients} projects={projects} />}
            {activeView === 'CLIENTS' && (
              <ClientList 
                clients={clients} 
                services={services}
                onAddClient={handleAddClient}
                onUpdateClient={handleUpdateClient}
                onDeleteClient={handleDeleteClient}
              />
            )}
            {activeView === 'PROJECTS' && (
              <ProjectBoard 
                projects={projects} 
                clients={clients}
                onUpdateProjectStatus={handleUpdateProjectStatus}
                onAddProject={handleAddProject}
                onDeleteProject={handleDeleteProject}
              />
            )}
            {activeView === 'SETTINGS' && (
              <Settings 
                services={services}
                onAddService={handleAddService}
                onDeleteService={handleDeleteService}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConvexClientProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConvexClientProvider>
  );
};

export default App;