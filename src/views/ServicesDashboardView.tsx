import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Service, Supply } from '../types';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Clock, 
  Boxes, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Scissors, 
  ArrowRight, 
  ChevronRight, 
  DollarSign, 
  Percent,
  Layers,
  Heart,
  Calendar,
  X,
  Check,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';

export const ServicesDashboardView: React.FC = () => {
  const { 
    services, 
    supplies, 
    appointments, 
    addService, 
    updateService, 
    deleteService, 
    changeView, 
    profile, 
    addToast 
  } = useApp();

  const isClient = profile.role === 'CLIENT';

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Form State for Create / Edit Service
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Uñas');
  const [formPrice, setFormPrice] = useState<number>(45);
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('#C4B5FD');
  const [formSupplies, setFormSupplies] = useState<{
    supply_id: string;
    supply_name: string;
    quantity: number;
    unit: string;
  }[]>([]);

  // Temp supply picker state for form
  const [selectedSupplyIdToAdd, setSelectedSupplyIdToAdd] = useState<string>(supplies[0]?.id || '');
  const [supplyQuantityToAdd, setSupplyQuantityToAdd] = useState<number>(1);

  // Available categories
  const categories = ['Todas', 'Uñas', 'Cabello', 'Pestañas', 'Skincare'];
  const paletteColors = [
    { label: 'Lavanda', hex: '#C4B5FD' },
    { label: 'Rosa Seda', hex: '#F472B6' },
    { label: 'Melocotón', hex: '#FDBA74' },
    { label: 'Menta Fresca', hex: '#6EE7B7' },
    { label: 'Azul Hielo', hex: '#93C5FD' },
    { label: 'Lila Soft', hex: '#E9D5FF' }
  ];

  // Calculate Supply Cost for a Service
  const calculateServiceCost = (srv: Service) => {
    return srv.required_supplies.reduce((acc, req) => {
      const match = supplies.find(s => s.id === req.supply_id);
      const unitCost = match?.unit_cost || 0.5;
      return acc + (req.quantity * unitCost);
    }, 0);
  };

  // Check if all supplies for a service are available
  const getServiceStockReadiness = (srv: Service) => {
    let allSufficient = true;
    let hasAlert = false;
    let hasDepleted = false;
    const missing: string[] = [];

    srv.required_supplies.forEach(req => {
      const match = supplies.find(s => s.id === req.supply_id);
      if (!match || match.stock <= 0) {
        hasDepleted = true;
        allSufficient = false;
        missing.push(match?.name || req.supply_name);
      } else if (match.stock < req.quantity || match.status !== 'Suficiente') {
        hasAlert = true;
        allSufficient = false;
        missing.push(match?.name || req.supply_name);
      }
    });

    return { allSufficient, hasAlert, hasDepleted, missing };
  };

  // Calculate demand per service from appointments
  const serviceDemand = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach(apt => {
      counts[apt.service_id] = (counts[apt.service_id] || 0) + 1;
    });
    return counts;
  }, [appointments]);

  // General KPIs
  const totalServices = services.length;
  const avgPrice = totalServices > 0 
    ? services.reduce((acc, s) => acc + s.price, 0) / totalServices 
    : 0;
  
  const totalAppointmentsCount = appointments.length || 1;
  const topService = useMemo(() => {
    if (services.length === 0) return null;
    return [...services].sort((a, b) => (serviceDemand[b.id] || 0) - (serviceDemand[a.id] || 0))[0];
  }, [services, serviceDemand]);

  const topServicePercentage = topService 
    ? Math.round(((serviceDemand[topService.id] || 0) / totalAppointmentsCount) * 100) 
    : 0;

  // Average profit margin
  const avgMargin = useMemo(() => {
    if (services.length === 0) return 0;
    const margins = services.map(s => {
      const cost = calculateServiceCost(s);
      return s.price > 0 ? ((s.price - cost) / s.price) * 100 : 0;
    });
    return Math.round(margins.reduce((a, b) => a + b, 0) / services.length);
  }, [services, supplies]);

  // Count services ready vs in alert
  const readinessStats = useMemo(() => {
    let ready = 0;
    let alert = 0;
    services.forEach(s => {
      const { allSufficient } = getServiceStockReadiness(s);
      if (allSufficient) ready++;
      else alert++;
    });
    return { ready, alert };
  }, [services, supplies]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesCategory = selectedCategory === 'Todas' || s.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery = !searchQuery || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.required_supplies.some(req => req.supply_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [services, selectedCategory, searchQuery]);

  // Open modal for new service
  const handleOpenCreateModal = () => {
    setEditingServiceId(null);
    setFormName('');
    setFormCategory('Uñas');
    setFormPrice(45);
    setFormDuration(60);
    setFormDescription('');
    setFormColor('#C4B5FD');
    setFormSupplies([]);
    setIsModalOpen(true);
  };

  // Open modal for editing service
  const handleOpenEditModal = (srv: Service) => {
    setEditingServiceId(srv.id);
    setFormName(srv.name);
    setFormCategory(srv.category);
    setFormPrice(srv.price);
    setFormDuration(srv.duration_minutes);
    setFormDescription(srv.description);
    setFormColor(srv.color || '#C4B5FD');
    setFormSupplies([...srv.required_supplies]);
    setIsModalOpen(true);
  };

  // Add supply requirement to form
  const handleAddSupplyToForm = () => {
    const supplyObj = supplies.find(s => s.id === selectedSupplyIdToAdd);
    if (!supplyObj) return;

    if (formSupplies.some(s => s.supply_id === supplyObj.id)) {
      addToast({
        type: 'info',
        title: 'Insumo ya incluido',
        message: 'Este insumo ya está en la lista. Puedes ajustar su cantidad.'
      });
      return;
    }

    setFormSupplies(prev => [
      ...prev,
      {
        supply_id: supplyObj.id,
        supply_name: supplyObj.name,
        quantity: supplyQuantityToAdd,
        unit: supplyObj.unit
      }
    ]);
  };

  const handleRemoveSupplyFromForm = (supplyId: string) => {
    setFormSupplies(prev => prev.filter(s => s.supply_id !== supplyId));
  };

  // Save Service Form
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast({ type: 'error', title: 'Campo requerido', message: 'Indica el nombre del servicio.' });
      return;
    }

    if (editingServiceId) {
      await updateService(editingServiceId, {
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        duration_minutes: Number(formDuration),
        description: formDescription,
        color: formColor,
        required_supplies: formSupplies
      });
    } else {
      await addService({
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        duration_minutes: Number(formDuration),
        description: formDescription,
        color: formColor,
        required_supplies: formSupplies
      });
    }

    setIsModalOpen(false);
  };

  // Confirm delete service
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    await deleteService(serviceToDelete.id);
    setServiceToDelete(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-900 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isClient ? 'Menú de Servicios & Tratamientos' : 'Dashboard de Servicios'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            {isClient
              ? 'Explora nuestros tratamientos de belleza, duración estimada y agenda tu cita con atención personalizada.'
              : 'Control de catálogo, rentabilidad por tratamiento, consumo de insumos en bodega y demanda operativa en tiempo real.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            id="btn-services-book-appointment"
            onClick={() => changeView('ReservationWizardView')}
            className="clay-button clay-lilac text-purple-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Cita</span>
          </button>

          {!isClient && (
            <button
              id="btn-create-new-service"
              onClick={handleOpenCreateModal}
              className="bg-purple-900 hover:bg-purple-950 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Servicio</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Cards (Only shown for Admin or simplified for Client) */}
      {!isClient ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* KPI 1: Total Services */}
          <div className="clay-card p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Servicios Activos</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalServices}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">En 4 categorías principales</p>
            </div>
          </div>

          {/* KPI 2: Average Ticket */}
          <div className="clay-card p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ticket Promedio</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">${avgPrice.toFixed(2)}</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">PVP por sesión en cabina</p>
            </div>
          </div>

          {/* KPI 3: Average Profit Margin */}
          <div className="clay-card p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Margen Promedio</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{avgMargin}%</div>
              <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Ganancia bruta tras insumos</p>
            </div>
          </div>

          {/* KPI 4: Stock Readiness */}
          <div className="clay-card p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Disponibilidad Stock</span>
              <div className={`p-2 rounded-xl ${readinessStats.alert === 0 ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {readinessStats.ready} <span className="text-xs font-normal text-slate-400">/ {totalServices}</span>
              </div>
              <p className={`text-[11px] font-semibold mt-0.5 ${readinessStats.alert === 0 ? 'text-teal-600' : 'text-amber-600'}`}>
                {readinessStats.alert === 0 ? 'Todos con stock 100% listo' : `${readinessStats.alert} con alerta de insumos`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Client Top Highlights */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="clay-card p-4 bg-pink-50/60 border border-pink-200/80 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white text-pink-600 shadow-2xs">
              <Heart className="w-5 h-5 fill-pink-100" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-pink-950">Garantía VIP Salon Gift</h3>
              <p className="text-[11px] text-pink-800">Productos premium libres de químicos abrasivos.</p>
            </div>
          </div>

          <div className="clay-card p-4 bg-purple-50/60 border border-purple-200/80 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white text-purple-600 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-purple-950">Puntualidad & Confort</h3>
              <p className="text-[11px] text-purple-800">Tiempos estandarizados para que disfrutes tu momento.</p>
            </div>
          </div>

          <div className="clay-card p-4 bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white text-emerald-600 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-950">Puntos VIP Acumulables</h3>
              <p className="text-[11px] text-emerald-800">Cada servicio suma puntos para descuentos en sesiones futuras.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-900 text-white shadow-2xs scale-[1.02]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, insumo o técnica..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 text-xs py-2 pl-9 pr-3 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const cost = calculateServiceCost(service);
          const profit = service.price - cost;
          const margin = service.price > 0 ? Math.round((profit / service.price) * 100) : 0;
          const { allSufficient, missing } = getServiceStockReadiness(service);
          const totalBookings = serviceDemand[service.id] || 0;

          return (
            <div
              key={service.id}
              className="clay-card p-6 bg-white border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group"
            >
              {/* Category & Color accent line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: service.color || '#C4B5FD' }}
              />

              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
                    {service.category}
                  </span>

                  {!isClient ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        title="Editar parámetros del servicio"
                        className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setServiceToDelete(service)}
                        title="Eliminar servicio del catálogo"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> VIP
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-purple-900 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Price & Duration Big Pills */}
                <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Precio</span>
                    <span className="text-lg font-black text-slate-900">
                      ${service.price.toFixed(2)} <span className="text-[10px] font-medium text-slate-400">USD</span>
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duración</span>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                </div>

                {/* Profit & Cost breakdown (Admin only) */}
                {!isClient && (
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-500">Costo Insumos: </span>
                      <strong className="text-slate-800">${cost.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Margen: </span>
                      <strong className="text-emerald-700 font-black">+{margin}% (${profit.toFixed(2)})</strong>
                    </div>
                  </div>
                )}

                {/* Required Supplies list */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-slate-400" />
                      Insumos Requeridos ({service.required_supplies.length})
                    </span>
                    {!isClient && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        allSufficient 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {allSufficient ? 'Stock Listo' : 'Alerta Insumos'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {service.required_supplies.map((req, idx) => {
                      const match = supplies.find(s => s.id === req.supply_id);
                      const isLow = match && match.stock < req.quantity;

                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg border ${
                            isLow ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">{req.supply_name}</span>
                          <span className="font-mono font-bold whitespace-nowrap text-[10px]">
                            {req.quantity} {req.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[10px] text-slate-400 font-medium">
                  {!isClient ? (
                    <span>{totalBookings} citas registradas</span>
                  ) : (
                    <span>Disponibilidad inmediata</span>
                  )}
                </div>

                <button
                  onClick={() => changeView('ReservationWizardView', service.id)}
                  className="clay-button clay-lilac text-purple-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs hover:scale-102 transition-transform cursor-pointer"
                >
                  <span>Agendar Este</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="clay-card p-12 bg-white text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-800">No se encontraron servicios</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            No hay tratamientos que coincidan con la categoría "{selectedCategory}" o la búsqueda "{searchQuery}".
          </p>
          <button
            onClick={() => { setSelectedCategory('Todas'); setSearchQuery(''); }}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 mt-2 cursor-pointer"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* CREATE / EDIT SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="clay-card p-6 bg-white max-w-xl w-full flex flex-col gap-5 shadow-2xl relative my-8 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-900">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {editingServiceId ? 'Editar Servicio' : 'Nuevo Servicio en Catálogo'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveService} className="flex flex-col gap-4 text-xs">
              {/* Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pedicura Rusa Spa & Esmaltado Semipermanente"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="clay-input w-full py-2.5 px-3 text-xs text-slate-800"
                />
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="clay-input w-full py-2.5 px-3 text-xs text-slate-800 font-bold cursor-pointer"
                  >
                    <option value="Uñas">Uñas</option>
                    <option value="Cabello">Cabello</option>
                    <option value="Pestañas">Pestañas</option>
                    <option value="Skincare">Skincare</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color de Etiqueta</label>
                  <div className="flex items-center gap-2 pt-1">
                    {paletteColors.map((col) => (
                      <button
                        type="button"
                        key={col.hex}
                        onClick={() => setFormColor(col.hex)}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                          formColor === col.hex ? 'scale-125 ring-2 ring-purple-600 ring-offset-2' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio al Público ($ USD) *</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.5}
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                      className="clay-input w-full py-2.5 pl-8 pr-3 text-xs text-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración (minutos) *</label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min={15}
                      step={15}
                      value={formDuration}
                      onChange={(e) => setFormDuration(parseInt(e.target.value) || 60)}
                      className="clay-input w-full py-2.5 pl-8 pr-3 text-xs text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Tratamiento</label>
                <textarea
                  rows={2}
                  placeholder="Detalles del procedimiento, beneficios y técnicas empleadas..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="clay-input w-full py-2 px-3 text-xs text-slate-800 resize-none"
                />
              </div>

              {/* Required Supplies Section */}
              <div className="pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block mb-1.5 flex items-center justify-between">
                  <span>Insumos Necesarios para este Servicio</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Se deducirán atómicamente de bodega en cada cita
                  </span>
                </label>

                {/* Add supply inline row */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center gap-2 mb-2">
                  <select
                    value={selectedSupplyIdToAdd}
                    onChange={(e) => setSelectedSupplyIdToAdd(e.target.value)}
                    className="clay-input w-full md:flex-1 py-1.5 px-2 text-[11px] font-medium"
                  >
                    {supplies.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.stock} {s.unit} disp.)
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={supplyQuantityToAdd}
                      onChange={(e) => setSupplyQuantityToAdd(parseFloat(e.target.value) || 1)}
                      className="clay-input w-20 py-1.5 px-2 text-[11px] font-mono font-bold text-center"
                      placeholder="Cant."
                    />

                    <button
                      type="button"
                      onClick={handleAddSupplyToForm}
                      className="clay-button clay-lilac text-purple-950 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Insumo</span>
                    </button>
                  </div>
                </div>

                {/* List of currently assigned supplies */}
                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                  {formSupplies.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-1 text-center">
                      No has agregado insumos a este servicio aún.
                    </p>
                  ) : (
                    formSupplies.map(req => (
                      <div
                        key={req.supply_id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-[11px]"
                      >
                        <span className="font-medium text-slate-700">{req.supply_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                            {req.quantity} {req.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSupplyFromForm(req.supply_id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="clay-button clay-lilac text-purple-950 font-black px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  {editingServiceId ? 'Guardar Cambios' : 'Registrar Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {serviceToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 bg-white max-w-sm w-full flex flex-col gap-4 shadow-xl border border-rose-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">¿Eliminar servicio?</h3>
              <p className="text-xs text-slate-500 mt-1">
                ¿Estás segura de eliminar <strong>"{serviceToDelete.name}"</strong> del catálogo de Salon Gift?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setServiceToDelete(null)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
