export type BusinessSector = 'technology' | 'healthcare' | 'finance' | 'consumer_discretionary' | 'consumer_staples' | 'energy' | 'utilities' | 'materials' | 'industrials' | 'real_estate' | 'telecommunications' | 'other';

export type BusinessData = {
  name: string;
  createdAt: Date;
  sector: BusinessSector;
  revenue: Array<{
    value: bigint;
    timestamp: Date;
  }>;
  sectorRevenue: bigint | null;
};
