import BASE_URL from '../utils/api'
import { useState, useEffect, useRef, useMemo } from 'react'
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
  dashboard:          { en: 'Citizen Portal',        am: 'የዜጎች መግቢያ',             or: 'Balbila Lammii' },
  dashboard_subtitle: { en: 'Track complaints, applications & manage your profile', am: 'ቅሬታዎችን፣ ማመልከቻዎችን ይከታተሉ እና መገለጫዎን ያስተዳድሩ', or: 'Iyyata, iyyannoo hordofaa fi profaayilii keessan bulchaa' },
  complaints:         { en: 'My Complaints',         am: 'ቅሬታዎቼ',                  or: 'Iyyata Koo' },
  applications:       { en: 'My Applications',       am: 'ማመልከቻዎቼ',               or: 'Gaaffii Koo' },
  profile:            { en: 'Profile Settings',      am: 'የመገለጫ ቅንብሮች',          or: 'Qindaa\'ina Profaayilii' },
  logout:             { en: 'Sign Out',              am: 'ውጣ',                      or: 'Ba\'i' },
  no_complaints:      { en: 'No complaints logged yet', am: 'እስካሁን የቀረበ ቅሬታ የለም', or: 'Iyyanni tokkollee hin galmoofne' },
  no_complaints_sub:  { en: 'Have an issue or service concern? Submit a complaint to get assistance.', am: 'የአገልግሎት ችግር ወይም ቅሬታ አለዎት? እርዳታ ለማግኘት ቅሬታዎን ያስገቡ።', or: 'Rakkoo tajaajilaa qabduu? Gargaarsa argachuuf iyyata galchaa.' },
  no_apps:            { en: 'No job applications submitted yet', am: 'ምንም ማመልከቻ አልቀረበም', or: 'Iyyannoon hojii hin galfamne' },
  submit_one:         { en: '+ Submit New Complaint', am: '+ አዲስ ቅሬታ ያቅርቡ',         or: '+ Iyyata Haaraa Galchi' },
  apply_now:          { en: 'Browse Vacancies',      am: 'ክፍት የሥራ ቦታዎች',          or: 'Bakka Duwwaa Barbaadi' },
  type:               { en: 'Sector / Directorate',  am: 'ዘርፍ / ቢሮ',               or: 'Damee / Biiroo' },
  date:               { en: 'Submitted Date',        am: 'የቀረበበት ቀን',            or: 'Guyyaa Galmaa\'e' },
  status:             { en: 'Current Status',        am: 'ወቅታዊ ሁኔታ',             or: 'Haala Ammaa' },
  position:           { en: 'Position',              am: 'የሥራ መደብ',               or: 'Sadarkaa Hojii' },
  location:           { en: 'Location',              am: 'አካባቢ',                   or: 'Bakka' },
  applied:            { en: 'Applied On',            am: 'የተላከበት ቀን',            or: 'Guyyaa Iyyatame' },
  save:               { en: 'Save Changes',          am: 'ለውጦችን አስቀምጥ',           or: 'Jijjiirama Kuusi' },
  cancel:             { en: 'Cancel',                am: 'ሰርዝ',                    or: 'Haqi' },
  current_pass:       { en: 'Current Password',      am: 'አሁን ያለ የይለፍ ቃል',       or: 'Jecha Darbii Ammaa' },
  new_pass:           { en: 'New Password',          am: 'አዲስ የይለፍ ቃል',           or: 'Jecha Darbii Haaraa' },
  confirm_pass:       { en: 'Confirm Password',      am: 'የይለፍ ቃልን አረጋግጥ',      or: 'Jecha Darbii Mirkaneessi' },
  suggest:            { en: 'Suggest strong password', am: 'ጠንካራ የይለፍ ቃል ሀሳብ',    or: 'Jecha Darbii Jabaa' },
  total_complaints:   { en: 'Total Complaints',      am: 'ጠቅላላ ቅሬታዎች',            or: 'Waliigala Iyyata' },
  active_in_progress: { en: 'In Progress',           am: 'በሂደት ላይ ያሉ',            or: 'Hojjatamaa Jiran' },
  resolved_cases:     { en: 'Resolved',              am: 'የተፈቱ',                   or: 'Furamaniiru' },
  proposed_timeline:  { en: 'Proposed Resolution Timeframe', am: 'የሚፈታበት የተገመተ ጊዜ', or: 'Yeroo Furmaata Tilmaamame' },
  target_date:        { en: 'Target Resolution Date', am: 'የመፍትሔው የመጨረሻ ቀን',      or: 'Guyyaa Xumura Furmaataa' },
  admin_response_title:{ en: 'Official Administration Response', am: 'ከአስተዳደሩ የተሰጠ ይፋዊ ምላሽ', or: 'Deebii Rasmi Bulchiinsa Irraa' },
  escalation_notice:  { en: 'If not resolved within the promised timeframe, please contact:', am: 'በተጠቀሰው ጊዜ ውስጥ ካልተፈታ እባክዎ በዚህ ስልክ ያነጋግሩ:', or: 'Yoo yeroo jedhame keessatti hin furamne bilbila kanaan qunnamaa:' },
  call_now:           { en: 'Call Office',           am: 'ይደውሉ',                   or: 'Bilbilaa' },
  copy_phone:         { en: 'Copy Phone',            am: 'ስልክ ቅዳ',                 or: 'Bilbila Waraabi' },
  copy_ref:           { en: 'Copy Ref',              am: 'መለያ ቅዳ',                 or: 'Koodii Waraabi' },
  copied:             { en: 'Copied!',               am: 'ተቀድቷል!',                 or: 'Waraabameera!' },
  details_evidence:   { en: 'View Details & Evidence', am: 'ዝርዝር እና ማስረጃዎችን ይመልከቱ', or: 'Bal\'ina fi Ragaa Ilaali' },
  hide_details:       { en: 'Hide Details',          am: 'ዝርዝር ደብቅ',               or: 'Bal\'ina Dhoksi' },
  incident_location:  { en: 'Incident Location',     am: 'ጉዳዩ የተከሰተበት ቦታ',      or: 'Bakka Rakkoon Mudate' },
  concerned_staff:    { en: 'Concerned Officer/Staff', am: 'የሚመለከተው ባለሙያ',        or: 'Hojjataa Dhimmi Ilaallatu' },
  attached_evidence:  { en: 'Attached Evidence',     am: 'የተያያዙ ማስረጃዎች',         or: 'Ragaalee Maxxanan' },
  search_placeholder: { en: 'Search by Ref ID, sector, or keyword…', am: 'በመለያ ቁጥር፣ በዘርፍ ወይም በቃላት ይፈልጉ…', or: 'Koodii, damee ykn jechaan barbaadi…' },
  filter_all:         { en: 'All Statuses',          am: 'ሁሉም',                    or: 'Hunda' },
  filter_assigning:   { en: 'Assigning',             am: 'በመመደብ ላይ',              or: 'Ramadamaa' },
  filter_in_progress: { en: 'In Progress',           am: 'በሂደት ላይ',                or: 'Adeemsa Irra' },
  filter_resolved:    { en: 'Resolved',              am: 'የተፈታ',                   or: 'Furameera' },
}

const StrengthBar = ({ password }) => {
  if (!password) return null
  const { score } = validatePasswordStrength(password)
  const colors = ['bg-red-500','bg-orange-500','bg-yellow-400','bg-emerald-500','bg-emerald-600']
  const labels = ['Very Weak','Weak','Fair','Strong','Very Strong']
  const idx = Math.min(score ?? 0, 4)
  return (
    <div className='mt-2'>
      <div className='flex gap-1'>{[0,1,2,3,4].map(i=><div key={i} className={`h-1 flex-1 rounded-full ${i<=idx?colors[idx]:'bg-slate-200'} transition-all`}/>)}</div>
      <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${idx<2?'text-red-500':idx<4?'text-orange-400':'text-emerald-700'}`}>{labels[idx]}</p>
    </div>
  )
}

// ── Interactive Multi-Step Timeline ──────────────────────────────────────────
function ComplaintProgressStepper({ status, timeframe, t }) {
  const norm = (status || '').toLowerCase().trim()
  const isRejected = norm === 'rejected' || norm === 'canceled' || norm === 'cancelled'

  // Step indexes: 0: assigning, 1: in progress, 2: resolved
  let activeStep = 0
  if (norm === 'in progress') activeStep = 1
  if (norm === 'resolved') activeStep = 2

  const steps = [
    {
      title: 'Received & Logged',
      subtitle: 'Ticket verified and sector assigned'
    },
    {
      title: 'Action In Progress',
      subtitle: timeframe ? `Estimated: ${timeframe}` : 'Investigation underway'
    },
    {
      title: 'Solution Delivered',
      subtitle: 'Issue resolved & verified'
    }
  ]

  if (isRejected) {
    return (
      <div className='mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-red-50/60 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl'>
        <div className='flex items-center gap-2 text-red-700 text-xs font-semibold'>
          <span className='w-2 h-2 rounded-full bg-red-500 animate-ping' />
          <span>Ticket Status: {status.toUpperCase()}</span>
        </div>
        <span className='text-xs text-red-600 font-mono'>Closed without resolution</span>
      </div>
    )
  }

  return (
    <div className='mt-5 pt-4 border-t border-slate-100'>
      <div className='grid grid-cols-3 gap-2 relative'>
        {steps.map((step, idx) => {
          const isDone = idx < activeStep
          const isCurrent = idx === activeStep

          return (
            <div key={idx} className='relative flex flex-col items-center text-center'>
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-0 transition-all duration-500 ${
                    idx < activeStep ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Step indicator circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-105'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>

              {/* Step text */}
              <div className='mt-2'>
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </p>
                <p className='text-[10px] text-slate-500 mt-0.5 hidden sm:block leading-snug'>
                  {step.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Redesigned Complaint Card ────────────────────────────────────────────────
function ComplaintCard({ complaint: c, t, notify }) {
  const [expanded, setExpanded] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  const refId = `CPL-${String(c.id || c.complaint_id || '').padStart(5, '0')}`

  const copyToClipboard = (text, type) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'phone') {
        setCopiedPhone(true)
        setTimeout(() => setCopiedPhone(false), 2000)
      } else {
        setCopiedRef(true)
        setTimeout(() => setCopiedRef(false), 2000)
      }
      notify(t('copied'), 'success')
    }).catch(() => {
      notify('Failed to copy', 'error')
    })
  }

  const parseMedia = (raw) => {
    if (!raw) return []
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw) } catch { return [] }
    }
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'object') return [raw]
    return []
  }

  const photos = parseMedia(c.photos)
  const videos = parseMedia(c.videos)
  const audios = parseMedia(c.audios)
  const hasEvidence = photos.length > 0 || videos.length > 0 || audios.length > 0

  const hasTimeline = Boolean(c.estimated_resolution_timeframe || c.estimated_resolution_date)
  const hasAdminResponse = Boolean(c.admin_response)
  const hasContactPhone = Boolean(c.admin_contact_phone)

  return (
    <div className='bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group'>
      {/* Top Header Row */}
      <div className='flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b border-slate-100'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <span className='font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/70'>
              #{refId}
            </span>
            <button
              type='button'
              onClick={() => copyToClipboard(refId, 'ref')}
              title='Copy Reference ID'
              className='text-slate-400 hover:text-emerald-700 text-xs transition-colors cursor-pointer'
            >
              {copiedRef ? '✓' : '⧉'}
            </button>
            <span className='text-xs text-slate-400'>•</span>
            <span className='text-xs text-slate-500 font-medium'>
              {c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
            </span>
          </div>

          <h3 className='font-goldman font-bold text-lg text-slate-900 tracking-wide pt-0.5 group-hover:text-emerald-700 transition-colors'>
            {c.type || 'General Complaint'}
          </h3>
        </div>

        <Status status={c.status} />
      </div>

      {/* Description Snippet */}
      <div className='mt-3.5 text-sm text-slate-700 font-light leading-relaxed'>
        <p className={expanded ? '' : 'line-clamp-2'}>{c.description}</p>
      </div>

      {/* ── HIGH PRIORITY: Proposed Resolution Timeframe Banner ── */}
      {hasTimeline && (
        <div className='mt-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-l-4 border-emerald-600 rounded-r-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0'>
              ⏱️
            </div>
            <div>
              <p className='text-[10px] uppercase font-bold tracking-wider text-emerald-800 font-goldman'>
                {t('proposed_timeline')}
              </p>
              <p className='text-sm sm:text-base font-bold text-slate-900'>
                {c.estimated_resolution_timeframe || '3 - 5 Days'}
              </p>
            </div>
          </div>

          {c.estimated_resolution_date && (
            <div className='text-left sm:text-right font-mono text-xs text-emerald-800 bg-white/80 border border-emerald-200/70 px-2.5 py-1 rounded-lg self-start sm:self-auto'>
              <span className='text-[10px] uppercase font-semibold text-slate-500 block'>{t('target_date')}</span>
              {new Date(c.estimated_resolution_date).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* ── HIGH PRIORITY: Official Administration Response Box ── */}
      {(hasAdminResponse || hasContactPhone) && (
        <div className='mt-3.5 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5'>
          {hasAdminResponse && (
            <div>
              <div className='flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1'>
                <span className='text-emerald-600'>🏛️</span>
                <span>{t('admin_response_title')}</span>
              </div>
              <p className='text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-100'>
                &ldquo;{c.admin_response}&rdquo;
              </p>
            </div>
          )}

          {/* Escalation Contact Callout */}
          {hasContactPhone && (
            <div className='pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5'>
              <div>
                <p className='text-[11px] font-semibold text-slate-700'>
                  {t('escalation_notice')}
                </p>
                <p className='text-sm font-bold font-mono text-emerald-700 tracking-wide'>
                  📞 {c.admin_contact_phone}
                </p>
              </div>

              <div className='flex items-center gap-2 self-start sm:self-auto'>
                <a
                  href={`tel:${c.admin_contact_phone.replace(/\s+/g, '')}`}
                  className='px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs'
                >
                  <span>📞</span>
                  <span>{t('call_now')}</span>
                </a>
                <button
                  type='button'
                  onClick={() => copyToClipboard(c.admin_contact_phone, 'phone')}
                  className='px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer'
                >
                  {copiedPhone ? t('copied') : t('copy_phone')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Progress Stepper ── */}
      <ComplaintProgressStepper
        status={c.status}
        timeframe={c.estimated_resolution_timeframe}
        t={t}
      />

      {/* ── Expandable Details Drawer ── */}
      {expanded && (
        <div className='mt-4 pt-4 border-t border-slate-100 text-xs space-y-3 animate-fade-in'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100'>
            <div>
              <p className='text-[10px] uppercase font-bold text-slate-400 mb-0.5'>{t('incident_location')}</p>
              <p className='font-semibold text-slate-800'>
                {c.complaint_subcity || c.complainer_subcity || 'Lideta'}, Woreda {c.complaint_woreda || c.complainer_woreda || '—'}
                {c.complainer_house_number ? `, House #${c.complainer_house_number}` : ''}
              </p>
            </div>
            {c.concerned_staff_member && (
              <div>
                <p className='text-[10px] uppercase font-bold text-slate-400 mb-0.5'>{t('concerned_staff')}</p>
                <p className='font-semibold text-slate-800'>{c.concerned_staff_member}</p>
              </div>
            )}
          </div>

          {/* Attached Evidence Media */}
          {hasEvidence && (
            <div>
              <p className='text-[10px] uppercase font-bold text-slate-400 mb-2'>{t('attached_evidence')}</p>
              <div className='space-y-2'>
                {photos.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {photos.map((p, i) => (
                      <a
                        key={i}
                        href={p.url || p}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-mono transition-colors'
                      >
                        📷 Photo {i + 1}
                      </a>
                    ))}
                  </div>
                )}
                {audios.length > 0 && (
                  <div className='space-y-1'>
                    {audios.map((a, i) => (
                      <div key={i} className='bg-slate-100 p-2 rounded-lg'>
                        <p className='text-[10px] text-slate-500 mb-1 font-mono'>Voice Note {i + 1}</p>
                        <audio controls className='w-full h-8' src={a.url || a} />
                      </div>
                    ))}
                  </div>
                )}
                {videos.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {videos.map((v, i) => (
                      <a
                        key={i}
                        href={v.url || v}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-mono transition-colors'
                      >
                        🎥 Video Clip {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expand / Collapse Action */}
      <div className='mt-3.5 pt-2 flex justify-end'>
        <button
          type='button'
          onClick={() => setExpanded(!expanded)}
          className='text-xs font-goldman font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1 transition-colors'
        >
          <span>{expanded ? t('hide_details') : t('details_evidence')}</span>
          <span>{expanded ? '▲' : '▼'}</span>
        </button>
      </div>
    </div>
  )
}

function UserDashboard() {
  const { user, userToken, logout, login } = useUser()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = (k) => T[k]?.[language] || T[k]?.en || k

  const [activeTab, setActiveTab] = useState('complaints')
  const [complaints, setComplaints] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotif] = useState({ isOpen:false, message:'', type:'success' })
  const notify = (msg, type='success') => setNotif({ isOpen:true, message:msg, type })

  // Search & Filter state for complaints
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [verifyOtp, setVerifyOtp] = useState(['','','','','',''])
  const [showVerify, setShowVerify] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const verifyRefs = useRef([])

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingPass, setEditingPass] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileForm, setProfileForm] = useState(() => ({
    first_name: user?.first_name||'',
    last_name: user?.last_name||'',
    phone: user?.phone||''
  }))
  const [passForm, setPassForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' })
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

  // Filtered complaints based on search query & status pill
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const normStatus = (c.status || '').toLowerCase()
      if (statusFilter !== 'All' && normStatus !== statusFilter.toLowerCase()) {
        return false
      }
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const refId = `cpl-${String(c.id || '').padStart(5, '0')}`
      return (
        refId.includes(q) ||
        (c.type || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.complaint_subcity || '').toLowerCase().includes(q)
      )
    })
  }, [complaints, statusFilter, searchQuery])

  // Complaint stats
  const totalCount = complaints.length
  const inProgressCount = complaints.filter(c => ['assigning', 'in progress'].includes((c.status || '').toLowerCase())).length
  const resolvedCount = complaints.filter(c => (c.status || '').toLowerCase() === 'resolved').length

  const inputCls = 'w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all'
  const labelCls = 'block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5'
  const tabCls = (tKey) => `px-5 py-3 text-sm font-goldman font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer border-b-2 ${activeTab===tKey ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-emerald-600/80'}`

  if (loading) return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
      <div className='flex gap-1.5'>
        {[0,1,2].map(i=><div key={i} className='w-3 h-3 bg-emerald-600 rounded-full animate-bounce' style={{animationDelay:`${i*100}ms`}}/>)}
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-slate-50 text-slate-800 font-roboto animate-fade-in pb-16'>
      <Notification isOpen={notification.isOpen} message={notification.message} type={notification.type} onClose={() => setNotif(n=>({...n,isOpen:false}))} />

      {/* Top Navbar */}
      <div className='bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs'>
        <Link to='/' className='hover:opacity-90 transition-opacity'><LidetaLogo className='w-28' /></Link>
        <div className='flex items-center gap-4'>
          <div className='text-right hidden sm:block'>
            <span className='text-sm font-bold text-slate-800 block'>{user?.first_name} {user?.last_name}</span>
            <span className='text-xs text-slate-400 font-mono'>{user?.email}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/') }}
            className='text-xs px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-goldman font-bold uppercase tracking-wider cursor-pointer transition-all duration-300'
          >
            {t('logout')}
          </button>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-goldman font-bold text-slate-900 uppercase tracking-wide'>
              {t('dashboard')}
            </h1>
            <p className='text-sm text-slate-500 mt-1'>
              {t('dashboard_subtitle')}
            </p>
          </div>
        </div>

        {/* Email verification banner (commented out for later implementation) */}
        {/*
        {user && !user.email_verified && (
          <div className='mb-8 bg-emerald-50 border border-emerald-600/30 rounded-2xl p-5 shadow-xs'>
            {!showVerify ? (
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex items-start gap-3.5'>
                  <span className='text-emerald-600 text-2xl mt-0.5'>✉️</span>
                  <div>
                    <p className='font-goldman font-bold text-sm text-emerald-800 uppercase tracking-wider'>Verify your email address</p>
                    <p className='text-xs text-slate-600 mt-0.5 font-light'>Your email <strong className='font-mono text-emerald-800'>{user.email}</strong> is not verified yet.</p>
                  </div>
                </div>
                <button
                  onClick={handleSendVerification}
                  className='px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-goldman font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto'
                >
                  Verify Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyEmail} className='space-y-4'>
                <p className='text-sm font-goldman font-bold text-emerald-800 uppercase tracking-wider'>Enter the 6-digit code sent to {user.email}</p>
                <div className='flex flex-wrap items-center gap-3'>
                  <div className='flex gap-2'>
                    {verifyOtp.map((d, i) => (
                      <input
                        key={i}
                        ref={el => verifyRefs.current[i] = el}
                        type='text'
                        inputMode='numeric'
                        maxLength={1}
                        value={d}
                        onChange={e => {
                          if (!/^\d?$/.test(e.target.value)) return
                          const next = [...verifyOtp]; next[i] = e.target.value; setVerifyOtp(next)
                          if (e.target.value && i < 5) verifyRefs.current[i+1]?.focus()
                        }}
                        onKeyDown={e => { if (e.key==='Backspace' && !verifyOtp[i] && i>0) verifyRefs.current[i-1]?.focus() }}
                        className='w-10 h-10 text-center text-lg font-bold border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-emerald-600'
                      />
                    ))}
                  </div>
                  <button
                    type='submit'
                    disabled={verifying}
                    className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-goldman font-bold uppercase tracking-widest rounded-xl transition-all shadow-xs cursor-pointer'
                  >
                    {verifying ? '…' : 'Confirm'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowVerify(false)}
                    className='px-3 py-2 text-xs font-goldman font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 cursor-pointer'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        */}

        {/* Navigation Tabs */}
        <div className='flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto'>
          {['complaints','applications','profile'].map(tab => (
            <button key={tab} className={tabCls(tab)} onClick={() => setActiveTab(tab)}>
              {t(tab)}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            ── TAB 1: COMPLAINTS ──
        ══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'complaints' && (
          <div className='space-y-6'>
            {/* Quick Metrics Bar */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5'>
              <div className='bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center justify-between'>
                <div>
                  <p className='text-[10px] uppercase tracking-wider font-bold text-slate-400 font-goldman'>{t('total_complaints')}</p>
                  <p className='text-2xl font-bold text-slate-800 mt-1 font-mono'>{totalCount}</p>
                </div>
                <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-lg'>
                  📋
                </div>
              </div>

              <div className='bg-white border border-emerald-200 rounded-2xl p-4.5 shadow-xs flex items-center justify-between bg-emerald-50/30'>
                <div>
                  <p className='text-[10px] uppercase tracking-wider font-bold text-emerald-800 font-goldman'>{t('active_in_progress')}</p>
                  <p className='text-2xl font-bold text-emerald-700 mt-1 font-mono'>{inProgressCount}</p>
                </div>
                <div className='w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg animate-pulse'>
                  ⚙️
                </div>
              </div>

              <div className='bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center justify-between'>
                <div>
                  <p className='text-[10px] uppercase tracking-wider font-bold text-slate-400 font-goldman'>{t('resolved_cases')}</p>
                  <p className='text-2xl font-bold text-emerald-700 mt-1 font-mono'>{resolvedCount}</p>
                </div>
                <div className='w-10 h-10 rounded-xl bg-emerald-100/60 flex items-center justify-center text-emerald-700 text-lg'>
                  ✓
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            {complaints.length > 0 && (
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder={t('search_placeholder')}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-800'
                  />
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>🔍</span>
                </div>

                {/* Status Filter Chips */}
                <div className='flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0'>
                  {[
                    { key: 'All', label: t('filter_all') },
                    { key: 'in progress', label: t('filter_in_progress') },
                    { key: 'assigning', label: t('filter_assigning') },
                    { key: 'resolved', label: t('filter_resolved') }
                  ].map(f => (
                    <button
                      key={f.key}
                      type='button'
                      onClick={() => setStatusFilter(f.key)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                        statusFilter === f.key
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Complaints List */}
            {complaints.length === 0 ? (
              <div className='bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center'>
                <div className='w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl mb-4'>
                  📝
                </div>
                <p className='font-goldman font-bold text-lg uppercase tracking-wide text-slate-800'>{t('no_complaints')}</p>
                <p className='text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed'>{t('no_complaints_sub')}</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className='bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500'>
                <p className='text-sm font-semibold text-slate-700'>No complaints matching your criteria</p>
                <p className='text-xs text-slate-400 mt-1'>Try clearing the search or status filter</p>
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('All') }}
                  className='mt-3 text-xs text-emerald-700 font-bold uppercase tracking-wider hover:underline'
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredComplaints.map(c => (
                  <ComplaintCard
                    key={c.id || c.complaint_id}
                    complaint={c}
                    t={t}
                    notify={notify}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            ── TAB 2: APPLICATIONS ──
        ══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div className='space-y-6'>
            {applications.length === 0 ? (
              <div className='bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center'>
                <FileIcon className='w-14 h-14 mb-4 opacity-30 text-emerald-600' />
                <p className='font-goldman font-bold text-lg uppercase tracking-wide text-slate-700'>{t('no_apps')}</p>
                <Link to='/vacancy' className='mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-goldman font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-105 active:scale-95 text-xs'>
                  {t('apply_now')}
                </Link>
              </div>
            ) : applications.map(a => (
              <div key={a.id} className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-emerald-600/30 group'>
                <div className='flex items-start justify-between mb-3.5'>
                  <div>
                    <p className='font-goldman font-bold text-lg text-slate-800 tracking-wide group-hover:text-emerald-700 transition-colors'>{a.vacancy_title || '—'}</p>
                    <p className='text-xs text-emerald-700 font-goldman uppercase tracking-wider mt-1.5'>{a.location} · {a.job_type} · {a.category}</p>
                    <p className='text-xs text-slate-400 font-mono mt-1'>{t('applied')}: {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <Status status={a.status} />
                </div>
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

        {/* ══════════════════════════════════════════════════════════════════════════
            ── TAB 3: PROFILE SETTINGS ──
        ══════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className='space-y-6 max-w-lg animate-fade-in'>
            {/* Personal info */}
            <div className='bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200'>
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
            <div className='bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200'>
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
