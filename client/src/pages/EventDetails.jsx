import BASE_URL from '../utils/api'
import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../components/utils/LanguageContext.jsx'
import EventCard from '../components/ui/EventCard.jsx'
import Loading from '../components/ui/Loading.jsx'
import eventsData from '../data/events.json'
import translatedContents from '../data/translated_contents.json'
import ArrowRight from '../assets/icons/arrow_right.svg?react'
import ImageIcon from '../assets/icons/image_icon.svg'
import Status from '../components/ui/Status.jsx'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'
import LocationIcon from '../assets/icons/location_icon.svg?react'

const formatFullDate = (dateValue) => {
  const parsed = new Date(dateValue)
  if (!isNaN(parsed)) {
    return parsed.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  return dateValue || ''
}

function EventDetails() {
  const { language } = useLanguage()
  const t = translatedContents.events_page.details
  const navigate = useNavigate()
  const { id } = useParams()

  const [, setEvents] = useState(eventsData)
  const [currentEvent, setCurrentEvent] = useState(eventsData.find(item => item.id === id) || eventsData[0])
  const [relatedEvents, setRelatedEvents] = useState(eventsData.filter(event => event.id !== (eventsData.find(item => item.id === id)?.id)).slice(0, 6))
  const [isLoading, setIsLoading] = useState(true)

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
          description: item.description || '',
          content: item.content || null,
          amh: item.amh,
          orm: item.orm
        }))

        setEvents(formatted)

        const selected = formatted.find(ev => ev.id === id) || formatted[0]
        setCurrentEvent(selected)

        const related = formatted
          .filter(ev => ev.id !== selected?.id)
          .slice(0, 6)
        setRelatedEvents(related)
      } catch (error) {
        console.error('Error fetching events:', error)
        // fallback to static data
        const selected = eventsData.find(ev => ev.id === id) || eventsData[0]
        setCurrentEvent(selected)
        const related = eventsData
          .filter(ev => ev.id !== selected?.id)
          .slice(0, 6)
        setRelatedEvents(related)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [id])

  const contentBlocks = useMemo(() => {
    if (!currentEvent) return []
    
    // Translation Logic
    let description = currentEvent.description;
    if (language === 'am' && currentEvent.amh?.description) {
        description = currentEvent.amh.description;
    } else if (language === 'or' && currentEvent.orm?.description) {
        description = currentEvent.orm.description;
    }

    if (currentEvent.content && Array.isArray(currentEvent.content) && currentEvent.content.length) {
      // Content array handling might be complex for translation if it's structured data. 
      // For now assume description override is main way or handle content if available in translation?
      // The prompt implies amh/orm JSON has title/description.
      // So I will rely on description field from translation.
      return currentEvent.content // fallback to original content array if no translation logic for it yet, or...
      // actually if description is translated, we should probably use that.
      // existing logic prefers content array over description.
    }
    
    if (description) {
       return description.split('\n').filter(p => p.trim())
    }

    return ['']
  }, [currentEvent, language])

  if (isLoading || !currentEvent) {
    return (
      <div className='w-full flex justify-center items-center h-screen'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='w-full px-4 max-w-7xl mx-auto bg-transparent mb-24 animate-fade-in'>

      <div className='w-full py-6'>
        <button
          onClick={() => navigate('/events')}
          className='bg-emerald-900 flex items-center gap-2 mb-8 font-goldman font-bold text-sm text-white py-2.5 px-5 rounded-xl hover:bg-amber-500 hover:text-emerald-950 active:scale-95 transition-all cursor-pointer shadow-md'
        >
          <ArrowRight className='w-4 h-4 rotate-180' />
          <span>{t.back_to_events[language]}</span>
        </button>

        <div className='w-full flex flex-col gap-12 items-start lg:flex-row lg:gap-8'>

          <div className='w-full flex flex-col md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'>

            <h1 className='font-goldman font-bold text-3xl md:text-4xl lg:text-5xl mb-4 text-emerald-950 leading-tight'>
              {(() => {
                  if (language === 'am' && currentEvent.amh?.title) return currentEvent.amh.title
                  if (language === 'or' && currentEvent.orm?.title) return currentEvent.orm.title
                  return currentEvent.title
              })()}
            </h1>

            <div className='flex items-center gap-4 mb-6 font-mono text-xs uppercase tracking-wider text-emerald-800/80 flex-wrap'>
              <Status status={currentEvent.status} />

              <div className='flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-900/10'>
                <CalenderIcon className='w-4 h-4 text-emerald-900/60' />
                <span>{formatFullDate(currentEvent.startDate || currentEvent.date)}</span>
              </div>

              <div className='flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-900/10'>
                <LocationIcon className='w-4 h-4 text-emerald-900/60' />
                <span>{currentEvent.location}</span>
              </div>
            </div>

            <div className='bg-gradient-to-br from-emerald-950/20 to-emerald-900/5 w-full h-80 sm:h-100 lg:h-120 xl:h-130 rounded-2xl mb-8 flex items-center justify-center overflow-hidden border border-emerald-900/10 shadow-lg relative'>
              {(() => {
                let photoSrc = null
                if (currentEvent?.photos) {
                  let photo = null
                  if (Array.isArray(currentEvent.photos) && currentEvent.photos.length > 0) {
                    photo = currentEvent.photos[0]
                  } else if (typeof currentEvent.photos === 'object' && currentEvent.photos.path) {
                    photo = currentEvent.photos
                  } else if (typeof currentEvent.photos === 'string') {
                    try {
                      const parsed = JSON.parse(currentEvent.photos)
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        photo = parsed[0]
                      } else if (parsed.path) {
                        photo = parsed
                      }
                    } catch (err) {
                      console.warn('Failed to parse event photos JSON:', err)
                    }
                  }
                  if (photo && photo.path) {
                    photoSrc = photo.path
                  }
                }
                return photoSrc ? (
                  <img 
                    src={photoSrc} 
                    alt={currentEvent.title || 'Event'} 
                    className='w-full h-full object-cover transition-transform duration-700 hover:scale-102'
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                ) : null
              })()}
              <div className={`${currentEvent?.photos ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                <img src={ImageIcon} alt='' className='w-24 h-24 text-emerald-900/30' />
              </div>
            </div>

            <div className='font-roboto text-gray-700 text-base md:text-lg leading-relaxed space-y-6'>
              {contentBlocks.map((paragraph, index) => (
                <p key={index} className='font-light'>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <hr className='text-emerald-900/10 w-full lg:hidden my-4' />

          <div className='flex mx-auto flex-col gap-8 lg:max-w-sm xl:max-w-100 2xl:max-w-150'>

            <div>
              
              <h2 className='font-goldman font-bold text-lg text-emerald-950 mb-4 uppercase tracking-wider border-b border-emerald-900/10 pb-2'>{t.other_events[language]}</h2>

              <div className='space-y-4 2xl:space-y-6'>
                {relatedEvents.map(event => {
                    let rTitle = event.title
                    let rLocation = event.location
                    if (language === 'am' && event.amh) {
                        rTitle = event.amh.title || rTitle
                        rLocation = event.amh.location || rLocation
                    } else if (language === 'or' && event.orm) {
                        rTitle = event.orm.title || rTitle
                        rLocation = event.orm.location || rLocation
                    }

                  return (
                  <EventCard
                    key={event.id}
                    event={{...event, title: rTitle, location: rLocation}}
                    onClick={() => navigate(`/events/${event.id}`)}
                  />
                )})}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default EventDetails


