//@ts-nocheck
import { drizzle } from 'drizzle-orm/neon-http';
// import { drizzle } from 'drizzle-orm/node-postgres';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env' }); // or .env.local

const sql = neon(
  // process.env.NODE_ENV === 'development'
  //   ? process.env.DATABASE_URL_DEV
  //   : process.env.DATABASE_URL_PROD
  'postgresql://mechalink_owner:gcY6DhXvK0Qx@ep-holy-meadow-a5vnosnq.us-east-2.aws.neon.tech/mechalink?sslmode=require'

  // 'postgresql://mechalink_owner:gcY6DhXvK0Qx@ep-holy-meadow-a5vnosnq.us-east-2.aws.neon.tech/mechalink?sslmode=require'
);
export const db = drizzle(sql);

// const db = drizzle('postgres://default:CK3LWXf4iyoY@ep-tight-mode-66645246-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require');
