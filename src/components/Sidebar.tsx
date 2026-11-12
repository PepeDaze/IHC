import React from 'react';
import { 
  LayoutDashboard, 
  Bus, 
  Receipt, 
  MapPin, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onResetToDirectory: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onResetToDirectory,
}) => {
  const navItems = [
    {
      id: 'directorio',
      label: 'Directorio General',
      icon: LayoutDashboard,
      badge: '142',
      badgeColor: 'bg-[#eff4ff] text-[#1a5bce]',
    },
    {
      id: 'flota',
      label: 'Flota y Unidades',
      icon: Bus,
      badge: '1,845',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'cobranza',
      label: 'Cobranza y Facturas',
      icon: Receipt,
      badge: '7 Mora',
      badgeColor: 'bg-[#fef2f2] text-[#b91c1c]',
    },
    {
      id: 'rutas',
      label: 'Rutas y Cobertura',
      icon: MapPin,
    },
    {
      id: 'reportes',
      label: 'Reportes y Finanzas',
      icon: BarChart3,
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between">
        <button 
          onClick={onResetToDirectory}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#1a5bce] flex items-center justify-center text-white shadow-sm shadow-[#1a5bce]/30 group-hover:scale-105 transition-transform">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-[#0a111a] tracking-tight">RutaFácil</span>
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.2 bg-[#eff4ff] text-[#1a5bce] rounded uppercase border border-[#dae2ff]">
                B2B
              </span>
            </div>
            <p className="text-[11px] text-[#737785] font-medium leading-tight">
              Gestión de Concesiones
            </p>
          </div>
        </button>
      </div>

      {/* Municipality / Concession Context Selector */}
      <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafe]/70">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#737785] mb-1.5 flex items-center gap-1">
          <Building2 className="w-3 h-3 text-[#1a5bce]" />
          <span>Jurisdicción de Concesiones</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-md bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0a111a] shadow-xs">
          <span className="truncate">SCT Veracruz • Zona Norte</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#737785] shrink-0" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#737785]">
          Menú Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#eff4ff] text-[#1a5bce] border-l-3 border-[#1a5bce] shadow-xs'
                  : 'text-[#434653] hover:bg-[#f8fafe] hover:text-[#0a111a]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1a5bce]' : 'text-[#737785]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#737785]">
          Soporte y Normativa
        </div>
        <button
          onClick={() => alert('Normativa Oficial de Transporte Público de Veracruz (Ley 589 y Código de Tránsito).')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#434653] hover:bg-[#f8fafe] hover:text-[#0a111a] rounded-md transition-colors text-left"
        >
          <ShieldCheck className="w-4 h-4 text-[#737785]" />
          <span>Normativa Estatal SCT</span>
        </button>
        <button
          onClick={() => alert('Mesa de Ayuda de RutaFácil: soporte@rutafacil.mx | Tel: 800-788-2324')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#434653] hover:bg-[#f8fafe] hover:text-[#0a111a] rounded-md transition-colors text-left"
        >
          <HelpCircle className="w-4 h-4 text-[#737785]" />
          <span>Centro de Ayuda</span>
        </button>
      </nav>

      {/* User / Officer Profile Footer */}
      <div className="p-3 border-t border-[#f1f5f9] bg-[#f8fafe]/60">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white transition-colors border border-transparent hover:border-[#e2e8f0]">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Lic. Carlos Mendoza"
              className="w-9 h-9 rounded-full object-cover border border-[#cbd5e1]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#047857] ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#0a111a] truncate leading-tight">
              Lic. Carlos Mendoza
            </p>
            <p className="text-[11px] text-[#737785] truncate leading-tight">
              Admin Concesiones
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
