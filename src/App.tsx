import React, { useState } from 'react';
import { Concessionaire, KPIData } from './types/transit';
import { mockConcessions, mockKPIs } from './data/mockTransitData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { KpiMetrics } from './components/KpiMetrics';
import { DirectoryView } from './components/DirectoryView';
import { ClientDetailView } from './components/ClientDetailView';
import { PaymentModal } from './components/PaymentModal';
import { NewConcessionModal } from './components/NewConcessionModal';
import { ViewportBar, ViewportMode } from './components/ViewportBar';
import { 
  Bus, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Receipt, 
  BarChart3,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [concessions, setConcessions] = useState<Concessionaire[]>(mockConcessions);
  const [kpis, setKpis] = useState<KPIData>(mockKPIs);
  
  // Navigation & View States
  const [activeConcession, setActiveConcession] = useState<Concessionaire | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('directorio');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Viewport mode: 'responsive' | 'desktop' | 'mobile'
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');

  // Modals & Drawers
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetConcession, setPaymentTargetConcession] = useState<Concessionaire | null>(null);
  const [isNewConcessionModalOpen, setIsNewConcessionModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Select concession for Detail View
  const handleSelectConcession = (concession: Concessionaire) => {
    setActiveConcession(concession);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Directory
  const handleBackToDirectory = () => {
    setActiveConcession(null);
  };

  // Open Payment Modal
  const handleOpenPaymentModal = (concession?: Concessionaire) => {
    setPaymentTargetConcession(concession || activeConcession || concessions[0]);
    setIsPaymentModalOpen(true);
  };

  // Process Payment Success
  const handlePaymentSuccess = (concessionId: string, amount: number, method: string, folio: string) => {
    setConcessions((prev) =>
      prev.map((c) => {
        if (c.id === concessionId) {
          const newInvoice = {
            id: `inv-${Date.now()}`,
            folio: `CFDI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            period: 'Noviembre 2026',
            issueDate: new Date().toLocaleDateString('es-MX'),
            dueDate: '15/11/2026',
            paidDate: new Date().toLocaleDateString('es-MX'),
            amount: amount,
            paymentMethod: method,
            status: 'pagado' as const,
          };
          return {
            ...c,
            status: 'activa' as const,
            balanceDue: Math.max(0, c.balanceDue - amount),
            invoices: [newInvoice, ...c.invoices],
          };
        }
        return c;
      })
    );

    // Update active concession if viewing
    if (activeConcession && activeConcession.id === concessionId) {
      setActiveConcession((prev) =>
        prev
          ? {
              ...prev,
              status: 'activa',
              balanceDue: Math.max(0, prev.balanceDue - amount),
            }
          : null
      );
    }

    // Update KPIs
    setKpis((prev) => ({
      ...prev,
      monthlyRevenue: {
        ...prev.monthlyRevenue,
        totalMXN: prev.monthlyRevenue.totalMXN + amount,
        collectionRate: Math.min(100, Math.round(((prev.monthlyRevenue.totalMXN + amount) / prev.monthlyRevenue.projectedMXN) * 100)),
      },
      pendingCollections: {
        ...prev.pendingCollections,
        totalMXN: Math.max(0, prev.pendingCollections.totalMXN - amount),
        criticalCount: Math.max(0, prev.pendingCollections.criticalCount - 1),
      },
      activeConcessions: {
        ...prev.activeConcessions,
        activeCount: prev.activeConcessions.activeCount + 1,
        lateCount: Math.max(0, prev.activeConcessions.lateCount - 1),
      },
    }));

    showToast(`Pago de $${amount.toLocaleString('es-MX')} MXN registrado exitosamente (Folio: ${folio}).`);
  };

  // Add New Concession
  const handleAddConcession = (newConcession: Concessionaire) => {
    setConcessions((prev) => [newConcession, ...prev]);
    setKpis((prev) => ({
      ...prev,
      activeConcessions: {
        ...prev.activeConcessions,
        total: prev.activeConcessions.total + 1,
        activeCount: prev.activeConcessions.activeCount + 1,
      },
      fleetUnits: {
        ...prev.fleetUnits,
        total: prev.fleetUnits.total + newConcession.totalUnits,
        inRoute: prev.fleetUnits.inRoute + newConcession.activeUnits,
      },
    }));
    showToast(`Concesión "${newConcession.name}" dada de alta correctamente.`);
  };

  // Sample quick switch to Autotransportes Tuxpan-Barra
  const handleSelectSampleDetail = () => {
    const tuxpan = concessions.find((c) => c.name.includes('Tuxpan')) || concessions[0];
    handleSelectConcession(tuxpan);
  };

  // Handle Tab Change
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'directorio') {
      setActiveConcession(null);
    } else if (tab === 'flota') {
      // Focus on fleet
      if (!activeConcession) {
        handleSelectSampleDetail();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafe] text-[#0f172a] flex flex-col font-sans selection:bg-[#1a5bce]/20 selection:text-[#0044a6]">
      {/* Viewport & Prototype Navigation Bar */}
      <ViewportBar
        currentMode={viewportMode}
        onModeChange={setViewportMode}
        activeView={activeConcession ? 'detalle' : 'directorio'}
        concessionName={activeConcession?.name}
        onNavigateDirectorio={handleBackToDirectory}
        onNavigateDetalleSample={handleSelectSampleDetail}
      />

      {/* Main Container - Controlled by Viewport Mode */}
      <div className={`flex-1 flex justify-center w-full ${viewportMode === 'mobile' ? 'py-4 sm:py-8 bg-slate-900/90' : ''}`}>
        <div
          className={`flex w-full transition-all duration-300 ${
            viewportMode === 'desktop'
              ? 'max-w-[1440px] shadow-2xl bg-[#f8fafe]'
              : viewportMode === 'mobile'
              ? 'max-w-[390px] min-h-[844px] rounded-[36px] overflow-hidden border-[8px] border-slate-800 shadow-2xl bg-[#f8fafe] relative my-auto'
              : 'w-full'
          }`}
        >
          {/* Desktop Left Sidebar (Hidden if forced mobile mode) */}
          {viewportMode !== 'mobile' && (
            <div className="hidden lg:block">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={handleSelectTab}
                onResetToDirectory={handleBackToDirectory}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
            {/* Top Header */}
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenNewConcessionModal={() => setIsNewConcessionModalOpen(true)}
              onOpenPaymentModal={() => handleOpenPaymentModal()}
              onOpenMobileMenu={() => setMobileDrawerOpen(true)}
              activeViewTitle={activeConcession ? activeConcession.name : 'Directorio'}
            />

            {/* Scrollable Page Body */}
            <main className="flex-1 p-3.5 sm:p-6 max-w-7xl w-full mx-auto">
              {/* If on General Dashboard / Directory */}
              {!activeConcession ? (
                <>
                  {/* KPI Metric Cards */}
                  <KpiMetrics
                    kpis={kpis}
                    onFilterByStatus={(status) => setStatusFilter(status)}
                  />

                  {/* Main Concessions Directory (Table on Desktop, Cards on Mobile) */}
                  <DirectoryView
                    concessions={concessions}
                    onSelectConcession={handleSelectConcession}
                    onOpenPaymentModal={(c) => handleOpenPaymentModal(c)}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    searchQuery={searchQuery}
                  />
                </>
              ) : (
                /* Client Detail View (Autotransportes Tuxpan-Barra / Selected Concession) */
                <ClientDetailView
                  concession={activeConcession}
                  onBack={handleBackToDirectory}
                  onOpenPaymentModal={(c) => handleOpenPaymentModal(c)}
                />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenNewModal={() => setIsNewConcessionModalOpen(true)}
        isDetailActive={!!activeConcession}
        onBackToDirectory={handleBackToDirectory}
      />

      {/* Mobile Drawer (Menu Lateral en Celular) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a111a]/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full shadow-2xl p-5 flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-[#1a5bce] text-white flex items-center justify-center font-bold text-sm">
                  <Bus className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-[#0a111a]">RutaFácil</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2 flex-1 overflow-y-auto text-xs font-semibold">
              <button
                onClick={() => {
                  handleBackToDirectory();
                  setCurrentTab('directorio');
                  setMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between ${
                  !activeConcession ? 'bg-[#eff4ff] text-[#1a5bce]' : 'text-[#434653]'
                }`}
              >
                <span>Directorio General</span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{concessions.length}</span>
              </button>

              <button
                onClick={() => {
                  handleSelectSampleDetail();
                  setMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between ${
                  activeConcession ? 'bg-[#eff4ff] text-[#1a5bce]' : 'text-[#434653]'
                }`}
              >
                <span>Autotransportes Tuxpan-Barra</span>
                <span className="text-[10px] text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-full font-bold">Activa</span>
              </button>

              <button
                onClick={() => {
                  setStatusFilter('pago_atrasado');
                  handleBackToDirectory();
                  setMobileDrawerOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between text-[#b91c1c] hover:bg-red-50"
              >
                <span>Concesiones en Mora</span>
                <span className="text-[10px] bg-[#fef2f2] text-[#b91c1c] px-2 py-0.5 rounded-full font-bold border border-[#fecaca]">
                  7
                </span>
              </button>

              <div className="pt-4 border-t border-[#f1f5f9]">
                <button
                  onClick={() => {
                    setIsNewConcessionModalOpen(true);
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full py-2 px-3 bg-[#1a5bce] text-white text-xs font-semibold rounded-md shadow-xs text-center"
                >
                  + Nueva Concesión
                </button>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-4 border-t border-[#f1f5f9] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Lic. Carlos Mendoza"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0a111a] truncate">Lic. Carlos Mendoza</p>
                <p className="text-[10px] text-[#737785]">SCT Veracruz</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Registration Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        concessions={concessions}
        defaultConcession={paymentTargetConcession}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* New Concession Registration Modal */}
      <NewConcessionModal
        isOpen={isNewConcessionModalOpen}
        onClose={() => setIsNewConcessionModalOpen(false)}
        onAddConcession={handleAddConcession}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#0a111a] text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span className="font-medium">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
