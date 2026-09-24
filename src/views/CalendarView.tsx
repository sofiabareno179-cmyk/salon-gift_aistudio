import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  User, 
  Plus, 
  Sparkles,
  Scissors
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { appointments, changeView } = useApp();

  const [selectedStylistFilter, setSelectedStylistFilter] = useState<string>('Todos');

  const daysOfWeek = [
    { name: 'Lunes', date: '2026-09-07', label: '07 Sep' },
    { name: 'Martes', date: '2026-09-08', label: '08 Sep' },
    { name: 'Miércoles', date: '2026-09-09', label: '09 Sep' },
    { name: 'Jueves', date: '2026-09-10', label: '10 Sep' },
    { name: 'Viernes', date: '2026-09-11', label: '11 Sep' },
    { name: 'Sábado', date: '2026-09-12', label: '12 Sep' },
    { name: 'Domingo', date: '2026-09-13', label: '13 Sep' }
  ];

  const hours = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const stylists = [
    'Todos',
    'Valentina Rossi (Master Nail Artist)',
    'Mateo Sandoval (Colorista Senior)',
    'Isabella Duarte (Cosmiatra)'
  ];

  const filteredAppointments = appointments.filter(a => {
    if (selectedStylistFilter === 'Todos') return true;
    return a.stylist_name === selectedStylistFilter;
  });

  return (
    <div id="view-calendar" className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Calendario de Disponibilidad Semanal</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              RF-02 Semanal
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualización interactiva tridimensional de cabinas y agenda de estilistas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-calendar-add-appointment"
            onClick={() => changeView('ReservationWizardView')}
            className="clay-button clay-lilac text-purple-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-purple-900" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Stylist Filter and Week Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/70 p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filtrar por Estilista:</span>
          <select
            value={selectedStylistFilter}
            onChange={(e) => setSelectedStylistFilter(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
          >
            {stylists.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600">Semana del 07 al 13 de Septiembre, 2026</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Time Grid (Weekly Matrix) */}
      <div className="clay-card p-6 overflow-x-auto bg-white/95">
        <div className="min-w-[850px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 pb-4 border-b border-slate-200 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
              Hora
            </div>
            {daysOfWeek.map((day) => (
              <div 
                key={day.date}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  day.date === '2026-09-07'
                    ? 'bg-purple-50 text-purple-900 border border-purple-200 font-extrabold'
                    : 'text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{day.name}</div>
                <div className="text-[11px] text-slate-400 font-medium">{day.label}</div>
              </div>
            ))}
          </div>

          {/* Hour Rows */}
          <div className="divide-y divide-slate-100">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-2 py-2 min-h-[72px] items-stretch">
                {/* Hour Label */}
                <div className="text-xs font-mono font-semibold text-slate-400 flex items-center justify-center">
                  {hour}
                </div>

                {/* Day Columns */}
                {daysOfWeek.map((day) => {
                  // Find appointments starting around this hour
                  const matchedAppointments = filteredAppointments.filter(a => {
                    return a.date === day.date && a.time.startsWith(hour.slice(0, 2));
                  });

                  return (
                    <div 
                      key={`${day.date}-${hour}`}
                      className="relative rounded-xl border border-dashed border-slate-200/60 p-1 flex flex-col gap-1 min-h-[64px] hover:bg-slate-50/50 transition-colors group"
                    >
                      {matchedAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          id={`calendar-block-${apt.id}`}
                          onClick={() => changeView('AppointmentDetailView', apt.id)}
                          className="clay-card-interactive p-2.5 rounded-xl cursor-pointer select-none bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 shadow-sm hover:scale-[1.03] transition-all"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-purple-900 truncate">
                              {apt.client_name}
                            </span>
                            <span className="font-mono text-slate-500">{apt.time}</span>
                          </div>

                          <div className="text-[10px] text-slate-600 truncate mt-0.5 font-medium">
                            {apt.service_name}
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400">
                            <span>{apt.duration_minutes}m</span>
                            <span className={`px-1.5 py-0.2 rounded-full font-bold ${
                              apt.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Quick slot click to create appointment */}
                      {matchedAppointments.length === 0 && (
                        <button
                          onClick={() => changeView('ReservationWizardView')}
                          className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-300 hover:text-purple-600 transition-opacity"
                          title="Agendar en este horario"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
