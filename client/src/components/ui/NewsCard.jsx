import React from 'react'
import { useNavigate } from 'react-router-dom'
import ImageIcon from '../../assets/icons/image_icon.svg?react'
import CalenderIcon from '../../assets/icons/calender_icon.svg?react'

// ─── Shared image helper ──────────────────────────────────────────────────────
function getImageSrc(photo) {
  if (!photo) return null
  if (typeof photo === 'object' && photo.path) return photo.path
  if (typeof photo === 'string') {
    try {
      const parsed = JSON.parse(photo)
      if (parsed.path) return parsed.path
    } catch {
      if (photo.startsWith('/')) return photo
    }
  }
  return null
}

// ─── ImagePlaceholder ─────────────────────────────────────────────────────────
function ImagePlaceholder({ className = '' }) {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center ${className}`}>
      <ImageIcon className='w-10 h-10 text-emerald-300' />
    </div>
  )
}

// ─── Feature Card  (used in the 2-up feature row) ────────────────────────────
export function FeatureCard({ id, title, description, date, category, photo }) {
  const navigate = useNavigate()
  const imageSrc = getImageSrc(photo)

  return (
    <div
      onClick={() => id && navigate(`/news/${id}`)}
      className='group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(6,78,59,0.13)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      {/* Image */}
      <div className='relative w-full aspect-video overflow-hidden bg-emerald-50 shrink-0'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <ImagePlaceholder className={imageSrc ? 'hidden' : 'flex'} />

        {/* Category overlay */}
        {category && (
          <span className='absolute top-3 left-3 bg-amber-500 text-emerald-950 font-goldman font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md'>
            {category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className='flex flex-col flex-1 p-5 gap-2'>
        <h2 className='font-goldman font-bold text-[16px] leading-snug text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-3'>
          {title}
        </h2>
        {description && (
          <p className='text-sm text-gray-500 leading-relaxed line-clamp-2 font-roboto font-light flex-1'>
            {description}
          </p>
        )}
        <div className='flex items-center justify-between mt-2 pt-3 border-t border-gray-100'>
          <span className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
            <CalenderIcon className='w-3.5 h-3.5 text-emerald-600/50 shrink-0' />
            {date}
          </span>
          <span className='text-xs font-goldman font-bold uppercase tracking-wide text-emerald-700 group-hover:text-amber-600 transition-colors duration-200'>
            Read →
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── List Row Card  (used in the main article list below the features) ────────
export function ListCard({ id, title, description, date, category, photo, index }) {
  const navigate = useNavigate()
  const imageSrc = getImageSrc(photo)

  return (
    <div
      onClick={() => id && navigate(`/news/${id}`)}
      className='group flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:border-emerald-200 shadow-[0_1px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(6,78,59,0.09)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer items-start'
    >
      {/* Thumbnail */}
      <div className='shrink-0 w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden bg-emerald-50'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <ImagePlaceholder className={imageSrc ? 'hidden' : 'flex'} />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
        {/* Category + date row */}
        <div className='flex items-center gap-2 flex-wrap'>
          {category && (
            <span className='text-[10px] font-goldman font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full'>
              {category}
            </span>
          )}
          <span className='text-[10px] text-gray-400 font-jost ml-auto shrink-0'>
            {date}
          </span>
        </div>

        {/* Headline */}
        <h3 className='font-goldman font-bold text-[14px] sm:text-[15px] leading-snug text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className='text-xs text-gray-500 leading-relaxed line-clamp-2 font-roboto font-light hidden sm:block'>
            {description}
          </p>
        )}
      </div>

      {/* Index number — NYT style subtle numbering */}
      {index !== undefined && (
        <div className='shrink-0 self-center hidden md:flex w-8 h-8 rounded-full bg-gray-50 border border-gray-100 items-center justify-center'>
          <span className='text-[11px] font-goldman font-bold text-gray-300'>{String(index + 1).padStart(2, '0')}</span>
        </div>
      )}
    </div>
  )
}

// ─── Default export (backward compat — renders ListCard) ─────────────────────
function NewsCard(props) {
  return <ListCard {...props} />
}

export default NewsCard
