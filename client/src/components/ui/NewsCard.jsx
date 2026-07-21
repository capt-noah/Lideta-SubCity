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
      className='group/card bg-gradient-to-br from-[#FCFAF6] to-[#F3EFE0] w-full rounded-3xl flex flex-col justify-between overflow-hidden relative border border-[#0E351D]/10 shadow-[0_4px_20px_rgba(14,53,29,0.04)] hover:shadow-[0_12px_30px_rgba(14,53,29,0.12)] hover:border-amber-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer min-h-[390px] h-full' 
    >

        <div className='w-full h-48 bg-[#F3EFE0] relative overflow-hidden' >
        {
          imageSrc ?
            <img src={imageSrc} alt='News' className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-108'/>
            : 
            <div className='w-full h-full bg-gradient-to-br from-[#0E351D]/10 to-[#0A2615]/5 flex justify-center items-center' >
              <ImageIcon className="w-12 h-12 text-[#0E351D]/30"  />
            </div>
        }

          <div className='bg-[#0E351D]/95 text-amber-400 font-goldman font-medium tracking-wide text-[10px] uppercase w-fit px-3 py-1 rounded-full absolute top-4 left-4 shadow-md backdrop-blur-sm border border-amber-500/10' >
            <p>{date}</p>
          </div>

        </div>

        <button className='bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 w-12 h-12 absolute top-0 right-0 rounded-bl-3xl flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300 group/btn' >
            <ArrowUpRight className="w-5 h-5 text-[#0E351D] transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
        </button>

        <div className='p-6 flex-grow flex flex-col justify-between gap-4' >

            <div className='flex flex-col gap-3' >
              <div className='flex items-center gap-2 justify-between flex-wrap' >
                {category && (
                  <span className='bg-[#FAF8F2] text-[#0E351D] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg border border-[#0E351D]/10' >{category}</span>
                )}
              </div>
              <h1 className='text-[#0E351D] text-lg font-goldman font-bold leading-snug line-clamp-2 group-hover/card:text-amber-500 transition-colors duration-300' >{title}</h1>
            </div>
            <p className='text-gray-650 text-sm font-normal leading-relaxed line-clamp-3' >{description}</p>

        </div>

    </div>
  )
}

export default NewsCard