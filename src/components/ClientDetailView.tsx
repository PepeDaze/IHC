import React, { useState } from 'react';
import { Concessionaire, FleetUnit } from '../types/transit';
import { StatusBadge } from './StatusBadge';
import { 
  ArrowLeft, 
  Building2, 
  Bus, 
  Calendar, 
  CreditCard, 
  Download, 
  FileText, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  User, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  ChevronRight,
  Printer,
  ExternalLink
} from 'lucide-react';

interface ClientDetailViewProps {
  concession: Concessionaire;
  onBack: () => void;
  onOpenPaymentModal: (concession: Concessionaire) => void;
  onSelectUnit?: (unit: FleetUnit) => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  concession,
  onBack,
  onOpenPaymentModal,
  onSelectUnit,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'flota' | 'facturacion' | 'rutas'>('general');
  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<FleetUnit | null>(null);

  // Calculations for subscription cycle
  const cyclePercent = Math.round((concession.cycleCurrentDay / concession.cycleTotalDays) * 100);
  const daysLeft = concession.cycleTotalDays - concession.cycleCurrentDay;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-lg border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 font-semibold text-[#1a5bce] hover:text-[#0044a6] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Directorio de Concesiones</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#737785]" />
          <span className="font-semibold text-[#0a111a] truncate max-w-[220px] sm:max-w-none">
            {concession.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0a111a] hover:bg-[#f8fafe] rounded-md transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#737785]" />
            <span className="hidden sm:inline">Imprimir Ficha</span>
          </button>
          <button
            onClick={() => onOpenPaymentModal(concession)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Registrar Pago</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#eff4ff] border border-[#dae2ff] text-[#1a5bce] flex items-center justify-center shrink-0 shadow-xs">
              <Bus className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#1a5bce] bg-[#eff4ff] px-2.5 py-0.5 rounded border border-[#dae2ff]">
                  {concession.concessionCode}
                </span>
                <StatusBadge status={concession.status} size="sm" />
                <span className="text-xs text-[#737785]">• RFC: <strong className="text-[#0a111a]">{concession.rfc}</strong></span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a111a]">
                {concession.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#434653] mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1a5bce]" />
                  <span>{concession.municipality}, {concession.state}</span>
                </span>
                <span>•</span>
                <span className="font-medium text-[#0a111a]">{concession.commercialName}</span>
                <span>•</span>
                <span>Plan: <strong className="text-[#1a5bce]">{concession.planName}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge Panel */}
          <div className="flex items-center gap-3 bg-[#f8fafe] p-3 rounded-lg border border-[#f1f5f9] self-start lg:self-center">
            <div className="text-center px-3 border-r border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#737785] block">Flota Total</span>
              <span className="text-xl font-bold text-[#0a111a]">{concession.totalUnits}</span>
              <span className="text-[10px] text-[#047857] block font-semibold">{concession.activeUnits} en ruta</span>
            </div>

            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-[#737785] block">Cuota Mensual</span>
              <span className="text-xl font-bold text-[#0a111a]">
                ${(concession.planMonthlyFee / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-[#737785] block">MXN / mes</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-[#f1f5f9] mt-5 pt-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'general', label: 'Resumen General' },
            { id: 'flota', label: `Flota de Unidades (${concession.units.length || concession.totalUnits})` },
            { id: 'facturacion', label: `Historial de Facturación (${concession.invoices.length})` },
            { id: 'rutas', label: `Rutas y Terminales (${concession.routes.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1a5bce] text-white shadow-xs'
                    : 'text-[#434653] hover:bg-slate-100 hover:text-[#0a111a]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab: Resumen General (Masonry / Multi-panel Grid) */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Legal Representative & Fiscal Card */}
          <div className="space-y-5">
            {/* Representative Card */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1a5bce]" />
                  <h3 className="text-sm font-bold text-[#0a111a]">Representante Legal</h3>
                </div>
                <span className="text-[10px] font-bold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                  Verificado
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-[#cbd5e1] overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                    alt={concession.legalRepresentative}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0a111a]">
                    {concession.legalRepresentative}
                  </h4>
                  <p className="text-xs text-[#737785]">Apoderado General de Transportes</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-2 bg-[#f8fafe] rounded-md border border-[#f1f5f9]">
                  <Phone className="w-3.5 h-3.5 text-[#1a5bce] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#737785] block">Teléfono de Enlace</span>
                    <a href={`tel:${concession.representativePhone}`} className="font-semibold text-[#0a111a] hover:underline">
                      {concession.representativePhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-[#f8fafe] rounded-md border border-[#f1f5f9]">
                  <Mail className="w-3.5 h-3.5 text-[#1a5bce] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#737785] block">Correo Electrónico</span>
                    <a href={`mailto:${concession.representativeEmail}`} className="font-semibold text-[#0a111a] hover:underline truncate block">
                      {concession.representativeEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-[#f8fafe] rounded-md border border-[#f1f5f9]">
                  <MapPin className="w-3.5 h-3.5 text-[#1a5bce] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#737785] block">Domicilio Fiscal Registrado</span>
                    <span className="font-medium text-[#0a111a] leading-tight block">
                      {concession.fiscalAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory & Concession Specs */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#f1f5f9] mb-3">
                <ShieldCheck className="w-4 h-4 text-[#1a5bce]" />
                <h3 className="text-sm font-bold text-[#0a111a]">Expediente Reglamentario</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#737785]">Título Concesión:</span>
                  <span className="font-semibold text-[#0a111a]">{concession.concessionCode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#737785]">Tipo de Servicio:</span>
                  <span className="font-semibold text-[#0a111a]">Urbano y Suburbano Colectivo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#737785]">Vigencia Quinquenal:</span>
                  <span className="font-semibold text-[#047857]">2024 - 2029 (Vigente)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#737785]">Póliza de Seguro Flota:</span>
                  <span className="font-semibold text-[#0a111a]">Qualitas Seguros Colectivo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Subscription Status & Fleet Summary */}
          <div className="lg:col-span-2 space-y-5">
            {/* Subscription Status & Billing Cycle Card (with Progress Bar) */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9] mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#1a5bce]" />
                  <h3 className="text-sm font-bold text-[#0a111a]">
                    Estado de Suscripción & Ciclo de Facturación
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Al Corriente
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-[#f8fafe] rounded-md border border-[#f1f5f9]">
                  <span className="text-[10px] uppercase font-bold text-[#737785] block">Plan Activo</span>
                  <span className="font-bold text-sm text-[#1a5bce]">{concession.planName}</span>
                  <span className="text-[11px] text-[#737785] block">Soporte y GPS Ilimitado</span>
                </div>

                <div className="p-3 bg-[#f8fafe] rounded-md border border-[#f1f5f9]">
                  <span className="text-[10px] uppercase font-bold text-[#737785] block">Cuota Mensual</span>
                  <span className="font-bold text-base text-[#0a111a]">
                    ${concession.planMonthlyFee.toLocaleString('es-MX')} MXN
                  </span>
                  <span className="text-[11px] text-[#737785] block">+ IVA Desglosado</span>
                </div>

                <div className="p-3 bg-[#f8fafe] rounded-md border border-[#f1f5f9]">
                  <span className="text-[10px] uppercase font-bold text-[#737785] block">Próximo Corte</span>
                  <span className="font-bold text-sm text-[#0a111a]">{concession.nextBillingDate}</span>
                  <span className="text-[11px] text-[#b45309] block font-medium">En {daysLeft} días</span>
                </div>
              </div>

              {/* Horizontal Progress Bar for Subscription Cycle */}
              <div className="bg-[#f8fafe] p-4 rounded-lg border border-[#e2e8f0] mb-4">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-[#0a111a] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1a5bce]" />
                    Progreso del Ciclo de Facturación
                  </span>
                  <span className="font-bold text-[#1a5bce]">
                    Día {concession.cycleCurrentDay} de {concession.cycleTotalDays} ({cyclePercent}%)
                  </span>
                </div>

                <div className="w-full bg-[#e2e8f0] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1a5bce] h-full rounded-full transition-all duration-500"
                    style={{ width: `${cyclePercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#737785] mt-2">
                  <span>Inicio de Ciclo: Día 01</span>
                  <span>Corte y Facturación: Día {concession.billingCycleDay}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2 text-[#434653]">
                  <span className="font-semibold text-[#0a111a]">Método registrado:</span>
                  <span>{concession.paymentMethod}</span>
                </div>
                <button
                  onClick={() => onOpenPaymentModal(concession)}
                  className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dae2ff] text-[#1a5bce] font-semibold rounded-md border border-[#dae2ff] transition-colors cursor-pointer text-center"
                >
                  Registrar Abono o Anticipo
                </button>
              </div>
            </div>

            {/* Fleet Summary Card (with Bus Photo & Metrics) */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#1a5bce]" />
                  <h3 className="text-sm font-bold text-[#0a111a]">
                    Resumen de Flota Vehicular ({concession.totalUnits} Unidades)
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('flota')}
                  className="text-xs font-semibold text-[#1a5bce] hover:underline cursor-pointer"
                >
                  Ver Catálogo Completo →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Bus Photo Showcase */}
                <div className="relative rounded-lg overflow-hidden border border-[#e2e8f0] h-36 bg-slate-900 group">
                  <img
                    src={concession.primaryBusPhoto}
                    alt="Unidad de Transporte Urbano"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Unidad Insignia
                    </span>
                    <span className="text-xs font-bold">Mercedes-Benz Marcopolo Boxer 2023</span>
                    <span className="text-[10px] text-slate-300 font-mono">ECO-01 • Placas A-78492-X</span>
                  </div>
                </div>

                {/* Fleet Breakdown Stats */}
                <div className="md:col-span-2 space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-[#ecfdf5] rounded-md border border-[#a7f3d0]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" />
                      <span className="text-xs font-semibold text-[#047857]">En Ruta Activa</span>
                    </div>
                    <span className="text-sm font-bold text-[#047857]">{concession.activeUnits} unidades (87.5%)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#fffbeb] rounded-md border border-[#fde68a]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]" />
                      <span className="text-xs font-semibold text-[#b45309]">En Taller / Mantenimiento</span>
                    </div>
                    <span className="text-sm font-bold text-[#b45309]">{concession.maintenanceUnits} unidades (8.3%)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#fef2f2] rounded-md border border-[#fecaca]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" />
                      <span className="text-xs font-semibold text-[#b91c1c]">Fuera de Servicio / Reserva</span>
                    </div>
                    <span className="text-sm font-bold text-[#b91c1c]">{concession.outOfServiceUnits} unidades (4.2%)</span>
                  </div>
                </div>
              </div>

              {/* Sample Units Grid preview */}
              {concession.units && concession.units.length > 0 && (
                <div className="border-t border-[#f1f5f9] pt-3">
                  <span className="text-[11px] uppercase font-bold text-[#737785] block mb-2">
                    Unidades Monitoreadas por GPS en Tiempo Real
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {concession.units.slice(0, 3).map((unit) => (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedUnitForDetail(unit)}
                        className="p-2.5 rounded-md border border-[#e2e8f0] bg-[#f8fafe] hover:border-[#1a5bce] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-[#0a111a]">{unit.economicNumber}</span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#047857]">
                            <Wifi className="w-3 h-3 text-[#047857]" />
                            {unit.currentSpeed} km/h
                          </span>
                        </div>
                        <p className="text-[11px] text-[#434653] truncate">{unit.driver}</p>
                        <p className="text-[10px] text-[#737785] truncate">{unit.routeAssigned}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Invoices Summary Bar */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1a5bce]" />
                  <h3 className="text-sm font-bold text-[#0a111a]">Últimas Facturas Emitidas</h3>
                </div>
                <button
                  onClick={() => setActiveTab('facturacion')}
                  className="text-xs font-semibold text-[#1a5bce] hover:underline cursor-pointer"
                >
                  Ver Historial Completo ({concession.invoices.length}) →
                </button>
              </div>

              <div className="space-y-2">
                {concession.invoices.slice(0, 2).map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 rounded-md border border-[#f1f5f9] bg-[#f8fafe] text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white border border-[#e2e8f0] flex items-center justify-center font-mono text-[11px] font-bold text-[#1a5bce]">
                        SAT
                      </div>
                      <div>
                        <span className="font-bold text-[#0a111a] block">{inv.folio}</span>
                        <span className="text-[11px] text-[#737785]">{inv.period} • {inv.issueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-bold text-[#0a111a] block">
                          ${inv.amount.toLocaleString('es-MX')} MXN
                        </span>
                        <span className="text-[10px] text-[#737785]">{inv.paymentMethod}</span>
                      </div>
                      <StatusBadge status={inv.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Flota de Unidades */}
      {activeTab === 'flota' && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f5f9] mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0a111a]">
                Parque Vehicular Registrado ({concession.units.length > 0 ? concession.units.length : concession.totalUnits} Unidades)
              </h3>
              <p className="text-xs text-[#737785]">
                Supervisión telemática de camiones urbanos, conductores asignados y estatus de operatividad.
              </p>
            </div>
            <button
              onClick={() => alert('Módulo de registro vehicular: Se requiere ficha técnica y póliza vigente.')}
              className="px-3 py-1.5 bg-[#1a5bce] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#0044a6] transition-colors self-start sm:self-center cursor-pointer"
            >
              + Dar de Alta Unidad
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0a111a] text-white text-[11px] font-semibold tracking-wider uppercase">
                  <th className="py-2.5 px-3">Económico & Placas</th>
                  <th className="py-2.5 px-3">Modelo / Carrocería</th>
                  <th className="py-2.5 px-3">Conductor Asignado</th>
                  <th className="py-2.5 px-3">Ruta Asignada</th>
                  <th className="py-2.5 px-3">Capacidad</th>
                  <th className="py-2.5 px-3">Telemetría GPS</th>
                  <th className="py-2.5 px-3">Estatus Operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {concession.units.map((unit) => (
                  <tr
                    key={unit.id}
                    onClick={() => setSelectedUnitForDetail(unit)}
                    className="hover:bg-[#f8fafe] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1a5bce] bg-[#eff4ff] px-2 py-0.5 rounded">
                          {unit.economicNumber}
                        </span>
                        <span className="font-mono text-[#0a111a]">{unit.plateNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#0a111a]">{unit.model}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#0a111a]">{unit.driver}</div>
                      <div className="text-[10px] text-[#737785]">{unit.driverPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-[#434653] font-medium">{unit.routeAssigned}</td>
                    <td className="py-3 px-3 text-[#434653]">{unit.capacity} Pasajeros</td>
                    <td className="py-3 px-3">
                      {unit.gpsStatus === 'online' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#047857]">
                          <Wifi className="w-3.5 h-3.5" />
                          <span>Online ({unit.currentSpeed} km/h)</span>
                        </span>
                      ) : unit.gpsStatus === 'alerta' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b45309]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Alerta taller</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b91c1c]">
                          <WifiOff className="w-3.5 h-3.5" />
                          <span>Offline</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {unit.operationalStatus === 'en_ruta' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                          En Ruta
                        </span>
                      )}
                      {unit.operationalStatus === 'en_mantenimiento' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
                          En Mantenimiento
                        </span>
                      )}
                      {unit.operationalStatus === 'fuera_servicio' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]">
                          Fuera de Servicio
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Historial de Facturación y Cobranza */}
      {activeTab === 'facturacion' && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f5f9] mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0a111a]">
                Historial de Facturación y Cobranza CFDI 4.0
              </h3>
              <p className="text-xs text-[#737785]">
                Comprobantes fiscales de la cuota de gestión de plataforma y derecho de concesión.
              </p>
            </div>
            <button
              onClick={() => onOpenPaymentModal(concession)}
              className="px-3.5 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start sm:self-center cursor-pointer flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Registrar Pago / Emitir CFDI</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0a111a] text-white text-[11px] font-semibold tracking-wider uppercase">
                  <th className="py-2.5 px-3">Folio Fiscal</th>
                  <th className="py-2.5 px-3">Periodo</th>
                  <th className="py-2.5 px-3">Fecha Emisión</th>
                  <th className="py-2.5 px-3">Vencimiento</th>
                  <th className="py-2.5 px-3">Monto Total</th>
                  <th className="py-2.5 px-3">Método de Pago</th>
                  <th className="py-2.5 px-3">Estatus</th>
                  <th className="py-2.5 px-3 text-right">Comprobantes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {concession.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f8fafe] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#1a5bce]">{inv.folio}</td>
                    <td className="py-3 px-3 font-medium text-[#0a111a]">{inv.period}</td>
                    <td className="py-3 px-3 text-[#434653]">{inv.issueDate}</td>
                    <td className="py-3 px-3 text-[#434653]">{inv.dueDate}</td>
                    <td className="py-3 px-3 font-bold text-[#0a111a]">
                      ${inv.amount.toLocaleString('es-MX')} MXN
                    </td>
                    <td className="py-3 px-3 text-[#737785]">{inv.paymentMethod}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`Descargando PDF de factura ${inv.folio}...`)}
                          className="px-2 py-1 bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#1a5bce] hover:bg-[#eff4ff] rounded transition-colors"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => alert(`Descargando XML SAT de factura ${inv.folio}...`)}
                          className="px-2 py-1 bg-white border border-[#e2e8f0] text-[11px] font-semibold text-[#434653] hover:bg-slate-100 rounded transition-colors"
                        >
                          XML
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Rutas y Terminales */}
      {activeTab === 'rutas' && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-xs">
          <div className="pb-4 border-b border-[#f1f5f9] mb-4">
            <h3 className="text-base font-bold text-[#0a111a]">
              Rutas Asignadas y Puntos Terminales Autorizados
            </h3>
            <p className="text-xs text-[#737785]">
              Recorridos autorizados por la Dirección General de Transporte del Estado de Veracruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concession.routes.map((route, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[#e2e8f0] bg-[#f8fafe] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1a5bce] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dae2ff]">
                    Tramo {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-[#047857]">Tarifa: $12.00 MXN</span>
                </div>
                <h4 className="font-bold text-sm text-[#0a111a]">{route}</h4>
                <div className="text-xs text-[#737785] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1a5bce]" />
                    <span>Frecuencia: Cada 8 minutos en hora pico</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1a5bce]" />
                    <span>Horario: 05:30 hrs - 22:30 hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unit Inspection Modal (if user clicked on a bus) */}
      {selectedUnitForDetail && (
        <div className="fixed inset-0 z-50 bg-[#0a111a]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#e2e8f0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between bg-[#0a111a] text-white">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#dae2ff]" />
                <span className="font-bold text-sm">Ficha Técnica: {selectedUnitForDetail.economicNumber}</span>
              </div>
              <button
                onClick={() => setSelectedUnitForDetail(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                <span className="text-[#737785]">Placas de Circulación:</span>
                <span className="font-mono font-bold text-[#0a111a]">{selectedUnitForDetail.plateNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                <span className="text-[#737785]">Modelo de Autobús:</span>
                <span className="font-semibold text-[#0a111a]">{selectedUnitForDetail.model}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                <span className="text-[#737785]">Conductor Titular:</span>
                <span className="font-semibold text-[#0a111a]">{selectedUnitForDetail.driver}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                <span className="text-[#737785]">Licencia Federal:</span>
                <span className="font-mono text-[#0a111a]">{selectedUnitForDetail.driverLicense}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                <span className="text-[#737785]">Velocidad Actual:</span>
                <span className="font-bold text-[#047857]">{selectedUnitForDetail.currentSpeed} km/h (GPS Activo)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#737785]">Ruta en Operación:</span>
                <span className="font-medium text-[#1a5bce]">{selectedUnitForDetail.routeAssigned}</span>
              </div>
            </div>

            <div className="p-4 bg-[#f8fafe] border-t border-[#f1f5f9] flex justify-end">
              <button
                onClick={() => setSelectedUnitForDetail(null)}
                className="px-4 py-2 bg-[#1a5bce] text-white font-semibold rounded-md hover:bg-[#0044a6]"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
