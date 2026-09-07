import { mysqlTable, serial, int, bigint, varchar, text, json, boolean, timestamp, date } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// ── 1. Admins ────────────────────────────────────────────────────────────────
export const admins = mysqlTable('admins', {
  admin_id: varchar('admin_id', { length: 64 }).primaryKey(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  phone_number: varchar('phone_number', { length: 150 }).notNull(),
  residency: varchar('residency', { length: 100 }).notNull(),
  password_hash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  gender: varchar('gender', { length: 20 }),
  photo: text('photo'),
  email_verified: boolean('email_verified').default(false),
  two_fa_enabled: boolean('two_fa_enabled').default(false),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 2. Admin Settings ────────────────────────────────────────────────────────
export const adminSettings = mysqlTable('admin_settings', {
  admin_id: varchar('admin_id', { length: 64 }).primaryKey(),
  theme: varchar('theme', { length: 20 }).default('light'),
  font_size: varchar('font_size', { length: 20 }).default('medium'),
  language: varchar('language', { length: 20 }).default('english'),
});

// ── 3. Activity Logs ─────────────────────────────────────────────────────────
export const activityLogs = mysqlTable('activity_logs', {
  id: serial('id').primaryKey(),
  admin_id: varchar('admin_id', { length: 64 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entity_type: varchar('entity_type', { length: 100 }).notNull(),
  entity_title: varchar('entity_title', { length: 255 }),
  username: varchar('username', { length: 100 }),
  details: json('details'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 4. Users ─────────────────────────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  password_hash: text('password_hash').notNull(),
  email_verified: boolean('email_verified').default(false),
  two_fa_enabled: boolean('two_fa_enabled').default(false),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 5. OTP Tokens ────────────────────────────────────────────────────────────
export const otpTokens = mysqlTable('otp_tokens', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 150 }).notNull(),
  token: varchar('token', { length: 100 }).notNull(),
  purpose: varchar('purpose', { length: 50 }).notNull(),
  entity_type: varchar('entity_type', { length: 50 }).notNull(),
  expires_at: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 6. Complaints ────────────────────────────────────────────────────────────
export const complaints = mysqlTable('complaints', {
  complaint_id: serial('complaint_id').primaryKey(),
  user_id: int('user_id'),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }),
  phone: varchar('phone', { length: 50 }),
  complainer_city: varchar('complainer_city', { length: 100 }),
  complainer_subcity: varchar('complainer_subcity', { length: 100 }),
  complainer_woreda: varchar('complainer_woreda', { length: 100 }),
  complainer_house_number: varchar('complainer_house_number', { length: 100 }),
  complaint_subcity: varchar('complaint_subcity', { length: 100 }),
  complaint_woreda: varchar('complaint_woreda', { length: 100 }),
  type: varchar('type', { length: 100 }),
  status: varchar('status', { length: 50 }).default('assigning'),
  description: text('description').notNull(),
  concerned_staff_member: varchar('concerned_staff_member', { length: 255 }),
  photos: json('photos'),
  videos: json('videos'),
  audios: json('audios'),
  estimated_resolution_timeframe: varchar('estimated_resolution_timeframe', { length: 100 }),
  estimated_resolution_date: date('estimated_resolution_date'),
  admin_response: text('admin_response'),
  admin_contact_phone: varchar('admin_contact_phone', { length: 100 }),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 7. Contacts ──────────────────────────────────────────────────────────────
export const contacts = mysqlTable('contacts', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  message: text('message').notNull(),
  photos: json('photos'),
  status: varchar('status', { length: 50 }).default('pending'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 8. News & News Translation ───────────────────────────────────────────────
export const news = mysqlTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  short_description: varchar('short_description', { length: 500 }),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  photo: json('photo'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const newsTranslation = mysqlTable('news_translation', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  news_id: int('news_id'),
  amh: json('amh'),
  orm: json('orm'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 9. Events & Events Translation ───────────────────────────────────────────
export const events = mysqlTable('events', {
  events_id: serial('events_id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }),
  start_date: date('start_date'),
  end_date: date('end_date'),
  status: varchar('status', { length: 50 }).default('upcoming'),
  photos: json('photos'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const eventsTranslation = mysqlTable('events_translation', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  event_id: int('event_id'),
  amh: json('amh'),
  orm: json('orm'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 10. Vacancies & Vacancy Translation ──────────────────────────────────────
export const vacancies = mysqlTable('vacancies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  short_description: varchar('short_description', { length: 500 }),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  salary: varchar('salary', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  skills: json('skills'),
  responsibilities: json('responsibilities'),
  qualifications: json('qualifications'),
  start_date: date('start_date'),
  end_date: date('end_date'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const vacancyTranslation = mysqlTable('vacancy_translation', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  vacancy_id: int('vacancy_id'),
  amh: json('amh'),
  orm: json('orm'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ── 11. Applicants ───────────────────────────────────────────────────────────
export const applicants = mysqlTable('applicants', {
  id: serial('id').primaryKey(),
  vacancy_id: int('vacancy_id').notNull(),
  user_id: int('user_id'),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }),
  phone: varchar('phone', { length: 50 }),
  cv_path: varchar('cv_path', { length: 255 }),
  status: varchar('status', { length: 50 }).default('submitted'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// ── 12. Service Satisfaction ─────────────────────────────────────────────────
export const serviceSatisfaction = mysqlTable('service_satisfaction', {
  id: serial('id').primaryKey(),
  gender: varchar('gender', { length: 20 }),
  age: varchar('age', { length: 20 }),
  marital_status: varchar('marital_status', { length: 50 }),
  education_level: varchar('education_level', { length: 100 }),
  employment_status: varchar('employment_status', { length: 100 }),
  district: varchar('district', { length: 100 }),
  visits: int('visits'),
  service_requested: json('service_requested'),
  q1: varchar('q1', { length: 50 }),
  q2: varchar('q2', { length: 50 }),
  q3: varchar('q3', { length: 50 }),
  q4: varchar('q4', { length: 50 }),
  q5: varchar('q5', { length: 50 }),
  q6: varchar('q6', { length: 50 }),
  q7: varchar('q7', { length: 50 }),
  q8: varchar('q8', { length: 50 }),
  q9: varchar('q9', { length: 50 }),
  q10: varchar('q10', { length: 50 }),
  q11: varchar('q11', { length: 50 }),
  additional_comments: text('additional_comments'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});
