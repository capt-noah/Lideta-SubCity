import React from 'react'
import { useNavigate } from 'react-router-dom'
import ImageIcon from '../../assets/icons/image_icon.svg?react'

import ArrowUpRight from '../../assets/arrow_up_right.svg?react'



function NewsCard({ id, title, description, date, category, photo }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (id) {
      navigate(`/news/${id}`)
    }
  }

  // Get image source from photo data - handles various formats
  const getImageSrc = () => {
    if (!photo) return null
    
    // If photo is already an object with path
    if (typeof photo === 'object' && photo.path) {
      return photo.path
    }
    
    // If photo is a JSON string, parse it
    if (typeof photo === 'string') {
      try {
        const parsed = JSON.parse(photo)
        if (parsed.path) return parsed.path
      } catch {
        // Not JSON, might be a direct path
        if (photo.startsWith('/')) return photo
      }
    }
    
    return null
  }

  const imageSrc = getImageSrc()

  return (
    <div 
      onClick={handleClick}
      className='group/card bg-white w-full rounded-2xl flex flex-col justify-between overflow-hidden relative border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-gray-200 hover:-translate-y-1.5 transition-all duration-400 cursor-pointer min-h-[380px] h-full' 
    >
        <div className='w-full h-48 bg-gray-100 relative overflow-hidden'>
        {
          imageSrc ?
            <img src={imageSrc} alt='News' className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105'/>
            : 
            <div className='w-full h-full bg-gray-100 flex justify-center items-center'>
              <ImageIcon className="w-12 h-12 text-gray-300"/>
            </div>
        }
          <div className='bg-emerald-900/90 text-white font-goldman font-medium tracking-wide text-[10px] uppercase w-fit px-3 py-1 rounded-full absolute top-4 left-4 shadow-md backdrop-blur-sm'>
            <p>{date}</p>
          </div>
        </div>

        <button className='bg-emerald-900 hover:bg-emerald-800 w-12 h-12 absolute top-0 right-0 rounded-bl-2xl flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300 group/btn'>
            <ArrowUpRight className="w-5 h-5 text-white transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
        </button>

        <div className='p-5 flex-grow flex flex-col justify-between gap-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 justify-between flex-wrap'>
                {category && (
                  <span className='bg-emerald-900 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md'>{category}</span>
                )}
              </div>
              <h1 className='text-gray-900 text-base font-goldman font-bold leading-snug line-clamp-2 group-hover/card:text-emerald-800 transition-colors duration-300'>{title}</h1>
            </div>
            <p className='text-gray-500 text-sm font-normal leading-relaxed line-clamp-3'>{description}</p>
        </div>
    </div>
  )
}

export default NewsCard