import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Star, 
  Gift, 
  Award, 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  RefreshCw, 
  Heart, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Camera
} from 'lucide-react';

export const ClientDashboardView: React.FC = () => {
  const { 
    profile, 
    updateProfileData,
    appointments, 
    services, 
    gallery,
    changeView, 
    addToast,
    sendReminder,
    updateAppointmentStatus
  } = useApp();

  // Tab for appointments: upcoming vs history
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [ratings, setRatings] = useState<Record<string, number>>({
    'apt-101': 5,
    'apt-102': 5,
    'apt-103': 4
  });

  // Client notification preferences state
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [reminderTime, setReminderTime] = useState<'24h' | '2h'>('24h');
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Filter client appointments based on profile email or name or if demo client
  const clientAppointments = appointments.filter(a => {
    if (profile.role === 'CLIENT') {
      // In CLIENT mode, match email or name, or if user is Camila Morales match her appointments
      return (
        a.client_id === profile.id || 
        a.client_email.toLowerCase() === profile.email.toLowerCase() ||
        a.client_name.toLowerCase().includes(profile.full_name.toLowerCase()) ||
        a.client_name === 'Camila Morales' ||
        a.client_name === 'Sofia Bareño'
      );
    }
    // In ADMIN mode previewing client portal, show Sofia or Camila's appointments
    return (
      a.client_id === profile.id || 
      a.client_email.toLowerCase() === profile.email.toLowerCase() ||
      a.client_name.toLowerCase().includes(profile.full_name.toLowerCase()) ||
      a.id === 'apt-101' || a.id === 'apt-102'
    );
  });

  // Upcoming vs Past
  const upcomingAppointments = clientAppointments.filter(a => a.status === 'Confirmada' || a.status === 'En Progreso');
  const pastAppointments = clientAppointments.filter(a => a.status === 'Completada' || a.status === 'Cancelada');

  // Next active appointment spotlight
  const nextAppointment = upcomingAppointments[0] || clientAppointments[0];

  const handleRate = (appointmentId: string, stars: number) => {
    setRatings(prev => ({ ...prev, [appointmentId]: stars }));
    addToast({
      type: 'success',
      title: '¡Gracias por tu reseña!',
      message: `Has calificado tu experiencia con ${stars} estrellas. Tu opinión nos ayuda a mantener la excelencia en Salon Gift.`
    });
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    const success = await updateAppointmentStatus(appointmentId, 'Cancelada');
    if (success) {
      addToast({
        type: 'info',
        title: 'Cita Cancelada',
        message: 'Tu cita ha sido cancelada y los insumos reservados han sido devueltos al stock disponible.'
      });
    }
  };

  const handleSavePreferences = () => {
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      addToast({
        type: 'success',
        title: 'Preferencias Actualizadas',
        message: 'Hemos guardado tus preferencias de recordatorios multicanal exitosamente.'
      });
    }, 400);
  };

  const handleWhatsAppConfirm = (apt: typeof nextAppointment) => {
    if (!apt) return;
    sendReminder(apt.id, 'whatsapp');
  };

  return (
    <div id="view-client-dashboard" className="p-8 max-w-7xl mx-auto flex flex-col gap-8 select-none">
      {/* 1. HERO WELCOME & LOYALTY VIP BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100/90 via-pink-50/70 to-indigo-50/80 border border-purple-200/80 p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-8 w-48 h-48 bg-pink-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={profile.full_name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-purple-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  ¡Hola, {profile.full_name.split(' ')[0]}! ✨
                </h1>
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-purple-200 text-purple-900 border border-purple-300 shadow-2xs">
                  Miembro VIP Gold
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1">
                Bienvenida a tu portal personalizado en <strong>Salon Gift</strong>. Gestiona tus citas, beneficios de fidelidad y cuidados de belleza.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-client-view-gallery"
              onClick={() => changeView('GalleryView')}
              className="clay-button bg-pink-50 hover:bg-pink-100 text-pink-900 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-xs border border-pink-200 hover:scale-102 transition-transform"
              title="Ver galería de trabajos y fotos de resultados reales"
            >
              <Camera className="w-4 h-4 text-pink-600" />
              <span>Galería de Trabajos</span>
            </button>

            <button
              id="btn-client-view-services"
              onClick={() => changeView('ServicesDashboardView')}
              className="clay-button bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 hover:scale-102 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Ver Menú de Servicios</span>
            </button>

            <button
              id="btn-client-new-booking"
              onClick={() => changeView('ReservationWizardView')}
              className="clay-button clay-lilac text-purple-950 font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-purple-900" />
              <span>Agendar Nueva Cita</span>
            </button>
          </div>
        </div>

        {/* VIP Loyalty Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-purple-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-purple-100 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-800">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Puntos Acumulados</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-purple-950">450</span>
                <span className="text-xs text-slate-400 font-medium">/ 500 para Mascarilla Gratis</span>
              </div>
              <div className="w-36 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div className="w-[90%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-purple-100 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-pink-100 text-pink-800">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Tratamiento Favorito</span>
              <span className="text-sm font-black text-slate-800 block truncate">
                Manicura Polygel Escultural
              </span>
              <span className="text-[11px] text-pink-700 font-bold">3 visitas completadas</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-purple-100 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Beneficio Activo</span>
              <span className="text-sm font-black text-emerald-900 block truncate">
                -15% en Próxima Sesión
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Válido hasta Octubre 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROXIMA CITA DESTACADA (SPOTLIGHT CARD) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-100 text-purple-800">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Tu Próxima Cita</h2>
          </div>
          {nextAppointment && (
            <span className="text-xs font-bold text-slate-500">
              Código de Reserva: <strong className="font-mono text-purple-900">{nextAppointment.id}</strong>
            </span>
          )}
        </div>

        {nextAppointment ? (
          <div className="clay-card p-6 bg-white border border-purple-100/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
            {/* Left: Service & Stylist Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
              <div className="w-16 h-16 rounded-2xl clay-lilac text-purple-900 flex items-center justify-center shrink-0 shadow-sm">
                <Scissors className="w-8 h-8" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {nextAppointment.duration_minutes} min
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    nextAppointment.status === 'Confirmada'
                      ? 'bg-emerald-100 text-emerald-800'
                      : nextAppointment.status === 'En Progreso'
                      ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    ● {nextAppointment.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ${nextAppointment.total_price.toFixed(2)} USD
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {nextAppointment.service_name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1.5 font-semibold text-purple-900">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    {nextAppointment.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-purple-900">
                    <Clock className="w-4 h-4 text-purple-600" />
                    {nextAppointment.time} hrs
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <User className="w-4 h-4 text-slate-400" />
                    {nextAppointment.stylist_name}
                  </span>
                </div>

                {nextAppointment.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl mt-1 italic border border-slate-100">
                    "{nextAppointment.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 w-full lg:w-56 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <button
                id="btn-client-view-appointment-detail"
                onClick={() => changeView('AppointmentDetailView', nextAppointment.id)}
                className="flex-1 lg:w-full py-2.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <span>Ver Protocolo de Cita</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="btn-client-whatsapp-confirm"
                onClick={() => handleWhatsAppConfirm(nextAppointment)}
                className="flex-1 lg:w-full py-2 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="Recibir recordatorio de asistencia por WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confirmar por WhatsApp</span>
              </button>

              {nextAppointment.status === 'Confirmada' && (
                <button
                  id="btn-client-cancel-appointment"
                  onClick={() => handleCancelAppointment(nextAppointment.id)}
                  className="flex-1 lg:w-full py-2 px-3.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Cancelar Reserva</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="clay-card p-8 text-center bg-white flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No tienes citas agendadas por el momento</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              ¿Lista para consentirte? Elige tu tratamiento favorito y asegura tu lugar con nuestros estilistas expertos.
            </p>
            <button
              onClick={() => changeView('ReservationWizardView')}
              className="clay-button clay-lilac text-purple-950 font-bold text-xs px-5 py-2.5 rounded-xl mt-2 cursor-pointer"
            >
              Agendar mi Cita Ahora
            </button>
          </div>
        )}
      </div>

      {/* 3. DOS COLUMNAS: MIS CITAS (TABS) & SERVICIOS RECOMENDADOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COL 1 & 2: Mis Citas (Próximas & Historial) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-slate-900">Mis Citas en Salon Gift</h2>
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-3 py-1 font-bold rounded-lg transition-all ${
                    activeTab === 'upcoming' ? 'bg-white text-purple-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Próximas ({upcomingAppointments.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1 font-bold rounded-lg transition-all ${
                    activeTab === 'history' ? 'bg-white text-purple-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Historial Pasado ({pastAppointments.length})
                </button>
              </div>
            </div>

            <button
              onClick={() => changeView('ReservationWizardView')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            >
              <span>+ Agendar Otra Cita</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Appointment Cards List */}
          <div className="flex flex-col gap-3">
            {activeTab === 'upcoming' ? (
              upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="clay-card p-5 bg-white border border-slate-200/70 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 shrink-0 mt-0.5">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{apt.service_name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="font-semibold text-slate-700">{apt.date} a las {apt.time}</span>
                          <span>•</span>
                          <span>{apt.stylist_name}</span>
                          <span>•</span>
                          <span className="font-mono font-bold text-slate-800">${apt.total_price.toFixed(2)} USD</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => changeView('AppointmentDetailView', apt.id)}
                        className="p-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-800 transition-colors"
                      >
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => handleWhatsAppConfirm(apt)}
                        className="p-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                        title="Enviar recordatorio WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  No hay citas pendientes por atender.
                </div>
              )
            ) : (
              pastAppointments.length > 0 ? (
                pastAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="clay-card p-5 bg-white border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{apt.service_name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span>{apt.date}</span>
                          <span>•</span>
                          <span>{apt.stylist_name}</span>
                          <span>•</span>
                          <span className="font-mono font-bold">${apt.total_price.toFixed(2)} USD</span>
                        </div>

                        {/* Interactive Star Rating */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[11px] font-semibold text-slate-500">Tu Calificación:</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRate(apt.id, star)}
                                className="text-amber-400 hover:scale-120 transition-transform cursor-pointer"
                              >
                                <Star 
                                  className={`w-3.5 h-3.5 ${
                                    (ratings[apt.id] || 5) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => changeView('ReservationWizardView')}
                      className="clay-button clay-mint text-emerald-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 self-end sm:self-center cursor-pointer hover:scale-102 transition-transform"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Volver a Agendar</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  Aún no tienes historial de citas pasadas registradas.
                </div>
              )
            )}
          </div>

          {/* BEAUTY AFTERCARE & CARE GUIDE TIPS */}
          <div className="clay-card p-6 bg-white flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-100 text-pink-700">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Guía de Cuidados Post-Tratamiento</h3>
                <p className="text-xs text-slate-400">Recomendaciones de tus estilistas para que tu look dure más tiempo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  💅 Uñas & Polygel
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Aplica aceite de cutícula cada noche. Evita usar las uñas como herramientas para destapar latas. Programa tu retoque a las 3 semanas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                  💇‍♀️ Color & Balayage
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Lava tu cabello con agua tibia o fría. Usa shampoo libre de sulfatos y aplica la mascarilla Plex selladora una vez a la semana.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  👁️ Pestañas & Cejas
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Evita mojar tus pestañas durante las primeras 24 horas tras el lifting. Péinalas suavemente por la mañana con el cepillo de cortesía.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COL 3: SERVICIOS SUGERIDOS & PREFERENCIAS DE RECORDATORIOS */}
        <div className="flex flex-col gap-6">
          {/* Servicios Recomendados / Promociones */}
          <div className="clay-card p-6 bg-white flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-black text-slate-900">Servicios Recomendados</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Para Ti
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {services.slice(0, 3).map((service) => (
                <div 
                  key={service.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 transition-all flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-purple-900 transition-colors">
                      {service.name}
                    </span>
                    <span className="text-xs font-black text-purple-950 font-mono">
                      ${service.price} USD
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration_minutes} min
                    </span>

                    <button
                      onClick={() => changeView('ReservationWizardView')}
                      className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Reservar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferencias de Notificación del Cliente */}
          <div className="clay-card p-6 bg-white flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">Mis Recordatorios</h3>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Avisos por WhatsApp
                </span>
                <input
                  type="checkbox"
                  checked={notifyWhatsapp}
                  onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                  className="rounded text-purple-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Confirmación por Email
                </span>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded text-purple-600"
                />
              </label>

              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-1">
                  Anticipación del Recordatorio
                </span>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value as '24h' | '2h')}
                  className="clay-input w-full p-2 text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="24h">24 horas antes del servicio</option>
                  <option value="2h">2 horas antes del servicio</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{savingPrefs ? 'Guardando...' : 'Guardar Preferencias'}</span>
              </button>
            </div>
          </div>

          {/* Salon Location & Support Mini Card */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-2 text-xs">
            <span className="font-black text-purple-950 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-purple-700" />
              Salon Gift Experience
            </span>
            <p className="text-slate-600 text-[11px]">
              Av. Presidente Masaryk 420, Polanco, CDMX.<br />
              Horario: Lun - Sáb de 09:00 a 19:00 hrs.
            </p>
            <span className="text-[10px] text-purple-800 font-bold">
              ¿Dudas con tu cita? WhatsApp: +52 55 4123 8890
            </span>
          </div>
        </div>
      </div>

      {/* 4. LOOKBOOK & GALERIA DE TRABAJOS PREVIEW */}
      <div className="clay-card p-6 md:p-8 bg-white border border-slate-200/80 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-pink-100 text-pink-900 shadow-2xs">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base md:text-lg font-black text-slate-900">
                Lookbook & Galería de Trabajos Reales
              </h2>
              <p className="text-xs text-slate-500">
                Uñas esculpidas, balayage luminoso, lifting de pestañas y skincare. Inspírate para tu próxima visita.
              </p>
            </div>
          </div>

          <button
            onClick={() => changeView('GalleryView')}
            className="clay-button bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 border border-purple-200 cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <span>Ver Portafolio Completo ({gallery.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => changeView('GalleryView')}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200/80 cursor-pointer shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={item.image_url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-white/90 text-slate-800">
                  {item.category}
                </span>
                <p className="text-[11px] font-bold mt-1 line-clamp-1 text-white drop-shadow-xs">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
