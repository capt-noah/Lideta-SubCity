import React from 'react'
import ArrowRight from '../../assets/icons/arrow_right.svg?react'

function CutoutCard({title, description}) {
  return (
        <div className='relative flex flex-col justify-between w-full sm:w-80 h-56 p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#073621] to-[#042013] border border-amber-500/10 hover:border-amber-500/30 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer overflow-hidden' >
          
          {/* Subtle background decoration */}
          <div className='absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors duration-300'></div>
          
          <div className='flex flex-col gap-4 relative z-10'>
              <div className='w-11 h-11 bg-emerald-900/60 border border-amber-500/20 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300'>
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className='flex flex-col gap-1.5'>
                <p className='font-goldman font-bold text-xl text-amber-400 group-hover:text-amber-300 transition-colors' >{ title }</p>
                <p className='font-light text-emerald-100/70 text-xs leading-relaxed line-clamp-3' > { description } </p>
              </div>
          </div>

          <div className='w-full flex justify-end relative z-10 mt-auto' >
            <button className='w-10 h-10 bg-amber-500 group-hover:bg-amber-400 rounded-xl flex justify-center items-center shadow-md transition-colors duration-300' >
                <ArrowRight className="w-4 h-4 text-[#03150c] transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
  )
}

export default CutoutCard