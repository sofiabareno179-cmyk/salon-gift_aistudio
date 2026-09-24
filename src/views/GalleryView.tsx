import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Heart, 
  Trash2, 
  X, 
  Upload, 
  Link as LinkIcon, 
  Calendar, 
  Tag, 
  User, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Eye,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  Camera
} from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { 
    gallery, 
    services, 
    profile, 
    addGalleryItem, 
    deleteGalleryItem, 
    toggleLikeGalleryItem, 
    changeView, 
    addToast 
  } = useApp();

  const isAdmin = profile.role === 'ADMIN';

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  // Form State for Admin New Work
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Uñas' | 'Cabello' | 'Pestañas' | 'Skincare' | 'General'>('Uñas');
  const [formServiceId, setFormServiceId] = useState<string>(services[0]?.id || '');
  const [formStylist, setFormStylist] = useState('Valentina Rossi (Master Nail Artist)');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTags, setFormTags] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset Sample Images for Quick Testing
  const presetPhotos = [
    {
      title: 'Uñas Acrílicas Nude & Glitter',
      category: 'Uñas' as const,
      url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop&q=80',
      serviceId: services.find(s => s.category === 'Uñas')?.id || ''
    },
    {
      title: 'Balayage Rubio Cenizo Platinado',
      category: 'Cabello' as const,
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      serviceId: services.find(s => s.category === 'Cabello')?.id || ''
    },
    {
      title: 'Diseño de Cejas HD & Laminado',
      category: 'Pestañas' as const,
      url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80',
      serviceId: services.find(s => s.category === 'Pestañas')?.id || ''
    },
    {
      title: 'Limpieza Facial Profunda con Ozono',
      category: 'Skincare' as const,
      url: 'https://images.unsplash.com/photo-1512290900672-1f02377a0663?w=800&auto=format&fit=crop&q=80',
      serviceId: services.find(s => s.category === 'Skincare')?.id || ''
    }
  ];

  const categories = ['Todas', 'Uñas', 'Cabello', 'Pestañas', 'Skincare'];

  // Handle local file upload with FileReader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Formato no soportado',
        message: 'Por favor selecciona un archivo de imagen válido (JPEG, PNG, WebP).'
      });
      return;
    }

    // Limit to 5MB for browser storage comfort
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'Imagen muy grande',
        message: 'El tamaño máximo recomendado es de 5MB.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open creation modal
  const handleOpenUploadModal = () => {
    setFormTitle('');
    setFormCategory('Uñas');
    setFormServiceId(services[0]?.id || '');
    setFormStylist('Valentina Rossi (Master Nail Artist)');
    setFormDescription('');
    setFormImageUrl('');
    setFormTags('Tendencia, SalonGift');
    setImageInputMode('upload');
    setIsUploadModalOpen(true);
  };

  // Select a preset
  const handleSelectPreset = (preset: typeof presetPhotos[0]) => {
    setFormImageUrl(preset.url);
    if (!formTitle) setFormTitle(preset.title);
    setFormCategory(preset.category);
    if (preset.serviceId) setFormServiceId(preset.serviceId);
  };

  // Save new gallery item
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      addToast({ type: 'error', title: 'Campo requerido', message: 'Ingresa un título para el trabajo.' });
      return;
    }

    if (!formImageUrl.trim()) {
      addToast({ type: 'error', title: 'Imagen requerida', message: 'Sube un archivo o ingresa una URL de imagen.' });
      return;
    }

    const matchedService = services.find(s => s.id === formServiceId);
    const parsedTags = formTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    await addGalleryItem({
      title: formTitle.trim(),
      category: formCategory,
      image_url: formImageUrl.trim(),
      description: formDescription.trim(),
      service_id: formServiceId || undefined,
      service_name: matchedService?.name || undefined,
      stylist_name: formStylist.trim(),
      tags: parsedTags.length > 0 ? parsedTags : undefined
    });

    setIsUploadModalOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteGalleryItem(itemToDelete.id);
    if (previewItem?.id === itemToDelete.id) {
      setPreviewItem(null);
    }
    setItemToDelete(null);
  };

  // Filter and Sort Gallery
  const filteredGallery = useMemo(() => {
    return gallery
      .filter(item => {
        const matchesCat = selectedCategory === 'Todas' || item.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = !searchQuery || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.stylist_name && item.stylist_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.likes_count || 0) - (a.likes_count || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [gallery, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-900 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAdmin ? 'Gestión de Galería & Portafolio' : 'Galería de Trabajos Salon Gift'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            {isAdmin
              ? 'Administra las imágenes de resultados reales de uñas, balayage, pestañas y skincare. Sube fotos o elimina trabajos del catálogo público.'
              : 'Inspírate con los diseños y transformaciones de nuestras artistas. Selecciona cualquier trabajo para reservar ese mismo estilo.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              id="btn-admin-add-gallery-photo"
              onClick={handleOpenUploadModal}
              className="clay-button clay-lilac text-purple-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nueva Foto</span>
            </button>
          ) : (
            <button
              id="btn-client-gallery-book-now"
              onClick={() => changeView('ReservationWizardView')}
              className="clay-button clay-lilac text-purple-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar mi Cita</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Notice Bar */}
      {isAdmin && (
        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-900">
            <span className="font-bold flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-700" />
              Modo Administrador Activo:
            </span>
            <span className="text-slate-600 hidden sm:inline">
              Puedes subir fotos desde tu computadora o enlaces web, y retirar imágenes en cualquier momento.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-200/80 text-purple-900 whitespace-nowrap">
            {gallery.length} Fotos Publicadas
          </span>
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

        {/* Right Controls: Sort & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-1 text-xs">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                sortBy === 'recent' ? 'bg-purple-100 text-purple-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Recientes
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                sortBy === 'popular' ? 'bg-purple-100 text-purple-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Populares
            </button>
          </div>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar estilo, técnica o especialista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs py-2 pl-9 pr-8 rounded-xl border border-slate-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-inner"
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
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => {
          return (
            <div
              key={item.id}
              className="clay-card bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all group relative"
            >
              {/* Image Container with Zoom & Overlay */}
              <div 
                className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => setPreviewItem(item)}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to salon placeholder if link expires
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10 opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-800 shadow-sm">
                    {item.category}
                  </span>
                  {item.service_name && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-900/80 backdrop-blur-xs text-white">
                      {item.service_name}
                    </span>
                  )}
                </div>

                {/* Admin Delete Button on top right */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete(item);
                    }}
                    title="Eliminar foto de la galería"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white backdrop-blur-xs shadow-md transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Quick inspect eye hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-purple-700" />
                    <span>Ver Detalle</span>
                  </span>
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm font-black leading-tight drop-shadow-sm line-clamp-1">
                    {item.title}
                  </h3>
                  {item.stylist_name && (
                    <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-pink-300" />
                      <span className="truncate">{item.stylist_name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description || 'Diseño y tratamiento profesional realizado con insumos de alta gama en Salon Gift.'}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Card Footer: Likes & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  {/* Like heart button */}
                  <button
                    onClick={() => toggleLikeGalleryItem(item.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors p-1 rounded-lg cursor-pointer"
                    title="Dar 'Me gusta'"
                  >
                    <Heart className={`w-4 h-4 ${item.likes_count > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                    <span className="font-bold text-[11px]">{item.likes_count || 0}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {item.service_id && (
                      <button
                        onClick={() => changeView('ReservationWizardView', item.service_id)}
                        className="clay-button clay-lilac text-purple-950 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs hover:scale-102 transition-transform cursor-pointer"
                        title="Agendar este servicio"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Agendar</span>
                      </button>
                    )}

                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Ver fotografía completa"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGallery.length === 0 && (
        <div className="clay-card p-12 bg-white text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-800">No hay fotos en esta sección</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            No se encontraron trabajos para la categoría "{selectedCategory}" o la búsqueda "{searchQuery}".
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => { setSelectedCategory('Todas'); setSearchQuery(''); }}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              Limpiar Filtros
            </button>
            {isAdmin && (
              <button
                onClick={handleOpenUploadModal}
                className="clay-button clay-lilac text-purple-950 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                + Subir primera foto
              </button>
            )}
          </div>
        </div>
      )}

      {/* DETAIL / LIGHTBOX MODAL */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="clay-card bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative my-6 flex flex-col md:flex-row border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-transform cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image Display */}
            <div className="md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[300px]">
              <img
                src={previewItem.image_url}
                alt={previewItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[500px] object-cover"
              />
            </div>

            {/* Modal Info Column */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-900">
                    {previewItem.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {previewItem.created_at}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {previewItem.title}
                </h2>

                {previewItem.stylist_name && (
                  <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Especialista: <strong>{previewItem.stylist_name}</strong></span>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Descripción del Trabajo
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {previewItem.description || 'Resultado profesional realizado con técnica de vanguardia e insumos premium en Salon Gift.'}
                  </p>
                </div>

                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Etiquetas
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {previewItem.tags.map((t, idx) => (
                        <span key={idx} className="text-xs text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleLikeGalleryItem(previewItem.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-600 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span><strong>{previewItem.likes_count || 0}</strong> personas guardaron este estilo</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setItemToDelete(previewItem);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar Foto</span>
                    </button>
                  )}
                </div>

                {previewItem.service_id && (
                  <button
                    onClick={() => {
                      setPreviewItem(null);
                      changeView('ReservationWizardView', previewItem.service_id);
                    }}
                    className="clay-button clay-lilac text-purple-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-transform cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar este estilo con {previewItem.stylist_name?.split(' ')[0] || 'la artista'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="clay-card p-6 bg-white max-w-xl w-full flex flex-col gap-5 shadow-2xl relative my-8 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-900">
                  <Camera className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Publicar Nuevo Trabajo en Portafolio
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveGalleryItem} className="flex flex-col gap-4 text-xs">
              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título del Trabajo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Uñas Baby Boomer con Encapsulado Floral"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="clay-input w-full py-2.5 px-3 text-xs text-slate-800"
                />
              </div>

              {/* Category & Associated Service */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as any;
                      setFormCategory(newCat);
                      const matched = services.find(s => s.category.toLowerCase() === newCat.toLowerCase());
                      if (matched) setFormServiceId(matched.id);
                    }}
                    className="clay-input w-full py-2 px-3 text-xs text-slate-800 font-bold cursor-pointer"
                  >
                    <option value="Uñas">Uñas</option>
                    <option value="Cabello">Cabello</option>
                    <option value="Pestañas">Pestañas</option>
                    <option value="Skincare">Skincare</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Servicio Relacionado</label>
                  <select
                    value={formServiceId}
                    onChange={(e) => setFormServiceId(e.target.value)}
                    className="clay-input w-full py-2 px-3 text-xs text-slate-800 font-bold cursor-pointer"
                  >
                    <option value="">Sin servicio directo</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (${s.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stylist */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Especialista / Estilista</label>
                <input
                  type="text"
                  placeholder="Ej: Valentina Rossi (Master Nail Artist)"
                  value={formStylist}
                  onChange={(e) => setFormStylist(e.target.value)}
                  className="clay-input w-full py-2.5 px-3 text-xs text-slate-800"
                />
              </div>

              {/* Image Input Selection Tabs */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Fotografía del Trabajo *</label>
                <div className="flex items-center gap-1.5 mb-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      imageInputMode === 'upload' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Archivo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      imageInputMode === 'url' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Enlace Web (URL)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('preset')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      imageInputMode === 'preset' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ejemplos HD</span>
                  </button>
                </div>

                {/* Subir Archivo local */}
                {imageInputMode === 'upload' && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-50/70 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="p-2.5 rounded-full bg-white text-purple-700 shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">
                        Haz clic para seleccionar foto de tu dispositivo
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP (Máx. 5MB)
                      </p>
                    </div>
                  </div>
                )}

                {/* Enlace URL directo */}
                {imageInputMode === 'url' && (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="clay-input w-full py-2.5 px-3 text-xs text-slate-800"
                  />
                )}

                {/* Presets HD para prueba rápida */}
                {imageInputMode === 'preset' && (
                  <div className="grid grid-cols-2 gap-2">
                    {presetPhotos.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          formImageUrl === preset.url ? 'border-purple-600 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover" 
                        />
                        <div className="truncate">
                          <p className="font-bold text-[11px] text-slate-800 truncate">{preset.title}</p>
                          <span className="text-[9px] text-purple-700 uppercase font-bold">{preset.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview Thumbnail if selected */}
                {formImageUrl && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={formImageUrl}
                        alt="Vista previa"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Imagen cargada correctamente
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                          {formImageUrl.startsWith('data:') ? 'Archivo local cargado' : formImageUrl}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Tratamiento / Técnica</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el diseño, colores, técnicas o beneficios..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="clay-input w-full py-2 px-3 text-xs text-slate-800 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  placeholder="Polygel, Almendra, BabyBoomer, Brillo"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="clay-input w-full py-2.5 px-3 text-xs text-slate-800"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="clay-button clay-lilac text-purple-950 font-black px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  Publicar en Galería
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 bg-white max-w-sm w-full flex flex-col gap-4 shadow-xl border border-rose-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">¿Eliminar esta foto?</h3>
              <p className="text-xs text-slate-500 mt-1">
                ¿Estás segura de retirar <strong>"{itemToDelete.title}"</strong> de la galería pública?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
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
