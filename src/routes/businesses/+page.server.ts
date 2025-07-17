import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import type { BusinessData } from '$lib/types/business';

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
    orderBy: (business, { desc }) => desc(business.createdAt),
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
