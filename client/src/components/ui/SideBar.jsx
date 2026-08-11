import React from 'react'

import SidebarIcon from '../../assets/icons/sidebar_icon.svg'
import DividerIcon from '../../assets/icons/divider_icon.svg'

import AllIcon from '../../assets/icons/all_icon.svg?react'
import ChipIcon from '../../assets/icons/chip_icon.svg?react'
import Enviroment_icon from '../../assets/icons/enviroment_icon.svg?react'
import CityIcon from '../../assets/icons/city_icon.svg?react'
import HealthIcon from '../../assets/icons/heart_pulse_icon.svg?react'
import GraduationIcon from '../../assets/icons/graduation_cap_solid.svg?react'
import ShieldIcon from '../../assets/icons/shield_solid_icon.svg?react'
import EventIcon from '../../assets/icons/calendar_day_icon.svg?react'

function SideBar({ categories, filter, setFilter }) {


  if (!categories) {
      categories = [
        { label: 'All', value: 'All', icon: AllIcon},
        { label: 'Technology', value: 'Technology', icon: ChipIcon},
        { label: 'Environment', value: 'Enviroment', icon: Enviroment_icon},
        { label: 'Infrastructure', value: 'Infrastructure', icon: CityIcon},
        { label: 'Health', value: 'Health', icon: HealthIcon},
        { label: 'Education', value: 'Education', icon: GraduationIcon},
        { label: 'Security', value: 'Security', icon: ShieldIcon},
        { label: 'Events', value: 'Event', icon: EventIcon},
    ]
  }


  return (
      <div className='w-48 bg-white/80 backdrop-blur-sm border border-emerald-200/50 flex flex-col space-y-1 rounded-2xl font-jost py-3 px-2 shadow-sm' >
          
          <div className='w-full space-y-1' >
              
            {
              categories.map(cat => {
                  const value = cat.value || cat.label
                  const isSelected = filter === value
                  
                  return (
                    <button  
                      key={cat.label} 
                      onClick={() => setFilter(value)} 
                      className={`w-full h-10 rounded-xl flex items-center px-3 gap-3 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-300/60 shadow-sm' 
                          : 'text-emerald-800/70 hover:text-emerald-900 hover:bg-emerald-50'
                      }`}
                    >
                      <cat.icon className={`w-4.5 h-4.5 transition-all duration-200 ${isSelected ? 'text-emerald-600' : 'text-emerald-700/50'}`} />
                      <p className='text-xs font-medium tracking-wide' >{ cat.label }</p>
                    </button>
                )
              })
            }
              

          </div>

        </div>
  )
}

export default SideBar