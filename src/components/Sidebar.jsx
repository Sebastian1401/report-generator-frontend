import { Home, Database, ClipboardList, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  
  console.log(`[Sidebar] Component rendered. Active tab: ${activeTab}, User Role: ${user?.role}`);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, roles: ['admin', 'tech'] },
    { id: 'registration', label: 'Data Registration', icon: Database, roles: ['admin', 'tech'] },
    { id: 'reports', label: 'Reports', icon: ClipboardList, roles: ['admin', 'tech'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] }, // Only for admin
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    console.log('[Sidebar] Initiating logout sequence');
    logout();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold">EDS Manager</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                console.log(`[Sidebar] Navigation clicked: ${item.id}`);
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="bg-slate-700 p-2 rounded-full">
            <UserIcon size={20} className="text-slate-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">{user?.username}</span>
            <span className="text-xs text-slate-400 capitalize">{user?.role} Role</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}