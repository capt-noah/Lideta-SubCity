import DepCard from '../components/ui/DepCard';
import SideBar from '../components/ui/SideBar';
import { getDepartmentLogo } from '../components/utils/departmentAssets';
import { useNavigate } from 'react-router-dom';
import departmentsData from '../data/departments.json';
import ArrowSvg from '../assets/arrow.svg?react';
import SearchIcon from '../assets/icons/search_icon.svg?react';
import SearchBox from '../components/ui/Search.jsx';

import AllIcon from '../assets/icons/all_icon.svg?react'
import ChipIcon from '../assets/icons/chip_icon.svg?react'
import Enviroment_icon from '../assets/icons/enviroment_icon.svg?react'
import CityIcon from '../assets/icons/city_icon.svg?react'
import HealthIcon from '../assets/icons/heart_pulse_icon.svg?react'
import GraduationIcon from '../assets/icons/graduation_cap_solid.svg?react'
import ScaleIcon from '../assets/icons/scale_icon.svg?react'
import BarleyIcon from '../assets/icons/barley_icon.svg?react'
import SocialServicesIcon from '../assets/icons/social_service_icon.svg?react'
import GrowthIcon from '../assets/icons/economic_growth_icon.svg?react'
import { useState } from 'react';
import { useLanguage } from '../components/utils/LanguageContext';
import translatedContents from '../data/translated_contents.json';

function Departments() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const departments = departmentsData.departments;
  const t = translatedContents.departments;

  const [results, setResults] = useState(null);
  const [noResultFound, setNoResultFound] = useState(false);
  const [filter, setFilter] = useState('All')

  let filtered = filter.toLowerCase() === 'all'? departments : departments.filter(dep => dep.category.toLocaleLowerCase() == filter.toLowerCase() )
  const finalList = results !== null ? results : filtered;

  console.log(filtered)

  const handleDepartmentClick = (departmentId) => {
    navigate(`/departments/${departmentId}`);
  };

  const categories = [
      { label: t.filters.all[language], value: 'All', bg: '#3A3A3A', color: 'white', icon: AllIcon},
      { label: t.filters.social_services[language], value: 'Social services', bg: '#FFFFFF', color: 'black', icon: SocialServicesIcon},
      { label: t.filters.agriculture[language], value: 'Agriculture', bg: '#FFFFFF', color: 'black', icon: BarleyIcon},
      { label: t.filters.economic_development[language], value: 'Economic Development', bg: '#FFFFFF', color: 'black', icon: GrowthIcon},
      { label: t.filters.environment[language], value: 'Environment', bg: '#FFFFFF', color: 'black', icon: Enviroment_icon},
      { label: t.filters.infrastructure[language], value: 'Infrastructure', bg: '#FFFFFF', color: 'black', icon: CityIcon},
      { label: t.filters.health[language], value: 'Health', bg: '#FFFFFF', color: 'black', icon: HealthIcon},
      { label: t.filters.education[language], value: 'Education', bg: '#FFFFFF', color: 'black', icon: GraduationIcon},
      { label: t.filters.legal[language], value: 'Legal', bg: '#FFFFFF', color: 'black', icon: ScaleIcon},
  ]

  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-8 px-4 mt-12 lg:flex-row lg:px-6 mb-24 animate-fade-in'>
      <div className='hidden lg:flex mt-20 shrink-0'>
        <SideBar categories={categories} filter={filter} setFilter={setFilter} />
      </div>

      <div className='w-full flex flex-col gap-6'>
        <div className='w-fit font-goldman font-bold text-4xl lg:text-5xl flex items-end pb-4 border-b-4 border-amber-500 pr-10 text-slate-800'>{t.title[language]}</div>
        
        {/* Mobile Filters */}
        <div className='flex lg:hidden overflow-x-auto gap-2 pb-3 mb-2 scrollbar-hide'>
            {categories.map((cat, index) => {
                const isActive = filter === cat.value
                return (
                  <button 
                    key={index} 
                    onClick={() => setFilter(cat.value)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap text-xs font-goldman font-medium transition-all duration-300 border ${isActive ? 'bg-amber-50 text-amber-600 border-amber-500/20 shadow-sm font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'}`}
                  >
                     <span>{cat.label}</span>
                  </button>
                )
            })}
        </div>

        <div className='bg-white w-full h-full rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-md mb-10'>
          <div className='w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1'>
            <SearchBox
              data={departments}
              results={results}
              setResults={setResults}
              noResultFound={noResultFound}
              setNoResultFound={setNoResultFound}
            />

            <button className='flex items-center justify-between gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 shadow-sm font-jost font-medium text-sm min-w-[120px] cursor-pointer transition-all self-start sm:self-auto text-slate-700'>
              <span>{language === 'am' ? 'የቅርብ ጊዜ' : language === 'or' ? 'Dhihoo' : 'Latest'}</span>
              <img src={ArrowSvg} alt="" className="w-3 opacity-60" />
            </button>
          </div>

          <div className='w-full h-px bg-slate-200 mt-6 mb-6' />

          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1'>
            {
              noResultFound || finalList.length < 1
                ? (
                  <div className='w-full h-96 flex flex-col gap-4 justify-center items-center text-slate-400 col-span-full'>
                    <SearchIcon className="w-16 h-16" />
                    <p className='text-lg font-goldman font-bold'>{language === 'am' ? 'ምንም ውጤት የለም' : language === 'or' ? 'Bu\'aa Hin Argamne' : 'No Results Found'}</p>
                  </div>
                )
                : finalList.map(dep => {
                    const title = typeof dep.title === 'object' ? dep.title[language] : (dep.name[language] || 'Department');
                    const description = dep.shortDescription?.[language] || 
                                     (typeof dep.mission === 'object' ? dep.mission[language] : 
                                     (dep.description?.[language] || 'No description available'));
                    
                    return (
                      <div 
                        key={dep.id} 
                        onClick={() => handleDepartmentClick(dep.id)}
                        className="cursor-pointer transition-transform duration-300 hover:-translate-y-1 w-full"
                      >
                        <DepCard 
                          title={title} 
                          description={description} 
                          logo={getDepartmentLogo(dep.id)}
                        />
                      </div>
                    );
                  })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Departments