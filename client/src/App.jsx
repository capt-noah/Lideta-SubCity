import React from 'react'
import Home from './pages/Home.jsx'
import { LanguageProvider } from './components/utils/LanguageContext.jsx'
import Departments from './pages/Departments.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Contacts from './pages/Contacts.jsx'
import Complaints from './pages/Complaints.jsx'
import Events from './pages/Events.jsx'
import News from './pages/News.jsx'
import NewsDetails from './pages/NewsDetails.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Vacancy from './pages/Vacancy.jsx'
import VacancyDetails from './pages/VacancyDetails.jsx'
import DepartmentDetails from './pages/DepartmentDetails.jsx'
import UserAuth from './pages/UserAuth.jsx'
import UserDashboard from './pages/UserDashboard.jsx'

import Admin from './pages/Admin/Admin.jsx'
import AdminHome from './pages/Admin/Home.jsx'
import AdminComplaints from './pages/Admin/Complaints.jsx'
import AdminEvent from './pages/Admin/Event.jsx'
import AdminNews from './pages/Admin/News.jsx'
import AdminProfile from './pages/Admin/Profile.jsx'
import AdminVacancy from './pages/Admin/Vacancy.jsx'
import Login from './pages/Admin/Login.jsx'
import SuperAdminLayout from './pages/SuperAdmin/SuperAdmin.jsx'
import SuperAdminHome from './pages/SuperAdmin/Home.jsx'
import SuperAdminProfile from './pages/SuperAdmin/Profile.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'
import RoleGuard from './components/utils/RoleGuard.jsx'
import ScrollToTop from './components/utils/ScrollToTop.jsx'
import HomePage from './pages/HomePage.jsx'

import GlobalSatisfactionTrigger from './components/forms/GlobalSatisfactionTrigger.jsx'

function App() {
  return (
    <LanguageProvider>
      <div>
        <ScrollToTop />
        <Routes>
          {/* ── Public site ──────────────────────────────────────────── */}
          <Route path='/' element={<Home />}>
            <Route path='/' element={<HomePage />} />
            <Route path='departments' element={<Departments />} />
            <Route path='about_us' element={<AboutUs />} />
            <Route path='contacts' element={<Contacts />} />
            {/* canonical spelling */}
            <Route path='complaints' element={<Complaints />} />
            <Route path='vacancy' element={<Vacancy />} />
            {/* legacy redirects — keep old URLs working */}
            <Route path='compliants' element={<Navigate to='/complaints' replace />} />
            <Route path='vaccancy' element={<Navigate to='/vacancy' replace />} />
            <Route path='events' element={<Events />} />
            <Route path='events/:id' element={<EventDetails />} />
            <Route path='news' element={<News />} />
            <Route path='news/:id' element={<NewsDetails />} />
            <Route path='vacancy/:id' element={<VacancyDetails />} />
            {/* legacy vacancy detail redirect */}
            <Route path='vaccancy/:id' element={<VacancyDetails />} />
            <Route path='departments/:id' element={<DepartmentDetails />} />
          </Route>

          {/* ── Auth ─────────────────────────────────────────────────── */}
          <Route path='/auth'>
            <Route path='login' element={<Login />} />
          </Route>

          {/* ── User auth & dashboard ─────────────────────────────────── */}
          <Route path='/account/auth' element={<UserAuth />} />
          <Route path='/account' element={<UserDashboard />} />

          {/* ── Admin ────────────────────────────────────────────────── */}
          <Route path='/admin' element={<Admin />}>
            {/* Home dashboard — full admin only */}
            <Route path='/admin' element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminHome />
              </RoleGuard>
            } />
            {/* Complaints */}
            <Route path='complaints' element={
              <RoleGuard allowedRoles={['admin', 'complaint_admin']}>
                <AdminComplaints />
              </RoleGuard>
            } />
            {/* legacy route redirect */}
            <Route path='compliants' element={<Navigate to='/admin/complaints' replace />} />
            {/* Events */}
            <Route path='events' element={
              <RoleGuard allowedRoles={['admin', 'event_admin']}>
                <AdminEvent />
              </RoleGuard>
            } />
            {/* News */}
            <Route path='news' element={
              <RoleGuard allowedRoles={['admin', 'news_admin']}>
                <AdminNews />
              </RoleGuard>
            } />
            {/* Vacancy */}
            <Route path='vacancy' element={
              <RoleGuard allowedRoles={['admin', 'vacancy_admin']}>
                <AdminVacancy />
              </RoleGuard>
            } />
            {/* Profile */}
            <Route path='profile' element={
              <RoleGuard allowedRoles={['admin', 'complaint_admin', 'event_admin', 'news_admin', 'vacancy_admin']}>
                <AdminProfile />
              </RoleGuard>
            } />
          </Route>

          {/* ── Super Admin ───────────────────────────────────────────── */}
          <Route path='/superadmin' element={<SuperAdminLayout />}>
            <Route index element={<Navigate to='home' replace />} />
            <Route path='home' element={<SuperAdminHome />} />
            <Route path='profile' element={<SuperAdminProfile />} />
          </Route>
        </Routes>

        <GlobalSatisfactionTrigger />
      </div>
    </LanguageProvider>
  )
}

export default App
