import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import type { PopulatedProduct } from '$lib/types/product';

export const load: PageServerLoad = async ({ params }) => {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  const userId = locals.user.id;

  const user_data = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  const business = await db.query.business.findFirst({
    where: (business, { eq, and }) => and(eq(business.userId, userId), eq(business.userBusinessId, Number(params.id))),
  })

  let products = await db.query.product.findMany({
    where: (product, { eq }) => eq(product.businessId, business?.id || 0),
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
    business,
    products: populatedProducts
  };
}

