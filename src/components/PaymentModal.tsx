import React, { useState } from 'react';
import { Concessionaire } from '../types/transit';
import { DollarSign, X, CheckCircle2, Building2, CreditCard, Calendar } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  concessions: Concessionaire[];
  defaultConcession?: Concessionaire | null;
  onPaymentSuccess: (concessionId: string, amount: number, method: string, folio: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  concessions,
  defaultConcession,
  onPaymentSuccess,
}) => {
  const [selectedConcessionId, setSelectedConcessionId] = useState<string>(
    defaultConcession ? defaultConcession.id : concessions[0]?.id || ''
  );
  const [amount, setAmount] = useState<string>(
    defaultConcession ? defaultConcession.planMonthlyFee.toString() : '28500'
  );
  const [method, setMethod] = useState<string>('Transferencia SPEI BBVA');
  const [folio, setFolio] = useState<string>(`SPEI-${Math.floor(100000 + Math.random() * 900000)}`);
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync if defaultConcession changes
  React.useEffect(() => {
    if (defaultConcession) {
      setSelectedConcessionId(defaultConcession.id);
      setAmount(defaultConcession.planMonthlyFee.toString());
    }
  }, [defaultConcession]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onPaymentSuccess(selectedConcessionId, parseFloat(amount) || 0, method, folio);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const selectedConcession = concessions.find((c) => c.id === selectedConcessionId);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a111a]/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-[#e2e8f0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafe]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-[#ecfdf5] text-[#047857] flex items-center justify-center border border-[#a7f3d0]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#0a111a]">
                Registrar Pago de Cuota / Concesión
              </h3>
              <p className="text-[11px] text-[#737785]">
                Registro de abono o mensualidad para conciliación inmediata
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Concession Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Empresa Concesionaria Beneficiaria
            </label>
            <select
              value={selectedConcessionId}
              onChange={(e) => {
                setSelectedConcessionId(e.target.value);
                const found = concessions.find((c) => c.id === e.target.value);
                if (found) setAmount(found.planMonthlyFee.toString());
              }}
              className="w-full bg-[#f8fafe] border border-[#e2e8f0] rounded-md px-3 py-2 text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
            >
              {concessions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.concessionCode} — {c.name} ({c.municipality})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Monto Recibido (MXN)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737785] font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-bold text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                Método de Cobro
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-[#f8fafe] border border-[#e2e8f0] rounded-md px-3 py-2 text-xs font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
              >
                <option value="Transferencia SPEI BBVA">Transferencia SPEI BBVA</option>
                <option value="Domiciliación Bancaria Santander">Domiciliación Santander</option>
                <option value="Depósito Ventanilla Banorte">Depósito Ventanilla Banorte</option>
                <option value="Pago con Tarjeta Corporativa">Tarjeta Corporativa</option>
                <option value="Efectivo en Caja Municipal">Efectivo en Caja Recaudadora</option>
              </select>
            </div>
          </div>

          {/* Folio / Reference */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Número de Folio / Rastreo SPEI / Comprobante
            </label>
            <input
              type="text"
              required
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8fafe] border border-[#e2e8f0] rounded-md text-xs font-mono font-medium text-[#0a111a] focus:outline-none focus:border-[#1a5bce]"
            />
          </div>

          {/* CFDI 4.0 Checkbox */}
          <div className="p-3 bg-[#f8fafe] rounded-md border border-[#e2e8f0] flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#0a111a] block">
                Timbrado de Factura CFDI 4.0 Inmediato
              </span>
              <span className="text-[11px] text-[#737785]">
                Generar y enviar XML + PDF al correo del representante fiscal
              </span>
            </div>
            <input
              type="checkbox"
              checked={generateInvoice}
              onChange={(e) => setGenerateInvoice(e.target.checked)}
              className="w-4 h-4 text-[#1a5bce] rounded border-gray-300 focus:ring-[#1a5bce]"
            />
          </div>

          {selectedConcession && (
            <div className="text-[11px] text-[#737785] p-2.5 bg-blue-50/50 rounded border border-blue-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1a5bce] shrink-0" />
              <span>
                Al registrar este pago, el estatus de <strong>{selectedConcession.name}</strong> cambiará automáticamente a <strong>Activa (Al Corriente)</strong>.
              </span>
            </div>
          )}

          {/* Actions */}
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#047857] hover:bg-[#065f46] text-white font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando...' : 'Confirmar y Aplicar Pago'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
