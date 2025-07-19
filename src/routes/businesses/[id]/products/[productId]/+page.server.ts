import { db } from "$lib/server/db";
import type { ProductCategory } from "$lib/types/product";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { id, productId } = params;

  const product = await db.query.product.findFirst({
    where: (product, { eq }) => eq(product.id, Number(productId)),
  })

  if (product === undefined) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  const expenses = await db.query.product_historical_data.findFirst({
    where: (data, { eq }) => eq(data.productId, Number(productId)),
    orderBy: (data, { desc }) => desc(data.timestamp),
    columns: {
      price: true,

      rawMaterialsCost: true,
      laborCost: true,
      overheadCost: true,
      marketingCost: true,
      distributionCost: true,

      availableStock: true,
    }
  });

  const rawMaterialsCost = expenses?.rawMaterialsCost ?? 0;
  const laborCost = expenses?.laborCost ?? 0;
  const overheadCost = expenses?.overheadCost ?? 0;
  const marketingCost = expenses?.marketingCost ?? 0;
  const distributionCost = expenses?.distributionCost ?? 0;

  const revenues = await db.query.product_historical_revenue.findMany({
    where: (revenue, { eq }) => eq(revenue.productId, Number(productId)),
    orderBy: (revenue, { desc }) => desc(revenue.timestamp),
    columns: {
      revenue: true,
      quantitySold: true,
      timestamp: true,
    },
    limit: 5,
  })

  const stats = await db.query.product_historical_stats.findFirst({
    where: (stats, { eq }) => eq(stats.productId, Number(productId)),
    orderBy: (stats, { desc }) => desc(stats.timestamp),
    columns: {
      packaging: true,
      quality: true,
      design: true,
      easeOfUse: true,
    }
  });

  return {
    id: Number(id),
    productId: Number(productId),
    product: {
      ...product,
      price: expenses?.price ?? 0,
      availableStock: expenses?.availableStock ?? 0,
      expenses: {
        rawMaterialsCost,
        laborCost,
        overheadCost,
        marketingCost,
        distributionCost,
        totalCost: rawMaterialsCost + laborCost + overheadCost + marketingCost + distributionCost
      },
      category: product.category as ProductCategory,
      revenues,
      stats,
    }
  }
}
