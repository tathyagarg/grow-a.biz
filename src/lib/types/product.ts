export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'furniture' | 'toys' | 'books' | 'healthcare' | 'automotive' | 'sports' | 'other';

export type PopulatedProduct = {
  id: number;
  businessId: number;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number; // selling price
  rawMaterialsCost: number;
  laborCost: number;
  overheadCost: number;
  marketingCost: number;
  distributionCost: number;
  createdAt: Date;
  availableStock: number; // quantity available for sale
  expenses: {
    rawMaterialsCost: number;
    laborCost: number;
    overheadCost: number;
    marketingCost: number;
    distributionCost: number;
    totalCost: number; // sum of all costs
  };
};
