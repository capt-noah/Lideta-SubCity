import BASE_URL from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/ui/EventCard.jsx'
import AnimatedCard from '../components/ui/AnimatedCard.jsx'
import Loading from '../components/ui/Loading.jsx'
import eventsData from '../data/events.json'
import SearchIcon from '../assets/icons/search_icon.svg?react'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'
import LocationIcon from '../assets/icons/location_icon.svg?react'
import { useLanguage } from '../components/utils/LanguageContext.jsx'
import translatedContents from '../data/translated_contents.json'

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_DOTS = {
  upcoming:  'bg-blue-500',
  pending:   'bg-amber-500',
  complete:  'bg-green-500',
  completed: 'bg-green-500',
  canceled:  'bg-red-500',
  cancelled: 'bg-red-500',
}

// ─── Month label from date ──────────────────────────────────────────────────
const getMonthLabel = (dateValue) => {
  const parsed = new Date(dateValue)
  if (!isNaN(parsed)) return parsed.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  return 'Other'
}

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionDivider({ label }) {
  return (
    <div className='flex items-center gap-3 mb-4 mt-2'>
      <CalenderIcon className='w-3.5 h-3.5 text-amber-500 shrink-0' />
      <span className='font-goldman font-bold text-[11px] uppercase tracking-widest text-emerald-900'>{label}</span>
      <div className='flex-1 h-px bg-gray-200' />
    </div>
  )
}

// ─── Sidebar stats ─────────────────────────────────────────────────────────────
function EventsSidebar({ events, language, onStatusFilter, activeStatus }) {
  const heading = { en: 'Overview', am: 'አጠቃላይ ዕይታ', or: 'Waliigaltee' }[language] || 'Overview'
  const upcomingLabel = { en: 'Upcoming', am: 'የሚመጡ', or: 'Dhufaa jiran' }[language] || 'Upcoming'
  const pendingLabel  = { en: 'Pending',  am: 'በመጠባበቅ ላይ', or: 'Eeggachaa jiran' }[language] || 'Pending'
  const completeLabel = { en: 'Complete', am: 'የተጠናቀቁ', or: 'Xumuramanii' }[language] || 'Complete'
  const cancelLabel   = { en: 'Canceled', am: 'የተሰረዙ', or: 'Haqamanii' }[language] || 'Canceled'

  const upcoming = events.filter(e => e.status?.toLowerCase() === 'upcoming').length
  const pending  = events.filter(e => e.status?.toLowerCase() === 'pending').length
  const complete = events.filter(e => ['complete','completed'].includes(e.status?.toLowerCase())).length
  const canceled = events.filter(e => ['canceled','cancelled'].includes(e.status?.toLowerCase())).length

  const stats = [
    { label: upcomingLabel, count: upcoming, status: 'Upcoming', dot: 'bg-blue-500',  text: 'text-blue-700'  },
    { label: pendingLabel,  count: pending,  status: 'Pending',  dot: 'bg-amber-500', text: 'text-amber-700' },
    { label: completeLabel, count: complete, status: 'Complete', dot: 'bg-green-500', text: 'text-green-700' },
    { label: cancelLabel,   count: canceled, status: 'Canceled', dot: 'bg-red-500',   text: 'text-red-700'   },
  ]

  return (
    <aside className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='px-5 py-4 bg-emerald-950'>
        <h2 className='font-goldman font-bold text-[13px] uppercase tracking-widest text-white'>{heading}</h2>
      </div>

      {/* Stat rows */}
      <div className='divide-y divide-gray-50'>
        {stats.map(s => (
          <button
            key={s.status}
            onClick={() => onStatusFilter(activeStatus === s.status ? 'All' : s.status)}
            className={`group w-full flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 text-left cursor-pointer ${activeStatus === s.status ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
            <span className={`flex-1 text-sm font-jost font-medium ${activeStatus === s.status ? 'text-emerald-900 font-semibold' : 'text-gray-600'}`}>{s.label}</span>
            <span className={`text-sm font-goldman font-bold ${s.count > 0 ? s.text : 'text-gray-300'}`}>{s.count}</span>
          </button>
        ))}
      </div>

      {/* Total */}
      <div className='px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between'>
        <span className='text-[11px] font-goldman font-bold uppercase tracking-wider text-gray-400'>
          { { en: 'Total Events', am: 'ጠቅላላ ዝግጅቶች', or: 'Taatee Hunda' }[language] || 'Total Events' }
        </span>
        <span className='font-goldman font-bold text-emerald-900'>{events.length}</span>
      </div>
    </aside>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
function Events() {
  const { language } = useLanguage()
  const t = translatedContents.events_page
  const navigate = useNavigate()

  const [events, setEvents]                 = useState([])
  const [isLoading, setIsLoading]           = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchTerm, setSearchTerm]         = useState('')
  const [searchFocused, setSearchFocused]   = useState(false)

  const statusFilters = [
    { label: t.filters.all[language],      value: 'All'      },
    { label: t.filters.upcoming[language], value: 'Upcoming' },
    { label: t.filters.pending[language],  value: 'Pending'  },
    { label: t.filters.complete[language], value: 'Complete' },
    { label: t.filters.canceled[language], value: 'Canceled' },
  ]

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${BASE_URL}/api/events`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setEvents(data.map(item => ({
          ...item,
          id:        item.id?.toString() || item.event_id?.toString() || '',
          startDate: item.start_date || item.startDate || item.date,
          date:      item.start_date || item.startDate || item.date,
          photos:    item.photos || item.photo || null,
          status:    item.status || 'Upcoming',
          amh:       item.amh,
          orm:       item.orm,
        })))
      } catch {
        setEvents(eventsData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // i18n helpers
  const getTitle = (e) => {
    if (language === 'am' && e.amh?.title) return e.amh.title
    if (language === 'or' && e.orm?.title) return e.orm.title
    return e.title
  }
  const getLocation = (e) => {
    if (language === 'am' && e.amh?.location) return e.amh.location
    if (language === 'or' && e.orm?.location) return e.orm.location
    return e.location
  }

  // Filtered list
  const filteredEvents = useMemo(() => {
    let list = events
    if (selectedStatus !== 'All') {
      list = list.filter(e => {
        const s = e.status?.toLowerCase()
        if (selectedStatus === 'Complete') return s === 'complete' || s === 'completed'
        if (selectedStatus === 'Canceled') return s === 'canceled' || s === 'cancelled'
        return s === selectedStatus.toLowerCase()
      })
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(e =>
        getTitle(e)?.toLowerCase().includes(term) ||
        getLocation(e)?.toLowerCase().includes(term)
      )
    }
    return list.sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date))
  }, [events, selectedStatus, searchTerm, language])

  // Group by month
  const monthSections = useMemo(() => {
    const map = new Map()
    filteredEvents.forEach(ev => {
      const label = getMonthLabel(ev.startDate || ev.date)
      if (!map.has(label)) map.set(label, [])
      map.get(label).push(ev)
    })
    return Array.from(map.entries()).map(([label, evs]) => ({ label, events: evs }))
  }, [filteredEvents])

  const noResults = !isLoading && filteredEvents.length === 0

  return (
    <div className='w-full bg-[#f0f4f2] min-h-screen'>

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='font-goldman font-bold text-2xl md:text-3xl text-emerald-950 leading-tight'>
              {t.title[language]}
            </h1>
            <p className='text-xs text-gray-400 font-jost mt-0.5'>
              {language === 'am' ? 'ልደታ ክፍለ ከተማ አስተዳደር' : language === 'or' ? 'Bulchiinsa Kutaa Magaalaa Lideta' : 'Lideta Sub-City Administration'}
            </p>
          </div>

          {/* Search */}
          <div className={`relative transition-all duration-300 ${searchFocused ? 'w-72' : 'w-56'}`}>
            <SearchIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/50' />
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={language === 'am' ? 'ዝግጅት ፈልግ…' : language === 'or' ? 'Taatee barbaadi…' : 'Search events…'}
              className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all font-roboto'
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none'>×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Status tab bar ──────────────────────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3'>
          <div className='flex items-center gap-1.5 overflow-x-auto' style={{ scrollbarWidth: 'none' }}>
            {statusFilters.map(f => {
              const isActive = selectedStatus === f.value
              const dot = STATUS_DOTS[f.value.toLowerCase()]
              const count = f.value === 'All'
                ? events.length
                : events.filter(e => {
                    const s = e.status?.toLowerCase()
                    if (f.value === 'Complete') return s === 'complete' || s === 'completed'
                    if (f.value === 'Canceled') return s === 'canceled' || s === 'cancelled'
                    return s === f.value.toLowerCase()
                  }).length
              return (
                <button
                  key={f.value}
                  onClick={() => setSelectedStatus(f.value)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-goldman font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-800 hover:bg-emerald-50/50'
                  }`}
                >
                  {dot && f.value !== 'All' && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-amber-400' : dot}`} />
                  )}
                  {f.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'>
        <div className='flex flex-col lg:flex-row gap-6 items-start'>

          {/* ── Event list ──────────────────────────────────────────────────── */}
          <div className='flex-1 min-w-0'>
            {isLoading ? (
              <div className='flex justify-center items-center h-64'><Loading /></div>
            ) : noResults ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className='flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100'
              >
                <div className='w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4'>
                  <CalenderIcon className='w-8 h-8 text-emerald-700/30' />
                </div>
                <p className='font-goldman font-bold text-lg text-emerald-950 mb-2'>
                  {language === 'am' ? 'ምንም ዝግጅት አልተገኘም' : language === 'or' ? 'Taatee hin argamne' : 'No events found'}
                </p>
                {(selectedStatus !== 'All' || searchTerm) && (
                  <button
                    onClick={() => { setSelectedStatus('All'); setSearchTerm('') }}
                    className='mt-3 px-5 py-2.5 bg-emerald-900 text-white font-goldman font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all cursor-pointer'
                  >
                    { { en: 'Show All Events', am: 'ሁሉንም ዝግጅቶች አሳይ', or: 'Taatee Hunda Agarsiisi' }[language] || 'Show All Events' }
                  </button>
                )}
              </motion.div>
            ) : (
              <div className='space-y-8'>
                {monthSections.map(({ label, events: sectionEvents }) => (
                  <div key={label}>
                    <SectionDivider label={label} />
                    <div className='space-y-3'>
                      {sectionEvents.map((ev, idx) => {
                        const title    = getTitle(ev)
                        const location = getLocation(ev)
                        return (
                          <AnimatedCard key={ev.id} index={idx} stagger={55} maxDelay={500}>
                            <EventCard
                              event={{ ...ev, title, location }}
                              onClick={() => navigate(`/events/${ev.id}`)}
                            />
                          </AnimatedCard>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events
