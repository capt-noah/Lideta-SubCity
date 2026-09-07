import pkg from 'pg'
const { Pool } = pkg

import postgres from 'postgres'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

dotenv.config()

let pool;
let isMock = false;

import { pool as mysqlRawPool } from '../db/index.js'
import { createMysqlPoolAdapter } from './mysqlAdapter.js'

// Pre-hash password for development mode
const DEV_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);

try {
  if (mysqlRawPool) {
    pool = createMysqlPoolAdapter(mysqlRawPool);
    console.log('[db] Connected to real MySQL database');
  } else if (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))) {
    pool = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      prepare: false
    });
    console.log('[db] Connected to real PostgreSQL database');
  } else {
    throw new Error('No database connection available');
  }
} catch (err) {
  console.warn('[db] Database connection failed. Using in-memory SQL database mock fallback:', err.message);
  isMock = true;
  pool = createMockPool();
}

function createMockPool() {
  // Initialize in-memory tables
  const tables = {
    admins: [
      {
        admin_id: 'superadmin1',
        first_name: 'Lideta',
        last_name: 'Super',
        username: 'superadmin',
        gender: 'Male',
        email: 'superadmin@lideta.gov',
        phone_number: '0911223344',
        residency: 'Lideta',
        password_hash: DEV_PASSWORD_HASH,
        role: 'superadmin',
        created_at: new Date()
      },
      {
        admin_id: 'admin1',
        first_name: 'Lideta',
        last_name: 'Admin',
        username: 'admin',
        gender: 'Male',
        email: 'admin@lideta.gov',
        phone_number: '0922334455',
        residency: 'Lideta',
        password_hash: DEV_PASSWORD_HASH,
        role: 'admin',
        created_at: new Date()
      },
      {
        admin_id: 'news1',
        first_name: 'News',
        last_name: 'Manager',
        username: 'news_admin',
        gender: 'Female',
        email: 'news@lideta.gov',
        phone_number: '0933445566',
        residency: 'Lideta',
        password_hash: DEV_PASSWORD_HASH,
        role: 'news_admin',
        created_at: new Date()
      },
      {
        admin_id: 'event1',
        first_name: 'Event',
        last_name: 'Manager',
        username: 'event_admin',
        gender: 'Male',
        email: 'event@lideta.gov',
        phone_number: '0944556677',
        residency: 'Lideta',
        password_hash: DEV_PASSWORD_HASH,
        role: 'event_admin',
        created_at: new Date()
      },
      {
        admin_id: 'complaint1',
        first_name: 'Complaint',
        last_name: 'Manager',
        username: 'complaint_admin',
        gender: 'Female',
        email: 'complaint@lideta.gov',
        phone_number: '0955667788',
        residency: 'Lideta',
        password_hash: DEV_PASSWORD_HASH,
        role: 'complaint_admin',
        created_at: new Date()
      },
      {
        admin_id: 'vacancy1',
        first_name: 'Vacancy',
        last_name: 'Manager',
        username: 'vacancy_admin',
        gender: 'Male',
        email: 'vacancy@lideta.gov',
        phone_number: '0966778899',
        residency: 'Lideta',
        password_hash: DEV_PASSWORD_HASH,
        role: 'vacancy_admin',
        created_at: new Date()
      }
    ],
    admin_settings: [],
    users: [],
    news: [],
    news_translation: [],
    events: [],
    events_translation: [],
    vacancies: [],
    vacancy_translation: [],
    applicants: [],
    complaints: [
      {
        complaint_id: 101,
        id: 101,
        user_id: 1,
        first_name: 'Abebe',
        last_name: 'Bikila',
        email: 'user@lideta.gov',
        phone: '+251 911 223344',
        complainer_city: 'Addis Ababa',
        complainer_subcity: 'Lideta',
        complainer_woreda: '04',
        complainer_house_number: '512',
        complaint_subcity: 'Lideta',
        complaint_woreda: '04',
        type: 'Water Supply Bureau',
        status: 'in progress',
        description: 'Frequent water interruption occurring on block 12 for the past 4 days without prior notice.',
        concerned_staff_member: 'Ato Kebede (District Engineer)',
        estimated_resolution_timeframe: '3 - 5 Days',
        estimated_resolution_date: '2026-09-12',
        admin_response: 'Our water maintenance crew has inspected the pipeline and replacement parts have been ordered. The service will be restored promptly.',
        admin_contact_phone: '0911223344',
        photos: [],
        videos: [],
        audios: [],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      },
      {
        complaint_id: 102,
        id: 102,
        user_id: 1,
        first_name: 'Abebe',
        last_name: 'Bikila',
        email: 'user@lideta.gov',
        phone: '+251 911 223344',
        complainer_city: 'Addis Ababa',
        complainer_subcity: 'Lideta',
        complainer_woreda: '02',
        complainer_house_number: '104',
        complaint_subcity: 'Lideta',
        complaint_woreda: '02',
        type: 'Roads and Transport Bureau',
        status: 'assigning',
        description: 'Large potholes on the main access road creating traffic blockage and safety hazard for pedestrians.',
        concerned_staff_member: null,
        estimated_resolution_timeframe: '5 - 7 Days',
        estimated_resolution_date: null,
        admin_response: 'Complaint logged and assigned to Lideta Sub-City Infrastructure Department for on-site assessment.',
        admin_contact_phone: '8080',
        photos: [],
        videos: [],
        audios: [],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      }
    ],
    contacts: []
  };

  // Seed default news from json file
  try {
    const newsPath = path.resolve(process.cwd(), 'client/src/data/news.json');
    if (fs.existsSync(newsPath)) {
      const rawNews = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
      tables.news = rawNews.map((n, i) => ({
        id: parseInt(n.id) || (i + 1),
        title: n.title,
        short_description: n.description || '',
        description: Array.isArray(n.content) ? n.content.join('\n\n') : (n.description || ''),
        category: n.category || 'General',
        photo: n.photo || null,
        created_at: n.date ? new Date(n.date) : new Date(),
        updated_at: new Date()
      }));
    }
  } catch (err) {
    console.warn('[db-mock] Failed to seed news table:', err.message);
  }

  // Seed default events from json file
  try {
    const eventsPath = path.resolve(process.cwd(), 'client/src/data/events.json');
    if (fs.existsSync(eventsPath)) {
      const rawEvents = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
      tables.events = rawEvents.map((e, i) => ({
        events_id: parseInt(e.id) || (i + 1),
        title: e.title,
        description: e.description || '',
        location: e.location || 'Lideta Sub-City',
        start_date: e.date || new Date(),
        end_date: e.date || new Date(),
        status: e.status || 'upcoming',
        photos: e.photos || null,
        created_at: new Date()
      }));
    }
  } catch (err) {
    console.warn('[db-mock] Failed to seed events table:', err.message);
  }

  // Seed default vacancies from json file
  try {
    const vacanciesPath = path.resolve(process.cwd(), 'client/src/data/vacancies.json');
    if (fs.existsSync(vacanciesPath)) {
      const rawVacancies = JSON.parse(fs.readFileSync(vacanciesPath, 'utf8'));
      tables.vacancies = rawVacancies.map((v, i) => ({
        id: parseInt(v.id) || (i + 1),
        title: v.title,
        short_description: v.short_description || '',
        description: v.description || '',
        location: v.location || 'Lideta Sub-City',
        salary: v.salary || 'Negotiable',
        type: v.type || 'Full-time',
        category: v.category || 'General',
        skills: v.skills || [],
        responsibilities: v.responsibilities || [],
        qualifications: v.qualifications || [],
        start_date: v.start_date ? new Date(v.start_date) : new Date(),
        end_date: v.end_date ? new Date(v.end_date) : new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }));
    }
  } catch (err) {
    console.warn('[db-mock] Failed to seed vacancies table:', err.message);
  }

  // Mock template tag function
  const mockDb = async function(strings, ...args) {
    const rawQuery = strings.reduce((acc, str, i) => acc + str + (args[i] !== undefined ? '?' : ''), '');
    const cleanQuery = rawQuery.replace(/\s+/g, ' ').trim();
    const lowerQuery = cleanQuery.toLowerCase();

    // ── SELECT QUERIES ────────────────────────────────────────────────────────
    if (lowerQuery.startsWith('select')) {
      // 1. SELECT * FROM admins
      if (lowerQuery.includes('from admins')) {
        if (lowerQuery.includes('username = ?')) {
          const username = args[0];
          const found = tables.admins.filter(a => a.username === username);
          return found;
        }
        if (lowerQuery.includes('email = ?')) {
          const email = args[0];
          const found = tables.admins.filter(a => a.email === email);
          return found;
        }
        return [...tables.admins];
      }

      // 2. SELECT * FROM users
      if (lowerQuery.includes('from users')) {
        if (lowerQuery.includes('email = ?')) {
          const email = args[0];
          const found = tables.users.filter(u => u.email === email);
          return found;
        }
        if (lowerQuery.includes('id = ?')) {
          const id = args[0];
          const found = tables.users.filter(u => String(u.id) === String(id));
          return found;
        }
        return [...tables.users];
      }

      // 3. SELECT * FROM news
      if (lowerQuery.includes('from news')) {
        if (lowerQuery.includes('where id = ?')) {
          const id = args[0];
          return tables.news.filter(n => String(n.id) === String(id));
        }
        return tables.news.map(n => ({
          ...n,
          formatted_date: n.created_at ? n.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
        })).sort((a, b) => b.created_at - a.created_at);
      }

      // 4. SELECT * FROM events
      if (lowerQuery.includes('from events')) {
        if (lowerQuery.includes('events_id = ?')) {
          const id = args[0];
          return tables.events.filter(e => String(e.events_id) === String(id));
        }
        return tables.events.map(e => ({
          ...e,
          start_date_short: e.start_date ? new Date(e.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''
        })).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      }

      // 5. SELECT * FROM vacancies
      if (lowerQuery.includes('from vacancies')) {
        if (lowerQuery.includes('where id = ?')) {
          const id = args[0];
          return tables.vacancies.filter(v => String(v.id) === String(id));
        }
        return tables.vacancies.map(v => ({
          ...v,
          formatted_date: v.created_at ? v.created_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
        })).sort((a, b) => b.created_at - a.created_at);
      }

      // 6. SELECT * FROM applicants
      if (lowerQuery.includes('from applicants')) {
        if (lowerQuery.includes('where a.id = ?') || lowerQuery.includes('where id = ?')) {
          const id = args[0];
          const row = tables.applicants.find(a => String(a.id) === String(id));
          if (row) {
            const vac = tables.vacancies.find(v => String(v.id) === String(row.vacancy_id));
            return [{ ...row, vacancy_title: vac ? vac.title : 'General Role' }];
          }
          return [];
        }
        return tables.applicants.map(a => {
          const vac = tables.vacancies.find(v => String(v.id) === String(a.vacancy_id));
          return {
            ...a,
            full_name: `${a.first_name} ${a.last_name}`,
            applied_date: a.created_at ? a.created_at.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
            vacancy_title: vac ? vac.title : 'General Role',
            category: vac ? vac.category : '',
            salary: vac ? vac.salary : ''
          };
        }).sort((a, b) => b.created_at - a.created_at);
      }

      // 7. SELECT * FROM complaints
      if (lowerQuery.includes('from complaints')) {
        if (lowerQuery.includes('count(*)')) {
          const total = tables.complaints.length;
          const pending = tables.complaints.filter(c => ['assigning', 'in progress'].includes((c.status || '').toLowerCase())).length;
          const resolved = tables.complaints.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
          return [{ total, pending, resolved }];
        }
        if (lowerQuery.includes('complaint_id = ?')) {
          const id = args[0];
          return tables.complaints.filter(c => String(c.complaint_id) === String(id));
        }
        if (lowerQuery.includes('user_id = ?')) {
          const userId = args[0];
          return tables.complaints.filter(c => String(c.user_id) === String(userId)).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
        return [...tables.complaints].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      }

      // 8. SELECT * FROM contacts
      if (lowerQuery.includes('from contacts')) {
        return tables.contacts.sort((a, b) => b.created_at - a.created_at);
      }
    }

    // ── INSERT QUERIES ────────────────────────────────────────────────────────
    if (lowerQuery.startsWith('insert into')) {
      const insertRegex = /insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values/i;
      const match = cleanQuery.match(insertRegex);
      if (match) {
        const table = match[1].toLowerCase();
        const cols = match[2].split(',').map(c => c.trim().toLowerCase());
        const row = {};

        cols.forEach((col, idx) => {
          row[col] = args[idx];
        });

        // Setup primary keys
        if (table === 'users' || table === 'applicants' || table === 'complaints' || table === 'contacts' || table === 'news' || table === 'vacancies') {
          row.id = row.id || row.complaint_id || row.events_id || Math.floor(Math.random() * 100000) + 1;
        }
        if (table === 'complaints') {
          row.complaint_id = row.id;
          row.status = row.status || 'pending';
        }
        if (table === 'events') {
          row.events_id = row.events_id || row.id || Math.floor(Math.random() * 100000) + 1;
          row.status = row.status || 'upcoming';
        }

        row.created_at = new Date();
        row.updated_at = new Date();

        if (tables[table]) {
          tables[table].push(row);
          const resArr = [row];
          resArr.count = 1;
          return resArr;
        }
      }
    }

    // ── UPDATE QUERIES ────────────────────────────────────────────────────────
    if (lowerQuery.startsWith('update')) {
      const updateRegex = /update\s+(\w+)\s+set\s+([\s\S]+?)\s+where\s+([\s\S]+)/i;
      const match = cleanQuery.match(updateRegex);
      if (match) {
        const tableName = match[1].toLowerCase();
        const setClause = match[2];
        const whereClause = match[3];

        const table = tables[tableName];
        if (table) {
          // Parse columns from SET clause
          const setParts = setClause.split(',').map(p => p.trim());
          const setMap = {};
          setParts.forEach((part, idx) => {
            const colName = part.split('=')[0].trim().toLowerCase();
            setMap[colName] = args[idx];
          });

          // Standard WHERE parser for updates by primary key (id, complaint_id, events_id, email, username)
          const whereVal = args[args.length - 1]; // usually the last argument is the WHERE parameter
          let updatedCount = 0;
          let updatedRows = [];

          tables[tableName] = table.map(row => {
            let matches = false;
            if (whereClause.includes('id =') || whereClause.includes('id=')) {
              matches = String(row.id) === String(whereVal);
            } else if (whereClause.includes('complaint_id =') || whereClause.includes('complaint_id=')) {
              matches = String(row.complaint_id) === String(whereVal);
            } else if (whereClause.includes('events_id =') || whereClause.includes('events_id=')) {
              matches = String(row.events_id) === String(whereVal);
            } else if (whereClause.includes('email =') || whereClause.includes('email=')) {
              matches = String(row.email) === String(whereVal);
            } else if (whereClause.includes('username =') || whereClause.includes('username=')) {
              matches = String(row.username) === String(whereVal);
            } else if (whereClause.includes('admin_id =') || whereClause.includes('admin_id=')) {
              matches = String(row.admin_id) === String(whereVal);
            }

            if (matches) {
              updatedCount++;
              const updatedRow = { ...row, ...setMap, updated_at: new Date() };
              updatedRows.push(updatedRow);
              return updatedRow;
            }
            return row;
          });

          const resArr = updatedRows;
          resArr.count = updatedCount;
          return resArr;
        }
      }
    }

    // ── DELETE QUERIES ────────────────────────────────────────────────────────
    if (lowerQuery.startsWith('delete')) {
      const deleteRegex = /delete\s+from\s+(\w+)\s+where\s+([\s\S]+)/i;
      const match = cleanQuery.match(deleteRegex);
      if (match) {
        const tableName = match[1].toLowerCase();
        const whereClause = match[2];
        const whereVal = args[0];

        const table = tables[tableName];
        if (table) {
          let beforeLen = table.length;
          tables[tableName] = table.filter(row => {
            let matches = false;
            if (whereClause.includes('id =') || whereClause.includes('id=')) {
              matches = String(row.id) === String(whereVal);
            } else if (whereClause.includes('complaint_id =') || whereClause.includes('complaint_id=')) {
              matches = String(row.complaint_id) === String(whereVal);
            } else if (whereClause.includes('events_id =') || whereClause.includes('events_id=')) {
              matches = String(row.events_id) === String(whereVal);
            } else if (whereClause.includes('admin_id =') || whereClause.includes('admin_id=')) {
              matches = String(row.admin_id) === String(whereVal);
            }
            return !matches;
          });
          const resArr = [];
          resArr.count = beforeLen - tables[tableName].length;
          return resArr;
        }
      }
    }

    // Fallback: return empty array
    const fallback = [];
    fallback.count = 0;
    return fallback;
  };

  return mockDb;
}

export default pool;
