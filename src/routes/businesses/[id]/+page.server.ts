import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import type { PopulatedProduct, ProductCategory } from '$lib/types/product';
import blueprints from '$lib/utils/blueprints';
import { historical_data, product, product_historical_data } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

  let populatedProducts: PopulatedProduct[] = await Promise.all(products.map(async (product) => {
    const productData = await db.query.product_historical_data.findFirst({
      where: (data, { eq }) => eq(data.productId, product.id),
      orderBy: (data, { desc }) => desc(data.timestamp),
      columns: {
        rawMaterialsCost: true,
        laborCost: true,
        overheadCost: true,
        marketingCost: true,
        distributionCost: true,
        price: true,
        availableStock: true,
      }
    })

    const expenses = {
      rawMaterialsCost: productData?.rawMaterialsCost || 0,
      laborCost: productData?.laborCost || 0,
      overheadCost: productData?.overheadCost || 0,
      marketingCost: productData?.marketingCost || 0,
      distributionCost: productData?.distributionCost || 0,
      totalCost: (productData?.rawMaterialsCost || 0) +
        (productData?.laborCost || 0) +
        (productData?.overheadCost || 0) +
        (productData?.marketingCost || 0) +
        (productData?.distributionCost || 0),
    };

    const availableStock = productData?.availableStock || 0;
    const price = productData?.price || 0;

    return {
      ...product,
      availableStock,
      expenses: {
        ...expenses,
        totalCost: expenses.totalCost
      },
      price,

    } as PopulatedProduct;
  }));

  console.log('Populated Products:', populatedProducts);

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
  default: async ({ request, locals }: { request: Request, locals: any }) => {
    const formData = await request.formData();

    const name = formData.get('product_name') as string;
    const category = formData.get('product_category') as ProductCategory;

    const blueprint = formData.get('blueprint') as string;

    const blueprintData = blueprints[category].find(bp => bp.name === blueprint);

    const businessId = formData.get('business_id')?.valueOf() as number;

    const liquidCash = await db.query.historical_data.findFirst({
      where: (data, { eq, and }) => and(eq(locals.user.id, data.userId), eq(data.type, 'liquid_cash')),
      orderBy: (data, { desc }) => desc(data.timestamp),
    })

    if ((liquidCash?.value || -1) < (blueprintData?.initialInvestment || 0)) {
      return fail(400, {
        error: 'You do not have enough liquid cash to create this product.',
      })
    }

    await db.insert(historical_data).values({
      userId: locals.user.id,
      type: 'liquid_cash',
      value: (liquidCash?.value || 0) - (blueprintData?.initialInvestment || 0),
      timestamp: new Date(),
    });

    const createdProduct = await db.insert(product).values({
      businessId,
      name,
      description: blueprintData?.description || '',
      category,
    }).returning({ insertedId: product.id });

    const createdProductId = createdProduct[0].insertedId;
    console.log('blueprintData:', blueprintData);

    await db.insert(product_historical_data).values({
      productId: createdProductId,
      price: blueprintData?.price || 0,
      rawMaterialsCost: blueprintData?.expenses?.rawMaterials || 0,
      laborCost: blueprintData?.expenses?.labor || 0,
      overheadCost: blueprintData?.expenses?.overhead || 0,
      marketingCost: 0,
      distributionCost: 0,
      availableStock: 0,

      timestamp: new Date(),
    });
  }
};
