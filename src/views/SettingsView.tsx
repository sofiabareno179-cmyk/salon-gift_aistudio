import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, NotificationSettings } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  MessageSquare, 
  Key, 
  Database, 
  Save, 
  Send, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';

export const SettingsView: React.FC = () => {
  const { 
    profile, 
    updateProfileData, 
    notifications, 
    setNotifications, 
    addToast,
    supabaseConnected 
  } = useApp();

  // Profile form state
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone || '');
  const [role, setRole] = useState<UserRole>(profile.role);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');

  // Notification API state
  const [notifConfig, setNotifConfig] = useState<NotificationSettings>(notifications);
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('+52 55 4123 8890');
  const [simulatedMessagePayload, setSimulatedMessagePayload] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      full_name: fullName,
      email,
      phone,
      role,
      avatar_url: avatarUrl
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifications(notifConfig);
    addToast({
      type: 'success',
      title: 'Credenciales API actualizadas',
      message: 'Configuración de WhatsApp Business y servicio de Email almacenadas exitosamente.'
    });
  };

  const handleSimulateWhatsAppTest = () => {
    const payload = JSON.stringify({
      messaging_product: "whatsapp",
      to: testPhoneNumber,
      type: "template",
      template: {
        name: "salon_gift_recordatorio_v1",
        language: { code: "es_MX" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: fullName },
              { type: "text", text: "Manicura Polygel Escultural" },
              { type: "text", text: "Mañana a las 14:30" }
            ]
          }
        ]
      }
    }, null, 2);

    setSimulatedMessagePayload(payload);
    addToast({
      type: 'success',
      title: 'Simulación de API WhatsApp Disparada',
      message: `Template 'salon_gift_recordatorio_v1' despachado satisfactoriamente hacia ${testPhoneNumber}.`
    });
  };

  return (
    <div id="view-settings" className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* View Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span>Configuración, Perfil y Notificaciones API</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            RF-01 / RF-05
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Gestión de datos de usuario en la tabla <code className="font-mono bg-slate-100 px-1 rounded">profiles</code> y credenciales de recordatorios multicanal.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* COLUMN 1: Profile Mutations (profiles table) */}
        <div className="clay-card p-7 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl clay-lilac text-purple-900">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800">Perfil de Usuario</h2>
                <p className="text-xs text-slate-400">Mutaciones sincronizadas con tabla profiles</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">ID: {profile.id}</span>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-300 shadow-sm"
              />
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                  URL del Avatar
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="clay-input w-full p-2 text-xs"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Correo Electrónico (auth.users)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Teléfono Móvil (WhatsApp)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="clay-input w-full p-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Role Switcher */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Rol de Usuario y Políticas RLS
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="clay-input w-full p-2.5 text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="ADMIN">ADMIN (Acceso total a inventario, citas y configuración)</option>
                <option value="CLIENT">CLIENT (Solo consulta y citas propias - Sujeto a Error 42501)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Al seleccionar CLIENT, cualquier intento de modificar stock disparará el error RLS 42501.
              </p>
            </div>

            <button
              type="submit"
              id="btn-save-profile"
              className="clay-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 mt-2 cursor-pointer transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios de Perfil</span>
            </button>
          </form>
        </div>

        {/* COLUMN 2: API Credentials & Supabase Diagnostic */}
        <div className="flex flex-col gap-6">
          {/* WhatsApp & Email Config */}
          <div className="clay-card p-7 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl clay-mint text-emerald-950">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800">Notificaciones Multicanal API</h2>
                <p className="text-xs text-slate-400">WhatsApp Cloud API & Email Transaccional</p>
              </div>
            </div>

            <form onSubmit={handleSaveNotifications} className="flex flex-col gap-4 text-xs">
              {/* WhatsApp Business API */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Business Cloud API
                  </span>
                  <input
                    type="checkbox"
                    checked={notifConfig.whatsapp_enabled}
                    onChange={(e) => setNotifConfig(prev => ({ ...prev, whatsapp_enabled: e.target.checked }))}
                    className="rounded text-purple-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={notifConfig.whatsapp_phone_number_id}
                    onChange={(e) => setNotifConfig(prev => ({ ...prev, whatsapp_phone_number_id: e.target.value }))}
                    className="clay-input w-full p-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">System User Access Token</label>
                  <input
                    type="password"
                    value={notifConfig.whatsapp_token}
                    onChange={(e) => setNotifConfig(prev => ({ ...prev, whatsapp_token: e.target.value }))}
                    className="clay-input w-full p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Email Provider */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    Proveedor de Correo Electrónico
                  </span>
                  <input
                    type="checkbox"
                    checked={notifConfig.email_enabled}
                    onChange={(e) => setNotifConfig(prev => ({ ...prev, email_enabled: e.target.checked }))}
                    className="rounded text-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Proveedor</label>
                    <select
                      value={notifConfig.email_provider}
                      onChange={(e) => setNotifConfig(prev => ({ ...prev, email_provider: e.target.value as any }))}
                      className="clay-input w-full p-2 text-xs"
                    >
                      <option value="Resend">Resend API</option>
                      <option value="SendGrid">SendGrid</option>
                      <option value="SMTP">SMTP Seguro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Antelación Recordatorio</label>
                    <select
                      value={notifConfig.reminder_hours_before}
                      onChange={(e) => setNotifConfig(prev => ({ ...prev, reminder_hours_before: Number(e.target.value) }))}
                      className="clay-input w-full p-2 text-xs"
                    >
                      <option value={24}>24 horas antes</option>
                      <option value={12}>12 horas antes</option>
                      <option value={2}>2 horas antes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="clay-button flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Guardar Parámetros API
                </button>

                <button
                  type="button"
                  onClick={handleSimulateWhatsAppTest}
                  className="clay-button px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Probar WhatsApp</span>
                </button>
              </div>
            </form>

            {/* Test Payload Preview */}
            {simulatedMessagePayload && (
              <div className="mt-2 p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-x-auto">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-slate-400">
                  <span>Payload Despachado (WhatsApp Cloud API)</span>
                  <button onClick={() => setSimulatedMessagePayload(null)} className="text-white hover:text-rose-400">✕</button>
                </div>
                <pre>{simulatedMessagePayload}</pre>
              </div>
            )}
          </div>

          {/* Supabase Diagnostics Panel */}
          <div className="clay-card p-6 flex flex-col gap-3.5 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Diagnóstico de Clúster Supabase</span>
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                supabaseConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {supabaseConnected ? 'Conectado a PostgreSQL' : 'Verificando'}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">URL del Proyecto:</span>
                <span className="text-slate-800 font-semibold truncate block">{SUPABASE_URL}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-slate-400 block text-[10px]">Anon / Publishable Key:</span>
                  <span className="text-slate-800 font-semibold truncate block">
                    {showAnonKey ? SUPABASE_ANON_KEY : `${SUPABASE_ANON_KEY.substring(0, 16)}••••••••••••••••`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
