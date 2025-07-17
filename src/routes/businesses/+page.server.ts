import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import type { BusinessData, BusinessSector } from '$lib/types/business';
import { business } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  const userId = locals.user.id;

  const user_data = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  const businesses = await db.query.business.findMany({
    where: (business, { eq }) => eq(business.userId, userId),
    orderBy: (business, { asc }) => asc(business.userBusinessId),
    columns: {
      userId: false,
    }
  });

  const businessesWithData: BusinessData[] = await Promise.all(businesses.map(async (business) => ({
    ...business,
    revenue: await db.query.business_historical_data.findMany({
      where: (data, { eq, and }) => and(eq(data.type, 'revenue'), eq(data.businessId, business.id)),
      orderBy: (data, { desc }) => desc(data.timestamp),
      columns: {
        id: false,
        businessId: false,
        type: false,
      }
    }),
    sectorRevenue: null,
  })));

  let seen_sectors: Record<string, bigint> = {};

  for (const business of businessesWithData) {
    if (business.sector && !seen_sectors[business.sector]) {
      const businessesInSector = await db.query.business.findMany({
        where: (b, { eq }) => eq(b.sector, business.sector),
        orderBy: (b, { desc }) => desc(b.createdAt),
      });

      let totalRevenue = 0n;

      for (const business of businessesInSector) {
        const revenueData = await db.query.business_historical_data.findFirst({
          where: (data, { eq, and }) => and(eq(data.type, 'revenue'), eq(data.businessId, business.id)),
          orderBy: (data, { desc }) => desc(data.timestamp),
          columns: {
            id: false,
            businessId: false,
            type: false,
          }
        });

        totalRevenue += revenueData?.value ?? 0n;
      }

      seen_sectors[business.sector] = totalRevenue;
      business.sectorRevenue = totalRevenue;
    } else {
      business.sectorRevenue = seen_sectors[business.sector] || null;
    }
  }

  console.dir(businessesWithData, { depth: null });

  return {
    user: {
      id: user_data?.id,
    },
    businesses: businessesWithData,
  };
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    console.log('Action triggered');

    if (!locals.user) {
      throw redirect(302, '/auth/login');
    }

    const formData = await request.formData();

    const name = formData.get('name')?.toString() || '';
    const sector = formData.get('sector')?.toString() || '';

    const userBusinessId: number = (Number(formData.get('business_id')) || 0) + 1;

    formData.forEach((value, key) => {
      console.log(`Form Data - Key: ${key}, Value: ${value}`);
    });

    if (!userBusinessId) {
      return { error: 'Business ID is required.' };
    }

    if (!name) {
      return { error: 'Business name is required.' };
    }

    if (!sector || !['technology', 'healthcare', 'finance', 'consumer_discretionary', 'consumer_staples', 'energy', 'utilities', 'materials', 'industrials', 'real_estate', 'telecommunications', 'other'].includes(sector)) {
      return { error: 'Invalid or missing business sector.' };
    }

    const newBusiness = await db.insert(business).values({
      userId: locals.user.id,
      userBusinessId,
      name,
      sector: sector as BusinessSector,
    });

    return { success: true, business: newBusiness };
  }
}
