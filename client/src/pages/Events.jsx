import BASE_URL from '../utils/api'
import { motion } from 'framer-motion'
import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/ui/EventCard.jsx'
import Loading from '../components/ui/Loading.jsx'
import AnimatedCard from '../components/ui/AnimatedCard.jsx'
import eventsData from '../data/events.json'
import SearchIcon from '../assets/icons/search_icon.svg'
import ArrowSvg from '../assets/arrow.svg'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'

import SearchBox from '../components/ui/Search.jsx'
import { useLanguage } from '../components/utils/LanguageContext.jsx'
import translatedContents from '../data/translated_contents.json'

const getMonthLabel = (dateValue) => {
  const parsed = new Date(dateValue)
  if (!isNaN(parsed)) {
    return parsed.toLocaleString('en-US', { month: 'long' })
  }
  return 'Other'
}

function Events() {
  const { language } = useLanguage()
  const t = translatedContents.events_page

  const statusFilters = [
    { label: t.filters.all[language], value: 'All' },
    { label: t.filters.upcoming[language], value: 'Upcoming' },
    { label: t.filters.pending[language], value: 'Pending' },
    { label: t.filters.complete[language], value: 'Complete' },
    { label: t.filters.canceled[language], value: 'Canceled' }
  ]

  const navigate = useNavigate()
  const [events, setEvents] = useState(eventsData)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [results, setResults] = useState(null)
  const [noResultFound, setNoResultFound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load events from API (fallback to static JSON on failure)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${BASE_URL}/api/events`)
        if (!res.ok) throw new Error('Failed to load events')
        const data = await res.json()

        const formatted = data.map(item => ({
          ...item,
          id: item.id?.toString() || item.event_id?.toString() || item.events_id?.toString() || item.id,
          title: item.title,
          location: item.location || '',
          status: item.status || 'Upcoming',
          startDate: item.start_date || item.startDate || item.date,
          date: item.start_date || item.startDate || item.date,
          photos: item.photos || item.photo || null,
          amh: item.amh,
          orm: item.orm
        }))

        setEvents(formatted)
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents(eventsData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    // If we have search results (even empty array), use those. Otherwise use all events.
    let source = results !== null ? results : events

    // Filter by status on top of search results
    return source
      .filter(event => {
        // Search is already handled by SearchBox now, but we keep this status filter
        const matchesStatus = selectedStatus === 'All' || event.status?.toLowerCase() === selectedStatus.toLowerCase()
        return matchesStatus
      })
      .sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date))
  }, [selectedStatus, events, results])

  const monthSections = useMemo(() => {
    return filteredEvents.reduce((sections, event) => {
      const monthLabel = getMonthLabel(event.startDate || event.date)
      const existing = sections.find(section => section.label === monthLabel)

      if (existing) {
        existing.events.push(event)
      } else {
        sections.push({ label: monthLabel, events: [event] })
      }

      return sections
    }, [])
  }, [filteredEvents])

  return (
    <div className='w-full bg-white min-h-screen'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-7xl mx-auto flex flex-col gap-6 px-4 pt-10 pb-24'
      >
      <div className='w-full flex flex-col gap-6'>
        <div className='w-fit font-goldman font-bold text-4xl lg:text-5xl flex items-end pb-4 border-b-4 border-emerald-600 pr-10 text-emerald-900'>{t.title[language]}</div>

        <div className='bg-emerald-50 w-full h-full overflow-y-auto rounded-2xl border border-emerald-200 p-4 lg:p-6 space-y-6 mb-20 shadow-md'>

          <div className='flex flex-wrap items-center gap-4 justify-between'>

            <SearchBox data={events} results={results} setResults={setResults} noResultFound={noResultFound} setNoResultFound={setNoResultFound} />

            <div className='border border-emerald-200 rounded-xl p-1.5 bg-emerald-50 shadow-sm flex flex-wrap items-center gap-1.5'>
              {statusFilters.map(status => {
                const isActive = selectedStatus === status.value
                return (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-goldman font-medium transition-all duration-300 cursor-pointer ${isActive ? 'bg-emerald-600 text-white shadow-md border border-emerald-700/10 font-bold' : 'bg-transparent text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900'}`}
                  >
                     {status.label}
                  </button>
                )
              })}
            </div>

            <button className='flex items-center justify-between gap-2 px-5 py-2 rounded-xl bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 shadow-sm font-roboto font-medium text-sm min-w-[120px] cursor-pointer transition-colors self-start lg:self-auto'>
              <span className="text-emerald-900">{language === 'am' ? 'የቅርብ ጊዜ' : language === 'or' ? 'Dhihoo' : 'Latest'}</span>
              <img src={ArrowSvg} alt='' className="w-3 opacity-60" />
            </button>
          </div>

          <div className='w-full h-px bg-emerald-200 mt-5 mb-5' />

          <div className='space-y-10'>
            {isLoading ? (
              <div className="w-full flex justify-center items-center h-64">
                <Loading />
              </div>
            ) : filteredEvents.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-center text-gray-500 w-full'>
                  <CalenderIcon className='w-8 h-8 mb-2 ' />
                  <p className='font-roboto'>{language === 'am' ? 'ምንም ውጤት የለም' : language === 'or' ? 'Wanti tokkoyyuu hin argamne' : 'No events match your filters.'}</p>
                </div>
            ) : (
                monthSections.map(section => (
              <div key={section.label} className='space-y-3'>
                <h3 className='font-goldman font-bold text-emerald-900 text-xl px-1 border-l-4 border-emerald-600 pl-3'>{section.label}</h3>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1'>
                  {
                        section.events.map((event, idx) => {
                         let title = event.title
                         let location = event.location

                         if (language === 'am' && event.amh) {
                             title = event.amh.title || title
                             location = event.amh.location || location
                         } else if (language === 'or' && event.orm) {
                             title = event.orm.title || title
                             location = event.orm.location || location
                         }

                          return (
                          <AnimatedCard key={event.id} index={idx} stagger={80} maxDelay={480}>
                            <EventCard event={{...event, title, location}} onClick={() => navigate(`/events/${event.id}`)} />
                          </AnimatedCard>
                        )})
                  }
                </div>
              </div>
            )))}


          </div>
        </div>
      </div>
      </motion.div>
    </div>
  )
}

export default Events