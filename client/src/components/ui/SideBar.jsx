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
      <div className='w-64 bg-gradient-to-br from-white to-slate-50 border border-slate-200 flex flex-col items-center space-y-4 rounded-3xl font-jost py-6 px-4 shadow-md' >
          
          <div className='w-full px-2 flex justify-between items-center' >
              <p className='font-goldman font-bold text-lg text-slate-800' >Categories</p>
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </div>
          </div>

          <div className='w-full h-px bg-slate-200' />
          
          <div className='w-full space-y-1.5' >
              
            {
              categories.map(cat => {
                  const value = cat.value || cat.label
                  const isSelected = filter === value
                  
                  return (
                    <button  
                      key={cat.label} 
                      onClick={() => setFilter(value)} 
                      className={`w-full h-11 rounded-xl flex items-center px-4.5 gap-3.5 cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'bg-amber-50 text-amber-600 font-bold shadow-sm border border-amber-500/20' 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/60'
                      }`}
                    >
                      <cat.icon className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'scale-110 text-amber-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <p className='text-sm font-medium tracking-wide' >{ cat.label }</p>
                    </button>
                )
              })
            }
             

          </div>

        </div>
  )
}

export default SideBar