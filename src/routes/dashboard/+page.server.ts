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

  const historicalNetWorth = await db.query.historicalData.findMany({
    where: (historicalData, { eq, and }) => and(eq(historicalData.userId, userId), eq(historicalData.type, 'net_worth')),
    orderBy: (historicalData, { desc }) => desc(historicalData.timestamp),
  });

  const historicalLiquidCash = await db.query.historicalData.findMany({
    where: (historicalData, { eq, and }) => and(eq(historicalData.userId, userId), eq(historicalData.type, 'liquid_cash')),
    orderBy: (historicalData, { desc }) => desc(historicalData.timestamp),
  });

  const historicalDebt = await db.query.historicalData.findMany({
    where: (historicalData, { eq, and }) => and(eq(historicalData.userId, userId), eq(historicalData.type, 'debt')),
    orderBy: (historicalData, { desc }) => desc(historicalData.timestamp),
  });

  const assetData = await db.query.asset.findMany({
    where: (asset, { eq }) => eq(asset.userId, userId),
    orderBy: (asset, { desc }) => desc(asset.acquiredAt),
  });

  const npcData = await db.query.npcData.findMany({
    where: (npc, { eq }) => eq(npc.userId, userId),
  });

  return {
    user: {
      id: user_data?.id,
      netWorth: historicalNetWorth[0].value,
      liquidCash: historicalLiquidCash[0].value,
      debt: historicalDebt[0].value || 0,
    },
    historicalData: {
      netWorth: historicalNetWorth,
      liquidCash: historicalLiquidCash,
      debt: historicalDebt
    },
    assetData: assetData,
    npcData: npcData
  };
}
