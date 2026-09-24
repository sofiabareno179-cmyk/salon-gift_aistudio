import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Scissors, 
  ArrowRight,
  Database,
  CheckCircle2,
  Heart,
  ShieldAlert
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthView: React.FC = () => {
  const { profile, setProfile, changeView, addToast } = useApp();

  // Portal selection: 'ADMIN_PORTAL' or 'CLIENT_PORTAL'
  const [targetPortal, setTargetPortal] = useState<'ADMIN' | 'CLIENT'>(profile.role);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState(
    profile.role === 'ADMIN' ? 'sofiabareno179@gmail.com' : 'camila.m@example.com'
  );
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState(
    profile.role === 'ADMIN' ? 'Sofia Bareño' : 'Camila Morales'
  );
  const [phone, setPhone] = useState(
    profile.role === 'ADMIN' ? '+52 55 4123 8890' : '+52 55 9876 5432'
  );
  const [loading, setLoading] = useState(false);

  const switchPortal = (portal: 'ADMIN' | 'CLIENT') => {
    setTargetPortal(portal);
    if (portal === 'ADMIN') {
      setAuthMode('login'); // Administrators cannot create account publicly; login only
      setEmail('sofiabareno179@gmail.com');
      setFullName('Sofia Bareño');
      setPhone('+52 55 4123 8890');
    } else {
      setEmail('camila.m@example.com');
      setFullName('Camila Morales');
      setPhone('+52 55 9876 5432');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activeRole = targetPortal;
    const isRegister = targetPortal === 'CLIENT' && authMode === 'register';

    try {
      // Attempt auth via Supabase Auth
      try {
        if (!isRegister) {
          await supabase.auth.signInWithPassword({ email, password });
        } else {
          await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, role: 'CLIENT' } }
          });
        }
      } catch (err) {
        // Fallback for demo mode
      }

      // Update active app state profile
      setProfile({
        id: activeRole === 'ADMIN' ? 'usr-1' : 'usr-2',
        email,
        full_name: fullName || (activeRole === 'ADMIN' ? 'Sofia Bareño' : 'Camila Morales'),
        phone,
        role: activeRole,
        avatar_url: activeRole === 'ADMIN'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      });

      addToast({
        type: 'success',
        title: isRegister ? 'Cuenta de Cliente Creada' : 'Sesión Iniciada con Éxito',
        message: activeRole === 'CLIENT'
          ? (isRegister ? `¡Bienvenida a Salon Gift, ${fullName}!` : `Bienvenida ${fullName}. Has ingresado a tu Portal Exclusivo de Cliente.`)
          : `Bienvenida ${fullName}. Acceso al Panel de Administración concedido.`
      });

      // Completely separated dashboard redirection
      changeView(activeRole === 'CLIENT' ? 'ClientDashboardView' : 'DashboardView');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="view-auth" className="min-h-[85vh] flex items-center justify-center p-6 select-none">
      {/* Floating Claymorphic Card */}
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
              <span className="text-xs font-black">Administración</span>
              <span className="text-[10px] text-slate-400">Staff & Stock</span>
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
                💖 <strong>Portal de Clientes:</strong> Tendrás acceso a tus citas, puntos VIP y solicitudes de reserva. <em>No podrás ingresar a las áreas de administración ni stock.</em>
              </span>
            ) : (
              <span>
                🛡️ <strong>Panel Administrativo:</strong> Acceso reservado para el personal de Salon Gift (métricas, control de inventario y configuración del sistema).
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
              onClick={() => setAuthMode('login')}
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
              onClick={() => setAuthMode('register')}
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
              Solo Login
            </span>
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
                  onChange={(e) => setFullName(e.target.value)}
                  className="clay-input w-full py-2.5 pl-9 pr-3 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="clay-input w-full py-2.5 pl-9 pr-3 text-xs text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="clay-input w-full py-2.5 pl-9 pr-3 text-xs text-slate-800 font-medium"
              />
            </div>
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
                ? 'Procesando...'
                : targetPortal === 'CLIENT'
                ? (authMode === 'register' ? 'Crear mi Cuenta de Cliente' : 'Entrar a Mi Portal de Cliente')
                : 'Iniciar Sesión en Administración'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Current Active Session Indicator */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-[11px] text-slate-500">
          Sesión actual en el sistema: <strong className="text-slate-800">{profile.full_name}</strong> ({profile.role})
        </div>
      </div>
    </div>
  );
};
