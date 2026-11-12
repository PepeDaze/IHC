import React, { useState } from 'react';
import { Concessionaire } from '../types/transit';
import { X, Plus, Bus, Building2, User, MapPin } from 'lucide-react';

interface NewConcessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConcession: (concession: Concessionaire) => void;
}

export const NewConcessionModal: React.FC<NewConcessionModalProps> = ({
  isOpen,
  onClose,
  onAddConcession,
}) => {
  const [name, setName] = useState('');
  const [commercialName, setCommercialName] = useState('');
  const [rfc, setRfc] = useState('');
  const [legalRep, setLegalRep] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [municipality, setMunicipality] = useState('Tuxpan');
  const [totalUnits, setTotalUnits] = useState('24');
  const [planName, setPlanName] = useState('Flota Integral Pro');
  const [planFee, setPlanFee] = useState('28500');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const unitsCount = parseInt(totalUnits, 10) || 20;
    const fee = parseFloat(planFee) || 25000;
    const newCode = `CON-VER-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newConcession: Concessionaire = {
      id: `con-${Date.now()}`,
      concessionCode: newCode,
      name: name.trim() || 'Nueva Concesionaria de Transporte S.A.',
      commercialName: commercialName.trim() || 'Rutas Urbanas del Golfo',
      rfc: rfc.trim().toUpperCase() || 'TRN-260101-9X1',
      legalRepresentative: legalRep.trim() || 'Representante Legal Asignado',
      representativePhone: phone.trim() || '+52 (783) 800-0000',
      representativeEmail: email.trim() || 'contacto@transporte.mx',
      fiscalAddress: `Calle Principal #100, Col. Centro, ${municipality}, Ver.`,
      municipality,
      state: 'Veracruz',
      status: 'activa',
      planName,
      planMonthlyFee: fee,
      billingCycleDay: 15,
      cycleCurrentDay: 1,
      cycleTotalDays: 30,
      nextBillingDate: '15 Dic 2026',
      paymentMethod: 'SPEI / Domiciliación Bancaria',
      balanceDue: 0,
      totalUnits: unitsCount,
      activeUnits: Math.round(unitsCount * 0.9),
      maintenanceUnits: Math.round(unitsCount * 0.08),
      outOfServiceUnits: Math.max(0, unitsCount - Math.round(unitsCount * 0.9) - Math.round(unitsCount * 0.08)),
      routes: [`Ruta 01: Terminal Central ⇄ Zona Industrial ${municipality}`],
      primaryBusPhoto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      invoices: [
        {
          id: `inv-${Date.now()}`,
          folio: `CFDI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          period: 'Noviembre 2026',
          issueDate: new Date().toLocaleDateString('es-MX'),
          dueDate: '15/11/2026',
          paidDate: new Date().toLocaleDateString('es-MX'),
          amount: fee,
          paymentMethod: 'Alta Inicial de Concesión',
          status: 'pagado',
        },
      ],
      units: [
        {
          id: `u-${Date.now()}-1`,
          economicNumber: 'ECO-01',
          plateNumber: 'A-90123-X',
          model: 'Mercedes-Benz Boxer 2024',
          driver: legalRep || 'Operador Asignado',
          driverPhone: phone || '+52 (783) 100-2000',
          driverLicense: 'LIC-FED-VER-2026',
          capacity: 41,
          gpsStatus: 'online',
          operationalStatus: 'en_ruta',
          lastPing: 'Hace 1 min',
          currentSpeed: 35,
          routeAssigned: `Ruta 01: ${municipality} Centro`,
        },
      ],
    };

    onAddConcession(newConcession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a111a]/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-[#e2e8f0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafe]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[#eff4ff] text-[#1a5bce] flex items-center justify-center border border-[#dae2ff]">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#0a111a]">
                Registrar Nueva Concesión
              </h3>
              <p className="text-[11px] text-[#737785]">
                Alta de operadora de transporte público municipal en la plataforma RutaFácil
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Razón Social de la Empresa Concesionaria
            </label>
            <input
              type="text"
              required
              placeholder="p. ej. Transportes Unidos de Tuxpan S.A. de C.V."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Nombre Comercial / Ruta
              </label>
              <input
                type="text"
                required
                placeholder="Ruta Barra Express"
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                RFC Fiscal
              </label>
              <input
                type="text"
                required
                placeholder="ATB-850412-KP3"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-mono font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Representante Legal
              </label>
              <input
                type="text"
                required
                placeholder="Don Roberto Morales Vega"
                value={legalRep}
                onChange={(e) => setLegalRep(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Municipio Sede
              </label>
              <select
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                className="w-full bg-[#f8fafe] border border-[#e2e8f0] rounded-md px-3 py-2 text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              >
                <option value="Tuxpan">Tuxpan, Ver.</option>
                <option value="Poza Rica">Poza Rica, Ver.</option>
                <option value="Xalapa">Xalapa, Ver.</option>
                <option value="Veracruz">Veracruz Puerto, Ver.</option>
                <option value="Córdoba">Córdoba, Ver.</option>
                <option value="Coatzacoalcos">Coatzacoalcos, Ver.</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                placeholder="+52 (783) 834-2910"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="contacto@empresa.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Unidades Totales
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Plan de Suscripción
              </label>
              <select
                value={planName}
                onChange={(e) => {
                  setPlanName(e.target.value);
                  if (e.target.value === 'Flota Básica Urbano') setPlanFee('18400');
                  else if (e.target.value === 'Flota Integral Pro') setPlanFee('28500');
                  else setPlanFee('52000');
                }}
                className="w-full bg-[#f8fafe] border border-[#e2e8f0] rounded-md px-3 py-2 text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              >
                <option value="Flota Básica Urbano">Básica ($18.4k)</option>
                <option value="Flota Integral Pro">Integral Pro ($28.5k)</option>
                <option value="Flota Metrópoli Enterprise">Enterprise ($52k)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Cuota Mensual (MXN)
              </label>
              <input
                type="number"
                value={planFee}
                onChange={(e) => setPlanFee(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-bold text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e2e8f0] text-[#434653] font-semibold rounded-md hover:bg-[#f8fafe] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1a5bce] hover:bg-[#0044a6] text-white font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Concesión</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
