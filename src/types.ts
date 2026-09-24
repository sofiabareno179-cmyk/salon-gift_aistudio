export type UserRole = 'ADMIN' | 'CLIENT';

export type ViewName = 
  | 'AuthView'
  | 'DashboardView'
  | 'ClientDashboardView'
  | 'SuppliesListView'
  | 'AppointmentDetailView'
  | 'ReservationWizardView'
  | 'SettingsView'
  | 'CalendarView'
  | 'ServicesDashboardView'
  | 'GalleryView';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Uñas' | 'Cabello' | 'Pestañas' | 'Skincare' | 'General';
  image_url: string;
  description?: string;
  service_id?: string;
  service_name?: string;
  stylist_name?: string;
  created_at: string;
  likes_count: number;
  tags?: string[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export type SupplyStatus = 'Suficiente' | 'Por Agotar' | 'Agotado';

export interface Supply {
  id: string;
  name: string;
  category: 'Uñas' | 'Cabello' | 'Pestañas' | 'Skincare' | 'General';
  stock: number;
  stock_min: number;
  unit: string;
  unit_cost: number;
  location: string;
  last_restock?: string;
  supplier?: string;
  status: SupplyStatus;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration_minutes: number;
  price: number;
  description: string;
  required_supplies: {
    supply_id: string;
    supply_name: string;
    quantity: number;
    unit: string;
  }[];
  color: string;
}

export type AppointmentStatus = 'Confirmada' | 'En Progreso' | 'Completada' | 'Cancelada';

export interface AppointmentSupply {
  id: string;
  appointment_id: string;
  supply_id: string;
  supply_name: string;
  quantity_used: number;
  unit: string;
  status: 'Reservado' | 'Consumido' | 'Reintegrado';
}

export interface ServiceTimelineStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  time?: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id: string;
  service_name: string;
  stylist_name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration_minutes: number;
  status: AppointmentStatus;
  notes?: string;
  total_price: number;
  supplies: AppointmentSupply[];
  timeline: ServiceTimelineStep[];
  whatsapp_reminder_sent: boolean;
  email_reminder_sent: boolean;
  created_at: string;
}

export interface NotificationSettings {
  whatsapp_enabled: boolean;
  whatsapp_phone_number_id: string;
  whatsapp_token: string;
  email_enabled: boolean;
  email_provider: 'Resend' | 'SendGrid' | 'SMTP';
  email_api_key: string;
  reminder_hours_before: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  code?: string;
}
