export type BusinessData = {
  name: string;
  createdAt: Date;
  sector: 'technology' | 'healthcare' | 'finance' | 'consumer_discretionary' | 'consumer_staples' | 'energy' | 'utilities' | 'materials' | 'industrials' | 'real_estate' | 'telecommunications' | 'other';
  revenue: Array<{
    value: bigint;
    timestamp: Date;
  }>;
  sectorRevenue: bigint | null;
};
