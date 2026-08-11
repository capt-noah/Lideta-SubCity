import React from 'react'

function DepCard({ title, description, logo }) {
  return (
    <div className='group/dep w-full h-60 bg-white rounded-2xl flex flex-col justify-between p-5 font-jost shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-gray-100 hover:border-gray-200 transition-all duration-400 cursor-pointer transform hover:-translate-y-1.5'>

      <div>
        <div className='w-full flex items-center gap-3.5'>
          {logo ? (
            <img
              src={logo}
              alt={`${title} logo`}
              className='w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm group-hover/dep:scale-105 transition-transform duration-400 flex-shrink-0'
            />
          ) : (
            <div className='w-12 h-12 bg-emerald-900 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0'>
              <span className='font-goldman font-bold text-white text-lg'>{title?.charAt(0) ?? 'D'}</span>
            </div>
          )}
          <h1
            className='flex-1 font-goldman font-bold text-base text-gray-900 group-hover/dep:text-emerald-800 transition-colors duration-300 line-clamp-2 leading-snug'
            title={title}
          >
            {title}
          </h1>
        </div>

        <p className='w-full text-gray-500 text-sm font-normal leading-relaxed line-clamp-3 mt-3'>
          {description}
        </p>
      </div>

      <div className='w-full flex justify-between items-center mt-3 pt-3 border-t border-gray-100'>
        <span className='text-[10px] uppercase tracking-wider text-gray-400 font-semibold'>
          Department
        </span>
        <button className='px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-goldman font-medium text-[11px] rounded-lg shadow-sm transition-all duration-300 group-hover/dep:shadow-md'>
          Read More
        </button>
      </div>

    </div>
  )
}

export default DepCard
