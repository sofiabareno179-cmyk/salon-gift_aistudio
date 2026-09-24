import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supply, SupplyStatus } from '../types';
import { 
  Boxes, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  PackageX, 
  MapPin, 
  Calendar, 
  ShieldAlert,
  Edit3
} from 'lucide-react';

export const SuppliesListView: React.FC = () => {
  const { 
    supplies, 
    updateSupplyStock, 
    setDirectSupplyStock, 
    userRole, 
    searchQuery, 
    setSearchQuery,
    selectedItemId
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [customStockInput, setCustomStockInput] = useState<number>(0);

  const categories = ['Todas', 'Uñas', 'Cabello', 'Pestañas', 'Skincare'];

  // Filter supplies
  const filteredSupplies = supplies.filter(s => {
    const matchesCategory = selectedCategory === 'Todas' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const columns: { id: SupplyStatus; title: string; subtitle: string; icon: React.ReactNode; badgeClass: string; cardClass: string }[] = [
    {
      id: 'Suficiente',
      title: 'Suficiente',
      subtitle: 'Stock operativo seguro',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cardClass: 'border-emerald-100'
    },
    {
      id: 'Por Agotar',
      title: 'Por Agotar',
      subtitle: 'Nivel cercano al mínimo',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      cardClass: 'border-amber-200 bg-amber-50/20'
    },
    {
      id: 'Agotado',
      title: 'Agotado / Crítico',
      subtitle: 'Bloquea reservas atómicas',
      icon: <PackageX className="w-4 h-4 text-rose-600" />,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      cardClass: 'border-rose-200 bg-rose-50/30'
    }
  ];

  const handleOpenEdit = (supply: Supply) => {
    setEditingSupply(supply);
    setCustomStockInput(supply.stock);
  };

  const handleSaveCustomStock = async () => {
    if (!editingSupply) return;
    await setDirectSupplyStock(editingSupply.id, customStockInput);
    setEditingSupply(null);
  };

  return (
    <div id="view-supplies-kanban" className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Gestión de Insumos (Kanban)</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              RF-04 Supabase
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualice el estado físico del inventario. La validación atómica bloquea citas cuando un insumo está en nivel crítico.
          </p>
        </div>

        {/* RLS Informative Banner */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs">
          <ShieldAlert className={`w-4 h-4 ${userRole === 'ADMIN' ? 'text-purple-600' : 'text-amber-500'}`} />
          <span className="text-slate-600 font-medium">
            Permisos RLS: <strong className={userRole === 'ADMIN' ? 'text-purple-800' : 'text-amber-800'}>{userRole}</strong>
          </span>
          {userRole === 'CLIENT' && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              Solo lectura (Error 42501 al mutar)
            </span>
          )}
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/70 p-4 rounded-2xl border border-slate-200/60">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'clay-lilac text-purple-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nombre o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs py-2 pl-9 pr-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const colSupplies = filteredSupplies.filter(s => s.status === col.id);

          return (
            <div 
              key={col.id}
              id={`kanban-column-${col.id}`}
              className="bg-slate-100/60 rounded-3xl p-5 border border-slate-200/70 flex flex-col gap-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{col.title}</h3>
                    <p className="text-[11px] text-slate-400">{col.subtitle}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${col.badgeClass}`}>
                  {colSupplies.length}
                </span>
              </div>

              {/* Column Items */}
              <div className="flex flex-col gap-3.5">
                {colSupplies.length === 0 ? (
                  <div className="p-8 text-center bg-white/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">No hay insumos en esta categoría.</p>
                  </div>
                ) : (
                  colSupplies.map((supply) => {
                    const isSelected = selectedItemId === supply.id;

                    return (
                      <div
                        key={supply.id}
                        id={`supply-card-${supply.id}`}
                        className={`clay-card p-5 transition-all relative ${col.cardClass} ${
                          isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                        }`}
                      >
                        {/* Header: Name and Category */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {supply.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                              {supply.name}
                            </h4>
                          </div>
                          <button
                            id={`btn-edit-supply-${supply.id}`}
                            onClick={() => handleOpenEdit(supply)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Editar niveles de stock"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Location and Supplier */}
                        <div className="mt-3 flex flex-col gap-1 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{supply.location}</span>
                          </div>
                          {supply.last_restock && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>Último reabastecimiento: {supply.last_restock}</span>
                            </div>
                          )}
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-slate-400 font-medium">Stock Actual</div>
                            <div className="text-xl font-black text-slate-900">
                              {supply.stock} <span className="text-xs font-semibold text-slate-500">{supply.unit}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Mínimo: {supply.stock_min} {supply.unit}
                            </div>
                          </div>

                          {/* Quick Adjust Buttons (+ / -) */}
                          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                            <button
                              id={`btn-decrement-${supply.id}`}
                              onClick={() => updateSupplyStock(supply.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-2xs cursor-pointer transition-all active:scale-95"
                              title={userRole === 'ADMIN' ? 'Restar 1 unidad' : 'Restringido por RLS (Error 42501)'}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              id={`btn-increment-${supply.id}`}
                              onClick={() => updateSupplyStock(supply.id, 1)}
                              className="w-7 h-7 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center shadow-2xs cursor-pointer transition-all active:scale-95"
                              title={userRole === 'ADMIN' ? 'Sumar 1 unidad' : 'Restringido por RLS (Error 42501)'}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Stock Edit Modal */}
      {editingSupply && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="clay-card max-w-md w-full p-6 bg-white flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Ajuste Directo de Inventario</h3>
              <button 
                onClick={() => setEditingSupply(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Insumo:</p>
              <h4 className="text-sm font-bold text-slate-800">{editingSupply.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Ubicación: {editingSupply.location}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Nuevo Stock Físico ({editingSupply.unit})
              </label>
              <input
                type="number"
                min="0"
                value={customStockInput}
                onChange={(e) => setCustomStockInput(Number(e.target.value))}
                className="clay-input p-3 text-lg font-bold text-slate-900"
              />
              <span className="text-[11px] text-slate-400">
                Stock mínimo de seguridad: {editingSupply.stock_min} {editingSupply.unit}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingSupply(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-save-stock-modal"
                onClick={handleSaveCustomStock}
                className="clay-button bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
