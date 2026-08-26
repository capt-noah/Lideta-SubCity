import BASE_URL from '../utils/api'
import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../components/utils/LanguageContext.jsx'
import EventCard, { CalendarWidget } from '../components/ui/EventCard.jsx'
import AnimatedCard from '../components/ui/AnimatedCard.jsx'
import Loading from '../components/ui/Loading.jsx'
import eventsData from '../data/events.json'
import translatedContents from '../data/translated_contents.json'
import ArrowRight from '../assets/icons/arrow_right.svg?react'
import LocationIcon from '../assets/icons/location_icon.svg?react'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'
import ImageIcon from '../assets/icons/image_icon.svg?react'

// ─── Status pill (inline, no import from Status.jsx to avoid dependency) ──────
const STATUS_PILL = {
  upcoming:  'bg-blue-50 text-blue-700 border-blue-100',
  pending:   'bg-amber-50 text-amber-700 border-amber-100',
  complete:  'bg-green-50 text-green-700 border-green-100',
  completed: 'bg-green-50 text-green-700 border-green-100',
  canceled:  'bg-red-50 text-red-700 border-red-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
}

// ─── Photo helper ─────────────────────────────────────────────────────────────
function getPhotoSrc(photos) {
  if (!photos) return null
  if (Array.isArray(photos) && photos.length > 0) {
    const p = photos[0]
    return p?.path || (typeof p === 'string' ? p : null)
  }
  if (typeof photos === 'object' && photos.path) return photos.path
  if (typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]?.path || null
      if (parsed.path) return parsed.path
    } catch { if (photos.startsWith('/')) return photos }
  }
  return null
}

// ─── Format date range ────────────────────────────────────────────────────────
const formatDate = (d) => {
  const p = new Date(d)
  return isNaN(p) ? d : p.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Reading progress bar ─────────────────────────────────────────────────────
function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div className='fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none'>
      <div className='h-full bg-amber-500 transition-all duration-100' style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function EventDetails() {
  const { language } = useLanguage()
  const t = translatedContents.events_page.details
  const navigate = useNavigate()
  const { id } = useParams()

  const [currentEvent, setCurrentEvent] = useState(null)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setIsLoading(true); setImgLoaded(false); setImgError(false)
    async function fetchEvents() {
      try {
        const res = await fetch(`${BASE_URL}/api/events`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        const formatted = data.map(item => ({
          ...item,
          id:          item.id?.toString() || item.event_id?.toString() || '',
          startDate:   item.start_date || item.startDate || item.date,
          date:        item.start_date || item.startDate || item.date,
          photos:      item.photos || item.photo || null,
          status:      item.status || 'Upcoming',
          description: item.description || '',
          amh:         item.amh,
          orm:         item.orm,
        }))
        const ev = formatted.find(e => e.id === id) || formatted[0]
        setCurrentEvent(ev)
        setRelatedEvents(formatted.filter(e => e.id !== ev?.id).slice(0, 5))
      } catch {
        const ev = eventsData.find(e => e.id === id) || eventsData[0]
        setCurrentEvent(ev)
        setRelatedEvents(eventsData.filter(e => e.id !== ev?.id).slice(0, 5))
      } finally { setIsLoading(false) }
    }
    fetchEvents()
  }, [id])

  const contentBlocks = useMemo(() => {
    if (!currentEvent) return []
    let desc = currentEvent.description
    if (language === 'am' && currentEvent.amh?.description) desc = currentEvent.amh.description
    else if (language === 'or' && currentEvent.orm?.description) desc = currentEvent.orm.description
    if (Array.isArray(currentEvent.content) && currentEvent.content.length) return currentEvent.content
    return desc ? desc.split('\n').map(p => p.trim()).filter(Boolean) : ['No description available.']
  }, [currentEvent, language])

  if (isLoading || !currentEvent) {
    return <div className='w-full flex justify-center items-center min-h-screen bg-[#f0f4f2]'><Loading /></div>
  }

  const title = (language === 'am' && currentEvent.amh?.title) ? currentEvent.amh.title
              : (language === 'or' && currentEvent.orm?.title) ? currentEvent.orm.title
              : currentEvent.title

  const location = (language === 'am' && currentEvent.amh?.location) ? currentEvent.amh.location
                 : (language === 'or' && currentEvent.orm?.location) ? currentEvent.orm.location
                 : currentEvent.location

  const imageSrc = getPhotoSrc(currentEvent.photos)
  const statusCls = STATUS_PILL[currentEvent.status?.toLowerCase()] || 'bg-gray-50 text-gray-600 border-gray-200'

  const backLabel    = t?.back_to_events?.[language] || 'Back to Events'
  const otherLabel   = t?.other_events?.[language]   || 'Other Events'

  return (
    <>
      <ReadingProgress />
      <div className='w-full bg-[#f0f4f2] min-h-screen'>

        {/* ── Sticky breadcrumb bar ──────────────────────────────────────── */}
        <div className='w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-3'>
            <button
              onClick={() => navigate('/events')}
              className='flex items-center gap-2 text-sm font-goldman font-bold text-emerald-900 hover:text-amber-600 transition-colors duration-200 cursor-pointer group'
            >
              <ArrowRight className='w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-200' />
              {backLabel}
            </button>
            <span className='text-gray-300'>›</span>
            {currentEvent.status && (
              <>
                <span className='text-sm font-jost text-gray-500'>{currentEvent.status}</span>
                <span className='text-gray-300'>›</span>
              </>
            )}
            <span className='text-sm font-jost text-gray-400 line-clamp-1 flex-1 hidden sm:block'>{title}</span>
          </div>
        </div>

        {/* ── Compact header ─────────────────────────────────────────────── */}
        <div className='w-full bg-white border-b border-gray-100'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 py-5'>
            <div className='max-w-3xl'>
              {/* Status + date meta row */}
              <div className='flex items-center gap-2.5 mb-3 flex-wrap'>
                <span className={`text-[10px] font-goldman font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusCls}`}>
                  {currentEvent.status}
                </span>
                {currentEvent.startDate && (
                  <span className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
                    <CalenderIcon className='w-3 h-3 text-emerald-600/40' />
                    {formatDate(currentEvent.startDate)}
                  </span>
                )}
                {location && (
                  <span className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
                    <LocationIcon className='w-3 h-3 text-emerald-600/40' />
                    {location}
                  </span>
                )}
              </div>

              {/* Event title */}
              <h1 className='font-goldman font-bold text-2xl sm:text-3xl md:text-4xl leading-tight text-emerald-950'>
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Main layout ────────────────────────────────────────────────── */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'>
          <div className='flex flex-col lg:flex-row gap-8 items-start'>

            {/* ── Article column ─────────────────────────────────────────── */}
            <article className='flex-1 min-w-0'>

              {/* Hero image with calendar widget overlay */}
              <div
                className='relative w-full rounded-2xl overflow-hidden bg-emerald-50 mb-8 shadow-[0_4px_32px_rgba(6,78,59,0.12)]'
                style={{ aspectRatio: '16/9', maxHeight: '480px' }}
              >
                {imageSrc && !imgError ? (
                  <>
                    {!imgLoaded && <div className='absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 animate-pulse' />}
                    <img
                      src={imageSrc}
                      alt={title}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImgLoaded(true)}
                      onError={() => setImgError(true)}
                    />
                    {/* Gradient overlay for calendar legibility */}
                    <div className='absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent' />
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 min-h-[200px]'>
                    <ImageIcon className='w-16 h-16 text-emerald-300' />
                  </div>
                )}

                {/* Calendar widget — bottom-left overlay */}
                <div className='absolute bottom-4 left-4 drop-shadow-xl'>
                  <CalendarWidget event={currentEvent} size='lg' />
                </div>

                {/* Status badge — bottom-right */}
                {currentEvent.status && (
                  <div className='absolute bottom-4 right-4'>
                    <span className={`text-[10px] font-goldman font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-sm ${statusCls}`}>
                      {currentEvent.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Event info chips */}
              <div className='flex flex-wrap gap-3 mb-7'>
                {location && (
                  <div className='flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm'>
                    <LocationIcon className='w-4 h-4 text-emerald-700 shrink-0' />
                    <span className='text-sm font-jost font-medium text-emerald-950'>{location}</span>
                  </div>
                )}
                {currentEvent.startDate && (
                  <div className='flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm'>
                    <CalenderIcon className='w-4 h-4 text-emerald-700 shrink-0' />
                    <span className='text-sm font-jost font-medium text-emerald-950'>{formatDate(currentEvent.startDate)}</span>
                  </div>
                )}
              </div>

              {/* Body text — constrained reading column */}
              <div className='max-w-2xl'>
                {contentBlocks.map((para, idx) => (
                  <p
                    key={idx}
                    className={`leading-8 text-gray-700 font-roboto mb-6 ${
                      idx === 0
                        ? 'text-[1.05rem] font-light text-gray-800 border-l-4 border-amber-500 pl-5 py-1 bg-amber-50/30 rounded-r-lg'
                        : 'text-base font-light'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>

            {/* ── Sticky sidebar ─────────────────────────────────────────── */}
            <aside className='w-full lg:w-72 xl:w-80 shrink-0 sticky top-[4.5rem] self-start space-y-5'>

              {/* Other Events */}
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='px-5 py-4 bg-emerald-950'>
                  <h2 className='font-goldman font-bold text-[13px] uppercase tracking-widest text-white'>{otherLabel}</h2>
                </div>
                <div className='p-3 space-y-2'>
                  {relatedEvents.length === 0 ? (
                    <p className='text-xs text-gray-400 font-jost px-2 py-3'>No other events available.</p>
                  ) : (
                    relatedEvents.map((ev, idx) => {
                      const rTitle = (language === 'am' && ev.amh?.title) ? ev.amh.title
                                   : (language === 'or' && ev.orm?.title) ? ev.orm.title : ev.title
                      const rLoc   = (language === 'am' && ev.amh?.location) ? ev.amh.location
                                   : (language === 'or' && ev.orm?.location) ? ev.orm.location : ev.location
                      return (
                        <AnimatedCard key={ev.id} index={idx} stagger={60} maxDelay={400}>
                          <EventCard
                            event={{ ...ev, title: rTitle, location: rLoc }}
                            onClick={() => navigate(`/events/${ev.id}`)}
                          />
                        </AnimatedCard>
                      )
                    })
                  )}
                </div>
                <div className='px-5 py-3 border-t border-gray-100 bg-gray-50/50'>
                  <button
                    onClick={() => navigate('/events')}
                    className='flex items-center gap-1.5 text-[11px] font-goldman font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors duration-200 cursor-pointer'
                  >
                    { { en: 'All Events', am: 'ሁሉም ዝግጅቶች', or: 'Taatee Hunda' }[language] || 'All Events' }
                    <ArrowRight className='w-3 h-3' />
                  </button>
                </div>
              </div>

              {/* "You are viewing" card */}
              <div className='bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-2xl p-5 border border-emerald-800'>
                <p className='text-[10px] font-goldman font-bold uppercase tracking-widest text-emerald-400/70 mb-2'>
                  { { en: 'You are viewing', am: 'እያዩ ያሉት', or: 'Ilaachaa jirtu' }[language] || 'You are viewing' }
                </p>
                <p className='text-sm font-goldman font-bold text-white leading-snug line-clamp-3 mb-3'>{title}</p>
                <div className='flex items-center gap-2 flex-wrap'>
                  {currentEvent.status && (
                    <span className={`text-[9px] font-goldman font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusCls}`}>
                      {currentEvent.status}
                    </span>
                  )}
                  {location && (
                    <span className='flex items-center gap-1 text-[10px] text-emerald-400/60 font-jost'>
                      <LocationIcon className='w-3 h-3' />
                      {location}
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetails
