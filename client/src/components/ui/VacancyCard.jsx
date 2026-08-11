import React from 'react'
import { useNavigate } from 'react-router-dom'

import ArrowUpRight from '../../assets/arrow_up_right.svg?react'

function VacancyCard({ id, title, description, salary, type }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (id) {
      navigate(`/vacancy/${id}`)
    }
  }

  return (
    <div 
      onClick={handleClick}
      key={id} 
      className='group/vac w-full bg-white rounded-2xl p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-gray-100 hover:border-gray-200 hover:-translate-y-1.5 transition-all duration-400 cursor-pointer relative min-h-[200px]'
    >
        <div className='flex flex-col gap-2.5 pr-10'>
            <h2 className='font-goldman font-bold text-base text-gray-900 group-hover/vac:text-gray-600 transition-colors duration-300 leading-snug'>{title}</h2>
            <p className='text-xs md:text-sm text-gray-500 font-normal leading-relaxed line-clamp-2'>{description}</p>
        </div>

        <div className='w-11 h-11 bg-emerald-900 rounded-bl-2xl rounded-tr-2xl flex items-center justify-center absolute right-0 top-0 shadow group-hover/vac:bg-emerald-800 transition-all duration-300'>
            <ArrowUpRight className='w-4 h-4 text-white transform group-hover/vac:translate-x-0.5 group-hover/vac:-translate-y-0.5 transition-transform duration-300' />
        </div>

        <div className='flex items-center gap-2.5 mt-5 font-jost font-semibold text-xs'>
            <span className='px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200'>
              {salary} ETB
            </span>
            <span className='px-3 py-1.5 rounded-lg bg-emerald-900 text-white'>
              {type}
            </span>
        </div>
    </div>
  )
}

export default VacancyCard