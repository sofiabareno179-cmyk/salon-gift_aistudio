import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Scissors, 
  ArrowRight, 
  Heart, 
  ShieldAlert,
  LogOut,
  KeyRound
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

// Demo clients list for public test/demo purposes
const DEFAULT_KNOWN_CLIENTS = [
  { email: 'camila.m@example.com', name: 'Camila Morales', phone: '+52 55 9876 5432', password: '123' },
  { email: 'lucia.g@example.com', name: 'Lucia Fernanda Gómez', phone: '+52 55 3344 5566', password: '123' },
  { email: 'mariana.silva@example.com', name: 'Mariana Silva', phone: '+52 55 7788 9900', password: '123' }
];

export const AuthView: React.FC = () => {
  const { profile, setProfile, changeView, addToast } = useApp();

  // Portal selection: 'ADMIN' or 'CLIENT'
  const [targetPortal, setTargetPortal] = useState<'ADMIN' | 'CLIENT'>(profile.role || 'CLIENT');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form inputs (default to client values, never expose admin credentials)
  const [email, setEmail] = useState('camila.m@example.com');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('Camila Morales');
  const [phone, setPhone] = useState('+52 55 9876 5432');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const switchPortal = (portal: 'ADMIN' | 'CLIENT') => {
    setTargetPortal(portal);
    setAuthError(null);
    if (portal === 'ADMIN') {
      setAuthMode('login'); // Admin access is login-only
      // Inputs start empty for Admin to prevent leaking credentials
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
    } else {
      // Default sample client demo
      setEmail('camila.m@example.com');
      setPassword('123456');
      setFullName('Camila Morales');
      setPhone('+52 55 9876 5432');
    }
  };

  const handleLogout = () => {
    const guestProfile: Profile = {
      id: 'usr-guest-' + Date.now(),
      email: '',
      full_name: 'Invitado',
      phone: '',
      role: 'CLIENT',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    };
    setProfile(guestProfile);
    localStorage.setItem('sg_profile', JSON.stringify(guestProfile));
    setTargetPortal('CLIENT');
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setAuthError(null);
    addToast({
      type: 'info',
      title: 'Sesión Finalizada',
      message: 'Has cerrado sesión correctamente. Ingresa tus credenciales para volver a entrar.'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Credenciales de administrador leídas de variables de entorno protegidas (.env en .gitignore)
    const configuredAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
    const configuredAdminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();
    const configuredAdminName = import.meta.env.VITE_ADMIN_NAME || 'Administrador';
    const configuredAdminPhone = import.meta.env.VITE_ADMIN_PHONE || '';

    try {
      // 1. VALIDACIÓN ESTRICTA DEL PORTAL DE ADMINISTRACIÓN
      if (targetPortal === 'ADMIN') {
        if (!normalizedEmail || !trimmedPassword) {
          setLoading(false);
          setAuthError('Por favor ingresa tanto el correo como la contraseña de administrador.');
          return;
        }

        let isAdminValid = false;

        // A. Verificación con variables de entorno locales protegidas
        if (configuredAdminEmail && configuredAdminPassword) {
          if (normalizedEmail === configuredAdminEmail && trimmedPassword === configuredAdminPassword) {
            isAdminValid = true;
          }
        }

        // B. Verificación con Supabase Auth si está disponible
        if (!isAdminValid) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password: trimmedPassword
            });
            if (!error && data?.user) {
              isAdminValid = true;
            }
          } catch {
            // Supabase fuera de línea o fallo de red
          }
        }

        // Si no coincide con ninguna credencial autorizada -> BLOQUEAR
        if (!isAdminValid) {
          setLoading(false);
          const errorMsg = 'Credenciales de administrador incorrectas. Acceso denegado.';
          setAuthError(errorMsg);
          addToast({
            type: 'error',
            title: 'Acceso Denegado (401)',
            message: errorMsg,
            code: '401_UNAUTHORIZED'
          });
          return; // STOP! No entra a la administración
        }

        // Credenciales correctas -> Acceso concedido
        const adminProfile: Profile = {
          id: 'usr-admin',
          email: normalizedEmail,
          full_name: configuredAdminName,
          phone: configuredAdminPhone,
          role: 'ADMIN',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          created_at: new Date().toISOString()
        };

        setProfile(adminProfile);
        localStorage.setItem('sg_profile', JSON.stringify(adminProfile));

        addToast({
          type: 'success',
          title: 'Acceso Concedido',
          message: `Bienvenido(a) ${configuredAdminName}. Has ingresado al Panel de Control.`
        });

        changeView('DashboardView');
        return;
      }

      // 2. VALIDACIÓN PARA EL PORTAL DE CLIENTES
      if (targetPortal === 'CLIENT') {
        // Si ingresa el correo del administrador en la pestaña de clientes, avisarle
        if (configuredAdminEmail && normalizedEmail === configuredAdminEmail) {
          setLoading(false);
          const errorMsg = 'Este correo corresponde al Administrador. Por favor selecciona la pestaña "Administración" para iniciar sesión.';
          setAuthError(errorMsg);
          addToast({
            type: 'info',
            title: 'Cuenta Administrativa',
            message: 'Selecciona la pestaña Administración para ingresar con tus credenciales.'
          });
          return;
        }

        if (authMode === 'login') {
          // Obtener clientes registrados locales
          const savedClientsRaw = localStorage.getItem('sg_registered_clients');
          const savedClients: typeof DEFAULT_KNOWN_CLIENTS = savedClientsRaw 
            ? JSON.parse(savedClientsRaw) 
            : DEFAULT_KNOWN_CLIENTS;

          const matchedClient = savedClients.find(
            c => c.email.toLowerCase() === normalizedEmail
          );

          let supabaseClientSuccess = false;
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password: trimmedPassword
            });
            if (!error && data?.user) {
              supabaseClientSuccess = true;
            }
          } catch {}

          if (!matchedClient && !supabaseClientSuccess && !trimmedPassword) {
            setLoading(false);
            const errorMsg = 'Cliente no registrado o contraseña incorrecta. Si es tu primera vez, haz clic en "Crear Cuenta".';
            setAuthError(errorMsg);
            addToast({
              type: 'error',
              title: 'Error de Inicio de Sesión',
              message: errorMsg,
              code: '401_CLIENT_UNAUTHORIZED'
            });
            return;
          }

          const clientName = matchedClient?.name || fullName || 'Cliente Salon Gift';
          const clientPhone = matchedClient?.phone || phone || '+52 55 9876 5432';

          const clientProfile: Profile = {
            id: 'usr-client-' + Date.now(),
            email: normalizedEmail,
            full_name: clientName,
            phone: clientPhone,
            role: 'CLIENT', // ESTRICTAMENTE CLIENTE
            avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            created_at: new Date().toISOString()
          };

          setProfile(clientProfile);
          localStorage.setItem('sg_profile', JSON.stringify(clientProfile));

          addToast({
            type: 'success',
            title: 'Sesión Iniciada',
            message: `¡Bienvenida ${clientName}! Has ingresado a tu Portal de Cliente.`
          });

          changeView('ClientDashboardView');
          return;
        } else {
          // REGISTRO DE NUEVA CUENTA DE CLIENTE
          if (!fullName.trim()) {
            setLoading(false);
            setAuthError('Por favor ingresa tu nombre completo para crear tu cuenta.');
            return;
          }

          const newClient = {
            name: fullName.trim(),
            email: normalizedEmail,
            phone: phone.trim() || '+52 55 0000 0000',
            password: trimmedPassword
          };

          const savedClientsRaw = localStorage.getItem('sg_registered_clients');
          const savedClients: typeof DEFAULT_KNOWN_CLIENTS = savedClientsRaw 
            ? JSON.parse(savedClientsRaw) 
            : [...DEFAULT_KNOWN_CLIENTS];

          if (!savedClients.some(c => c.email.toLowerCase() === normalizedEmail)) {
            savedClients.push(newClient);
            localStorage.setItem('sg_registered_clients', JSON.stringify(savedClients));
          }

          const clientProfile: Profile = {
            id: 'usr-client-' + Date.now(),
            email: normalizedEmail,
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: 'CLIENT', // ESTRICTAMENTE CLIENTE
            avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            created_at: new Date().toISOString()
          };

          setProfile(clientProfile);
          localStorage.setItem('sg_profile', JSON.stringify(clientProfile));

          addToast({
            type: 'success',
            title: 'Cuenta Creada Exitosamente',
            message: `¡Bienvenida a Salon Gift, ${fullName.trim()}!`
          });

          changeView('ClientDashboardView');
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="view-auth" className="min-h-[85vh] flex items-center justify-center p-6 select-none">
      {/* Floating Card */}
      <div className="clay-card max-w-md w-full p-8 bg-white flex flex-col gap-6 shadow-2xl relative border border-slate-200/80">
        {/* Salon Gift Brand */}
        <div className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl clay-lilac flex items-center justify-center text-purple-950 shadow-md mb-3">
            <Scissors className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Salon Gift</h1>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma con separación estricta de Dashboards por Rol
          </p>
        </div>

        {/* 1. SEPARADOR DE PORTALES: ADMIN VS CLIENTE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Selecciona el Portal de Ingreso
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/60">
            <button
              type="button"
              id="tab-portal-client"
              onClick={() => switchPortal('CLIENT')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                targetPortal === 'CLIENT'
                  ? 'bg-white text-pink-950 shadow-sm border border-pink-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-5 h-5 ${targetPortal === 'CLIENT' ? 'text-pink-600 fill-pink-100' : 'text-slate-400'}`} />
              <span className="text-xs font-black">Portal Cliente</span>
              <span className="text-[10px] text-slate-400">Mis Citas & VIP</span>
            </button>

            <button
              type="button"
              id="tab-portal-admin"
              onClick={() => switchPortal('ADMIN')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                targetPortal === 'ADMIN'
                  ? 'bg-white text-purple-950 shadow-sm border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${targetPortal === 'ADMIN' ? 'text-purple-600' : 'text-slate-400'}`} />
              <div className="flex items-center gap-1">
                <span className="text-xs font-black">Administración</span>
                <KeyRound className="w-3 h-3 text-purple-500" />
              </div>
              <span className="text-[10px] text-slate-400">Personal & Stock</span>
            </button>
          </div>

          {/* Explanation Banner */}
          <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${
            targetPortal === 'CLIENT'
              ? 'bg-pink-50/70 border-pink-200 text-pink-900'
              : 'bg-purple-50/70 border-purple-200 text-purple-900'
          }`}>
            {targetPortal === 'CLIENT' ? (
              <span>
                💖 <strong>Portal de Clientes:</strong> Acceso a citas, puntos VIP y reservas. <em>No otorga acceso al panel administrativo ni al stock.</em>
              </span>
            ) : (
              <span>
                🛡️ <strong>Panel Administrativo:</strong> Acceso reservado para el personal autorizado. Requiere correo y contraseña de administración válidos.
              </span>
            )}
          </div>
        </div>

        {/* Tab Switcher: Only clients can create a new account. Admin access is login-only */}
        {targetPortal === 'CLIENT' ? (
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              id="tab-client-login"
              onClick={() => { setAuthMode('login'); setAuthError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-pink-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              id="tab-client-register"
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-pink-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Crear Cuenta
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-bold text-purple-950">
                Ingreso de Personal Administrativo
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
              Requiere Credenciales
            </span>
          </div>
        )}

        {/* Authentication Error Alert Banner */}
        {authError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold">Error de Autenticación</strong>
              <span className="text-[11px] text-rose-700 leading-tight">{authError}</span>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {targetPortal === 'CLIENT' && authMode === 'register' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Camila Morales"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setAuthError(null); }}
                  className="clay-input w-full py-2.5 pl-9 pr-3 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Correo Electrónico</label>
              {targetPortal === 'ADMIN' && (
                <span className="text-[10px] text-purple-600 font-medium">
                  Correo de administrador
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={targetPortal === 'ADMIN' ? 'admin@ejemplo.com' : 'correo@ejemplo.com'}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setAuthError(null); }}
                className="clay-input w-full py-2.5 pl-9 pr-3 text-xs text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Contraseña</label>
              {targetPortal === 'ADMIN' && (
                <span className="text-[10px] text-purple-600 font-medium">
                  Contraseña oficial
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(null); }}
                className="clay-input w-full py-2.5 pl-9 pr-3 text-xs text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Clean helper box without leaking any credentials */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 text-[11px] text-slate-500">
            {targetPortal === 'ADMIN' ? (
              <p className="text-[11px] text-slate-600">
                🔒 <strong>Acceso Restringido:</strong> Ingresa con el correo y la contraseña configurados para la administración.
              </p>
            ) : (
              <p>
                💖 <strong>Portal de Clientes:</strong> Inicia sesión con tu cuenta de cliente o utiliza la pestaña <strong className="text-pink-900">Crear Cuenta</strong>.
              </p>
            )}
          </div>

          <button
            type="submit"
            id="btn-submit-auth"
            disabled={loading}
            className={`clay-button font-black py-3 rounded-2xl flex items-center justify-center gap-2 mt-2 shadow-md hover:scale-[1.01] transition-all cursor-pointer ${
              targetPortal === 'CLIENT' 
                ? 'clay-pink bg-pink-100 text-pink-950 border-pink-200' 
                : 'clay-lilac text-purple-950'
            }`}
          >
            <span>
              {loading
                ? 'Verificando credenciales...'
                : targetPortal === 'CLIENT'
                ? (authMode === 'register' ? 'Crear mi Cuenta de Cliente' : 'Entrar a Mi Portal de Cliente')
                : 'Iniciar Sesión en Administración'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Current Active Session Indicator and Logout */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 text-center text-[11px] text-slate-500">
          <div>
            Sesión actual: <strong className="text-slate-800">{profile.full_name || 'Sin sesión'}</strong>{' '}
            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
              profile.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-pink-100 text-pink-800'
            }`}>
              {profile.role}
            </span>
          </div>

          {profile.email && (
            <button
              type="button"
              id="btn-logout-auth"
              onClick={handleLogout}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión activa</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
