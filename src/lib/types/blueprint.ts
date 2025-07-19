export type BlueprintProps = {
  name: string;
  description: string;
  image: BlueprintImageType;

  expenses: {
    rawMaterials: number;
    labor: number;
    overhead: number;
  }

  price: number;

  initialInvestment: number;
};

export type BlueprintImageType =
  | { type: "image"; src: string; alt: string }
  | { type: "emoji"; emoji: string; }
