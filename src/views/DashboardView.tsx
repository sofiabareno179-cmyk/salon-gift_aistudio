import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Boxes, 
  ArrowUpRight, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle, 
  Heart, 
  Camera,
  DollarSign,
  Users,
  Search,
  Filter,
  Eye,
  Plus
} from 'lucide-react';
import { AppointmentStatus } from '../types';

export const DashboardView: React.FC = () => {
  const { appointments, supplies, changeView, searchQuery } = useApp();

  // Local filter for appointment agenda
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TODAY' | AppointmentStatus>('ALL');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Reference date for current salon day
  const todayDateStr = '2026-09-07';

  // Metrics calculation
  const totalAppointments = appointments.length;
  const criticalSupplies = useMemo(() => {
    return supplies.filter(s => s.status === 'Agotado' || s.status === 'Por Agotar');
  }, [supplies]);

  const todayAppointments = useMemo(() => {
    return appointments.filter(a => a.date === todayDateStr);
  }, [appointments]);

  const todayRevenue = useMemo(() => {
    return todayAppointments.reduce((sum, apt) => sum + (apt.total_price || 0), 0);
  }, [todayAppointments]);

  const confirmedCount = useMemo(() => {
    return appointments.filter(a => a.status === 'Confirmada' || a.status === 'En Progreso').length;
  }, [appointments]);

  const occupancyRate = 82; // 82% average cabina efficiency for current shift

  // Weekly bar data
  const weekDays = [
    { day: 'Lun', dateStr: '2026-09-07', label: '07 Sep', count: 4, revenue: 178, active: true },
    { day: 'Mar', dateStr: '2026-09-08', label: '08 Sep', count: 6, revenue: 265, active: false },
    { day: 'Mié', dateStr: '2026-09-09', label: '09 Sep', count: 5, revenue: 210, active: false },
    { day: 'Jue', dateStr: '2026-09-10', label: '10 Sep', count: 7, revenue: 320, active: false },
    { day: 'Vie', dateStr: '2026-09-11', label: '11 Sep', count: 8, revenue: 395, active: false },
    { day: 'Sáb', dateStr: '2026-09-12', label: '12 Sep', count: 9, revenue: 450, active: false },
    { day: 'Dom', dateStr: '2026-09-13', label: '13 Sep', count: 3, revenue: 135, active: false }
  ];

  const maxCount = Math.max(...weekDays.map(w => w.count));

  // Lead Stylists Summary
  const stylistsSummary = [
    { name: 'Valentina Rossi', specialty: 'Polygel & Nails', activeApts: 3, avatar: 'VR', color: 'bg-purple-100 text-purple-800' },
    { name: 'Camila Mendoza', specialty: 'Balayage & Color', activeApts: 2, avatar: 'CM', color: 'bg-pink-100 text-pink-800' },
    { name: 'Elena Gómez', specialty: 'Lash & Brow HD', activeApts: 3, avatar: 'EG', color: 'bg-emerald-100 text-emerald-800' }
  ];

  // Filtered appointments by search, tab and day selector
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          a.client_name.toLowerCase().includes(q) ||
          a.service_name.toLowerCase().includes(q) ||
          a.stylist_name.toLowerCase().includes(q) ||
          a.date.includes(q);
        if (!matchesSearch) return false;
      }

      // Day filter if clicked on chart
      if (selectedDayIndex !== null) {
        const selectedDate = weekDays[selectedDayIndex]?.dateStr;
        if (selectedDate && a.date !== selectedDate) return false;
      }

      // Status pill filter
      if (statusFilter === 'TODAY') {
        return a.date === todayDateStr;
      }
      if (statusFilter !== 'ALL') {
        return a.status === statusFilter;
      }

      return true;
    });
  }, [appointments, searchQuery, statusFilter, selectedDayIndex]);

  return (
    <div id="view-dashboard" className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Panel Global de Operaciones
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Salón Abierto • Turno Activo
            </span>
          </div>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Supervisión integral de citas, disponibilidad de cabinas y consumo de insumos en tiempo real.
          </p>
        </div>

        {/* Quick Nav & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          <button
            id="btn-dashboard-go-gallery"
            onClick={() => changeView('GalleryView')}
            className="clay-button bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200/80 font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs transition-all text-xs"
            title="Gestionar Galería y Fotos de Trabajos"
          >
            <Camera className="w-4 h-4 text-purple-600" />
            <span>Galería</span>
          </button>

          <button
            id="btn-dashboard-go-services"
            onClick={() => changeView('ServicesDashboardView')}
            className="clay-button bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200/80 font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs transition-all text-xs"
            title="Catálogo de Servicios y Costos"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Servicios</span>
          </button>

          <button
            id="btn-dashboard-go-client-portal"
            onClick={() => changeView('ClientDashboardView')}
            className="clay-button bg-pink-50/80 hover:bg-pink-100 text-pink-950 border border-pink-200/80 font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs transition-all text-xs"
            title="Vista de Vista Previa del Portal Cliente"
          >
            <Heart className="w-4 h-4 text-pink-600" />
            <span>Vista Cliente</span>
          </button>

          <button
            id="btn-dashboard-new-booking"
            onClick={() => changeView('ReservationWizardView')}
            className="clay-button clay-lilac text-purple-950 font-black px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-transform text-xs"
          >
            <Plus className="w-4 h-4 text-purple-900" />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs Superiores (Claymorphism Cards con microdatos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Citas Activas */}
        <div 
          id="kpi-card-appointments"
          onClick={() => changeView('CalendarView')}
          className="clay-card-interactive p-5 md:p-6 flex flex-col justify-between cursor-pointer group hover:border-purple-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Agenda Semanal
            </span>
            <div className="p-2.5 rounded-xl clay-lilac text-purple-900">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{totalAppointments}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{confirmedCount} citas confirmadas</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Insumos en Alerta */}
        <div 
          id="kpi-card-supplies-alert"
          onClick={() => changeView('SuppliesListView')}
          className="clay-card-interactive p-5 md:p-6 flex flex-col justify-between cursor-pointer group border-amber-100 hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Insumos en Alerta
            </span>
            <div className="p-2.5 rounded-xl clay-peach text-amber-950">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-900">
              {criticalSupplies.length} <span className="text-xs font-bold text-slate-400">de {supplies.length} ítems</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-700 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{criticalSupplies.filter(s => s.status === 'Agotado').length} agotados críticos</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Ocupación de Cabinas */}
        <div 
          id="kpi-card-occupancy"
          onClick={() => changeView('CalendarView')}
          className="clay-card-interactive p-5 md:p-6 flex flex-col justify-between cursor-pointer group hover:border-emerald-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Ocupación de Cabinas
            </span>
            <div className="p-2.5 rounded-xl clay-mint text-emerald-950">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{occupancyRate}%</div>
            <div className="mt-1 text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>3 estilistas en cabina activa</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Ingresos Estimados Hoy */}
        <div 
          id="kpi-card-confirmed-today"
          onClick={() => changeView('CalendarView')}
          className="clay-card-interactive p-5 md:p-6 flex flex-col justify-between cursor-pointer group hover:border-pink-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Ingresos de Hoy
            </span>
            <div className="p-2.5 rounded-xl clay-pink text-pink-950">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">${todayRevenue}</div>
            <div className="mt-1 text-xs text-purple-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{todayAppointments.length} citas programadas hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stylist Shift Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
            <Users className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-black text-slate-900">Especialistas en Turno Hoy</h4>
            <p className="text-[11px] text-slate-400">Disponibilidad en cabinas operativas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          {stylistsSummary.map((st, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className={`w-6 h-6 rounded-lg ${st.color} flex items-center justify-center text-[10px] font-black`}>
                {st.avatar}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block leading-tight">{st.name}</span>
                <span className="text-[10px] text-slate-400 block">{st.specialty} • {st.activeApts} citas</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Weekly Workload Bar Chart & Critical Insumos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 clay-card p-6 md:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900">Carga de Trabajo Semanal</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Demanda diaria proyectada. Haz clic en un día para filtrar la agenda.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              {selectedDayIndex !== null && (
                <button
                  onClick={() => setSelectedDayIndex(null)}
                  className="text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer text-xs"
                >
                  Restablecer
                </button>
              )}
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Citas
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Capacidad
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-60 flex items-end justify-between gap-2 md:gap-3 pt-6 pb-2 px-3 md:px-5 bg-slate-50/60 rounded-2xl border border-slate-100">
            {weekDays.map((item, idx) => {
              const heightPercent = Math.round((item.count / maxCount) * 100);
              const isSelected = selectedDayIndex === idx;
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDayIndex(isSelected ? null : idx)}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-900 text-white py-1 px-2 rounded-lg shadow-lg pointer-events-none mb-1 text-center whitespace-nowrap z-10">
                    {item.count} citas • ${item.revenue}
                  </div>
                  
                  {/* Visual Clay Bar */}
                  <div className={`w-full max-w-[42px] rounded-xl h-full flex items-end p-1 transition-all ${
                    isSelected ? 'bg-purple-200/80 ring-2 ring-purple-600' : 'bg-slate-200/60'
                  }`}>
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-lg transition-all duration-300 shadow-xs ${
                        isSelected
                          ? 'bg-purple-700'
                          : item.active 
                          ? 'clay-lilac bg-purple-500 text-white' 
                          : 'bg-gradient-to-t from-purple-400 to-purple-200 group-hover:from-purple-500 group-hover:to-purple-300'
                      }`}
                    />
                  </div>

                  <span className={`text-xs font-black transition-colors ${
                    isSelected ? 'text-purple-950 font-black scale-110' : item.active ? 'text-purple-700' : 'text-slate-500'
                  }`}>
                    {item.day}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pico proyectado de atención: <strong>Viernes y Sábados</strong></span>
            <button 
              onClick={() => changeView('CalendarView')}
              className="text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver calendario completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Critical Supplies Quick Panel (1 Col) */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Insumos Críticos</h3>
                <p className="text-xs text-slate-400">Stock físico bajo umbral mínimo</p>
              </div>
              <button
                onClick={() => changeView('SuppliesListView')}
                className="p-2 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                title="Abrir vista Kanban"
              >
                <Boxes className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {criticalSupplies.slice(0, 4).map((supply) => {
                const stockRatio = Math.min(100, Math.round((supply.stock / (supply.stock_min || 1)) * 100));
                const isOut = supply.status === 'Agotado';

                return (
                  <div 
                    key={supply.id}
                    onClick={() => changeView('SuppliesListView', supply.id)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 cursor-pointer transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{supply.name}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                        isOut
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {supply.status}
                      </span>
                    </div>

                    {/* Stock level mini gauge */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Stock: <strong className="text-slate-800">{supply.stock} {supply.unit}</strong></span>
                      <span className="text-slate-400">Mín: {supply.stock_min} {supply.unit}</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.max(5, stockRatio)}%` }} 
                        className={`h-full rounded-full ${isOut ? 'bg-rose-500' : 'bg-amber-500'}`}
                      />
                    </div>
                  </div>
                );
              })}

              {criticalSupplies.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                  Todos los insumos se encuentran en niveles óptimos.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => changeView('SuppliesListView')}
              className="w-full py-2.5 rounded-xl bg-purple-50 text-purple-900 hover:bg-purple-100 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explorar Tablero Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Próximas Citas Programadas con Filtro Interactivo */}
      <div className="clay-card p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900">Agenda Operativa de Citas</h3>
            <p className="text-xs text-slate-400">Monitoreo de citas, materiales reservados y avance del servicio</p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'ALL'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({appointments.length})
            </button>
            <button
              onClick={() => setStatusFilter('TODAY')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'TODAY'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hoy ({todayAppointments.length})
            </button>
            <button
              onClick={() => setStatusFilter('En Progreso')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'En Progreso'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              En Cabina
            </button>
            <button
              onClick={() => setStatusFilter('Confirmada')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'Confirmada'
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Confirmadas
            </button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-600">No hay citas para el filtro seleccionado.</p>
            <p className="text-xs text-slate-400 mt-1">Prueba cambiando el filtro o la fecha en la gráfica semanal.</p>
            <button
              onClick={() => { setStatusFilter('ALL'); setSelectedDayIndex(null); }}
              className="mt-3 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3 px-3">Cliente</th>
                  <th className="pb-3 px-3">Servicio</th>
                  <th className="pb-3 px-3">Especialista</th>
                  <th className="pb-3 px-3">Fecha & Hora</th>
                  <th className="pb-3 px-3">Insumos</th>
                  <th className="pb-3 px-3">Estado</th>
                  <th className="pb-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.slice(0, 6).map((apt) => {
                  const initials = apt.client_name
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr 
                      key={apt.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => changeView('AppointmentDetailView', apt.id)}
                    >
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 font-black text-[11px] flex items-center justify-center shrink-0 border border-purple-200">
                            {initials}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block leading-tight">{apt.client_name}</span>
                            <span className="text-[11px] text-slate-400">{apt.client_phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-bold text-slate-800 block">{apt.service_name}</span>
                        <span className="text-[11px] text-slate-400">{apt.duration_minutes} min • ${apt.total_price}</span>
                      </td>
                      <td className="py-4 px-3 text-slate-700 font-semibold">
                        {apt.stylist_name}
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-bold text-slate-800 block">{apt.date}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{apt.time}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {apt.supplies?.length || 0} reservados
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                          apt.status === 'Confirmada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'En Progreso'
                            ? 'bg-purple-100 text-purple-800 animate-pulse'
                            : apt.status === 'Completada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeView('AppointmentDetailView', apt.id);
                          }}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

