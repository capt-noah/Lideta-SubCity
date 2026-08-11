import React from 'react'
import ArrowRight from '../../assets/icons/arrow_right.svg?react'

/**
 * CutoutCard — Additional Services card.
 * All three variants share the same clean white base.
 * Each gets a distinct dark-green icon and a unique service icon.
 *
 * variant — 'news' | 'jobs' | 'events'
 */

const icons = {
  news: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M13 4v6h6M9 12h6M9 16h4" />
    </svg>
  ),
  jobs: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  events: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
}

function CutoutCard({ title, description, variant = 'news' }) {
  const renderIcon = icons[variant] ?? icons.news

  return (
    <div className="relative flex flex-col justify-between w-full sm:w-88 h-64 p-7 rounded-2xl bg-white border border-gray-200 hover:border-emerald-900/20 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer overflow-hidden">

      {/* Subtle bg tint on hover */}
      <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/40 transition-colors duration-300 pointer-events-none rounded-2xl" />

      {/* Icon + text */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="w-12 h-12 bg-emerald-900 rounded-xl flex items-center justify-center shadow-sm">
          {renderIcon('w-6 h-6 text-white')}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-goldman font-bold text-xl text-gray-900 group-hover:text-emerald-900 transition-colors duration-300 leading-snug">
            {title}
          </p>
          <p className="text-sm font-light leading-relaxed text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Arrow button */}
      <div className="w-full flex justify-end relative z-10">
        <button className="w-10 h-10 bg-emerald-900 hover:bg-emerald-800 rounded-xl flex justify-center items-center shadow-sm transition-all duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}

export default CutoutCard
