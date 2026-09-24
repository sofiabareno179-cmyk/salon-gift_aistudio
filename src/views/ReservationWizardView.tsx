import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Boxes, 
  MessageSquare, 
  Mail,
  ArrowLeft,
  Scissors
} from 'lucide-react';

export const ReservationWizardView: React.FC = () => {
  const { 
    services, 
    supplies, 
    validateSuppliesForService, 
    createAppointment, 
    changeView,
    selectedItemId
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (selectedItemId && services.some(s => s.id === selectedItemId)) {
      return selectedItemId;
    }
    return services[0]?.id || '';
  });
  const [selectedStylist, setSelectedStylist] = useState<string>('Valentina Rossi (Master Nail Artist)');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-08');
  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  
  // Client details
  const [clientName, setClientName] = useState<string>('Sofia Bareño');
  const [clientEmail, setClientEmail] = useState<string>('sofiabareno179@gmail.com');
  const [clientPhone, setClientPhone] = useState<string>('+52 55 4123 8890');
  const [notes, setNotes] = useState<string>('Diseño personalizado. Primera sesión del mes.');

  // Notification toggles
  const [enableWhatsApp, setEnableWhatsApp] = useState<boolean>(true);
  const [enableEmail, setEnableEmail] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentService = services.find(s => s.id === selectedServiceId)!;
  const validation = validateSuppliesForService(selectedServiceId);

  const stylists = [
    { name: 'Valentina Rossi (Master Nail Artist)', special: 'Uñas & Pestañas', rating: '4.9 ★' },
    { name: 'Mateo Sandoval (Colorista Senior)', special: 'Cabello & Colorimetría', rating: '4.8 ★' },
    { name: 'Isabella Duarte (Cosmiatra)', special: 'Skincare & Tratamientos', rating: '5.0 ★' }
  ];

  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'
  ];

  const handleNextStep = () => {
    if (step === 3 && !validation.isValid) {
      return; // Blocked by atomic validation!
    }
    setStep(prev => Math.min(4, prev + 1));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    try {
      const res = await createAppointment({
        client_id: 'usr-1',
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        service_id: currentService.id,
        service_name: currentService.name,
        stylist_name: selectedStylist,
        date: selectedDate,
        time: selectedTime,
        duration_minutes: currentService.duration_minutes,
        status: 'Confirmada',
        notes: notes,
        total_price: currentService.price,
        whatsapp_reminder_sent: enableWhatsApp,
        email_reminder_sent: enableEmail
      });

      if (res.success && res.appointmentId) {
        changeView('AppointmentDetailView', res.appointmentId);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="view-reservation-wizard" className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span>Reserva de Citas (Wizard Guiado)</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            RF-03 Atómico
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Flujo guiado con validación atómica obligatoria de inventario físico antes de apartar el horario.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="clay-card p-5 bg-white flex items-center justify-between">
        {[
          { num: 1, title: 'Servicio' },
          { num: 2, title: 'Fecha y Estilista' },
          { num: 3, title: 'Validación Atómica' },
          { num: 4, title: 'Confirmación' }
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-2.5">
              <div 
                className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                  step === s.num
                    ? 'clay-lilac text-purple-950 ring-2 ring-purple-400'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${
                step === s.num ? 'text-purple-900 font-extrabold' : 'text-slate-500'
              }`}>
                {s.title}
              </span>
            </div>
            {idx < 3 && <div className="flex-1 h-0.5 bg-slate-100 mx-3" />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Selección de Servicio */}
      {step === 1 && (
        <div className="clay-card p-7 flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">1. Seleccione el Servicio</h2>
            <span className="text-xs text-slate-400">Cada servicio requiere insumos específicos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => {
              const isSelected = selectedServiceId === srv.id;
              return (
                <div
                  key={srv.id}
                  id={`select-service-${srv.id}`}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 shadow-md translate-y-[-2px]'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                        {srv.category}
                      </span>
                      <span className="text-base font-black text-slate-900">${srv.price.toFixed(2)}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mt-2">{srv.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Receta de Insumos Requeridos:
                    </span>
                    <ul className="flex flex-col gap-1 text-[11px] text-slate-600">
                      {srv.required_supplies.map((req, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span className="truncate">{req.supply_name}</span>
                          <span className="font-semibold text-slate-800">{req.quantity} {req.unit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-[11px] font-semibold text-purple-700">
                      Duración estimada: {srv.duration_minutes} min
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Selección de Estilista, Fecha y Hora */}
      {step === 2 && (
        <div className="clay-card p-7 flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">2. Estilista, Fecha y Horario</h2>
            <span className="text-xs text-slate-500">Servicio: <strong>{currentService.name}</strong></span>
          </div>

          {/* Stylist Selection */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
              Profesional Asignado
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stylists.map((st) => {
                const isSelected = selectedStylist === st.name;
                return (
                  <div
                    key={st.name}
                    onClick={() => setSelectedStylist(st.name)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{st.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{st.special}</div>
                    <div className="text-[11px] font-semibold text-amber-600 mt-1">{st.rating}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Fecha del Servicio
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="clay-input w-full p-3 text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Horario Disponible
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      selectedTime === slot
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Validación Atómica de Inventario en Tiempo Real */}
      {step === 3 && (
        <div className="clay-card p-7 flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800">3. Validación Atómica de Insumos</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verificación en tiempo real de la tabla <code className="font-mono bg-slate-100 px-1 rounded">supplies</code> antes de bloquear recursos.
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              validation.isValid
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-rose-100 text-rose-800 border-rose-200'
            }`}>
              {validation.isValid ? 'Stock Verificado' : 'Bloqueo Atómico'}
            </span>
          </div>

          {/* Validation Alert Status */}
          {!validation.isValid ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-sm">Reserva Bloqueada por Recursos Insuficientes</h4>
                <p className="mt-1">
                  El sistema no permite confirmar esta cita porque no hay suficiente stock físico en almacén.
                  Debe reabastecer los insumos faltantes o ajustar el servicio.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold text-sm">Inventario Suficiente Garantizado</h4>
                <p className="mt-1">
                  Todos los insumos requeridos para este servicio están disponibles en almacén. Al continuar, 
                  se descontará atómicamente la cantidad reservada.
                </p>
              </div>
            </div>
          )}

          {/* Table of Required Supplies vs Stock */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200/60 text-slate-400 uppercase font-semibold">
                  <th className="p-3.5">Insumo Requerido</th>
                  <th className="p-3.5">Cantidad Necesaria</th>
                  <th className="p-3.5">Stock Físico Actual</th>
                  <th className="p-3.5">Stock Proyectado Tras Cita</th>
                  <th className="p-3.5 text-right">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {currentService.required_supplies.map((req) => {
                  const targetSupply = supplies.find(s => s.id === req.supply_id);
                  const available = targetSupply ? targetSupply.stock : 0;
                  const isSufficient = available >= req.quantity;
                  const projected = Math.max(0, available - req.quantity);

                  return (
                    <tr key={req.supply_id} className="hover:bg-white/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800">
                        {req.supply_name}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700">
                        {req.quantity} {req.unit}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-bold ${isSufficient ? 'text-slate-800' : 'text-rose-600'}`}>
                          {available} {req.unit}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">
                        {isSufficient ? `${projected} ${req.unit}` : 'Deficitario'}
                      </td>
                      <td className="p-3.5 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSufficient
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isSufficient ? 'Aprobado' : 'Faltante'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 4: Datos del Cliente, Multicanal y Confirmación */}
      {step === 4 && (
        <div className="clay-card p-7 flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">4. Datos del Cliente y Recordatorios</h2>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Insumos validados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre Completo</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Teléfono WhatsApp</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Notas Especiales</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Multichannel Notification Simulation Options */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Canales de Recordatorio Automático
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableWhatsApp}
                  onChange={(e) => setEnableWhatsApp(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400"
                />
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Enviar recordatorio WhatsApp (24h antes)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableEmail}
                  onChange={(e) => setEnableEmail(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400"
                />
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Enviar comprobante por Email</span>
              </label>
            </div>
          </div>

          {/* Reservation Summary */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Servicio:</span> <strong className="text-slate-900">{currentService.name}</strong>
              <span className="mx-2">•</span>
              <span className="text-slate-500">Fecha:</span> <strong>{selectedDate} ({selectedTime})</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Total a Pagar:</span>{' '}
              <strong className="text-base text-purple-900 font-black">${currentService.price.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paso Anterior</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            id="btn-next-step"
            onClick={handleNextStep}
            disabled={step === 3 && !validation.isValid}
            className={`clay-button px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              step === 3 && !validation.isValid
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'clay-lilac text-purple-950 hover:scale-[1.02]'
            }`}
          >
            <span>{step === 3 ? 'Continuar a Confirmación' : 'Siguiente Paso'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            id="btn-confirm-reservation-atomic"
            onClick={handleConfirmReservation}
            disabled={isSubmitting}
            className="clay-button bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isSubmitting ? 'Procesando Transacción...' : 'Confirmar Reserva Atómica'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
