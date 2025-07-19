import { pgEnum, pgTable, serial, integer, text, timestamp, bigint } from 'drizzle-orm/pg-core';

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

export const historical_data = pgTable('historical_data', {
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
  'protective' // insurance
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
  'supplier',
  'distributor',
  'retailer',
  'loan_provider',
  'investor',
  'bank',
  'money_launderer',
  'employee',
  'competitor'
]);

export const npc_data = pgTable('npc_data', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),

  name: text('name').notNull(),

  feelings: integer('value').notNull(),

  type: npcType('type').notNull(),
  description: text('description'),
});

export const business = pgTable('business', {
  id: serial('id').primaryKey(),

  userBusinessId: integer('user_business_id').notNull(), // Unique ID for the business within the user's context

  userId: text('user_id').references(() => user.id),
  npcId: integer('npc_id').references(() => npc_data.id),  // in case of NPC-owned businesses

  name: text('name').notNull(),
  description: text('description'),

  sector: sector('sector').notNull(),
  credit_worthiness: integer('credit_worthiness').notNull().default(0), // 0-100 scale

  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const productCategory = pgEnum('product_category', [
  'electronics',
  'clothing',
  'food',
  'furniture',
  'toys',
  'books',
  'healthcare',
  'automotive',
  'sports',
  'other'
]);

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => business.id),

  name: text('name').notNull(),
  description: text('description'),

  category: productCategory('category').notNull(),

  price: integer('price').notNull(), // selling price

  rawMaterialsCost: integer('raw_materials_cost').notNull(),
  laborCost: integer('labor_cost').notNull(),
  overheadCost: integer('overhead_cost').notNull(),
  marketingCost: integer('marketing_cost').notNull(),
  distributionCost: integer('distribution_cost').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),

  availableStock: integer('available_stock').notNull(), // quantity available for sale
});

export const businessHistoricalDataType = pgEnum('business_historical_data_type', [
  'revenue',
  'profit',
  'expenses',
  'valuation'
]);

export const business_historical_data = pgTable('business_historical_data', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => business.id),

  type: businessHistoricalDataType('type').notNull(),
  value: bigint({ mode: 'bigint' }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => business.id),

  amount: integer('amount').notNull(),
  interestRate: integer('interest_rate').notNull(),
  termMonths: integer('term_months').notNull(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }).notNull(),

  description: text('description'),
});

export const loanPayments = pgTable('loan_payments', {
  id: serial('id').primaryKey(),
  loanId: integer('loan_id').notNull().references(() => loans.id),

  paymentDate: timestamp('payment_date', { withTimezone: true, mode: 'date' }).notNull(),
  amount: integer('amount').notNull(),
});

export const employee = pgTable('employee', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => business.id),

  name: text('name').notNull(),
  position: text('position').notNull(),
  salary: integer('salary').notNull(),
  hireDate: timestamp('hire_date', { withTimezone: true, mode: 'date' }).notNull(),

  performanceRating: integer('performance_rating').notNull().default(0),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type HistoricalData = typeof historical_data.$inferSelect;

export type Asset = typeof asset.$inferSelect;

export type NpcData = typeof npc_data.$inferSelect;

export type HistoricalDataType = typeof historicalDataType.enumValues;

export type AssetType = typeof assetType.enumValues;

export type Sector = typeof sector.enumValues;

export type NpcType = typeof npcType.enumValues;

export type Business = typeof business.$inferSelect;

export type ProductCategory = typeof productCategory.enumValues;

export type Product = typeof product.$inferSelect;

export type BusinessHistoricalDataType = typeof businessHistoricalDataType.enumValues;

export type BusinessHistoricalData = typeof business_historical_data.$inferSelect;

export type Loans = typeof loans.$inferSelect;

export type LoanPayments = typeof loanPayments.$inferSelect;

export type Employee = typeof employee.$inferSelect;

