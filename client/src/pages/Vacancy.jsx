import BASE_URL from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import VacancyCard from '../components/ui/VacancyCard'
import AnimatedCard from '../components/ui/AnimatedCard'
import Loading from '../components/ui/Loading'
import { useLanguage } from '../components/utils/LanguageContext'
import translatedContents from '../data/translated_contents.json'

import SearchIcon    from '../assets/icons/search_icon.svg?react'
import ChipIcon      from '../assets/icons/chip_icon.svg?react'
import HealthIcon    from '../assets/icons/health_icon.svg?react'
import BookIcon      from '../assets/icons/book_icon.svg?react'
import BuildingIcon  from '../assets/icons/building_icon.svg?react'
import ShieldIcon    from '../assets/icons/sheild_icon.svg?react'
import EnvIcon       from '../assets/icons/enviroment_icon.svg?react'
import BoltIcon      from '../assets/icons/bolt_icon.svg?react'
import AllIcon       from '../assets/icons/vaccancy_icon.svg?react'
import ArrowRight    from '../assets/icons/arrow_right.svg?react'
import CloseIcon     from '../assets/icons/stop_icon.svg?react'

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_META = {
  All:            { Icon: AllIcon,      color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-100' },
  Technology:     { Icon: ChipIcon,     color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-100'    },
  Health:         { Icon: HealthIcon,   color: 'text-red-600',     bg: 'bg-red-50',      border: 'border-red-100'     },
  Education:      { Icon: BookIcon,     color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-100'   },
  Infrastructure: { Icon: BuildingIcon, color: 'text-slate-600',   bg: 'bg-slate-50',    border: 'border-slate-100'   },
  Security:       { Icon: ShieldIcon,   color: 'text-violet-700',  bg: 'bg-violet-50',   border: 'border-violet-100'  },
  Environment:    { Icon: EnvIcon,      color: 'text-teal-700',    bg: 'bg-teal-50',     border: 'border-teal-100'    },
  Event:          { Icon: BoltIcon,     color: 'text-orange-600',  bg: 'bg-orange-50',   border: 'border-orange-100'  },
}

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']

// ─── Hero stats bar ───────────────────────────────────────────────────────────
function StatsBar({ totalJobs, language }) {
  const labels = {
    en: { open: 'Open Positions', dept: 'Departments' },
    am: { open: 'ክፍት ቦታዎች',    dept: 'ክፍሎች'       },
    or: { open: 'Bakka Banaawwan', dept: 'Kutaalee'   },
  }
  const l = labels[language] || labels.en
  return (
    <div className='flex items-center gap-6 flex-wrap'>
      <div className='flex items-center gap-2'>
        <span className='text-2xl font-goldman font-bold text-amber-500'>{totalJobs}</span>
        <span className='text-sm text-emerald-100/80 font-jost'>{l.open}</span>
      </div>
      <div className='w-px h-8 bg-emerald-700/50 hidden sm:block' />
      <div className='flex items-center gap-2'>
        <span className='text-2xl font-goldman font-bold text-amber-500'>7</span>
        <span className='text-sm text-emerald-100/80 font-jost'>{l.dept}</span>
      </div>
    </div>
  )
}

// ─── Category directory row ───────────────────────────────────────────────────
function CategoryRow({ catKey, label, count, isActive, onClick, index }) {
  const meta = CATEGORY_META[catKey] || CATEGORY_META.All
  const { Icon } = meta

  return (
    <AnimatedCard index={index} stagger={40} maxDelay={480}>
      <button
        onClick={onClick}
        className={`
          group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left
          ${isActive
            ? 'bg-emerald-50 border-emerald-800 shadow-sm'
            : 'bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/60 hover:-translate-y-0.5 hover:shadow-sm'
          }
        `}
      >
        {/* Arrow chevron */}
        <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${isActive ? 'text-emerald-800' : 'text-emerald-500 group-hover:text-emerald-700'}`} />

        {/* Category icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-900/10' : meta.bg}`}>
          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : meta.color}`} />
        </div>

        {/* Label */}
        <span className={`flex-1 font-goldman font-bold text-sm leading-tight transition-colors duration-200 ${isActive ? 'text-emerald-900' : 'text-emerald-950 group-hover:text-emerald-800'}`}>
          {label}
        </span>

        {/* Count */}
        <span className={`text-sm font-goldman font-bold shrink-0 transition-colors duration-200 ${isActive ? 'text-emerald-800' : 'text-emerald-600/70 group-hover:text-emerald-700'}`}>
          {count}
        </span>
      </button>
    </AnimatedCard>
  )
}

// ─── Category directory view ──────────────────────────────────────────────────
function CategoryDirectory({ language, jobs, categories, filter, onSelectCategory, onSearch }) {
  const [localSearch, setLocalSearch] = useState('')
  const searchRef = useRef(null)
  const t = translatedContents.jobs_page

  const totalJobs  = jobs.length
  const catCount   = categories.filter(c => c.value !== 'All' && jobs.filter(j => j.category === c.value).length > 0).length

  const summaryLabel = {
    en: `${totalJobs} open position${totalJobs !== 1 ? 's' : ''} across ${catCount} categor${catCount !== 1 ? 'ies' : 'y'}`,
    am: `${catCount} ምድቦች ውስጥ ${totalJobs} ክፍት ቦታዎች`,
    or: `Gareewwan ${catCount} keessatti bakka ${totalJobs} banaa`,
  }[language] || ''

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (localSearch.trim()) onSearch(localSearch.trim())
  }

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && localSearch.trim()) onSearch(localSearch.trim())
  }

  return (
    <motion.div
      key='directory'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className='w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'
    >
      {/* Search bar */}
      <div className='max-w-2xl mx-auto mb-10'>
        <div className='relative'>
          <SearchIcon className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/50' />
          <input
            ref={searchRef}
            type='text'
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder={
              language === 'am' ? 'ሥራ ፈልግ…' :
              language === 'or' ? 'Hojii barbaadi…' :
              'Search for a position, skill, or department…'
            }
            className='w-full pl-12 pr-14 py-3.5 text-sm border-2 border-gray-200 rounded-2xl bg-white focus:bg-white focus:outline-none focus:border-emerald-500 transition-all font-roboto shadow-sm'
          />
          {localSearch ? (
            <button
              onClick={() => { setLocalSearch(''); searchRef.current?.focus() }}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer'
            >
              <CloseIcon className='w-3.5 h-3.5' />
            </button>
          ) : (
            <button
              onClick={handleSearchSubmit}
              className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-900 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer'
            >
              <ArrowRight className='w-3.5 h-3.5 text-white' />
            </button>
          )}
        </div>
      </div>

      {/* Section header */}
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-5 rounded-full bg-amber-500' />
          <h2 className='font-goldman font-bold text-base uppercase tracking-widest text-emerald-950'>
            { { en: 'Browse by Category', am: 'በምድብ ፈልግ', or: 'Gareewwan Irraan Barbaadi' }[language] || 'Browse by Category' }
          </h2>
        </div>
        <span className='text-xs text-gray-400 font-jost hidden sm:block'>{summaryLabel}</span>
      </div>

      {/* 3-column category grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {categories.filter(c => c.value !== 'All').map((cat, idx) => {
          const count = jobs.filter(j => j.category === cat.value).length
          return (
            <CategoryRow
              key={cat.value}
              catKey={cat.value}
              label={cat.label}
              count={count}
              isActive={filter === cat.value}
              onClick={() => onSelectCategory(cat.value)}
              index={idx}
            />
          )
        })}
      </div>

      {/* Footer count — mobile */}
      <p className='text-xs text-gray-400 font-jost text-center mt-6 sm:hidden'>{summaryLabel}</p>
    </motion.div>
  )
}

// ─── Sidebar filter panel ─────────────────────────────────────────────────────
function SidebarFilters({ language, filter, setFilter, typeFilter, setTypeFilter, searchTerm, setSearchTerm, jobs, isOpen, onClose, onBackToDirectory }) {
  const t = translatedContents.jobs_page
  const categories = [
    { label: t.categories_section.filters.all[language],            value: 'All'            },
    { label: t.categories_section.filters.technology[language],     value: 'Technology'     },
    { label: t.categories_section.filters.health[language],         value: 'Health'         },
    { label: t.categories_section.filters.education[language],      value: 'Education'      },
    { label: t.categories_section.filters.infrastructure[language], value: 'Infrastructure' },
    { label: t.categories_section.filters.security[language],       value: 'Security'       },
    { label: t.categories_section.filters.environment[language],    value: 'Environment'    },
    { label: t.categories_section.filters.events[language],         value: 'Event'          },
  ]

  const countFor = (val) => val === 'All' ? jobs.length : jobs.filter(j => j.category === val).length

  const labels = {
    en: { categories: 'Categories', jobType: 'Job Type', clearAll: 'Clear Filters', allCategories: 'All Categories' },
    am: { categories: 'ምድቦች',       jobType: 'የሥራ ዓይነት', clearAll: 'ማጣሪያ አጽዳ',   allCategories: 'ሁሉም ምድቦች'     },
    or: { categories: 'Gareewwan', jobType: 'Gosa Hojii', clearAll: 'Qaxxaamura Haqii', allCategories: 'Gareewwan Hunda' },
  }
  const l = labels[language] || labels.en
  const hasActiveFilters = filter !== 'All' || typeFilter !== 'All' || searchTerm !== ''

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='overlay'
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/40 z-30 lg:hidden'
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white z-40 shadow-2xl overflow-y-auto
        transition-transform duration-300 ease-in-out
        lg:static lg:h-auto lg:w-64 xl:lg:w-72 lg:shadow-none lg:translate-x-0 lg:z-auto lg:overflow-visible
        lg:shrink-0 lg:sticky lg:top-6 lg:self-start
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className='flex items-center justify-between p-5 border-b border-gray-100 lg:hidden'>
          <span className='font-goldman font-bold text-emerald-950 text-base uppercase tracking-wide'>Filters</span>
          <button onClick={onClose} className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer'>
            <CloseIcon className='w-3.5 h-3.5 text-gray-600' />
          </button>
        </div>

        <div className='p-5 space-y-6 lg:bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm lg:overflow-hidden'>

          {/* Back to directory link */}
          <button
            onClick={onBackToDirectory}
            className='w-full flex items-center gap-2 text-xs font-goldman font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors duration-200 cursor-pointer group'
          >
            <ArrowRight className='w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-200' />
            {l.allCategories}
          </button>

          <div className='h-px bg-gray-100' />

          {/* Search */}
          <div>
            <label className='block text-xs font-goldman font-bold uppercase tracking-widest text-emerald-800 mb-2.5'>
              {t.search[language]}
            </label>
            <div className='relative'>
              <SearchIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/50' />
              <input
                type='text'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={
                  language === 'am' ? 'ሥራ ፈልግ…' :
                  language === 'or' ? 'Hojii barbaadi…' :
                  'Search jobs…'
                }
                className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all font-roboto'
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer'>
                  <CloseIcon className='w-3 h-3' />
                </button>
              )}
            </div>
          </div>

          <div className='h-px bg-gray-100' />

          {/* Categories */}
          <div>
            <label className='block text-xs font-goldman font-bold uppercase tracking-widest text-emerald-800 mb-3'>
              {l.categories}
            </label>
            <ul className='space-y-1'>
              {categories.map(cat => {
                const meta = CATEGORY_META[cat.value] || CATEGORY_META.All
                const { Icon } = meta
                const count = countFor(cat.value)
                const isActive = filter === cat.value
                return (
                  <li key={cat.value}>
                    <button
                      onClick={() => { setFilter(cat.value); onClose() }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                        isActive ? 'bg-emerald-900 text-white font-bold' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/20' : meta.bg}`}>
                        <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-white' : meta.color}`} />
                      </div>
                      <span className='flex-1 text-left font-jost font-medium'>{cat.label}</span>
                      {count > 0 && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className='h-px bg-gray-100' />

          {/* Job Type */}
          <div>
            <label className='block text-xs font-goldman font-bold uppercase tracking-widest text-emerald-800 mb-3'>
              {l.jobType}
            </label>
            <div className='space-y-2'>
              {['All', ...JOB_TYPES].map(type => {
                const typeCount = type === 'All'
                  ? jobs.length
                  : jobs.filter(j => (j.type || '').replace('-', ' ') === type.replace('-', ' ')).length
                const isActive = typeFilter === type
                return (
                  <button
                    key={type}
                    onClick={() => { setTypeFilter(type); onClose() }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                      isActive ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-gray-700 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    <span className='font-jost font-medium'>
                      {type === 'All' ? (language === 'am' ? 'ሁሉም ዓይነቶች' : language === 'or' ? 'Gosa Hunda' : 'All Types') : type}
                    </span>
                    {typeCount > 0 && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-900/20 text-emerald-950' : 'bg-gray-100 text-gray-500'}`}>
                        {typeCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={() => { setFilter('All'); setTypeFilter('All'); setSearchTerm(''); onClose() }}
              className='w-full py-2.5 text-sm font-goldman font-bold uppercase tracking-wide text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all cursor-pointer'
            >
              {l.clearAll}
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
function Vacancy() {
  const { language } = useLanguage()
  const t = translatedContents.jobs_page

  const [jobs, setJobs]               = useState([])
  const [isLoading, setIsLoading]     = useState(true)
  const [filter, setFilter]           = useState('All')
  const [typeFilter, setTypeFilter]   = useState('All')
  const [searchTerm, setSearchTerm]   = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // 'directory' = category browse, 'list' = job list with sidebar
  const [view, setView]               = useState('directory')

  // fetch
  useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await fetch(`${BASE_URL}/api/vacancies`)
        if (res.ok) {
          const data = await res.json()
          setJobs(data.map(item => ({
            id:          item.id.toString(),
            title:       item.title,
            description: item.short_description || item.description?.substring(0, 120) || '',
            date:        item.formatted_date || item.end_date?.split('T')[0] || '',
            category:    item.category || 'Other',
            type:        item.type || 'Full Time',
            location:    item.location || '',
            amh:         item.amh,
            orm:         item.orm,
          })))
        }
      } catch (err) {
        console.error('Error fetching vacancies:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVacancies()
  }, [])

  // close mobile sidebar on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Select a category from the directory → go to list view
  const handleSelectCategory = (catValue) => {
    setFilter(catValue)
    setSearchTerm('')
    setTypeFilter('All')
    setView('list')
  }

  // Search from the directory → go to list view with search
  const handleDirectorySearch = (term) => {
    setSearchTerm(term)
    setFilter('All')
    setTypeFilter('All')
    setView('list')
  }

  // Back to directory
  const handleBackToDirectory = () => {
    setView('directory')
    setFilter('All')
    setSearchTerm('')
    setTypeFilter('All')
    setSidebarOpen(false)
  }

  // filtered list (used in list view)
  const finalList = useMemo(() => {
    let list = jobs
    if (filter !== 'All') list = list.filter(j => j.category === filter)
    if (typeFilter !== 'All') list = list.filter(j => (j.type || '').replace('-', ' ').toLowerCase() === typeFilter.replace('-', ' ').toLowerCase())
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      list = list.filter(j => {
        const enTitle = j.title?.toLowerCase() || ''
        const amTitle = j.amh?.title?.toLowerCase() || ''
        const orTitle = j.orm?.title?.toLowerCase() || ''
        const enDesc  = j.description?.toLowerCase() || ''
        const amDesc  = (j.amh?.short_description || j.amh?.description || '').toLowerCase()
        const orDesc  = (j.orm?.short_description || j.orm?.description || '').toLowerCase()
        const cat     = j.category?.toLowerCase() || ''
        return enTitle.includes(term) || amTitle.includes(term) || orTitle.includes(term) ||
               enDesc.includes(term)  || amDesc.includes(term)  || orDesc.includes(term)  || cat.includes(term)
      })
    }
    return list
  }, [jobs, filter, typeFilter, searchTerm])

  // i18n helpers
  const getTitle = (job) => {
    if (language === 'am' && job.amh?.title) return job.amh.title
    if (language === 'or' && job.orm?.title) return job.orm.title
    return job.title
  }
  const getDesc = (job) => {
    if (language === 'am' && job.amh) return job.amh.short_description || job.amh.description?.substring(0, 120) || job.description
    if (language === 'or' && job.orm) return job.orm.short_description || job.orm.description?.substring(0, 120) || job.description
    return job.description
  }

  // Category list (shared)
  const categories = [
    { value: 'All',            label: t.categories_section.filters.all[language]            },
    { value: 'Technology',     label: t.categories_section.filters.technology[language]     },
    { value: 'Health',         label: t.categories_section.filters.health[language]         },
    { value: 'Education',      label: t.categories_section.filters.education[language]      },
    { value: 'Infrastructure', label: t.categories_section.filters.infrastructure[language] },
    { value: 'Security',       label: t.categories_section.filters.security[language]       },
    { value: 'Environment',    label: t.categories_section.filters.environment[language]    },
    { value: 'Event',          label: t.categories_section.filters.events[language]         },
  ]

  const activeLabel     = categories.find(c => c.value === filter)?.label || categories[0].label
  const hasActiveFilters = filter !== 'All' || typeFilter !== 'All' || searchTerm !== ''

  const noResultsLabel = {
    en: 'No positions found',
    am: 'ምንም ቦታ አልተገኘም',
    or: 'Bakka hin argamne',
  }

  return (
    <div className='w-full bg-[#f6f9f7] min-h-screen'>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className='w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-72 h-72 bg-emerald-700/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none' />
        <div className='relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-7 md:py-8'>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
          >
            <div>
              <div className='flex items-center gap-2 mb-1.5'>
                <div className='w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse' />
                <span className='text-[11px] font-goldman font-bold uppercase tracking-widest text-amber-400/80'>
                  {language === 'am' ? 'ልደታ ክፍለ ከተማ' : language === 'or' ? 'Kutaa Magaalaa Lideta' : 'Lideta Sub-City Administration'}
                </span>
              </div>
              <h1 className='font-goldman font-bold text-2xl md:text-3xl text-white leading-tight'>
                {language === 'am' ? 'የሥራ ቦታ ማስታወቂያ' : language === 'or' ? 'Beeksisa Hojii' : 'Career Opportunities'}
              </h1>
            </div>
            {!isLoading && <StatsBar totalJobs={jobs.length} language={language} />}
          </motion.div>
        </div>
      </div>

      {/* ── Views ────────────────────────────────────────────────────────────── */}
      <AnimatePresence mode='wait'>

        {/* ── DIRECTORY VIEW ─────────────────────────────────────────────── */}
        {view === 'directory' && (
          isLoading ? (
            <div key='loading' className='flex justify-center items-center h-64'>
              <Loading />
            </div>
          ) : (
            <CategoryDirectory
              key='directory'
              language={language}
              jobs={jobs}
              categories={categories}
              filter={filter}
              onSelectCategory={handleSelectCategory}
              onSearch={handleDirectorySearch}
            />
          )
        )}

        {/* ── LIST VIEW ──────────────────────────────────────────────────── */}
        {view === 'list' && (
          <motion.div
            key='list'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'
          >
            <div className='flex gap-6 items-start'>

              {/* Sidebar */}
              <SidebarFilters
                language={language}
                filter={filter}
                setFilter={setFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                jobs={jobs}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onBackToDirectory={handleBackToDirectory}
              />

              {/* Job list column */}
              <div className='flex-1 min-w-0'>

                {/* Results toolbar */}
                <div className='flex items-center justify-between gap-4 mb-5 flex-wrap'>
                  <div className='flex items-center gap-3 flex-wrap'>

                    {/* Mobile filter toggle */}
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className='lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-jost font-medium text-gray-700 hover:border-emerald-300 shadow-sm transition-all cursor-pointer'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4h18M7 12h10M10 20h4' />
                      </svg>
                      {language === 'am' ? 'ማጣሪያ' : language === 'or' ? 'Qaxxaamuri' : 'Filter'}
                    </button>

                    {/* Active filter pills */}
                    <div className='flex items-center gap-2 flex-wrap'>
                      {filter !== 'All' && (
                        <span className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 text-white text-xs font-goldman font-bold uppercase tracking-wide rounded-full'>
                          {activeLabel}
                          <button onClick={() => setFilter('All')} className='ml-1 hover:text-amber-400 transition-colors cursor-pointer'>
                            <CloseIcon className='w-2.5 h-2.5' />
                          </button>
                        </span>
                      )}
                      {typeFilter !== 'All' && (
                        <span className='flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-emerald-950 text-xs font-goldman font-bold uppercase tracking-wide rounded-full'>
                          {typeFilter}
                          <button onClick={() => setTypeFilter('All')} className='ml-1 hover:text-emerald-800 transition-colors cursor-pointer'>
                            <CloseIcon className='w-2.5 h-2.5' />
                          </button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-jost font-medium rounded-full'>
                          "{searchTerm}"
                          <button onClick={() => setSearchTerm('')} className='ml-1 hover:text-red-500 transition-colors cursor-pointer'>
                            <CloseIcon className='w-2.5 h-2.5' />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Count */}
                  <span className='text-sm text-gray-400 font-jost shrink-0'>
                    <span className='font-bold text-emerald-900'>{finalList.length}</span>
                    {' '}
                    {language === 'am' ? 'ቦታዎች' : language === 'or' ? 'bakka' : finalList.length === 1 ? 'position' : 'positions'}
                  </span>
                </div>

                {/* Job cards */}
                {isLoading ? (
                  <div className='flex justify-center items-center h-64'><Loading /></div>
                ) : finalList.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100'
                  >
                    <div className='w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4'>
                      <SearchIcon className='w-8 h-8 text-emerald-700/30' />
                    </div>
                    <p className='font-goldman font-bold text-lg text-emerald-950 mb-1'>
                      {noResultsLabel[language] || noResultsLabel.en}
                    </p>
                    <p className='text-sm text-gray-400 font-jost mb-5'>
                      {language === 'am' ? 'ማጣሪያዎን ያስተካክሉ' : language === 'or' ? 'Qaxxaamura keessan gulaali' : 'Try adjusting your filters'}
                    </p>
                    <button
                      onClick={handleBackToDirectory}
                      className='px-5 py-2.5 bg-emerald-900 text-white font-goldman font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all cursor-pointer'
                    >
                      {language === 'am' ? 'ሁሉንም ምድቦች ይመልከቱ' : language === 'or' ? 'Gareewwan Hunda Ilaali' : 'Browse All Categories'}
                    </button>
                  </motion.div>
                ) : (
                  <div className='space-y-3'>
                    {finalList.map((job, idx) => (
                      <AnimatedCard key={job.id} index={idx} stagger={55} maxDelay={550} variant='up'>
                        <VacancyCard
                          id={job.id}
                          title={getTitle(job)}
                          description={getDesc(job)}
                          type={job.type}
                          location={job.location}
                          date={job.date}
                          category={job.category}
                        />
                      </AnimatedCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Vacancy
