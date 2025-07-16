import { pgEnum, pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const historicalDataType = pgEnum('historical_data_type', [
  'net_worth',
  'liquid_cash',
  'debt',
  'asset_value',
  'asset_quantity'
]);

export const historicalData = pgTable('historicalData', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),

  type: historicalDataType('type').notNull(),
  value: integer('value').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const assetType = pgEnum('asset_type', [
  'physical',
  'liquid',
  'investment',
  'informal',
  'protective'
]);

export const sector = pgEnum('sector', [
  'technology',
  'healthcare',
  'finance',
  'consumer_discretionary',
  'consumer_staples',
  'energy',
  'utilities',
  'materials',
  'industrials',
  'real_estate',
  'telecommunications',
  'other'
])

export const asset = pgTable('asset', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  name: text('name').notNull(),

  value: integer('value').notNull(),
  quantity: integer('quantity').notNull(),

  type: assetType('type').notNull(),
  acquiredAt: timestamp('acquired_at', { withTimezone: true, mode: 'date' }).notNull(),
  valueAtAcquisition: integer('value_at_acquisition').notNull(),

  data: text('data'), // JSON or other metadata about the asset
  sector: sector('sector'),
});

export const npcType = pgEnum('npc_type', [
  'friend',
  'enemy',
  'neutral',
  'ally',
  'rival'
]);

export const npcData = pgTable('npcData', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),

  name: text('name').notNull(),
  value: integer('value').notNull(),

  type: npcType('type').notNull(),
  description: text('description'),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type HistoricalData = typeof historicalData.$inferSelect;

export type Asset = typeof asset.$inferSelect;

export type NpcData = typeof npcData.$inferSelect;

export type HistoricalDataType = typeof historicalDataType.enumValues;

export type AssetType = typeof assetType.enumValues;

export type Sector = typeof sector.enumValues;

export type NpcType = typeof npcType.enumValues;


