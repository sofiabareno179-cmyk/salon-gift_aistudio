import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';

import { DashboardView } from './views/DashboardView';
import { ClientDashboardView } from './views/ClientDashboardView';
import { SuppliesListView } from './views/SuppliesListView';
import { AppointmentDetailView } from './views/AppointmentDetailView';
import { ReservationWizardView } from './views/ReservationWizardView';
import { SettingsView } from './views/SettingsView';
import { CalendarView } from './views/CalendarView';
import { AuthView } from './views/AuthView';
import { ServicesDashboardView } from './views/ServicesDashboardView';
import { GalleryView } from './views/GalleryView';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const ViewRouter: React.FC = () => {
  const { currentView, profile, changeView } = useApp();

  const isClient = profile.role === 'CLIENT';
  const isAdminOnly = currentView === 'DashboardView' || currentView === 'SuppliesListView' || currentView === 'SettingsView';

  const renderCurrentView = () => {
    // Hard security barrier: clients cannot access admin views
    if (isClient && isAdminOnly) {
      return (
        <div className="p-8 max-w-lg mx-auto min-h-[70vh] flex items-center justify-center">
          <div className="clay-card p-8 bg-white border border-rose-200/80 flex flex-col items-center text-center gap-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Acceso Restringido al Área de Administración</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tu cuenta actual tiene el rol <strong>CLIENT</strong>. Las vistas operativas de administración, control de inventario y configuración de APIs están reservadas exclusivamente para el personal y administradores de Salon Gift.
            </p>
            <button
              onClick={() => changeView('ClientDashboardView')}
              className="clay-button clay-lilac text-purple-950 font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 transition-transform mt-2"
            >
              <span>Ir a Mi Portal de Cliente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'DashboardView':
        return <DashboardView />;
      case 'ClientDashboardView':
        return <ClientDashboardView />;
      case 'SuppliesListView':
        return <SuppliesListView />;
      case 'AppointmentDetailView':
        return <AppointmentDetailView />;
      case 'ReservationWizardView':
        return <ReservationWizardView />;
      case 'SettingsView':
        return <SettingsView />;
      case 'CalendarView':
        return <CalendarView />;
      case 'ServicesDashboardView':
        return <ServicesDashboardView />;
      case 'GalleryView':
        return <GalleryView />;
      case 'AuthView':
        return <AuthView />;
      default:
        return isClient ? <ClientDashboardView /> : <DashboardView />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full flex-1"
      >
        {renderCurrentView()}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F8F9FA] flex text-slate-800 font-sans antialiased selection:bg-purple-200 selection:text-purple-900">
        {/* Persistent Sidebar */}
        <Sidebar />

        {/* Main Content Area with Header */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 pb-16">
            <ViewRouter />
          </main>
        </div>

        {/* Global Toast Notifications (Success, 42501 RLS Alert, Info) */}
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
