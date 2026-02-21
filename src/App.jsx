import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import LoginView from './components/LoginView';

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  console.log('[AppContent] App state evaluated. Authenticated:', isAuthenticated);

  return isAuthenticated ? <DashboardLayout /> : <LoginView />;
}

export default function App() {
  console.log('[App] Application initialized');
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}