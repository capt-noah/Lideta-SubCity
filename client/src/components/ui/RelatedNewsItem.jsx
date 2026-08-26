import React from 'react'
import ImageIcon from '../../assets/icons/image_icon.svg?react'
import CalenderIcon from '../../assets/icons/calender_icon.svg?react'

function getImageSrc(path) {
  if (!path) return null
  if (typeof path === 'object' && path.path) return path.path
  if (typeof path === 'string') {
    try {
      const parsed = JSON.parse(path)
      if (parsed.path) return parsed.path
    } catch {
      if (path.startsWith('/')) return path
    }
  }
  return null
}

function RelatedNewsItem({ title, category, path, date, onClick }) {
  const imageSrc = getImageSrc(path)

  return (
    <button
      onClick={onClick}
      className='group w-full flex items-start gap-3 text-left py-3 border-b border-gray-100 last:border-0 hover:bg-emerald-50/50 -mx-3 px-3 rounded-xl transition-all duration-200 cursor-pointer'
    >
      {/* Thumbnail */}
      <div className='shrink-0 w-16 h-14 rounded-lg overflow-hidden bg-emerald-50 border border-gray-100'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 ease-out'
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div className={`${imageSrc ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100`}>
          <ImageIcon className='w-5 h-5 text-emerald-300' />
        </div>
      </div>

      {/* Text */}
      <div className='flex-1 min-w-0 flex flex-col gap-1'>
        {category && (
          <span className='text-[9px] font-goldman font-bold uppercase tracking-widest text-amber-700'>
            {category}
          </span>
        )}
        <p className='text-[13px] font-goldman font-bold leading-snug text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {title}
        </p>
        {date && (
          <span className='flex items-center gap-1 text-[10px] text-gray-400 font-jost mt-0.5'>
            <CalenderIcon className='w-3 h-3 text-emerald-500/40 shrink-0' />
            {date}
          </span>
        )}
      </div>
    </button>
  )
}

export default RelatedNewsItem
