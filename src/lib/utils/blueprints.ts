import type { BlueprintProps } from "$lib/types/blueprint";
import type { ProductCategory } from "$lib/types/product";


const blueprints: Record<ProductCategory, BlueprintProps[]> = {
  electronics: [
    {
      name: "Smartphone",
      description: "A high-end smartphone with a sleek design and powerful features.",
      image: { type: "emoji", emoji: "📱" },

      expenses: {
        rawMaterials: 200,
        labor: 50,
        overhead: 30,
      },

      price: 1000,
      initialInvestment: 50000,
    },
    {
      name: "Laptop",
      description: "A lightweight laptop perfect for work and play.",
      image: { type: "emoji", emoji: "💻" },

      expenses: {
        rawMaterials: 500,
        labor: 100,
        overhead: 70,
      },

      price: 1300,
      initialInvestment: 100000,
    }
  ],
  clothing: [],
  food: [],
  furniture: [],
  toys: [],
  books: [],
  healthcare: [],
  automotive: [],
  sports: [],
  other: []
}

export default blueprints;
