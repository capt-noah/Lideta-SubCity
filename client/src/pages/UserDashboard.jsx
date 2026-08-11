import BASE_URL from '../utils/api'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../components/utils/UserContext'
import { useLanguage } from '../components/utils/LanguageContext'
import Status from '../components/ui/Status.jsx'
import Notification from '../components/ui/Notification'
import LoadingButton from '../components/ui/LoadingButton'
import LidetaLogo from '../assets/LidetaLogo.svg?react'
import EditIcon from '../assets/icons/edit_icon.svg?react'
import FileIcon from '../assets/icons/file_icon.svg?react'
import ComplaintIcon from '../assets/icons/compliant_icon2.svg?react'
import { validatePasswordStrength, generateStrongPassword } from '../utils/passwordHelper'

const T = {
  dashboard:   { en: 'My Account',          am: 'መለያዬ',                  or: 'Herrega Koo' },
  complaints:  { en: 'My Complaints',        am: 'ቅሬታዎቼ',                 or: 'Iyyata Koo' },
  applications:{ en: 'My Applications',      am: 'ማመልከቻዎቼ',              or: 'Gaaffii Koo' },
  profile:     { en: 'Profile',              am: 'መገለጫ',                  or: 'Ibsa' },
  logout:      { en: 'Sign Out',             am: 'ውጣ',                     or: 'Ba\'i' },
  no_complaints:{ en: 'No complaints yet',   am: 'ቅሬታ የለም',              or: 'Iyyata hin jiru' },
  no_apps:     { en: 'No applications yet',  am: 'ማመልከቻ የለም',            or: 'Gaaffii hin jiru' },
  submit_one:  { en: 'Submit a complaint',   am: 'ቅሬታ ያቅርቡ',             or: 'Iyyata galchi' },
  apply_now:   { en: 'Browse vacancies',     am: 'ክፍት ቦታዎችን ፈልጉ',       or: 'Bakka Duwwaa Barbaadi' },
  type:        { en: 'Sector',               am: 'ዘርፍ',                   or: 'Damee' },
  date:        { en: 'Submitted',            am: 'የቀረበ',                  or: 'Galii' },
  status:      { en: 'Status',               am: 'ሁኔታ',                   or: 'Haala' },
  position:    { en: 'Position',             am: 'ቦታ',                    or: 'Sadarkaa' },
  location:    { en: 'Location',             am: 'አካባቢ',                  or: 'Bakka' },
  applied:     { en: 'Applied',              am: 'ተልኳል',                  or: 'Ergame' },
  save:        { en: 'Save Changes',         am: 'ለውጦችን አስቀምጥ',          or: 'Jijjiirama Kuusi' },
  cancel:      { en: 'Cancel',               am: 'ሰርዝ',                   or: 'Haqi' },
  current_pass:{ en: 'Current Password',     am: 'አሁን ያለ የይለፍ ቃል',      or: 'Jecha Amma Jiru' },
  new_pass:    { en: 'New Password',         am: 'አዲስ የይለፍ ቃል',          or: 'Jecha Haaraa' },
  confirm_pass:{ en: 'Confirm Password',     am: 'የይለፍ ቃልን አረጋግጥ',     or: 'Jecha Mirkaneessi' },
  suggest:     { en: 'Suggest password',     am: 'የይለፍ ቃል ሀሳብ',         or: 'Gorfama' },
}

const StrengthBar = ({ password }) => {
  if (!password) return null
  const { score } = validatePasswordStrength(password)
  const colors = ['bg-red-500','bg-orange-500','bg-yellow-400','bg-emerald-500','bg-emerald-600']
  const labels = ['Very Weak','Weak','Fair','Strong','Very Strong']
  const idx = Math.min(score ?? 0, 4)
  return (
    <div className='mt-2'>
      <div className='flex gap-1'>{[0,1,2,3,4].map(i=><div key={i} className={`h-1 flex-1 rounded-full ${i<=idx?colors[idx]:'bg-slate-800'} transition-all`}/>)}</div>
      <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${idx<2?'text-red-500':idx<4?'text-orange-400':'text-emerald-700'}`}>{labels[idx]}</p>
    </div>
  )
}

// ── Status step tracker ────────────────────────────────────────────────────────
const COMPLAINT_STEPS = ['assigning', 'in progress', 'resolved']
const APP_STEPS       = ['submitted', 'reviewing', 'accepted']

function StepTracker({ steps, current }) {
  const norm = (s) => (s||'').toLowerCase().replace('cancelled','cancelled')
  const rejected = norm(current) === 'rejected' || norm(current) === 'canceled'
  const curIdx = rejected ? -1 : steps.findIndex(s => norm(s) === norm(current))

  return (
    <div className='flex items-center gap-1 mt-4 pt-4 border-t border-slate-800'>
      {steps.map((step, i) => {
        const done    = !rejected && i <= curIdx
        const active  = !rejected && i === curIdx
        return (
          <div key={step} className='flex items-center flex-1'>
            <div className='flex flex-col items-center w-full'>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-goldman font-bold transition-all duration-300 ${done ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/20' : 'bg-slate-900 text-slate-400 border border-slate-800'} ${active ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-emerald-600 scale-110' : ''}`}>
                {done && !active ? '✓' : i+1}
              </div>
              <span className={`text-[10px] uppercase tracking-wider mt-1.5 text-center leading-none font-goldman ${done ? 'text-emerald-600/90 font-bold' : 'text-slate-400'}`}>{step}</span>
            </div>
            {i < steps.length-1 && <div className={`h-0.5 flex-1 mb-6 ${i < curIdx && !rejected ? 'bg-emerald-600' : 'bg-slate-800'} transition-all duration-300`} />}
          </div>
        )
      })}
      {rejected && <span className='ml-2 text-xs font-bold text-red-500 uppercase tracking-widest font-goldman'>{current}</span>}
    </div>
  )
}

function UserDashboard() {
  const { user, userToken, logout, login } = useUser()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = (k) => T[k][language] || T[k].en

  const [activeTab,    setActiveTab]    = useState('complaints')
  const [complaints,   setComplaints]   = useState([])
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [notification, setNotif]        = useState({ isOpen:false, message:'', type:'success' })
  const notify = (msg, type='success') => setNotif({ isOpen:true, message:msg, type })
  const [verifyOtp,    setVerifyOtp]    = useState(['','','','','',''])
  const [showVerify,   setShowVerify]   = useState(false)
  const [verifying,    setVerifying]    = useState(false)
  const verifyRefs = useRef([])

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingPass,    setEditingPass]    = useState(false)
  const [isSaving,       setIsSaving]       = useState(false)
  const [profileForm, setProfileForm] = useState(() => ({
    first_name: user?.first_name||'',
    last_name: user?.last_name||'',
    phone: user?.phone||''
  }))
  const [passForm,    setPassForm]    = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
  const [showNewPass, setShowNewPass] = useState(false)

  const [prevUser, setPrevUser] = useState(user)
  if (user !== prevUser) {
    setPrevUser(user)
    setProfileForm({
      first_name: user?.first_name||'',
      last_name: user?.last_name||'',
      phone: user?.phone||''
    })
  }

  useEffect(() => {
    if (!userToken) { navigate('/account/auth'); return }
    fetch(`${BASE_URL}/api/user/dashboard`, { headers: { authorization: `Bearer ${userToken}` } })
      .then(r => r.json())
      .then(data => { setComplaints(data.complaints||[]); setApplications(data.applications||[]) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userToken, navigate])

  const handleSendVerification = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/send-verification`, { method:'POST', headers:{ authorization:`Bearer ${userToken}` } })
      if (!res.ok) throw new Error()
      setShowVerify(true); notify('Verification code sent to your email!')
    } catch { notify('Failed to send code', 'error') }
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    const code = verifyOtp.join('')
    if (code.length < 6) { notify('Enter all 6 digits', 'error'); return }
    setVerifying(true)
    try {
      const res  = await fetch(`${BASE_URL}/api/auth/verify-email`, { method:'POST', headers:{'Content-Type':'application/json', authorization:`Bearer ${userToken}`}, body: JSON.stringify({ otp: code }) })
      const data = await res.json()
      if (!res.ok) { notify(data.error, 'error'); return }
      login(data, userToken); setShowVerify(false); notify('Email verified!')
    } catch { notify('Verification failed', 'error') }
    finally { setVerifying(false) }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', authorization: `Bearer ${userToken}` },
        body: JSON.stringify(profileForm)
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      const updated = await res.json()
      login(updated, userToken)
      setEditingProfile(false)
      notify('Profile updated!')
    } catch (e) { notify(e.message, 'error') }
    finally { setIsSaving(false) }
  }

  const handleSavePassword = async () => {
    if (passForm.newPassword !== passForm.confirmPassword) { notify('Passwords do not match', 'error'); return }
    const { isValid, feedback } = validatePasswordStrength(passForm.newPassword)
    if (!isValid) { notify(`Weak password: ${feedback}`, 'error'); return }
    setIsSaving(true)
    try {
      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setPassForm({ currentPassword:'', newPassword:'', confirmPassword:'' })
      setEditingPass(false)
      notify('Password updated!')
    } catch (e) { notify(e.message, 'error') }
    finally { setIsSaving(false) }
  }

  const inputCls = 'w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all'
  const labelCls = 'block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5'
  const tabCls   = (t) => `px-5 py-3 text-sm font-goldman font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border-b-2 ${activeTab===t ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-emerald-600/80'}`

  if (loading) return (
    <div className='min-h-screen bg-white flex items-center justify-center'>
      <div className='flex gap-1.5'>
        {[0,1,2].map(i=><div key={i} className='w-3 h-3 bg-emerald-600 rounded-full animate-bounce' style={{animationDelay:`${i*100}ms`}}/>)}
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-white text-slate-800 font-roboto animate-fade-in pb-16'>
      <Notification isOpen={notification.isOpen} message={notification.message} type={notification.type} onClose={() => setNotif(n=>({...n,isOpen:false}))} />

      {/* Top bar */}
      <div className='bg-white/85 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm'>
        <Link to='/' className='hover:opacity-90 transition-opacity'><LidetaLogo className='w-28' /></Link>
        <div className='flex items-center gap-5'>
          <span className='text-sm text-slate-700 hidden sm:block font-goldman font-bold uppercase tracking-wider'>{user?.first_name} {user?.last_name}</span>
          <button onClick={() => { logout(); navigate('/') }}
            className='text-xs px-4 py-1.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-goldman font-bold uppercase tracking-wider cursor-pointer transition-all duration-350'>
            {t('logout')}
          </button>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        <h1 className='text-3xl sm:text-4xl font-goldman font-bold text-emerald-600 uppercase tracking-widest mb-8'>{t('dashboard')}</h1>

        {/* Email verification banner */}
        {user && !user.email_verified && (
          <div className='mb-8 bg-emerald-50 border border-emerald-600/30 rounded-2xl p-6 shadow-lg animate-pulse-slow'>
            {!showVerify ? (
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex items-start gap-4'>
                  <span className='text-emerald-600 text-2xl mt-0.5'>✉️</span>
                  <div>
                    <p className='font-goldman font-bold text-sm text-emerald-600 uppercase tracking-wider'>Verify your email address</p>
                    <p className='text-xs text-slate-600 mt-1 font-light leading-relaxed'>Your email <strong className='font-mono font-normal text-emerald-700'>{user.email}</strong> is not verified yet.</p>
                  </div>
                </div>
                <button onClick={handleSendVerification}
                  className='px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto'>
                  Verify Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyEmail} className='space-y-4'>
                <p className='text-sm font-goldman font-bold text-emerald-600 uppercase tracking-wider'>Enter the 6-digit code sent to {user.email}</p>
                <div className='flex flex-wrap items-center gap-3'>
                  <div className='flex gap-2'>
                    {verifyOtp.map((d, i) => (
                      <input key={i} ref={el => verifyRefs.current[i] = el}
                        type='text' inputMode='numeric' maxLength={1} value={d}
                        onChange={e => {
                          if (!/^\d?$/.test(e.target.value)) return
                          const next = [...verifyOtp]; next[i] = e.target.value; setVerifyOtp(next)
                          if (e.target.value && i < 5) verifyRefs.current[i+1]?.focus()
                        }}
                        onKeyDown={e => { if (e.key==='Backspace' && !verifyOtp[i] && i>0) verifyRefs.current[i-1]?.focus() }}
                        className='w-10 h-10 text-center text-lg font-bold border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-emerald-600' />
                    ))}
                  </div>
                  <button type='submit' disabled={verifying}
                    className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer'>
                    {verifying ? '…' : 'Confirm'}
                  </button>
                  <button type='button' onClick={() => setShowVerify(false)}
                    className='px-3 py-2 text-xs font-goldman font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 cursor-pointer transition-colors'>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className='flex gap-2 border-b border-slate-200 mb-8'>
          {['complaints','applications','profile'].map(tab => (
            <button key={tab} className={tabCls(tab)} onClick={() => setActiveTab(tab)}>
              {t(tab)}
            </button>
          ))}
        </div>

        {/* ── COMPLAINTS ── */}
        {activeTab === 'complaints' && (
          <div className='space-y-6'>
            {complaints.length === 0 ? (
              <div className='bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-slate-400'>
                <ComplaintIcon className='w-14 h-14 mb-4 opacity-30 text-emerald-600' />
                <p className='font-goldman font-bold text-lg uppercase tracking-wide text-slate-600'>{t('no_complaints')}</p>
                <Link to='/complaints' className='mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-105 active:scale-95'>
                  {t('submit_one')}
                </Link>
              </div>
            ) : complaints.map(c => (
              <div key={c.id} className='bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden transition-all duration-300 hover:border-emerald-600/30 group'>
                <div className='flex items-start justify-between mb-3.5'>
                  <div>
                    <p className='font-goldman font-bold text-lg text-slate-800 tracking-wide group-hover:text-emerald-700 transition-colors'>{c.type || '—'}</p>
                    <p className='text-xs text-slate-400 font-mono mt-1'>{t('date')}: {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <Status status={c.status} />
                </div>
                <p className='text-sm text-slate-600 font-light leading-relaxed mb-4'>{c.description}</p>
                <StepTracker steps={COMPLAINT_STEPS} current={c.status} />
              </div>
            ))}
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {activeTab === 'applications' && (
          <div className='space-y-6'>
            {applications.length === 0 ? (
              <div className='bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-slate-400'>
                <FileIcon className='w-14 h-14 mb-4 opacity-30 text-emerald-600' />
                <p className='font-goldman font-bold text-lg uppercase tracking-wide text-slate-600'>{t('no_apps')}</p>
                <Link to='/vacancy' className='mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-105 active:scale-95'>
                  {t('apply_now')}
                </Link>
              </div>
            ) : applications.map(a => (
              <div key={a.id} className='bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden transition-all duration-300 hover:border-emerald-600/30 group'>
                <div className='flex items-start justify-between mb-3.5'>
                  <div>
                    <p className='font-goldman font-bold text-lg text-slate-800 tracking-wide group-hover:text-emerald-700 transition-colors'>{a.vacancy_title || '—'}</p>
                    <p className='text-xs text-emerald-700 font-goldman uppercase tracking-wider mt-1.5'>{a.location} · {a.job_type} · {a.category}</p>
                    <p className='text-xs text-slate-400 font-mono mt-1'>{t('applied')}: {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <Status status={a.status} />
                </div>
                <StepTracker steps={APP_STEPS} current={a.status} />
                {a.cv_path && (
                  <a href={a.cv_path} target='_blank' rel='noreferrer'
                    className='inline-flex items-center gap-1.5 mt-4 text-xs font-goldman font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-600 hover:underline transition-all duration-300'>
                    <FileIcon className='w-3.5 h-3.5 text-emerald-600' /> View submitted CV
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === 'profile' && (
          <div className='space-y-6 max-w-lg animate-fade-in'>
            {/* Personal info */}
            <div className='bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4.5 bg-slate-50 border-b border-slate-200'>
                <h3 className='font-goldman font-bold text-sm uppercase tracking-wider text-slate-700'>Personal Information</h3>
                <button onClick={() => setEditingProfile(!editingProfile)} className='p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 cursor-pointer transition-all duration-300'>
                  <EditIcon className='w-4 h-4' />
                </button>
              </div>
              <div className='divide-y divide-slate-100 px-6'>
                {[['First Name','first_name'],['Last Name','last_name'],['Phone','phone']].map(([label,key]) => (
                  <div key={key} className='flex justify-between items-center py-4'>
                    <span className='text-sm text-slate-500 font-light'>{label}</span>
                    {editingProfile
                      ? <input type='text' value={profileForm[key]} onChange={e=>setProfileForm(p=>({...p,[key]:e.target.value}))}
                          className='w-52 px-3 py-1.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-right text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all' />
                      : <span className='font-semibold text-sm text-slate-800'>{user?.[key] || '—'}</span>
                    }
                  </div>
                ))}
                <div className='flex justify-between items-center py-4'>
                  <span className='text-sm text-slate-500 font-light'>Email</span>
                  <span className='font-semibold text-sm text-slate-800 font-mono'>{user?.email}</span>
                </div>
              </div>
              {editingProfile && (
                <div className='px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3'>
                  <button onClick={() => { setEditingProfile(false); setProfileForm({ first_name: user?.first_name||'', last_name: user?.last_name||'', phone: user?.phone||'' }) }}
                    className='px-4 py-2 text-xs font-goldman font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 rounded-xl cursor-pointer transition-all'>{t('cancel')}</button>
                  <LoadingButton isLoading={isSaving} onClick={handleSaveProfile}
                    className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md'>
                    {t('save')}
                  </LoadingButton>
                </div>
              )}
            </div>

            {/* Password */}
            <div className='bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4.5 bg-slate-50 border-b border-slate-200'>
                <h3 className='font-goldman font-bold text-sm uppercase tracking-wider text-slate-700'>Password</h3>
                <button onClick={() => setEditingPass(!editingPass)} className='p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 cursor-pointer transition-all duration-300'>
                  <EditIcon className='w-4 h-4' />
                </button>
              </div>
              {editingPass ? (
                <div className='px-6 py-5 space-y-4'>
                  <div>
                    <label className={labelCls}>{t('current_pass')}</label>
                    <input type='password' value={passForm.currentPassword} onChange={e=>setPassForm(p=>({...p,currentPassword:e.target.value}))} className={inputCls} />
                  </div>
                  <div>
                    <div className='flex justify-between items-center mb-1.5'>
                      <label className={labelCls.replace('mb-1.5','')}>{t('new_pass')}</label>
                      <button type='button' onClick={() => { const p=generateStrongPassword(); setPassForm(prev=>({...prev,newPassword:p,confirmPassword:p})) }}
                        className='text-[10px] text-emerald-700 hover:text-emerald-600 font-goldman font-bold uppercase tracking-wider cursor-pointer transition-all'>{t('suggest')}</button>
                    </div>
                    <div className='relative'>
                      <input type={showNewPass?'text':'password'} value={passForm.newPassword} onChange={e=>setPassForm(p=>({...p,newPassword:e.target.value}))} className={inputCls+' pr-14'} />
                      <button type='button' onClick={()=>setShowNewPass(!showNewPass)} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-goldman font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer'>{showNewPass?'Hide':'Show'}</button>
                    </div>
                    <StrengthBar password={passForm.newPassword} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('confirm_pass')}</label>
                    <input type='password' value={passForm.confirmPassword} onChange={e=>setPassForm(p=>({...p,confirmPassword:e.target.value}))} className={inputCls} />
                    {passForm.confirmPassword && passForm.newPassword !== passForm.confirmPassword && <p className='text-xs text-red-500 mt-1.5 font-light'>Passwords do not match</p>}
                  </div>
                  <div className='flex justify-end gap-3 pt-2 border-t border-slate-100'>
                    <button onClick={() => { setEditingPass(false); setPassForm({currentPassword:'',newPassword:'',confirmPassword:''}) }}
                      className='px-4 py-2 text-xs font-goldman font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 rounded-xl cursor-pointer transition-all'>{t('cancel')}</button>
                    <LoadingButton isLoading={isSaving} onClick={handleSavePassword}
                      className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md'>
                      {t('save')}
                    </LoadingButton>
                  </div>
                </div>
              ) : (
                <div className='px-6 py-5'><p className='text-sm text-slate-500 italic font-light'>Password is hidden for security</p></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
