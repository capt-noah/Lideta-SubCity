import React from 'react'

function DepCard({title, description, logo}) {
  return (
    <div className='group/dep w-full h-60 bg-gradient-to-br from-[#FCFAF6] to-[#F3EFE0] rounded-3xl flex flex-col justify-between p-6 font-jost shadow-[0_4px_20px_rgba(14,53,29,0.04)] hover:shadow-[0_12px_30px_rgba(14,53,29,0.12)] border border-[#0E351D]/10 hover:border-amber-500/30 transition-all duration-500 cursor-pointer transform hover:-translate-y-2' >
      
      <div>
        <div className='w-full flex items-center gap-4' >
          { logo ? (
             <img src={logo} alt={`${title} logo`} className='w-14 h-14 rounded-2xl object-cover border border-[#0E351D]/15 shadow-sm group-hover/dep:scale-105 transition-transform duration-500' />
          ) : (
            <div className='w-14 h-14 bg-gradient-to-br from-[#0E351D] to-[#0A2615] rounded-2xl flex items-center justify-center border border-amber-500/10 shadow-sm' >
              <span className='font-goldman font-bold text-amber-400 text-xl'>{title.charAt(0)}</span>
            </div>
          )}
          <h1 className='flex-1 font-goldman font-bold text-lg text-[#0E351D] group-hover/dep:text-amber-500 transition-colors duration-300 line-clamp-1' title={title}>{ title }</h1>
        </div>
        
        <p className='w-full text-gray-650 text-sm font-normal leading-relaxed line-clamp-3 mt-4 group-hover/dep:text-gray-900 transition-colors' > {description} </p>
      </div>

      <div className='w-full flex justify-between items-center mt-4 pt-4 border-t border-[#0E351D]/5' >
        <span className='text-[10px] uppercase tracking-wider text-[#0E351D]/50 font-bold group-hover/dep:text-amber-500/75 transition-colors'>Department</span>
        <button className='px-4.5 py-1.5 bg-gradient-to-r from-[#0E351D] to-[#0A2615] hover:from-[#0A2615] hover:to-[#0E351D] text-amber-400 font-goldman font-medium text-[11px] rounded-xl shadow-md border border-amber-500/15 transition-all duration-300 transform group-hover/dep:scale-105 group-hover/dep:shadow-lg group-hover/dep:shadow-emerald-950/20' >Read More</button>   
      </div>
      
    </div>
  )
}

export default DepCard