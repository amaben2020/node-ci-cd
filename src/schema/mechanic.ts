import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
  text,
} from 'drizzle-orm/pg-core';

import { jobRequests } from './jobRequest.js';
import { MechanicStatuses } from '../../constants/constants.js';
import { usersTable } from './user.js';
import { z } from 'zod';
import { jobs } from './job.js';

// export const mobileOsEnum = pgEnum('mobile_app_os', ['ios', 'android']);
function extractValuesAsTuple<T extends Record<string, unknown>>(
  obj: T
): [T[keyof T], ...T[keyof T][]] {
  const values = Object.values(obj) as T[keyof T][];
  if (values.length === 0)
    throw new Error('Object must have at least one value.');

  // Explicitly extract the first value
  const result: [T[keyof T], ...T[keyof T][]] = [values[0], ...values.slice(1)];

  return result;
}
export function enumFromConst<T extends Record<string, string>>(obj: T) {
  const values = extractValuesAsTuple(obj);
  return z.enum(values);
}
export const AccountType = {
  CUSTOMER: 'CUSTOMER', // for companies
  PROVIDER: 'PROVIDER', // for individual provider
  SHOP: 'SHOP', // for provider shops
  SYSTEM: 'SYSTEM', // for agents
} as const;

export const mechanics = pgTable('mechanics', {
  id: serial('id').primaryKey(),
  created_by: varchar('created_by', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_by: varchar('updated_by', { length: 256 }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  userId: integer('user_id').references(() => usersTable.id),
  arrivalRate: integer('arrival_rate'),
  jobCount: integer('jobCount'),
  status: varchar('status', {
    enum: Object.values(MechanicStatuses) as [string],
    length: 256,
  }),
  lastKnownLocationTimestamp: timestamp('last_known_location_timestamp', {}),
  // mobileAppOs: mobileOsEnum('mobile_app_os'),
  type: text('type', { enum: enumFromConst(AccountType).options }).notNull(),
});

// one job can have one mechanic but one mechanic can have many jobs
export const mechanicRelations = relations(mechanics, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [mechanics.userId],
    references: [usersTable.id],
  }),
  jobs: many(jobs),
  jobRequests: many(jobRequests),
}));
