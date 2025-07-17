import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestEvent } from '$app/server';

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
      id: false,
      userId: false,
    }
  });

  return {
    user: {
      id: user_data?.id,
    },
    businesses,
  };
}

