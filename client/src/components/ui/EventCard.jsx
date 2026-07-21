import React, { useMemo } from 'react'
import Status from './Status.jsx'
import CalenderIcon from '../../assets/icons/calender_icon.svg?react'
import LocationIcon from '../../assets/icons/location_icon.svg?react'

const getDateParts = (event) => {
  const rawDate = event?.startDate || event?.date || event?.start_date
  const parsed = rawDate ? new Date(rawDate) : null

  if (parsed && !isNaN(parsed)) {
    return {
      day: parsed.getDate(),
      dayOfWeek: parsed.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
      month: parsed.toLocaleString('en-US', { month: 'short' }),
      year: parsed.getFullYear()
    }
  }

  return {
    day: event?.day || '--',
    dayOfWeek: event?.dayOfWeek || '',
    month: event?.month || '',
    year: event?.year || ''
  }
}

function EventCard({ event, onClick }) {
  const dateParts = useMemo(() => getDateParts(event), [event])

  return (
    <div
      onClick={onClick}
      className={`group/evt bg-[#FCFAF6] border border-[#0E351D]/10 rounded-2xl p-4 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className='flex gap-4 items-center'>
        {/* Date section only on cards (no image thumbnail) */}
        <div className='flex flex-col items-center justify-center p-2 bg-[#FAF8F2] rounded-xl min-w-[64px] border border-[#0E351D]/10 shadow-inner group-hover/evt:bg-[#0E351D] group-hover/evt:border-[#0E351D] transition-colors duration-300'>
          <span className='text-3xl font-goldman font-bold text-[#0E351D] group-hover/evt:text-amber-400 transition-colors leading-none mb-1'>{dateParts.day}</span>
          <span className='text-[10px] font-bold tracking-wider text-[#0E351D]/70 group-hover/evt:text-emerald-100 transition-colors uppercase'>{dateParts.dayOfWeek}</span>
        </div>

        <div className='w-px h-12 bg-gray-200 rounded-full' />

        <div className='flex-1 min-w-0'>
          <h3 className='font-goldman font-bold text-[#0E351D] mb-2 leading-snug group-hover/evt:text-[#0E351D] transition-colors truncate' title={event.title}>
            {event.title}
          </h3>

          <div className='flex flex-wrap items-center gap-3 text-xs text-gray-500'>
            <Status status={event.status} />

            <div className='flex items-center gap-1 font-light'>
              <CalenderIcon className='w-3.5 h-3.5 text-[#0E351D]/60' />
              <span>{dateParts.month} {dateParts.day}, {dateParts.year}</span>
            </div>

            <div className='flex items-center gap-1 font-light min-w-0'>
              <LocationIcon className='w-3.5 h-3.5 text-[#0E351D]/60 shrink-0' />
              <span className='truncate max-w-[150px]' title={event.location}>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard


