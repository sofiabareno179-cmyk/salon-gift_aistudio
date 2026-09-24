import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppointmentStatus } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  Boxes, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  ArrowLeft,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AppointmentDetailView: React.FC = () => {
  const { 
    appointments, 
    selectedItemId, 
    changeView, 
    updateAppointmentStatus, 
    toggleTimelineStep, 
    sendReminder 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'supplies' | 'timeline'>('supplies');

  // Select current appointment or fallback to first
  const currentAppointment = 
    appointments.find(a => a.id === selectedItemId) || appointments[0];

  if (!currentAppointment) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 font-semibold">No se ha seleccionado ninguna cita.</p>
        <button
          onClick={() => changeView('DashboardView')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
        >
          Ir al Panel
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    await updateAppointmentStatus(currentAppointment.id, newStatus);
  };

  const handleWhatsAppAction = () => {
    sendReminder(currentAppointment.id, 'whatsapp');
  };

  const handleEmailAction = () => {
    sendReminder(currentAppointment.id, 'email');
  };

  return (
    <div id="view-appointment-detail" className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeView('DashboardView')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Panel</span>
        </button>

        {/* Quick Status Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Estado de Cita:</span>
          <select
            value={currentAppointment.status}
            onChange={(e) => handleStatusChange(e.target.value as AppointmentStatus)}
            className="text-xs font-bold py-1.5 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs focus:ring-2 focus:ring-purple-200 cursor-pointer"
          >
            <option value="Confirmada">Confirmada</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada (Liberar Insumos)</option>
          </select>
        </div>
      </div>

      {/* Main Panoramic Card (Claymorphism) */}
      <div className="clay-card p-8 flex flex-col gap-6">
        {/* Header Information */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                {currentAppointment.service_name}
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {currentAppointment.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              {currentAppointment.client_name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Atendido por <strong>{currentAppointment.stylist_name}</strong>
            </p>
          </div>

          {/* Quick Notification Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-whatsapp-reminder"
              onClick={handleWhatsAppAction}
              className="clay-button bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>
                {currentAppointment.whatsapp_reminder_sent ? 'Reenviar WhatsApp' : 'Recordatorio WhatsApp'}
              </span>
            </button>

            <button
              id="btn-email-reminder"
              onClick={handleEmailAction}
              className="clay-button bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>
                {currentAppointment.email_reminder_sent ? 'Reenviar Email' : 'Notificar por Email'}
              </span>
            </button>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Fecha Programada</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentAppointment.date}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Hora y Duración</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentAppointment.time} ({currentAppointment.duration_minutes} min)</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Teléfono Cliente</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentAppointment.client_phone}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Precio Total</span>
            <div className="font-black text-purple-900 text-sm">
              ${currentAppointment.total_price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Client Notes */}
        {currentAppointment.notes && (
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
            <strong>Notas del Cliente:</strong> {currentAppointment.notes}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('supplies')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'supplies'
                ? 'border-b-2 border-purple-600 text-purple-900'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Insumos Asignados (appointment_supplies)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {currentAppointment.supplies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-b-2 border-purple-600 text-purple-900'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline del Servicio</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {currentAppointment.timeline.filter(t => t.completed).length}/{currentAppointment.timeline.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Insumos Asignados */}
        {activeTab === 'supplies' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Recursos físicos descontados del inventario central para esta sesión:</span>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Bloqueo atómico confirmado
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/60 text-slate-400 uppercase font-semibold">
                    <th className="p-3.5">Insumo</th>
                    <th className="p-3.5">Cantidad Consumida</th>
                    <th className="p-3.5">Estado en Cita</th>
                    <th className="p-3.5 text-right">Trazabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentAppointment.supplies.map((sup) => (
                    <tr key={sup.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800">
                        {sup.supply_name}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700">
                        {sup.quantity_used} {sup.unit}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          currentAppointment.status === 'Cancelada'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {currentAppointment.status === 'Cancelada' ? 'Reintegrado' : sup.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-[11px] text-slate-400">
                        {sup.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Timeline del Servicio */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="text-xs text-slate-500">
              Haga clic en cada hito conforme el estilista ejecute los pasos del protocolo de belleza:
            </div>

            <div className="flex flex-col gap-3">
              {currentAppointment.timeline.map((step, idx) => (
                <div
                  key={step.id}
                  onClick={() => toggleTimelineStep(currentAppointment.id, step.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    step.completed
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      step.completed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold leading-snug">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  {step.completed && step.time && (
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                      {step.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
