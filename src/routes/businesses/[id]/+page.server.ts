import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import type { PopulatedProduct, ProductCategory } from '$lib/types/product';
import blueprints from '$lib/utils/blueprints';
import { product } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  const userId = locals.user.id;

  const user_data = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  const thisBusiness = await db.query.business.findFirst({
    where: (business, { eq, and }) => and(eq(business.userId, userId), eq(business.userBusinessId, Number(params.id))),
  })

  const populatedBusiness = {
    ...thisBusiness,
    revenue: await db.query.business_historical_data.findFirst({
      where: (data, { eq, and }) => and(eq(data.businessId, thisBusiness?.id || 0), eq(data.type, 'revenue')),
      orderBy: (data, { desc }) => desc(data.timestamp),
    })
  }

  const competitorBusinesses = await db.query.business.findMany({
    where: (business, { isNotNull, eq, and }) => and(isNotNull(business.npcId), eq(business.sector, thisBusiness?.sector || 'other')),
  });

  const populatedCompetitorBusinesses = await Promise.all(competitorBusinesses.map(async (competitor) => ({
    ...competitor,
    revenue: await db.query.business_historical_data.findFirst({
      where: (data, { eq, and }) => and(eq(data.businessId, competitor.id), eq(data.type, 'revenue')),
      orderBy: (data, { desc }) => desc(data.timestamp),
    }),
    products: await db.query.product.findMany({
      where: (product, { eq }) => eq(product.businessId, competitor.id),
      orderBy: (product, { desc }) => desc(product.createdAt),
    })
  })));

  let products = await db.query.product.findMany({
    where: (product, { eq }) => eq(product.businessId, thisBusiness?.id || 0),
  });

  let populatedProducts: PopulatedProduct[] = products.map(product => ({
    ...product,
    expenses: {
      rawMaterialsCost: product.rawMaterialsCost,
      laborCost: product.laborCost,
      overheadCost: product.overheadCost,
      marketingCost: product.marketingCost,
      distributionCost: product.distributionCost,
      totalCost: product.rawMaterialsCost + product.laborCost + product.overheadCost + product.marketingCost + product.distributionCost
    }
  }))

  return {
    user: {
      id: user_data?.id,
    },
    business: populatedBusiness,
    competitorBusinesses: populatedCompetitorBusinesses,
    products: populatedProducts
  };
}

export const actions: Actions = {
  default: async ({ request }: { request: Request }) => {
    const formData = await request.formData();

    const name = formData.get('product_name') as string;
    const category = formData.get('product_category') as ProductCategory;

    const blueprint = formData.get('blueprint') as string;

    const blueprintData = blueprints[category].find(bp => bp.name === blueprint);

    const businessId = formData.get('business_id')?.valueOf() as number;

    await db.insert(product).values({
      businessId,
      name: blueprintData?.name || name,
      description: blueprintData?.description || '',
      category,
      price: blueprintData?.price || 0,
      rawMaterialsCost: blueprintData?.expenses.rawMaterials || 0,
      laborCost: blueprintData?.expenses.labor || 0,
      overheadCost: blueprintData?.expenses.overhead || 0,
      marketingCost: 0,
      distributionCost: 0,
      availableStock: 0,
    })
  }
};
