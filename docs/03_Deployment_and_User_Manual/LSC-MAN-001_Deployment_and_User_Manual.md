# Deployment and User Manual
## Lideta Sub-City Official Web Portal & Administrative System
### Document Reference: LSC-MAN-001 | Version: 1.0.0

---

**Document Identification**

- **Project:** Lideta Sub-City Administration Official Portal
- **Document Code:** LSC-MAN-001
- **Target Organization:** Information Network Security Administration (INSA) / Hibir Review Board
- **Issuing Department:** Lideta Sub-City Administration, IT Department
- **City:** Addis Ababa, Ethiopia
- **Date:** October 2026
- **Audience:** System Administrators, Security Evaluators, and Sub-City Administrative Officers

---

## 1. System Requirements and Environment

The portal is designed to run efficiently on shared or virtual Linux hosting managed through Plesk Obsidian.

### 1.1 Minimum Server Specifications
- **Operating System:** Linux (Ubuntu 22.04 LTS or AlmaLinux 8 / 9 supported by Plesk)
- **Node.js Runtime:** v18.18.0 LTS or v20.x / v22.x
- **Web Server / Application Server:** Nginx (reverse proxy) + Phusion Passenger (managed via Plesk Node.js extension)
- **Database Server:** MySQL 8.0+ Community Server (running on local loopback or assigned internal network `10.180.50.142`)
- **Memory (RAM):** 2 GB minimum (4 GB recommended for production traffic)
- **Storage:** 20 GB SSD storage minimum (to accommodate uploaded complaints media and applicant CVs)

### 1.2 Client Browser Compatibility
- Google Chrome (desktop & mobile) — v110+
- Mozilla Firefox — v115+
- Apple Safari (macOS & iOS) — v16+
- Microsoft Edge — v110+

---

## 2. Server Installation & Deployment Procedures

### 2.1 Directory Structure on Server
On the production server, the application root directory is structured as follows:

```
/var/www/vhosts/lidetasubcity.gov.et/httpdocs/
├── app.js               <-- Phusion Passenger startup entrypoint
├── package.json         <-- Root npm workspace definitions
├── .env                 <-- Environment credentials (restricted permissions: 600)
├── client/
│   ├── dist/            <-- Compiled production frontend (HTML, JS, CSS bundles)
│   └── public/
│       └── uploads/     <-- Local media & candidate CV uploads directory
├── server/
│   ├── server.js        <-- Main Express application
│   ├── con/             <-- MySQL adapter and connection pool
│   ├── middleware/      <-- Security headers, probe blocker, CORS, Multer upload
│   └── routes/          <-- API endpoint routers
└── docs/                <-- Technical specifications and manual
```

### 2.2 Environment Configuration (`.env`)
The application requires the following environment variables placed in a `.env` file at the root of the project:

```ini
# Database Connection (Plesk Internal MySQL)
DB_HOST=10.180.50.142
DB_PORT=3306
DB_USER=lideta_admin
DB_PASSWORD=YourSecureDatabasePasswordHere
DB_NAME=lideta_db

# Server & Application Settings
PORT=3000
NODE_ENV=production

# JWT Authentication Secret (Minimum 64-character random string)
JWT_SECRET=Your256BitCryptographicSecretStringForTokenSigning

# Authorized Client Origin
CLIENT_ORIGIN=https://lidetasubcity.gov.et
```

> **Security Note:**  
> Ensure the `.env` file has restricted file permissions so it cannot be read by other system users:
> ```bash
> chmod 600 .env
> chown lideta_user:psacln .env
> ```

### 2.3 Dependency Installation & Front-End Compilation
Before launching the service on the server, install the dependencies and compile the Vite client application:

```bash
# 1. Install production dependencies across all workspaces
npm install

# 2. Build the optimized React frontend bundle
npm run build
```

This generates the compiled Single Page Application assets inside `client/dist/`, which are served directly by Express.

### 2.4 Plesk Node.js Passenger Setup
In the Plesk Control Panel:
1. Navigate to **Websites & Domains > Node.js**.
2. Set **Node.js Version** to `20.x` or `22.x`.
3. Set **Document Root** to `/client/dist`.
4. Set **Application Root** to the repository root directory.
5. Set **Application Startup File** to `app.js`.
6. Click **Restart** to boot the Node.js Passenger worker process.

### 2.5 Nginx Additional Directives (Plesk Web Server Configuration)
To further harden the deployment at the reverse-proxy layer, add these directives under **Plesk > Apache & nginx Settings > Additional nginx directives**:

```nginx
# Hide server banner tokens
server_tokens off;
passenger_show_version_in_header off;
proxy_hide_header X-Powered-By;
proxy_hide_header X-Passenger-Version;

# Enforce maximum upload body size (50MB for complaint video/media)
client_max_body_size 50M;

# Gzip compression for static assets
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
```

---

## 3. Citizen Portal User Guide

The public citizen portal is accessible at `https://lidetasubcity.gov.et`.

### 3.1 Language Switching
- Citizens can toggle between **English**, **አማርኛ (Amharic)**, and **Afaan Oromoo** using the language selector dropdown in the top navigation bar.
- The choice is saved in browser storage and remembered across sessions.
- If an article or event does not yet have a translation in the chosen language, the system cleanly displays the original version without breaking layout.

### 3.2 Reading News and Announcements
- The **News** page displays sub-city announcements organized by category (Health, Education, Infrastructure, Social Services, etc.).
- Citizens can search articles using the live search box or filter by topic.
- Each article includes estimated reading time, publication date, category badge, and social share links (Telegram, Facebook, Copy Link).

### 3.3 Viewing Upcoming Events
- The **Events** section features sub-city town halls, volunteer cleanups, public forums, and municipal ceremonies.
- Each event card features an easy-to-read date stamp, venue location, and event description.

### 3.4 Submitting a Complaint (Citizen Grievance Redress)
The sub-city administration provides an online complaint channel so residents do not need to visit woreda offices in person for basic service issues:

1. Navigate to **Complaints** (`/complaints`).
2. Fill out personal information: Full name, phone number, and residential address (Woreda, House Number).
3. Select the responsible administrative sector (e.g., Water Supply, Sanitation, Road Maintenance, Construction, Customer Service).
4. Provide a description of the issue.
5. (Optional) Attach photos, short video clips, or record voice notes directly in the browser.
6. Click **Submit Complaint**.
7. The system immediately outputs an official tracking code in the format:  
   **`CPL-XXXXX`** (e.g., `CPL-00042`).
8. Keep this code to track the resolution status.

### 3.5 Applying for Job Vacancies
1. Go to **Vacancies** (`/vacancy`).
2. Browse open job opportunities by category and employment type (Full Time, Contract, Internship).
3. Click on a position to view requirements, responsibilities, and qualifications.
4. To apply, citizens are prompted to sign in with their citizen account (or create one in under a minute).
5. Attach a Curriculum Vitae in **PDF format** (maximum size 30 MB).
6. Click **Submit Application**.
7. The system generates an application reference number:  
   **`APP-XXXXX`** (e.g., `APP-00108`).

### 3.6 Public Service Satisfaction Survey
- Citizens can provide feedback on municipal services through the survey prompt or via the footer link.
- Collects rating metrics (Very High to Very Low) on staff responsiveness, waiting time, transparency, and service quality.
- Responses are processed into aggregate satisfaction scores for leadership review.

### 3.7 Citizen Account Dashboard (`/account`)
Registered citizens can log in at `/account/auth` to access their private citizen dashboard:
- View all previously submitted complaints and their live resolution status (`assigning`, `in progress`, `resolved`).
- Read administrative responses and view the assigned officer's contact telephone.
- View submitted job applications and their review status (`submitted`, `reviewing`, `shortlisted`).
- Update personal profile details (telephone number, password).

---

## 4. Administrative Back-Office Guide

Staff access the administration panel at `https://lidetasubcity.gov.et/auth/login`.

### 4.1 Staff Login and Authentication
1. Enter staff username and password.
2. For accounts with two-factor verification enabled, enter the 6-digit verification code sent to the officer's email.
3. Upon successful verification, the system automatically redirects the staff member to their assigned departmental dashboard based on their role.

### 4.2 Role-Based Workflows

#### 1. News Administrator (`news_admin`)
- Accessible at `/admin/news`.
- **Add Article:** Click *Add News*, fill in English title and summary, body text, select category, upload header photo, and input Amharic/Oromo translations if available.
- **Edit / Update:** Click the edit icon on any published story to update details or fix typos.
- **Delete:** Remove outdated announcements.

#### 2. Event Administrator (`event_admin`)
- Accessible at `/admin/events`.
- Create new calendar events with venue location, start date, and end date.
- Update event status (Upcoming, In Progress, Completed, Canceled).

#### 3. Vacancy Administrator (`vacancy_admin`)
- Accessible at `/admin/vacancy`.
- Post new government vacancy announcements with start and deadline dates, required educational background, and duties.
- **Review Applicants:** Switch to the *Applicants* tab to see all submitted candidate files.
- Click on any applicant to view contact details, download their attached CV PDF, and update application status (e.g., set to *Shortlisted* or *Interviewed*).

#### 4. Complaint Administrator (`complaint_admin`)
- Accessible at `/admin/complaints`.
- View incoming citizen complaints sorted chronologically.
- Filter by status (`Assigning`, `In Progress`, `Resolved`) or sector group.
- **Resolve Complaint:** Open a complaint record, review citizen notes and uploaded photos/audio, select *Status: Resolved*, input the municipal resolution note, and provide a contact phone number for follow-up.

#### 5. Super Administrator (`superadmin`)
- Accessible at `/superadmin/home`.
- **Overview Dashboard:** Live KPI cards showing Total Complaints, Resolved Complaints, Pending Job Applications, and Active Events.
- **Satisfaction Metrics:** Visual breakdown of citizen satisfaction scores across all 11 evaluation criteria.
- **Staff Account Management:** Located under `/superadmin/profile`. Create new staff members, assign specific roles, update staff details, or revoke account access.
- **Audit Logs:** Review chronological log of all administrative actions (who created, updated, or deleted content, with timestamps).

---

## 5. Routine Maintenance and Troubleshooting

### 5.1 Quick Health Check
Administrators or IT personnel can verify that the application server and database connection are functioning by calling the diagnostic endpoints:

- `curl https://lidetasubcity.gov.et/health`  
  Should return: `{"ok":true,"message":"Server is running"}`
- `curl https://lidetasubcity.gov.et/api/db-test`  
  Should return: `{"status":"connected","tables":[...]}`

### 5.2 Server Restart
If code updates are pulled via git:
```bash
# Pull changes
git pull origin main

# Rebuild frontend
npm run build

# Trigger Phusion Passenger reload
touch tmp/restart.txt
```

### 5.3 Database Backup Procedure
Schedule daily MySQL backups using standard `mysqldump`:
```bash
mysqldump -h 10.180.50.142 -u lideta_admin -p lideta_db > /backup/lideta_db_$(date +%F).sql
```

*Prepared by the Lideta Sub-City Administration IT Team for official INSA submission.*
