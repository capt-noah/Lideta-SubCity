import React from 'react'
import ArrowRight from '../../assets/icons/arrow_right.svg?react'

// Category accent colours — used for the pill and the initial avatar bg
const CATEGORY_COLORS = {
  'social services':      { pill: 'bg-violet-50 text-violet-700 border-violet-100',  avatar: 'bg-violet-700' },
  'health':               { pill: 'bg-red-50 text-red-700 border-red-100',            avatar: 'bg-red-600'    },
  'infrastructure':       { pill: 'bg-slate-50 text-slate-700 border-slate-200',      avatar: 'bg-slate-600'  },
  'education':            { pill: 'bg-amber-50 text-amber-700 border-amber-100',      avatar: 'bg-amber-600'  },
  'agriculture':          { pill: 'bg-green-50 text-green-700 border-green-100',      avatar: 'bg-green-700'  },
  'environment':          { pill: 'bg-teal-50 text-teal-700 border-teal-100',         avatar: 'bg-teal-700'   },
  'economic development': { pill: 'bg-blue-50 text-blue-700 border-blue-100',         avatar: 'bg-blue-700'   },
  'legal':                { pill: 'bg-orange-50 text-orange-700 border-orange-100',   avatar: 'bg-orange-600' },
}

const DEFAULT_COLORS = { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', avatar: 'bg-emerald-700' }

function DepCard({ title, description, logo, category }) {
  const colors = CATEGORY_COLORS[category?.toLowerCase()] || DEFAULT_COLORS

  return (
    <div className='group w-full bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-[0_1px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(6,78,59,0.10)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 flex items-start gap-4'>

      {/* Logo / initial avatar */}
      <div className='shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm'>
        {logo ? (
          <img
            src={logo}
            alt={`${title} logo`}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-400'
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${colors.avatar}`}>
            <span className='font-goldman font-bold text-white text-xl'>
              {title?.charAt(0)?.toUpperCase() ?? 'D'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
        {/* Category pill */}
        {category && (
          <span className={`w-fit text-[9px] font-goldman font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${colors.pill}`}>
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className='font-goldman font-bold text-[14px] sm:text-[15px] leading-snug text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className='text-xs text-gray-500 leading-relaxed line-clamp-2 font-roboto font-light'>
            {description}
          </p>
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

export default DepCard
