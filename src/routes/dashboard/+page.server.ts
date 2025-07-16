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

  const historicalNetWorth = await db.query.historical_data.findMany({
    where: (historical_data, { eq, and }) => and(eq(historical_data.userId, userId), eq(historical_data.type, 'net_worth')),
    orderBy: (historical_data, { desc }) => desc(historical_data.timestamp),
    columns: {
      id: false,
      userId: false,
      type: false,
    }
  });

  const historicalLiquidCash = await db.query.historical_data.findMany({
    where: (historical_data, { eq, and }) => and(eq(historical_data.userId, userId), eq(historical_data.type, 'liquid_cash')),
    orderBy: (historical_data, { desc }) => desc(historical_data.timestamp),
    columns: {
      id: false,
      userId: false,
      type: false,
    }
  });

  const historicalDebt = await db.query.historical_data.findMany({
    where: (historical_data, { eq, and }) => and(eq(historical_data.userId, userId), eq(historical_data.type, 'debt')),
    orderBy: (historical_data, { desc }) => desc(historical_data.timestamp),
    columns: {
      id: false,
      userId: false,
      type: false,
    }
  });

  const assetData = await db.query.asset.findMany({
    where: (asset, { eq }) => eq(asset.userId, userId),
    orderBy: (asset, { desc }) => desc(asset.acquiredAt),
    columns: {
      id: false,
      userId: false,
    }
  });

  const npc_data = await db.query.npc_data.findMany({
    where: (npc, { eq }) => eq(npc.userId, userId),
    columns: {
      id: false,
      userId: false,
      description: false,
    }
  });

  return {
    user: {
      id: user_data?.id,
      netWorth: historicalNetWorth[0] ? historicalNetWorth[0].value : 0,
      liquidCash: historicalLiquidCash[0] ? historicalLiquidCash[0].value : 0,
      debt: historicalDebt[0] ? historicalDebt[0].value : 0,
    },
    historicalData: {
      netWorth: historicalNetWorth,
      liquidCash: historicalLiquidCash,
      debt: historicalDebt
    },
    assets: assetData,
    npcData: npc_data
  };
}
