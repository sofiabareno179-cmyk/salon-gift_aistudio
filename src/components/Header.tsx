import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  ShieldCheck, 
  User, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Bell,
  Heart
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    changeView, 
    searchQuery, 
    setSearchQuery, 
    profile, 
    toggleRole,
    appointments,
    selectedItemId
  } = useApp();

  // Dynamic breadcrumbs based on view
  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'DashboardView':
        return [{ label: 'Panel Global Operativo', active: true }];
      case 'ClientDashboardView':
        return [
          { label: 'Clientes', active: false },
          { label: 'Mi Portal Exclusivo (VIP)', active: true }
        ];
      case 'ReservationWizardView':
        return [
          { label: 'Citas', onClick: () => changeView('CalendarView') },
          { label: 'Nueva Reserva (Validación Atómica)', active: true }
        ];
      case 'CalendarView':
        return [
          { label: 'Agenda', active: true },
          { label: 'Disponibilidad Semanal', active: true }
        ];
      case 'SuppliesListView':
        return [
          { label: 'Logística', active: false },
          { label: 'Gestión de Insumos (Kanban)', active: true }
        ];
      case 'ServicesDashboardView':
        return [
          { label: 'Servicios', active: false },
          { label: 'Dashboard de Tratamientos & Rentabilidad', active: true }
        ];
      case 'GalleryView':
        return [
          { label: 'Portafolio', active: false },
          { label: 'Galería de Trabajos & Diseños', active: true }
        ];
      case 'AppointmentDetailView':
        const currentApt = appointments.find(a => a.id === selectedItemId);
        return [
          { label: 'Citas', onClick: () => changeView('CalendarView') },
          { label: currentApt ? `Cita: ${currentApt.client_name}` : 'Detalle de Cita', active: true }
        ];
      case 'SettingsView':
        return [
          { label: 'Sistema', active: false },
          { label: 'Perfil y Notificaciones API', active: true }
        ];
      case 'AuthView':
        return [
          { label: 'Seguridad', active: false },
          { label: 'Autenticación & Sesión', active: true }
        ];
      default:
        return [{ label: 'Salon Gift', active: true }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header 
      id="main-topbar"
      className="sticky top-0 z-20 backdrop-blur-md bg-white/75 border-b border-slate-200/70 px-8 py-3.5 flex items-center justify-between transition-all"
    >
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <span 
          onClick={() => changeView(profile.role === 'CLIENT' ? 'ClientDashboardView' : 'DashboardView')}
          className="cursor-pointer hover:text-purple-700 transition-colors font-semibold text-slate-800"
        >
          {profile.role === 'CLIENT' ? 'Salon Gift (Clientes)' : 'Salon Gift (Admin)'}
        </span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {crumb.onClick ? (
              <button 
                onClick={crumb.onClick} 
                className="hover:text-purple-600 transition-colors cursor-pointer"
              >
                {crumb.label}
              </button>
            ) : (
              <span className={crumb.active ? 'text-purple-900 font-bold' : ''}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Global Search & Quick Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-global-search"
            type="text"
            placeholder={profile.role === 'CLIENT' ? 'Buscar mis citas o tratamientos...' : 'Buscar cita, insumo o estilista...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs py-2 pl-9 pr-3 rounded-xl border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Reserve Button */}
        <button
          id="btn-quick-new-reservation"
          onClick={() => changeView('ReservationWizardView')}
          className="clay-button bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 flex items-center gap-2 shadow-md hover:from-purple-600 hover:to-indigo-600 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Agendar Cita</span>
        </button>

        {/* Role Pill */}
        {profile.role === 'CLIENT' ? (
          <button
            id="btn-header-client-profile"
            onClick={() => changeView('AuthView')}
            title="Ver mi cuenta o salir de sesión"
            className="px-3 py-1.5 rounded-xl border border-pink-200 bg-pink-50 text-pink-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-pink-100 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span>Cliente VIP</span>
          </button>
        ) : (
          <button
            id="btn-header-role-pill"
            onClick={toggleRole}
            title="Click para alternar rol y verificar políticas RLS"
            className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>ADMIN</span>
            <RefreshCw className="w-3 h-3 text-slate-400 ml-0.5 hover:rotate-180 transition-transform" />
          </button>
        )}

        {/* User Profile Mini Card */}
        <div 
          onClick={() => changeView(profile.role === 'CLIENT' ? 'ClientDashboardView' : 'SettingsView')}
          className="flex items-center gap-2.5 pl-2 cursor-pointer group"
          title={profile.role === 'CLIENT' ? 'Ver mi portal' : 'Ver perfil y ajustes de administración'}
        >
          <img
            src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={profile.full_name}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all shadow-sm"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 group-hover:text-purple-900 transition-colors leading-tight">
              {profile.full_name}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {profile.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
