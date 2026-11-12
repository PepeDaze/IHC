export type ConcessionStatus = 'activa' | 'por_vencer' | 'pago_atrasado' | 'suspendida';

export type PaymentStatus = 'pagado' | 'por_vencer' | 'no_pagado';

export interface FleetUnit {
  id: string;
  economicNumber: string; // e.g. "ECO-01"
  plateNumber: string;    // e.g. "A-84920-X"
  model: string;          // e.g. "Mercedes-Benz Boxer 2023"
  driver: string;
  driverPhone: string;
  driverLicense: string;
  capacity: number;       // passenger capacity e.g. 41
  gpsStatus: 'online' | 'offline' | 'alerta';
  operationalStatus: 'en_ruta' | 'en_mantenimiento' | 'fuera_servicio';
  lastPing: string;
  currentSpeed?: number;
  routeAssigned: string;
}

export interface InvoiceRecord {
  id: string;
  folio: string;          // e.g. "CFDI-2024-8901"
  period: string;         // e.g. "Octubre 2026"
  issueDate: string;      // e.g. "01/10/2026"
  dueDate: string;        // e.g. "15/10/2026"
  paidDate?: string;      // e.g. "10/10/2026"
  amount: number;         // e.g. 28500
  paymentMethod: string;  // "Transferencia SPEI" | "Domiciliación BBVA"
  status: PaymentStatus;
  pdfUrl?: string;
  xmlUrl?: string;
}

export interface Concessionaire {
  id: string;
  concessionCode: string; // e.g. "CON-VER-2024-089"
  name: string;           // "Autotransportes Tuxpan-Barra S.A. de C.V."
  commercialName: string; // "Ruta Tuxpan-Barra Express"
  rfc: string;            // "ATB-850412-KP3"
  legalRepresentative: string; // "Don Roberto Morales Vega"
  representativePhone: string;
  representativeEmail: string;
  fiscalAddress: string;
  municipality: string;   // "Tuxpan"
  state: string;          // "Veracruz"
  status: ConcessionStatus;
  
  // Subscription Info
  planName: string;       // "Flota Integral Pro"
  planMonthlyFee: number; // 28500
  billingCycleDay: number;// 15 (corte cada día 15)
  cycleCurrentDay: number;// 22
  cycleTotalDays: number; // 30
  nextBillingDate: string;// "15 Nov 2026"
  paymentMethod: string;  // "BBVA Domiciliación (Clabe terminación ••4901)"
  balanceDue: number;     // 0 or debt amount

  // Fleet & Operations
  totalUnits: number;
  activeUnits: number;
  maintenanceUnits: number;
  outOfServiceUnits: number;
  routes: string[];       // ["Ruta 04: Centro - Barra Norte", "Ruta 12: Terminal Portuaria"]
  primaryBusPhoto: string;
  units: FleetUnit[];
  invoices: InvoiceRecord[];
  notes?: string;
}

export interface KPIData {
  activeConcessions: {
    total: number;
    trendPercentage: number;
    trendPositive: boolean;
    activeCount: number;
    warningCount: number;
    lateCount: number;
  };
  fleetUnits: {
    total: number;
    inRoute: number;
    maintenance: number;
    outOfService: number;
    utilizationRate: number;
  };
  monthlyRevenue: {
    totalMXN: number;
    projectedMXN: number;
    trendPercentage: number;
    collectionRate: number; // e.g. 88.4%
  };
  pendingCollections: {
    totalMXN: number;
    concessionsCount: number;
    criticalCount: number;
  };
}
