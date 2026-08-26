import React, { useMemo } from 'react'
import LocationIcon from '../../assets/icons/location_icon.svg?react'
import ArrowRight from '../../assets/icons/arrow_right.svg?react'

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META = {
  upcoming:  { pill: 'bg-blue-50 text-blue-700 border-blue-100',     dot: 'bg-blue-500',   header: 'bg-emerald-900' },
  pending:   { pill: 'bg-amber-50 text-amber-700 border-amber-100',  dot: 'bg-amber-500',  header: 'bg-amber-500'   },
  complete:  { pill: 'bg-green-50 text-green-700 border-green-100',  dot: 'bg-green-500',  header: 'bg-gray-500'    },
  completed: { pill: 'bg-green-50 text-green-700 border-green-100',  dot: 'bg-green-500',  header: 'bg-gray-500'    },
  canceled:  { pill: 'bg-red-50 text-red-700 border-red-100',        dot: 'bg-red-500',    header: 'bg-gray-400'    },
  cancelled: { pill: 'bg-red-50 text-red-700 border-red-100',        dot: 'bg-red-500',    header: 'bg-gray-400'    },
}
const DEFAULT_STATUS = { pill: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', header: 'bg-emerald-900' }

const getStatusMeta = (status) => STATUS_META[status?.toLowerCase()] || DEFAULT_STATUS

// ─── Date helper ──────────────────────────────────────────────────────────────
const getDateParts = (event) => {
  const raw = event?.startDate || event?.date || event?.start_date
  const parsed = raw ? new Date(raw) : null
  if (parsed && !isNaN(parsed)) {
    return {
      day:   parsed.getDate(),
      month: parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      year:  parsed.getFullYear(),
      full:  parsed.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
  }
  return { day: '--', month: '---', year: '', full: '' }
}

// ─── Calendar widget ──────────────────────────────────────────────────────────
export function CalendarWidget({ event, size = 'md' }) {
  const dateParts = useMemo(() => getDateParts(event), [event])
  const meta = getStatusMeta(event?.status)

  const sizes = {
    sm: { outer: 'w-14 h-16', month: 'text-[9px] py-0.5', day: 'text-2xl', shadow: 'shadow-sm' },
    md: { outer: 'w-16 h-[72px]', month: 'text-[9px] py-1', day: 'text-3xl', shadow: 'shadow-md' },
    lg: { outer: 'w-20 h-[88px]', month: 'text-[10px] py-1.5', day: 'text-4xl', shadow: 'shadow-md' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className={`shrink-0 ${s.outer} rounded-xl overflow-hidden ${s.shadow} border border-gray-100`}>
      {/* Month header strip */}
      <div className={`w-full ${s.month} ${meta.header} flex items-center justify-center`}>
        <span className='font-goldman font-bold text-white tracking-widest uppercase'>
          {dateParts.month}
        </span>
      </div>
      {/* Day number */}
      <div className='flex-1 bg-white flex items-center justify-center py-1'>
        <span className={`${s.day} font-goldman font-bold leading-none`}
          style={{ color: meta.header === 'bg-emerald-900' ? '#064e3b' : meta.header === 'bg-amber-500' ? '#92400e' : '#374151' }}>
          {dateParts.day}
        </span>
      </div>
    </div>
  )
}

// ─── Main EventCard ───────────────────────────────────────────────────────────
function EventCard({ event, onClick }) {
  const dateParts = useMemo(() => getDateParts(event), [event])
  const meta = getStatusMeta(event?.status)

  return (
    <div
      onClick={onClick}
      className={`group w-full bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-[0_1px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(6,78,59,0.10)] hover:-translate-y-0.5 transition-all duration-300 p-4 flex items-start gap-4 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Calendar widget */}
      <CalendarWidget event={event} size='md' />

      {/* Content */}
      <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
        {/* Status + date range row */}
        <div className='flex items-center gap-2 flex-wrap'>
          <span className={`text-[9px] font-goldman font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${meta.pill}`}>
            {event.status || 'Event'}
          </span>
          <span className='text-[10px] text-gray-400 font-jost'>{dateParts.full}</span>
        </div>

        {/* Title */}
        <h3 className='font-goldman font-bold text-[14px] sm:text-[15px] leading-snug text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {event.title}
        </h3>

        {/* Location */}
        {event.location && (
          <div className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
            <LocationIcon className='w-3.5 h-3.5 text-emerald-600/50 shrink-0' />
            <span className='truncate'>{event.location}</span>
          </div>
        )}
      </div>

      {/* Arrow CTA */}
      <div className='shrink-0 self-center'>
        <div className='w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-900 group-hover:border-emerald-900 transition-all duration-300'>
          <ArrowRight className='w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors duration-300' />
        </div>
      </div>
    </div>
  )
}

export default EventCard
