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
    <div className={`w-full h-full bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 flex flex-col items-center justify-center text-emerald-300 gap-1 ${className}`}>
      <ImageIcon className='w-9 h-9 text-emerald-400/60' />
      <span className='text-[10px] font-goldman font-bold uppercase tracking-widest text-emerald-600/40'>Lideta News</span>
    </div>
  )
}

// ─── GridCard / Default NewsCard (used in 3 or 4-col grids like HomePage) ─────
export function GridCard({ id, title, description, date, category, photo }) {
  const navigate = useNavigate()
  const imageSrc = getImageSrc(photo)

  return (
    <div
      onClick={() => id && navigate(`/news/${id}`)}
      className='group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_3px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_rgba(6,78,59,0.14)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      {/* Thumbnail Container */}
      <div className='relative w-full aspect-[16/10] overflow-hidden bg-slate-100 shrink-0'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out'
            onError={e => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <ImagePlaceholder className={imageSrc ? 'hidden' : 'flex'} />

        {/* Ambient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none' />

        {/* Category Badge */}
        {category && (
          <span className='absolute top-3 left-3 bg-emerald-800/90 text-white font-goldman font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm border border-emerald-700/40'>
            {category}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className='flex flex-col flex-1 p-5 gap-2.5'>
        {/* Title */}
        <h3 className='font-goldman font-bold text-[15px] sm:text-[16px] leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {title}
        </h3>

        {/* Short description */}
        {description && (
          <p className='text-xs sm:text-[13px] text-slate-500 leading-relaxed line-clamp-3 font-roboto font-light flex-1'>
            {description}
          </p>
        )}

        {/* Bottom bar */}
        <div className='flex items-center justify-between mt-auto pt-3.5 border-t border-slate-100'>
          <span className='flex items-center gap-1.5 text-xs text-slate-400 font-jost'>
            <CalenderIcon className='w-3.5 h-3.5 text-emerald-600/60 shrink-0' />
            {date}
          </span>
          <span className='flex items-center gap-1 text-xs font-goldman font-bold uppercase tracking-wider text-emerald-700 group-hover:text-emerald-500 transition-colors duration-200'>
            <span>Read</span>
            <span className='transform group-hover:translate-x-1 transition-transform duration-200'>→</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Feature Card (used in the 2-up feature row) ────────────────────────────
export function FeatureCard({ id, title, description, date, category, photo }) {
  const navigate = useNavigate()
  const imageSrc = getImageSrc(photo)

  return (
    <div
      onClick={() => id && navigate(`/news/${id}`)}
      className='group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(6,78,59,0.15)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      {/* Image */}
      <div className='relative w-full aspect-[16/10] sm:aspect-video overflow-hidden bg-slate-100 shrink-0'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out'
            onError={e => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <ImagePlaceholder className={imageSrc ? 'hidden' : 'flex'} />

        <div className='absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none' />

        {/* Category overlay */}
        {category && (
          <span className='absolute top-3.5 left-3.5 bg-amber-500 text-slate-950 font-goldman font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-md border border-amber-400/50'>
            {category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className='flex flex-col flex-1 p-5 sm:p-6 gap-2.5'>
        <h2 className='font-goldman font-bold text-[17px] sm:text-[18px] leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {title}
        </h2>
        {description && (
          <p className='text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 font-roboto font-light flex-1'>
            {description}
          </p>
        )}
        <div className='flex items-center justify-between mt-auto pt-3.5 border-t border-slate-100'>
          <span className='flex items-center gap-1.5 text-xs text-slate-400 font-jost'>
            <CalenderIcon className='w-3.5 h-3.5 text-emerald-600/60 shrink-0' />
            {date}
          </span>
          <span className='flex items-center gap-1 text-xs font-goldman font-bold uppercase tracking-wider text-emerald-700 group-hover:text-amber-600 transition-colors duration-200'>
            <span>Read Article</span>
            <span className='transform group-hover:translate-x-1 transition-transform duration-200'>→</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── List Row Card (used in the main article list below the features) ────────
export function ListCard({ id, title, description, date, category, photo, index }) {
  const navigate = useNavigate()
  const imageSrc = getImageSrc(photo)

  return (
    <div
      onClick={() => id && navigate(`/news/${id}`)}
      className='group flex gap-4 bg-white rounded-2xl p-4 border border-slate-100 hover:border-emerald-200 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(6,78,59,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer items-start'
    >
      {/* Thumbnail */}
      <div className='shrink-0 w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden bg-slate-100 relative'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out'
            onError={e => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <ImagePlaceholder className={imageSrc ? 'hidden' : 'flex'} />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
        {/* Category + date row */}
        <div className='flex items-center gap-2 flex-wrap'>
          {category && (
            <span className='text-[10px] font-goldman font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-md'>
              {category}
            </span>
          )}
          <span className='text-[10px] text-slate-400 font-jost ml-auto shrink-0'>
            {date}
          </span>
        </div>

        {/* Headline */}
        <h3 className='font-goldman font-bold text-[14px] sm:text-[15px] leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className='text-xs text-slate-500 leading-relaxed line-clamp-2 font-roboto font-light hidden sm:block'>
            {description}
          </p>
        )}
      </div>

      {/* Index number */}
      {index !== undefined && (
        <div className='shrink-0 self-center hidden md:flex w-8 h-8 rounded-full bg-slate-50 border border-slate-100 items-center justify-center'>
          <span className='text-[11px] font-goldman font-bold text-slate-400'>{String(index + 1).padStart(2, '0')}</span>
        </div>
      )}
    </div>
  )
}

// ─── Default export (renders GridCard for beautiful grid layouts) ─────────────
function NewsCard(props) {
  return <GridCard {...props} />
}

export default NewsCard
