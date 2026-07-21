import React from 'react'
import { useNavigate } from 'react-router-dom'

import ArrowUpRight from '../../assets/arrow_up_right.svg?react'

function VacancyCard({ id, title, description, salary, type }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (id) {
      navigate(`/vaccancy/${id}`)
    }
  }

  return (
    <div 
      onClick={handleClick}
      key={id} 
      className='group/vac w-full bg-gradient-to-br from-[#FCFAF6] to-[#F3EFE0] rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(14,53,29,0.04)] hover:shadow-[0_12px_30px_rgba(14,53,29,0.12)] border border-[#0E351D]/10 hover:border-amber-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative min-h-[200px]'
    >
        
        <div className='flex flex-col gap-3 pr-10'>
            <h2 className='font-goldman font-bold text-lg text-[#0E351D] group-hover/vac:text-amber-500 transition-colors duration-300 leading-snug'>{title}</h2>
            <p className='text-xs md:text-sm text-gray-650 font-normal leading-relaxed line-clamp-2'>{description}</p>
        </div>

        <div className='w-12 h-12 bg-gradient-to-br from-[#0E351D] to-[#0A2615] border border-amber-500/10 rounded-bl-3xl rounded-tr-3xl flex items-center justify-center absolute right-0 top-0 shadow-md group-hover/vac:from-amber-400 group-hover/vac:to-amber-600 transition-all duration-500 group/btn'>
            <ArrowUpRight className='w-5 h-5 text-amber-400 group-hover/vac:text-[#0E351D] transform group-hover/vac:translate-x-0.5 group-hover/vac:-translate-y-0.5 transition-all duration-300' />
        </div>

        <div className='flex items-center gap-3.5 mt-5 font-jost font-bold text-xs'>
            <span className='px-3.5 py-1.5 rounded-xl bg-[#FAF8F2] text-[#0E351D] border border-[#0E351D]/10 shadow-sm'> 
              {salary} ETB
            </span>
            <span className='px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0E351D] to-[#0A2615] text-amber-400 border border-amber-500/10 shadow-sm'> 
              {type} 
            </span>
        </div>
    </div>
  )
}

export default VacancyCard