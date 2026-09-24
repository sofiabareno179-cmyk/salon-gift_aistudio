import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewName } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Boxes, 
  Sparkles, 
  FileText, 
  Settings, 
  UserCircle2, 
  ShieldCheck, 
  User,
  Scissors,
  Database,
  Heart,
  Camera
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, changeView, supplies, services, gallery, profile, toggleRole, supabaseConnected } = useApp();

  const isClient = profile.role === 'CLIENT';
  const lowStockCount = supplies.filter(s => s.status !== 'Suficiente').length;

  // Dedicated Nav Items separated by Role
  const adminNavItems: { id: ViewName; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'DashboardView',
      label: 'Panel Operativo (Admin)',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'ServicesDashboardView',
      label: 'Dashboard de Servicios',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      badge: `${services.length}`,
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'GalleryView',
      label: 'Galería & Portafolio',
      icon: <Camera className="w-5 h-5 text-purple-600" />,
      badge: `${gallery.length}`,
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'SuppliesListView',
      label: 'Inventario (Kanban)',
      icon: <Boxes className="w-5 h-5" />,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'CalendarView',
      label: 'Calendario Semanal',
      icon: <CalendarDays className="w-5 h-5" />
    },
    {
      id: 'ReservationWizardView',
      label: 'Nueva Cita (Wizard)',
      icon: <Scissors className="w-5 h-5 text-purple-600" />,
      badge: 'Atómico',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'AppointmentDetailView',
      label: 'Detalle de Servicio',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'SettingsView',
      label: 'Configuración & APIs',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 'AuthView',
      label: 'Cuentas & Seguridad',
      icon: <UserCircle2 className="w-5 h-5" />
    }
  ];

  const clientNavItems: { id: ViewName; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'ClientDashboardView',
      label: 'Mi Portal (Dashboard)',
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      badge: 'VIP Gold',
      badgeColor: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'ServicesDashboardView',
      label: 'Menú de Servicios',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      badge: `${services.length}`,
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'GalleryView',
      label: 'Galería de Trabajos',
      icon: <Camera className="w-5 h-5 text-pink-600" />,
      badge: 'Lookbook',
      badgeColor: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'ReservationWizardView',
      label: 'Agendar Nueva Cita',
      icon: <CalendarDays className="w-5 h-5 text-purple-600" />
    },
    {
      id: 'AppointmentDetailView',
      label: 'Detalle de mi Cita',
      icon: <FileText className="w-5 h-5 text-indigo-600" />
    },
    {
      id: 'AuthView',
      label: 'Mi Cuenta / Salir',
      icon: <UserCircle2 className="w-5 h-5 text-slate-500" />
    }
  ];

  const activeNavItems = isClient ? clientNavItems : adminNavItems;

  return (
    <aside 
      id="sidebar-navigation"
      className="w-72 bg-white/90 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between p-5 select-none h-screen sticky top-0 shadow-sm z-30"
    >
      <div>
        {/* Brand Header with Claymorphism badge */}
        <div 
          onClick={() => changeView(isClient ? 'ClientDashboardView' : 'DashboardView')}
          className="cursor-pointer group flex items-center gap-3.5 pb-6 border-b border-slate-100"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 ${
            isClient ? 'clay-pink text-pink-900 bg-pink-100' : 'clay-lilac text-purple-900'
          }`}>
            {isClient ? <Heart className="w-6 h-6 text-pink-600" /> : <Scissors className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-800 font-sans">
                Salon Gift
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                isClient 
                  ? 'bg-pink-100 text-pink-800 border border-pink-200' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isClient ? 'CLIENTE' : 'ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isClient ? 'Portal Personal de Belleza' : 'Gestión de Citas e Insumos'}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex flex-col gap-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center justify-between">
            <span>{isClient ? 'Menú del Cliente' : 'Panel de Control'}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
              {isClient ? 'Área Segura' : 'Total'}
            </span>
          </div>

          {activeNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => changeView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left ${
                  isActive
                    ? 'clay-card bg-purple-50/80 text-purple-900 border-purple-200/80 shadow-md translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${isActive ? 'bg-purple-200/70 text-purple-800' : 'text-slate-400'}`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Role Information */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isClient ? 'Sesión de Cliente:' : 'Sesión Activa:'}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              profile.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {profile.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {profile.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name} 
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-300"
            />
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                {profile.full_name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate leading-tight">
                {profile.email}
              </span>
            </div>
          </div>

          {/* Quick toggle for development/testing */}
          <button
            id="btn-toggle-role-sidebar"
            onClick={toggleRole}
            className="w-full text-[11px] font-bold py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-900 shadow-2xs hover:shadow-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            title="Alternar entre ADMIN y CLIENT para probar la separación de dashboards"
          >
            <span>Cambiar a {profile.role === 'ADMIN' ? 'Vista Cliente' : 'Vista Administrador'}</span>
          </button>
        </div>

        {/* Supabase Status Indicator */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">RLS Supabase</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-[11px] font-medium text-slate-500">
              {isClient ? 'Aislado' : 'Operativo'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
