import React from 'react';
import { KPIData } from '../types/transit';
import { Bus, TrendingUp, AlertTriangle, ArrowUpRight, DollarSign, ShieldCheck } from 'lucide-react';

interface KpiMetricsProps {
  kpis: KPIData;
  onFilterByStatus?: (status: string) => void;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ kpis, onFilterByStatus }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Concesiones Activas */}
      <div 
        onClick={() => onFilterByStatus?.('activa')}
        className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs hover:border-[#1a5bce]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#434653]">
            Concesiones Activas
          </span>
          <div className="w-8 h-8 rounded-md bg-[#e8eefc] text-[#1a5bce] flex items-center justify-center group-hover:bg-[#1a5bce] group-hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a111a]">
            {kpis.activeConcessions.total}
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +{kpis.activeConcessions.trendPercentage}%
          </span>
        </div>

        <div className="text-xs text-[#434653] flex items-center justify-between mb-3">
          <span>{kpis.activeConcessions.activeCount} al corriente</span>
          <span className="text-[#b45309]">{kpis.activeConcessions.warningCount} por vencer</span>
        </div>

        {/* Small trendline SVG */}
        <div className="w-full h-8 pt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 28" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradConcessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a5bce" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1a5bce" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0 24 Q 25 22, 45 18 T 85 10 T 120 4 L 120 28 L 0 28 Z"
              fill="url(#gradConcessions)"
            />
            <path
              d="M0 24 Q 25 22, 45 18 T 85 10 T 120 4"
              fill="none"
              stroke="#1a5bce"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. Unidades en Operación */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs hover:border-[#1a5bce]/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#434653]">
            Unidades en Flota
          </span>
          <div className="w-8 h-8 rounded-md bg-[#eff4ff] text-[#0044a6] flex items-center justify-center">
            <Bus className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a111a]">
            {kpis.fleetUnits.total.toLocaleString('es-MX')}
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
            {kpis.fleetUnits.utilizationRate}% en ruta
          </span>
        </div>

        <div className="text-xs text-[#434653] flex items-center justify-between mb-3">
          <span>{kpis.fleetUnits.inRoute.toLocaleString('es-MX')} activas</span>
          <span className="text-slate-500">{kpis.fleetUnits.maintenance} taller</span>
        </div>

        {/* Fleet mini bar */}
        <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden flex mt-2">
          <div
            className="bg-[#047857] h-full"
            style={{ width: `${(kpis.fleetUnits.inRoute / kpis.fleetUnits.total) * 100}%` }}
            title="En ruta activa"
          />
          <div
            className="bg-[#b45309] h-full"
            style={{ width: `${(kpis.fleetUnits.maintenance / kpis.fleetUnits.total) * 100}%` }}
            title="En mantenimiento"
          />
          <div
            className="bg-[#b91c1c] h-full"
            style={{ width: `${(kpis.fleetUnits.outOfService / kpis.fleetUnits.total) * 100}%` }}
            title="Fuera de servicio"
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#737785] mt-1.5 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" /> Activas
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b45309]" /> Taller
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]" /> Baja
          </span>
        </div>
      </div>

      {/* 3. Recaudación del Mes */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs hover:border-[#1a5bce]/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#434653]">
            Recaudación del Mes
          </span>
          <div className="w-8 h-8 rounded-md bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a111a]">
            ${(kpis.monthlyRevenue.totalMXN / 1000).toFixed(1)}k
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            +{kpis.monthlyRevenue.trendPercentage}%
          </span>
        </div>

        <div className="text-xs text-[#434653] flex items-center justify-between mb-2">
          <span>Meta: ${(kpis.monthlyRevenue.projectedMXN / 1000).toFixed(0)}k MXN</span>
          <span className="font-semibold text-[#0a111a]">{kpis.monthlyRevenue.collectionRate}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden mt-3">
          <div
            className="bg-[#1a5bce] h-full rounded-full transition-all duration-500"
            style={{ width: `${kpis.monthlyRevenue.collectionRate}%` }}
          />
        </div>
        <div className="text-[11px] text-[#737785] mt-1.5">
          ${kpis.monthlyRevenue.totalMXN.toLocaleString('es-MX')} MXN cobrados
        </div>
      </div>

      {/* 4. Cobranza Pendiente */}
      <div 
        onClick={() => onFilterByStatus?.('pago_atrasado')}
        className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs hover:border-[#b91c1c]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#434653]">
            Cobranza Pendiente
          </span>
          <div className="w-8 h-8 rounded-md bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center group-hover:bg-[#b91c1c] group-hover:text-white transition-colors">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#b91c1c]">
            ${kpis.pendingCollections.totalMXN.toLocaleString('es-MX')}
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] px-2 py-0.5 rounded-full border border-[#fecaca]">
            {kpis.pendingCollections.criticalCount} en mora
          </span>
        </div>

        <div className="text-xs text-[#434653] flex items-center justify-between mb-3">
          <span>{kpis.pendingCollections.concessionsCount} concesiones pendientes</span>
          <span className="text-[#b91c1c] font-medium group-hover:underline">Filtrar →</span>
        </div>

        {/* Warning sparkline SVG */}
        <div className="w-full h-8 pt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 28" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0 12 Q 30 18, 55 10 T 95 22 T 120 14 L 120 28 L 0 28 Z"
              fill="url(#gradPending)"
            />
            <path
              d="M0 12 Q 30 18, 55 10 T 95 22 T 120 14"
              fill="none"
              stroke="#b91c1c"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
