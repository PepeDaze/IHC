import React from 'react';
import { Monitor, Smartphone, Maximize2, Shield } from 'lucide-react';

export type ViewportMode = 'responsive' | 'desktop' | 'mobile';

interface ViewportBarProps {
  currentMode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
  activeView: 'directorio' | 'detalle';
  concessionName?: string;
  onNavigateDirectorio: () => void;
  onNavigateDetalleSample: () => void;
}

export const ViewportBar: React.FC<ViewportBarProps> = ({
  currentMode,
  onModeChange,
  activeView,
  concessionName,
  onNavigateDirectorio,
  onNavigateDetalleSample,
}) => {
  return (
    <div className="bg-[#0a111a] text-white px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 z-50">
      {/* Left: Section Navigator */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hidden md:inline">
          Vistas del Prototipo:
        </span>
        <div className="inline-flex rounded-md p-0.5 bg-slate-900 border border-slate-700">
          <button
            onClick={onNavigateDirectorio}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'directorio'
                ? 'bg-[#1a5bce] text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            1. Directorio General
          </button>
          <button
            onClick={onNavigateDetalleSample}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'detalle'
                ? 'bg-[#1a5bce] text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            2. Detalle de Cliente ({concessionName ? 'Tuxpan-Barra' : 'Cliente'})
          </button>
        </div>
      </div>

      {/* Right: Viewport Simulator Mode */}
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hidden sm:inline">
          Modo Dispositivo:
        </span>
        <div className="inline-flex rounded-md p-0.5 bg-slate-900 border border-slate-700">
          <button
            onClick={() => onModeChange('responsive')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              currentMode === 'responsive'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Adaptable al 100% del tamaño del navegador"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Adaptable</span>
          </button>

          <button
            onClick={() => onModeChange('desktop')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              currentMode === 'desktop'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Forzar vista de escritorio (1280px con barra lateral)"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:inline">Escritorio</span>
          </button>

          <button
            onClick={() => onModeChange('mobile')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              currentMode === 'mobile'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Forzar vista móvil (marco smartphone de 390px con tarjetas y barra inferior)"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">Móvil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
