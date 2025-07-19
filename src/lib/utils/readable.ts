import type { BusinessSector } from "$lib/types/business";

export function convert_to_readable(num: bigint, precision: number = 1): string {
  const numFloat = Number(num);

  if (num >= 1e7) {
    return (numFloat / 1e7).toFixed(precision) + ' Cr';
  } else if (num >= 1e5) {
    return (numFloat / 1e5).toFixed(precision) + ' L';
  } else if (num >= 1e3) {
    return (numFloat / 1e3).toFixed(precision) + ' K';
  }
  return num.toString();
}

export function convert_to_readable_float(num: number, precision: number = 1): string {
  if (num >= 1e7) {
    return (num / 1e7).toFixed(precision) + ' Cr';
  } else if (num >= 1e5) {
    return (num / 1e5).toFixed(precision) + ' L';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(precision) + ' K';
  }
  return num.toString();
}

const EXPENSES: Record<string, string> = {
  rawMaterialsCost: 'Raw Materials',
  laborCost: 'Labor',
  overheadCost: 'Overhead',
  marketingCost: 'Marketing',
  distributionCost: 'Distribution',
}

export function readableExpense(name: string): string {
  return EXPENSES[name] || name.replace(/([A-Z])/g, ' $1').trim();
}

export function readableSector(sector: BusinessSector): string {
  const SECTOR_NAMES: Record<BusinessSector, string> = {
    technology: 'Technology',
    healthcare: 'Healthcare',
    finance: 'Finance',
    consumer_discretionary: 'Consumer Discretionary',
    consumer_staples: 'Consumer Staples',
    energy: 'Energy',
    utilities: 'Utilities',
    materials: 'Materials',
    industrials: 'Industrials',
    real_estate: 'Real Estate',
    telecommunications: 'Telecommunications',
    other: 'Other'
  };

  return SECTOR_NAMES[sector] || sector.charAt(0).toUpperCase() + sector.slice(1).replace(/_/g, ' ');
}
