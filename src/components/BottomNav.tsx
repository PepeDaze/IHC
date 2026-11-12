import React from 'react';
import { LayoutDashboard, Bus, Receipt, User, PlusCircle } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewModal: () => void;
  isDetailActive?: boolean;
  onBackToDirectory?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewModal,
  isDetailActive,
  onBackToDirectory,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] px-2 py-1.5 z-40 flex items-center justify-around shadow-lg">
      <button
        onClick={() => {
          if (isDetailActive && onBackToDirectory) onBackToDirectory();
          onSelectTab('directorio');
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${
          currentTab === 'directorio' && !isDetailActive
            ? 'text-[#1a5bce] font-bold'
            : 'text-[#737785] hover:text-[#0a111a]'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Directorio</span>
      </button>

      <button
        onClick={() => onSelectTab('flota')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${
          currentTab === 'flota'
            ? 'text-[#1a5bce] font-bold'
            : 'text-[#737785] hover:text-[#0a111a]'
        }`}
      >
        <Bus className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Flotas</span>
      </button>

      {/* Floating Center Action Button */}
      <button
        onClick={onOpenNewModal}
        className="flex flex-col items-center justify-center -mt-4 bg-[#1a5bce] text-white p-2.5 rounded-full shadow-md hover:bg-[#0044a6] transition-transform active:scale-95"
        aria-label="Registrar nueva concesión"
      >
        <PlusCircle className="w-5 h-5" />
      </button>

      <button
        onClick={() => onSelectTab('cobranza')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${
          currentTab === 'cobranza'
            ? 'text-[#1a5bce] font-bold'
            : 'text-[#737785] hover:text-[#0a111a]'
        }`}
      >
        <Receipt className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Cobranza</span>
      </button>

      <button
        onClick={() => onSelectTab('configuracion')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors ${
          currentTab === 'configuracion'
            ? 'text-[#1a5bce] font-bold'
            : 'text-[#737785] hover:text-[#0a111a]'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Perfil</span>
      </button>
    </nav>
  );
};
