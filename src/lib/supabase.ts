import { createClient } from '@supabase/supabase-js';
import type { 
  Appointment, 
  Supply, 
  Service, 
  Profile, 
  UserRole,
  NotificationSettings,
  GalleryItem
} from '../types';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://llcxhdvfcpshmfwxymjt.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LEVCS5jK7Hn02XAEypDiZg_XX5N5WZ3';

// Supabase Singleton instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Default Services with supplies recipe
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Manicura Polygel Escultural',
    category: 'Uñas',
    duration_minutes: 90,
    price: 45.00,
    description: 'Extensión y esculpido con Polygel de alta resistencia, secado UV y esmaltado semipermanente.',
    color: '#C4B5FD',
    required_supplies: [
      { supply_id: 'sup-1', supply_name: 'Polygel Constructor Clear 60g', quantity: 15, unit: 'g' },
      { supply_id: 'sup-2', supply_name: 'Primer Adherente sin Ácido', quantity: 5, unit: 'ml' },
      { supply_id: 'sup-3', supply_name: 'Top Coat Gloss Ultra Brillo', quantity: 8, unit: 'ml' }
    ]
  },
  {
    id: 'srv-2',
    name: 'Balayage & Coloración Profunda',
    category: 'Cabello',
    duration_minutes: 150,
    price: 95.00,
    description: 'Técnica de aclaración suave con matiz y baño de color con Tinte Negro / Ébano Intenso.',
    color: '#FDBA74',
    required_supplies: [
      { supply_id: 'sup-4', supply_name: 'Tinte Negro Ébano 1.0 (60ml)', quantity: 1, unit: 'tubo' },
      { supply_id: 'sup-5', supply_name: 'Oxidante en Crema 20 Vol', quantity: 75, unit: 'ml' },
      { supply_id: 'sup-6', supply_name: 'Mascarilla Plex Reparadora', quantity: 30, unit: 'ml' }
    ]
  },
  {
    id: 'srv-3',
    name: 'Lifting de Pestañas + Keratina',
    category: 'Pestañas',
    duration_minutes: 60,
    price: 38.00,
    description: 'Curvatura natural con tratamiento de infusión de keratina y tinte negro para mirada intensa.',
    color: '#6EE7B7',
    required_supplies: [
      { supply_id: 'sup-7', supply_name: 'Kit Almohadillas Silicona', quantity: 1, unit: 'par' },
      { supply_id: 'sup-8', supply_name: 'Loción Ondulante Perm Paso 1', quantity: 3, unit: 'ml' },
      { supply_id: 'sup-9', supply_name: 'Suero de Keratina Nutritiva', quantity: 2, unit: 'ml' }
    ]
  },
  {
    id: 'srv-4',
    name: 'Facial Hidra-Glow & Peeling Ultrasónico',
    category: 'Skincare',
    duration_minutes: 75,
    price: 55.00,
    description: 'Higiene facial profunda con extracción suave, ácido hialurónico y mascarilla de colágeno.',
    color: '#F472B6',
    required_supplies: [
      { supply_id: 'sup-10', supply_name: 'Ampolla Ácido Hialurónico Puro', quantity: 1, unit: 'ampolla' },
      { supply_id: 'sup-11', supply_name: 'Mascarilla Hidrogel Colágeno', quantity: 1, unit: 'máscara' }
    ]
  }
];

// Initial Supplies with stock levels
export const INITIAL_SUPPLIES: Supply[] = [
  {
    id: 'sup-1',
    name: 'Polygel Constructor Clear 60g',
    category: 'Uñas',
    stock: 120, // grams
    stock_min: 50,
    unit: 'g',
    unit_cost: 0.45,
    location: 'Estante A-1 (Uñas)',
    status: 'Suficiente',
    last_restock: '2026-08-28',
    supplier: 'Nails Pro International'
  },
  {
    id: 'sup-2',
    name: 'Primer Adherente sin Ácido',
    category: 'Uñas',
    stock: 25, // ml (Near minimum)
    stock_min: 20,
    unit: 'ml',
    unit_cost: 0.80,
    location: 'Estante A-2 (Uñas)',
    status: 'Por Agotar',
    last_restock: '2026-08-15',
    supplier: 'Nails Pro International'
  },
  {
    id: 'sup-3',
    name: 'Top Coat Gloss Ultra Brillo',
    category: 'Uñas',
    stock: 80, // ml
    stock_min: 30,
    unit: 'ml',
    unit_cost: 0.65,
    location: 'Estante A-3 (Uñas)',
    status: 'Suficiente',
    last_restock: '2026-08-20',
    supplier: 'Glamour Polish Co.'
  },
  {
    id: 'sup-4',
    name: 'Tinte Negro Ébano 1.0 (60ml)',
    category: 'Cabello',
    stock: 3, // tubos (low stock)
    stock_min: 4,
    unit: 'tubos',
    unit_cost: 7.50,
    location: 'Gabinete B-1 (Colorimetría)',
    status: 'Por Agotar',
    last_restock: '2026-08-10',
    supplier: 'L\'Élégance Hair'
  },
  {
    id: 'sup-5',
    name: 'Oxidante en Crema 20 Vol',
    category: 'Cabello',
    stock: 650, // ml
    stock_min: 200,
    unit: 'ml',
    unit_cost: 0.03,
    location: 'Gabinete B-2 (Colorimetría)',
    status: 'Suficiente',
    last_restock: '2026-09-01',
    supplier: 'L\'Élégance Hair'
  },
  {
    id: 'sup-6',
    name: 'Mascarilla Plex Reparadora',
    category: 'Cabello',
    stock: 180, // ml
    stock_min: 100,
    unit: 'ml',
    unit_cost: 0.12,
    location: 'Gabinete B-3 (Tratamientos)',
    status: 'Suficiente',
    last_restock: '2026-08-25',
    supplier: 'BioCare Professional'
  },
  {
    id: 'sup-7',
    name: 'Kit Almohadillas Silicona',
    category: 'Pestañas',
    stock: 1, // par (Agotándose crítico)
    stock_min: 5,
    unit: 'pares',
    unit_cost: 3.20,
    location: 'Cajonera C-1 (Mirada)',
    status: 'Agotado',
    last_restock: '2026-07-30',
    supplier: 'Lash Express'
  },
  {
    id: 'sup-8',
    name: 'Loción Ondulante Perm Paso 1',
    category: 'Pestañas',
    stock: 14, // ml
    stock_min: 10,
    unit: 'ml',
    unit_cost: 1.20,
    location: 'Cajonera C-2 (Mirada)',
    status: 'Por Agotar',
    last_restock: '2026-08-14',
    supplier: 'Lash Express'
  },
  {
    id: 'sup-9',
    name: 'Suero de Keratina Nutritiva',
    category: 'Pestañas',
    stock: 45, // ml
    stock_min: 15,
    unit: 'ml',
    unit_cost: 1.50,
    location: 'Cajonera C-3 (Mirada)',
    status: 'Suficiente',
    last_restock: '2026-08-22',
    supplier: 'Lash Express'
  },
  {
    id: 'sup-10',
    name: 'Ampolla Ácido Hialurónico Puro',
    category: 'Skincare',
    stock: 0, // 0 unidades
    stock_min: 6,
    unit: 'ampollas',
    unit_cost: 4.80,
    location: 'Vitrina D-1 (Skincare)',
    status: 'Agotado',
    last_restock: '2026-07-15',
    supplier: 'Dermacell Labs'
  },
  {
    id: 'sup-11',
    name: 'Mascarilla Hidrogel Colágeno',
    category: 'Skincare',
    stock: 18,
    stock_min: 8,
    unit: 'máscaras',
    unit_cost: 2.90,
    location: 'Vitrina D-2 (Skincare)',
    status: 'Suficiente',
    last_restock: '2026-08-30',
    supplier: 'Dermacell Labs'
  }
];

// Helper to determine status
export function calculateSupplyStatus(stock: number, stock_min: number): 'Suficiente' | 'Por Agotar' | 'Agotado' {
  if (stock <= 0 || stock < stock_min * 0.5) return 'Agotado';
  if (stock <= stock_min * 1.5) return 'Por Agotar';
  return 'Suficiente';
}

// Initial Appointments
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    client_id: 'usr-1',
    client_name: 'Sofia B.',
    client_email: 'sofia.b@example.com',
    client_phone: '+52 55 4123 0000',
    service_id: 'srv-1',
    service_name: 'Manicura Polygel Escultural',
    stylist_name: 'Valentina Rossi (Master Nail Artist)',
    date: '2026-09-07',
    time: '14:30',
    duration_minutes: 90,
    status: 'Confirmada',
    notes: 'Diseño almendrado con degradé baby boomer y piedras Swarovski en dedo anular.',
    total_price: 45.00,
    whatsapp_reminder_sent: true,
    email_reminder_sent: true,
    created_at: '2026-09-05T10:15:00Z',
    supplies: [
      { id: 'as-1', appointment_id: 'apt-101', supply_id: 'sup-1', supply_name: 'Polygel Constructor Clear 60g', quantity_used: 15, unit: 'g', status: 'Reservado' },
      { id: 'as-2', appointment_id: 'apt-101', supply_id: 'sup-2', supply_name: 'Primer Adherente sin Ácido', quantity_used: 5, unit: 'ml', status: 'Reservado' },
      { id: 'as-3', appointment_id: 'apt-101', supply_id: 'sup-3', supply_name: 'Top Coat Gloss Ultra Brillo', quantity_used: 8, unit: 'ml', status: 'Reservado' }
    ],
    timeline: [
      { id: 't-1', title: 'Recepción y Diagnóstico', description: 'Bienvenida, café de cortesía y revisión de la placa ungueal.', completed: true, time: '14:30' },
      { id: 't-2', title: 'Manicura Rusa y Deshidratado', description: 'Limpieza de cutícula y aplicación de Primer Adherente.', completed: true, time: '14:45' },
      { id: 't-3', title: 'Esculpido en Polygel', description: 'Moldeado anatómico y curado en lámpara LED 48W.', completed: false },
      { id: 't-4', title: 'Esmaltado & Top Coat', description: 'Aplicación de brillo de alta durabilidad y aceite aromático.', completed: false },
      { id: 't-5', title: 'Control de Calidad y Cierre', description: 'Inspección de simetría y entrega de kit post-cuidado.', completed: false }
    ]
  },
  {
    id: 'apt-102',
    client_id: 'usr-2',
    client_name: 'Camila Morales',
    client_email: 'camila.m@example.com',
    client_phone: '+52 55 9876 5432',
    service_id: 'srv-2',
    service_name: 'Balayage & Coloración Profunda',
    stylist_name: 'Mateo Sandoval (Colorista Senior)',
    date: '2026-09-08',
    time: '10:00',
    duration_minutes: 150,
    status: 'Confirmada',
    notes: 'Cliente con aclaración previa en puntas. Desea oscurecer raíz con Tinte Negro Ébano.',
    total_price: 95.00,
    whatsapp_reminder_sent: true,
    email_reminder_sent: false,
    created_at: '2026-09-04T16:20:00Z',
    supplies: [
      { id: 'as-4', appointment_id: 'apt-102', supply_id: 'sup-4', supply_name: 'Tinte Negro Ébano 1.0 (60ml)', quantity_used: 1, unit: 'tubo', status: 'Reservado' },
      { id: 'as-5', appointment_id: 'apt-102', supply_id: 'sup-5', supply_name: 'Oxidante en Crema 20 Vol', quantity_used: 75, unit: 'ml', status: 'Reservado' },
      { id: 'as-6', appointment_id: 'apt-102', supply_id: 'sup-6', supply_name: 'Mascarilla Plex Reparadora', quantity_used: 30, unit: 'ml', status: 'Reservado' }
    ],
    timeline: [
      { id: 't-6', title: 'Test de Mecha y Consulta', description: 'Evaluación de elasticidad capilar y prueba de sensibilidad.', completed: false },
      { id: 't-7', title: 'Aplicación de Color Raíz', description: 'Fórmula Tinte Negro Ébano con oxidante 20V.', completed: false },
      { id: 't-8', title: 'Lavado Técnico & Plex', description: 'Tratamiento sellador de cutícula capilar.', completed: false },
      { id: 't-9', title: 'Brushing & Estilizado', description: 'Ondas al agua y protector térmico.', completed: false }
    ]
  },
  {
    id: 'apt-103',
    client_id: 'usr-3',
    client_name: 'Lucia Fernanda Gómez',
    client_email: 'lucia.g@example.com',
    client_phone: '+52 55 3344 5566',
    service_id: 'srv-3',
    service_name: 'Lifting de Pestañas + Keratina',
    stylist_name: 'Valentina Rossi (Master Lash Artist)',
    date: '2026-09-09',
    time: '16:00',
    duration_minutes: 60,
    status: 'En Progreso',
    notes: 'Sensibilidad ocular leve. Usar almohadilla talla M.',
    total_price: 38.00,
    whatsapp_reminder_sent: true,
    email_reminder_sent: true,
    created_at: '2026-09-06T09:00:00Z',
    supplies: [
      { id: 'as-7', appointment_id: 'apt-103', supply_id: 'sup-7', supply_name: 'Kit Almohadillas Silicona', quantity_used: 1, unit: 'par', status: 'Consumido' },
      { id: 'as-8', appointment_id: 'apt-103', supply_id: 'sup-8', supply_name: 'Loción Ondulante Perm Paso 1', quantity_used: 3, unit: 'ml', status: 'Consumido' },
      { id: 'as-9', appointment_id: 'apt-103', supply_id: 'sup-9', supply_name: 'Suero de Keratina Nutritiva', quantity_used: 2, unit: 'ml', status: 'Consumido' }
    ],
    timeline: [
      { id: 't-10', title: 'Limpieza y Colocación de Pads', description: 'Desmaquillado y fijación anatómica.', completed: true, time: '16:00' },
      { id: 't-11', title: 'Aplicación Loción Ondulante', description: 'Tiempo de exposición: 12 minutos.', completed: true, time: '16:15' },
      { id: 't-12', title: 'Neutralizado y Baño de Keratina', description: 'Fortalecimiento de fibra capilar de la pestaña.', completed: false },
      { id: 't-13', title: 'Peinado y Cepillado Final', description: 'Retiro de pads y aplicación de sérum botox.', completed: false }
    ]
  },
  {
    id: 'apt-104',
    client_id: 'usr-4',
    client_name: 'Mariana Silva',
    client_email: 'mariana.silva@example.com',
    client_phone: '+52 55 7788 9900',
    service_id: 'srv-1',
    service_name: 'Manicura Polygel Escultural',
    stylist_name: 'Valentina Rossi (Master Nail Artist)',
    date: '2026-09-10',
    time: '11:00',
    duration_minutes: 90,
    status: 'Confirmada',
    notes: 'Relleno de polygel de 3 semanas.',
    total_price: 45.00,
    whatsapp_reminder_sent: false,
    email_reminder_sent: true,
    created_at: '2026-09-06T14:30:00Z',
    supplies: [
      { id: 'as-10', appointment_id: 'apt-104', supply_id: 'sup-1', supply_name: 'Polygel Constructor Clear 60g', quantity_used: 15, unit: 'g', status: 'Reservado' },
      { id: 'as-11', appointment_id: 'apt-104', supply_id: 'sup-2', supply_name: 'Primer Adherente sin Ácido', quantity_used: 5, unit: 'ml', status: 'Reservado' },
      { id: 'as-12', appointment_id: 'apt-104', supply_id: 'sup-3', supply_name: 'Top Coat Gloss Ultra Brillo', quantity_used: 8, unit: 'ml', status: 'Reservado' }
    ],
    timeline: [
      { id: 't-14', title: 'Recepción', description: 'Evaluación de crecimiento.', completed: false },
      { id: 't-15', title: 'Retiro de área crecida', description: 'Rebalance con torno.', completed: false },
      { id: 't-16', title: 'Relleno con Polygel', description: 'Curado UV.', completed: false }
    ]
  }
];

// Current Profile State (Las credenciales reales se leen desde .env que está protegido en .gitignore)
export const DEFAULT_PROFILE: Profile = {
  id: 'usr-admin',
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@salongift.com',
  full_name: import.meta.env.VITE_ADMIN_NAME || 'Administrador Salon Gift',
  phone: import.meta.env.VITE_ADMIN_PHONE || '+52 55 0000 0000',
  role: 'ADMIN',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  created_at: '2026-01-15T08:00:00Z'
};

// Initial Notification Settings
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  whatsapp_enabled: true,
  whatsapp_phone_number_id: '109847289381726',
  whatsapp_token: 'EAAO8x...[Token Seguro]',
  email_enabled: true,
  email_provider: 'Resend',
  email_api_key: 're_salongift_prod_8273948',
  reminder_hours_before: 24
};

// Initial Portfolio / Gallery Works
export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Uñas Almendradas Baby Boomer & Cristales',
    category: 'Uñas',
    image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80',
    description: 'Estructura escultural en Polygel con degradado soft nude y encapsulado de brillo con microcristales en zona de cutícula.',
    service_id: 'srv-1',
    service_name: 'Manicura Polygel Escultural',
    stylist_name: 'Valentina Rossi (Master Nail Artist)',
    created_at: '2026-09-02',
    likes_count: 24,
    tags: ['Polygel', 'BabyBoomer', 'Cristales', 'Almendra']
  },
  {
    id: 'gal-2',
    title: 'Balayage Caramelo Miel & Ondas Glam',
    category: 'Cabello',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    description: 'Aclarado gradual multidimensional manteniendo raíz natural, con matiz cálido avellana y sellado capilar reparador.',
    service_id: 'srv-2',
    service_name: 'Balayage & Coloración Profunda',
    stylist_name: 'Camila Mendoza (Colorist & Stylist)',
    created_at: '2026-09-04',
    likes_count: 38,
    tags: ['Balayage', 'Ondas', 'BrilloCapilar', 'Caramel']
  },
  {
    id: 'gal-3',
    title: 'Lifting de Pestañas Efecto Rímel & Keratina',
    category: 'Pestañas',
    image_url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&auto=format&fit=crop&q=80',
    description: 'Curvatura L-Curl con tinte negro azabache y baño regenerador de keratina para una mirada abierta y natural.',
    service_id: 'srv-3',
    service_name: 'Lifting de Pestañas + Keratina',
    stylist_name: 'Elena Gómez (Lash Expert)',
    created_at: '2026-09-05',
    likes_count: 19,
    tags: ['LashLift', 'Keratina', 'MiradaImpacto']
  },
  {
    id: 'gal-4',
    title: 'Manicura Francesa Minimalista Micro-Line',
    category: 'Uñas',
    image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    description: 'Base lechosa porcelana con fina línea blanca en punta y acabado Top Coat ultra glossy de larga duración.',
    service_id: 'srv-1',
    service_name: 'Manicura Polygel Escultural',
    stylist_name: 'Valentina Rossi (Master Nail Artist)',
    created_at: '2026-09-06',
    likes_count: 29,
    tags: ['French', 'Minimalist', 'NudeElegance']
  },
  {
    id: 'gal-5',
    title: 'Pestañas Volumen Ruso 4D Seda Premium',
    category: 'Pestañas',
    image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    description: 'Abanicos artesanales ultralivianos de fibra de seda que proporcionan densidad aterciopelada sin dañar la pestaña natural.',
    service_id: 'srv-3',
    service_name: 'Lifting de Pestañas + Keratina',
    stylist_name: 'Elena Gómez (Lash Expert)',
    created_at: '2026-09-07',
    likes_count: 42,
    tags: ['VolumenRuso', 'Lashes', 'Seda']
  },
  {
    id: 'gal-6',
    title: 'Tratamiento Facial Glass Skin & Ácido Hialurónico',
    category: 'Skincare',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    description: 'Protocolo de higiene profunda, hidrogel descongestivo y sellado con velo de colágeno puro para luminosidad inmediata.',
    stylist_name: 'Dra. Patricia Silva (Cosmiatra)',
    created_at: '2026-09-08',
    likes_count: 31,
    tags: ['GlassSkin', 'Hidratacion', 'Colageno']
  }
];
