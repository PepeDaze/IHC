import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  DollarSign, 
  Menu, 
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  Bus
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewConcessionModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenMobileMenu: () => void;
  activeViewTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenNewConcessionModal,
  onOpenPaymentModal,
  onOpenMobileMenu,
  activeViewTitle,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Factura por vencer (3 días)',
      desc: 'Líneas Unidas de Poza Rica - $34,200 MXN',
      time: 'Hace 25 min',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Pago recibido exitoso',
      desc: 'Autotransportes Tuxpan-Barra - $28,500 MXN (SPEI)',
      time: 'Hace 2 horas',
      type: 'success',
    },
    {
      id: 3,
      title: 'Atraso crítico detectado',
      desc: 'Autotransportes Costeros del Golfo - 2 mensualidades',
      time: 'Ayer',
      type: 'alert',
    },
  ];

  return (
    <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Mobile menu trigger & Brand icon on mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-md hover:bg-slate-100 text-[#434653] focus:outline-none cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#1a5bce] text-white flex items-center justify-center font-bold text-sm">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-[#0a111a] tracking-tight">RutaFácil</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden sm:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#737785] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por concesión, RFC, representante o municipio..."
            className="w-full pl-9 pr-8 py-2 bg-[#f8fafe] text-xs text-[#0a111a] placeholder-[#737785] border border-[#e2e8f0] rounded-md focus:outline-none focus:border-[#1a5bce] focus:ring-1 focus:ring-[#1a5bce] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick Date pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#434653]">
            <Calendar className="w-3.5 h-3.5 text-[#1a5bce]" />
            <span>Ciclo: Noviembre 2026</span>
          </div>

          {/* Quick Register Payment button */}
          <button
            onClick={onOpenPaymentModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0a111a] hover:bg-[#f8fafe] rounded-md transition-all shadow-xs cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#047857]" />
            <span>Registrar Pago</span>
          </button>

          {/* New Concession button */}
          <button
            onClick={onOpenNewConcessionModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1a5bce] hover:bg-[#0044a6] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva Concesión</span>
            <span className="sm:hidden">Nueva</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md hover:bg-slate-100 text-[#434653] transition-colors cursor-pointer"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#b91c1c] ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e2e8f0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] mb-2">
                  <span className="text-xs font-bold text-[#0a111a]">Notificaciones del Sistema</span>
                  <span className="text-[10px] font-semibold text-[#1a5bce] bg-[#eff4ff] px-1.5 py-0.5 rounded">
                    3 nuevas
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-md hover:bg-[#f8fafe] border border-transparent hover:border-[#f1f5f9] transition-all"
                    >
                      <div className="flex items-start gap-2">
                        {item.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
                        )}
                        {item.type === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" />
                        )}
                        {item.type === 'alert' && (
                          <AlertTriangle className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0a111a] leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#434653] truncate mt-0.5">
                            {item.desc}
                          </p>
                          <span className="text-[10px] text-[#737785]">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#f1f5f9] mt-2 text-center">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-semibold text-[#1a5bce] hover:underline cursor-pointer"
                  >
                    Cerrar notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar row */}
      <div className="mt-2.5 sm:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-[#737785] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar concesión, folio, municipio..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#f8fafe] text-xs text-[#0a111a] placeholder-[#737785] border border-[#e2e8f0] rounded-md focus:outline-none focus:border-[#1a5bce]"
          />
        </div>
      </div>
    </header>
  );
};
