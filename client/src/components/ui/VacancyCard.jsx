import React from 'react'
import { useNavigate } from 'react-router-dom'
import LocationIcon from '../../assets/icons/location_icon.svg?react'
import CalenderIcon from '../../assets/icons/calender_icon.svg?react'
import ClockIcon from '../../assets/icons/clock_icon.svg?react'
import ArrowRight from '../../assets/icons/arrow_right.svg?react'

function VacancyCard({ id, title, description, type, location, date, category }) {
  const navigate = useNavigate()

  const typeColors = {
    'Full Time':   'bg-emerald-900 text-white',
    'Full-Time':   'bg-emerald-900 text-white',
    'Part Time':   'bg-amber-500 text-emerald-950',
    'Part-Time':   'bg-amber-500 text-emerald-950',
    'Contract':    'bg-blue-700 text-white',
    'Internship':  'bg-violet-700 text-white',
    'Remote':      'bg-teal-700 text-white',
  }
  const typeCls = typeColors[type] || 'bg-emerald-900 text-white'

  return (
    <div
      onClick={() => id && navigate(`/vacancy/${id}`)}
      className='group w-full bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-4 shadow-[0_1px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(6,78,59,0.10)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'
    >
      {/* Left accent bar */}
      <div className='hidden sm:flex shrink-0 w-1 self-stretch rounded-full bg-emerald-100 group-hover:bg-amber-400 transition-colors duration-300' />

      {/* Content */}
      <div className='flex-1 min-w-0'>
        {/* Category badge + type pill row */}
        <div className='flex items-center gap-2 mb-2 flex-wrap'>
          <span className='text-[10px] font-goldman font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full'>
            {category}
          </span>
          <span className={`text-[10px] font-goldman font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${typeCls}`}>
            {type}
          </span>
        </div>

        {/* Title */}
        <h3 className='font-goldman font-bold text-base md:text-[17px] text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 leading-snug mb-1.5'>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className='text-sm text-gray-500 leading-relaxed line-clamp-2 font-roboto font-light mb-3'>
            {description}
          </p>
        )}

        {/* Meta row */}
        <div className='flex items-center gap-4 flex-wrap'>
          {location && (
            <span className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
              <LocationIcon className='w-3.5 h-3.5 text-emerald-600/60 shrink-0' />
              {location}
            </span>
          )}
          {date && (
            <span className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
              <CalenderIcon className='w-3.5 h-3.5 text-emerald-600/60 shrink-0' />
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Right arrow CTA */}
      <div className='shrink-0 flex items-center self-center'>
        <div className='w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-900 group-hover:border-emerald-900 transition-all duration-300'>
          <ArrowRight className='w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors duration-300' />
        </div>
      </div>
    </div>
  )
}

export default VacancyCard
