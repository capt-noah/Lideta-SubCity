import BASE_URL from '../utils/api'
import { motion } from 'framer-motion'
import React, { useState, useEffect, useRef } from 'react'
import VacancyCard from '../components/ui/VacancyCard'
import Loading from '../components/ui/Loading'
import AnimatedCard from '../components/ui/AnimatedCard'
import SearchIcon from '../assets/icons/search_icon.svg?react'
import ChevronDown from '../assets/icons/arrow_right.svg?react'
import { useLanguage } from '../components/utils/LanguageContext'
import translatedContents from '../data/translated_contents.json'

function Vacancy() {
  const { language } = useLanguage()
  const t = translatedContents.jobs_page
  const [jobs, setJobs] = useState([])
  const [results, setResults] = useState(null)
  const [noResultFound, setNoResultFound] = useState(false)
  const [filter, setFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const filterDropdownRef = useRef(null)

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const response = await fetch(`${BASE_URL}/api/vacancies`)
        if (response.ok) {
          const data = await response.json()
          const formattedVacancies = data.map(item => ({
            id: item.id.toString(),
            title: item.title,
            description: item.short_description || item.description?.substring(0, 100) || '',
            date: item.formatted_date || item.created_at?.split('T')[0] || '',
            category: item.category,
            type: item.type,
            salary: item.salary,
            amh: item.amh,
            orm: item.orm
          }))
          setJobs(formattedVacancies)
        }
      } catch (error) {
        console.error('Error fetching vacancies:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVacancies()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = filter.toLowerCase() === 'all' ? jobs : jobs.filter(job => job.category.toLowerCase() === filter.toLowerCase())
  const finalList = results || filtered || []

  const categories = [
    { label: t.categories_section.filters.all[language], value: 'All' },
    { label: t.categories_section.filters.technology[language], value: 'Technology' },
    { label: t.categories_section.filters.health[language], value: 'Health' },
    { label: t.categories_section.filters.infrastructure[language], value: 'Infrastructure' },
    { label: t.categories_section.filters.education[language], value: 'Education' },
    { label: t.categories_section.filters.events[language], value: 'Event' },
    { label: t.categories_section.filters.security[language], value: 'Security' },
    { label: t.categories_section.filters.environment[language], value: 'Environment' }
  ]

  const getCurrentCategoryLabel = () => {
    const cat = categories.find(c => c.value === filter)
    return cat ? cat.label : t.categories_section.filters.all[language]
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase().trim()
    
    if (term === '') {
      setNoResultFound(false)
      setResults(null)
      return
    }

    const searchResults = filtered.filter(item => {
      let enTitle = ''
      let amTitle = ''
      let orTitle = ''
      let enDesc = ''
      let amDesc = ''
      let orDesc = ''
      
      if (typeof item.title === 'string') {
        enTitle = item.title.toLowerCase()
        amTitle = item.amh?.title?.toLowerCase() || ''
        orTitle = item.orm?.title?.toLowerCase() || ''
      }
      
      if (typeof item.description === 'string') {
        enDesc = item.description.toLowerCase()
        amDesc = item.amh?.short_description?.toLowerCase() || item.amh?.description?.toLowerCase() || ''
        orDesc = item.orm?.short_description?.toLowerCase() || item.orm?.description?.toLowerCase() || ''
      }

      return enTitle.includes(term) || amTitle.includes(term) || orTitle.includes(term) ||
             enDesc.includes(term) || amDesc.includes(term) || orDesc.includes(term)
    })

    if (searchResults.length === 0) {
      setNoResultFound(true)
      setResults([])
    } else {
      setNoResultFound(false)
      setResults(searchResults)
    }
  }

  return (
    <div className='w-full bg-white min-h-screen'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-7xl mx-auto px-4 pt-8 pb-24'
      >
        <div className='mb-8'>
          <h1 className='font-goldman font-bold text-3xl md:text-4xl text-emerald-900 mb-6'>{t.title[language]}</h1>
          
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1 max-w-lg'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2'>
                <SearchIcon className='w-5 h-5 text-emerald-700/50' />
              </div>
              <input
                type='text'
                placeholder={t.search?.[language] || (language === 'am' ? 'ፈልግ' : language === 'or' ? 'Barbaadi' : 'Search')}
                onChange={handleSearch}
                className='w-full pl-12 pr-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 font-roboto text-sm transition-all'
              />
            </div>

            <div className='relative' ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className='flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 shadow-sm font-jost font-medium text-sm text-emerald-900 cursor-pointer transition-all min-w-[160px]'
              >
                <span>{getCurrentCategoryLabel()}</span>
                <ChevronDown
                  className={`w-3 h-3 text-emerald-700/70 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isFilterDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-200 rounded-2xl shadow-lg z-50 overflow-hidden'>
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setFilter(cat.value)
                        setIsFilterDropdownOpen(false)
                      }}
                      className={`w-full text-left px-5 py-3 font-jost text-sm transition-all ${
                        cat.value === filter
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-700 hover:bg-emerald-50/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'>
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : finalList.length === 0 ? (
            <div className='w-full col-span-full flex flex-col gap-3 justify-center items-center text-slate-400 py-16'>
              <SearchIcon className="w-14 h-14 text-emerald-700/30" />
              <p className='text-lg font-goldman font-bold text-slate-600'>
                {language === 'am' ? 'ምንም ውጤት የለም' : language === 'or' ? 'Bu\'aa Hin Argamne' : 'No Results Found'}
              </p>
            </div>
          ) : (
            finalList.map((job, idx) => {
              let title = job.title
              let description = job.description

              if (language === 'am' && job.amh) {
                   title = job.amh.title || title
                   description = job.amh.short_description || job.amh.description?.substring(0, 100) || description
              } else if (language === 'or' && job.orm) {
                   title = job.orm.title || title
                   description = job.orm.short_description || job.orm.description?.substring(0, 100) || description
              }

              return (
                <AnimatedCard key={job.id} index={idx} stagger={70} maxDelay={560} className="h-full">
                  <VacancyCard
                    id={job.id}
                    title={title}
                    description={description}
                    salary={job.salary}
                    type={job.type}
                  />
                </AnimatedCard>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Vacancy
