export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'furniture' | 'toys' | 'books' | 'healthcare' | 'automotive' | 'sports' | 'other';

export type PopulatedProduct = {
  id: number;
  businessId: number;
  name: string;
  description: string | null;
  category: ProductCategory;

  createdAt: Date;

  availableStock: number;

  expenses: {
    rawMaterialsCost: number;
    laborCost: number;
    overheadCost: number;
    marketingCost: number;
    distributionCost: number;
    totalCost: number; // sum of all costs
  };
};
