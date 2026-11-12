import React from 'react';
import { ConcessionStatus, PaymentStatus } from '../types/transit';
import { CheckCircle2, Clock, AlertCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: ConcessionStatus | PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  let label = '';
  let colorClasses = '';
  let IconComponent = CheckCircle2;

  switch (status) {
    case 'activa':
      label = 'Activa';
      colorClasses = 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]';
      IconComponent = CheckCircle2;
      break;
    case 'pagado':
      label = 'Pagado';
      colorClasses = 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]';
      IconComponent = CheckCircle2;
      break;
    case 'por_vencer':
      label = 'Por Vencer';
      colorClasses = 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]';
      IconComponent = Clock;
      break;
    case 'pago_atrasado':
      label = 'Pago Atrasado';
      colorClasses = 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]';
      IconComponent = AlertCircle;
      break;
    case 'no_pagado':
      label = 'No Pagado';
      colorClasses = 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]';
      IconComponent = AlertCircle;
      break;
    case 'suspendida':
      label = 'Suspendida';
      colorClasses = 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]';
      IconComponent = AlertTriangle;
      break;
    default:
      label = status;
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      IconComponent = CheckCircle2;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-semibold tracking-wide',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colorClasses} ${sizeClasses} ${className}`}
    >
      <IconComponent className={`${iconSizes} shrink-0 stroke-[2.2]`} />
      <span>{label}</span>
    </span>
  );
};
