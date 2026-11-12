import React, { useState, useMemo } from 'react';
import { Concessionaire, ConcessionStatus } from '../types/transit';
import { StatusBadge } from './StatusBadge';
import { 
  Building2, 
  Bus, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  Filter, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Calendar,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';

interface DirectoryViewProps {
  concessions: Concessionaire[];
  onSelectConcession: (concession: Concessionaire) => void;
  onOpenPaymentModal: (concession?: Concessionaire) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  concessions,
  onSelectConcession,
  onOpenPaymentModal,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
}) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'name' | 'units' | 'fee' | 'status'>('status');

  // Unique municipalities list
  const municipalities = useMemo(() => {
    const list = Array.from(new Set(concessions.map((c) => c.municipality)));
    return ['todos', ...list];
  }, [concessions]);

  // Filtered & sorted concessions
  const filteredConcessions = useMemo(() => {
    return concessions
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'todos' && item.status !== statusFilter) {
          return false;
        }
        // Municipality filter
        if (selectedMunicipality !== 'todos' && item.municipality !== selectedMunicipality) {
          return false;
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchCode = item.concessionCode.toLowerCase().includes(q);
          const matchRfc = item.rfc.toLowerCase().includes(q);
          const matchRep = item.legalRepresentative.toLowerCase().includes(q);
          const matchMun = item.municipality.toLowerCase().includes(q);
          return matchName || matchCode || matchRfc || matchRep || matchMun;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'units') return b.totalUnits - a.totalUnits;
        if (sortBy === 'fee') return b.planMonthlyFee - a.planMonthlyFee;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // By default, prioritize late payments and warning
        const statusPriority: Record<ConcessionStatus, number> = {
          pago_atrasado: 0,
          suspendida: 1,
          por_vencer: 2,
          activa: 3,
        };
        return statusPriority[a.status] - statusPriority[b.status];
      });
  }, [concessions, statusFilter, selectedMunicipality, searchQuery, sortBy]);

  const handleExportCSV = () => {
    const headers = ['Folio', 'Concesionaria', 'RFC', 'Representante', 'Municipio', 'Flota', 'Plan_MXN', 'Estatus'];
    const rows = filteredConcessions.map(c => [
      c.concessionCode,
      `"${c.name}"`,
      c.rfc,
      `"${c.legalRepresentative}"`,
      c.municipality,
      c.totalUnits,
      c.planMonthlyFee,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Directorio_RutaFacil_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Directory Title & Controls Header */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a111a]">
                Directorio de Concesiones
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#434653]">
                {filteredConcessions.length} concesiones
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#434653] mt-0.5">
              Supervisión de empresas operadoras de transporte público, unidades activas y cobranza.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0a111a] hover:bg-[#f8fafe] rounded-md transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#737785]" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-[#f1f5f9]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos', count: concessions.length },
              { id: 'activa', label: 'Activas', count: concessions.filter(c => c.status === 'activa').length, color: 'text-[#047857]' },
              { id: 'por_vencer', label: 'Por Vencer', count: concessions.filter(c => c.status === 'por_vencer').length, color: 'text-[#b45309]' },
              { id: 'pago_atrasado', label: 'Pago Atrasado', count: concessions.filter(c => c.status === 'pago_atrasado').length, color: 'text-[#b91c1c]' },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1a5bce] text-white shadow-xs'
                      : 'bg-[#f8fafe] text-[#434653] hover:bg-slate-100 hover:text-[#0a111a] border border-[#e2e8f0]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Selectors (Municipality & Sort) */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-xs text-[#737785]">
              <MapPin className="w-3.5 h-3.5 text-[#1a5bce]" />
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="bg-[#f8fafe] border border-[#e2e8f0] text-xs text-[#0a111a] font-medium rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#1a5bce]"
              >
                <option value="todos">Todos los Municipios</option>
                {municipalities.filter(m => m !== 'todos').map((m) => (
                  <option key={m} value={m}>{m}, Veracruz</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#737785]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#737785]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#f8fafe] border border-[#e2e8f0] text-xs text-[#0a111a] font-medium rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#1a5bce]"
              >
                <option value="status">Prioridad Estatus</option>
                <option value="units">Mayor Flota</option>
                <option value="fee">Mayor Cuota</option>
                <option value="name">Alfabético</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View: Structured Table with Hover Effects */}
      <div className="hidden md:block bg-white rounded-lg border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a111a] text-white text-[11px] font-semibold tracking-wider uppercase border-b border-[#0a111a]">
                <th className="py-3 px-4">Concesionaria & Folio</th>
                <th className="py-3 px-4">Representante Legal</th>
                <th className="py-3 px-4">Municipio & Rutas</th>
                <th className="py-3 px-4">Flota</th>
                <th className="py-3 px-4">Plan & Cuota</th>
                <th className="py-3 px-4">Corte / Vencimiento</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#0a111a]">
              {filteredConcessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#737785]">
                    No se encontraron concesiones que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredConcessions.map((item, index) => {
                  const isOverdue = item.status === 'pago_atrasado';
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectConcession(item)}
                      className={`hover:bg-[#f8fafe] transition-colors cursor-pointer group ${
                        index % 2 === 1 ? 'bg-[#fafcff]' : 'bg-white'
                      }`}
                    >
                      {/* Concesionaria & Folio */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-[#eff4ff] text-[#1a5bce] flex items-center justify-center shrink-0 border border-[#dae2ff] group-hover:bg-[#1a5bce] group-hover:text-white transition-colors">
                            <Bus className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-[#0a111a] group-hover:text-[#1a5bce] transition-colors line-clamp-1">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#737785] mt-0.5">
                              <span className="font-mono font-medium text-[#1a5bce] bg-[#eff4ff] px-1.5 py-0.2 rounded text-[10px]">
                                {item.concessionCode}
                              </span>
                              <span>RFC: {item.rfc}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Representante Legal */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#0a111a]">{item.legalRepresentative}</div>
                        <div className="text-[11px] text-[#737785]">{item.representativePhone}</div>
                      </td>

                      {/* Municipio & Rutas */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0a111a]">{item.municipality}, Ver.</div>
                        <div className="text-[11px] text-[#737785]">
                          {item.routes.length} ruta{item.routes.length !== 1 ? 's' : ''} autorizada{item.routes.length !== 1 ? 's' : ''}
                        </div>
                      </td>

                      {/* Flota */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-sm text-[#0a111a]">{item.totalUnits}</span>
                          <span className="text-[11px] text-[#737785]">unidades</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#737785] mt-0.5">
                          <span className="text-[#047857] font-semibold">{item.activeUnits} en ruta</span>
                          {item.maintenanceUnits > 0 && (
                            <span>• {item.maintenanceUnits} taller</span>
                          )}
                        </div>
                      </td>

                      {/* Plan & Cuota */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0a111a]">
                          ${item.planMonthlyFee.toLocaleString('es-MX')} MXN
                        </div>
                        <div className="text-[11px] text-[#737785] truncate max-w-[130px]">
                          {item.planName}
                        </div>
                      </td>

                      {/* Ciclo / Vencimiento */}
                      <td className="py-3.5 px-4">
                        <div className={`font-semibold ${isOverdue ? 'text-[#b91c1c]' : 'text-[#0a111a]'}`}>
                          {item.nextBillingDate}
                        </div>
                        <div className="text-[11px] text-[#737785] mt-0.5">
                          Corte: Día {item.billingCycleDay}
                        </div>
                      </td>

                      {/* Estatus */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isOverdue && (
                            <button
                              onClick={() => onOpenPaymentModal(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] rounded border border-[#fecaca] transition-colors cursor-pointer"
                              title="Registrar pago urgente"
                            >
                              Cobrar
                            </button>
                          )}
                          <button
                            onClick={() => onSelectConcession(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#1a5bce] bg-[#eff4ff] hover:bg-[#dae2ff] rounded border border-[#dae2ff] transition-colors cursor-pointer"
                          >
                            <span>Ver Detalle</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Table Footer */}
        <div className="p-3 px-4 bg-[#f8fafe] border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#737785]">
          <span>Mostrando {filteredConcessions.length} de {concessions.length} concesiones registradas</span>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#047857]" />
            <span>Sistemas de Monitoreo GPS Conectados</span>
          </div>
        </div>
      </div>

      {/* Mobile View: Vertically Stacked Tap-Friendly Summary Cards */}
      <div className="md:hidden space-y-3">
        {filteredConcessions.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 text-center text-xs text-[#737785]">
            No se encontraron concesiones que coincidan con la búsqueda.
          </div>
        ) : (
          filteredConcessions.map((item) => {
            const isOverdue = item.status === 'pago_atrasado';
            return (
              <div
                key={item.id}
                onClick={() => onSelectConcession(item)}
                className="bg-white rounded-lg border border-[#e2e8f0] p-4 shadow-xs active:scale-[0.99] transition-transform cursor-pointer relative"
              >
                {/* Top Folio and Status Bar */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-[11px] text-[#1a5bce] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dae2ff]">
                    {item.concessionCode}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                {/* Concession Title */}
                <h3 className="font-bold text-sm text-[#0a111a] leading-snug mb-1">
                  {item.name}
                </h3>
                <p className="text-[11px] text-[#737785] mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#1a5bce]" />
                  <span>{item.municipality}, Veracruz</span>
                  <span>•</span>
                  <span>{item.commercialName}</span>
                </p>

                {/* 2-Column Info Matrix */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#f8fafe] rounded-md border border-[#f1f5f9] text-xs mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#737785] block">
                      Flota en Ruta
                    </span>
                    <span className="font-bold text-[#0a111a] text-sm">
                      {item.totalUnits} <span className="text-[11px] font-normal text-[#737785]">unidades</span>
                    </span>
                    <span className="block text-[10px] text-[#047857]">
                      {item.activeUnits} activas hoy
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#737785] block">
                      Cuota Mensual
                    </span>
                    <span className="font-bold text-[#0a111a] text-sm">
                      ${item.planMonthlyFee.toLocaleString('es-MX')}
                    </span>
                    <span className={`block text-[10px] ${isOverdue ? 'text-[#b91c1c] font-semibold' : 'text-[#737785]'}`}>
                      Corte: {item.nextBillingDate}
                    </span>
                  </div>
                </div>

                {/* Representative info */}
                <div className="flex items-center justify-between text-xs text-[#434653] pt-1 border-t border-[#f1f5f9] mb-3">
                  <span className="text-[11px] text-[#737785]">Representante:</span>
                  <span className="font-medium text-[#0a111a] truncate max-w-[190px]">
                    {item.legalRepresentative}
                  </span>
                </div>

                {/* Action buttons on mobile */}
                <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onOpenPaymentModal(item)}
                    className="w-full py-1.5 px-2 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0a111a] rounded hover:bg-[#f8fafe] transition-colors text-center"
                  >
                    Registrar Pago
                  </button>
                  <button
                    onClick={() => onSelectConcession(item)}
                    className="w-full py-1.5 px-2 bg-[#1a5bce] text-white text-xs font-semibold rounded hover:bg-[#0044a6] transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <span>Ver Expediente</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
