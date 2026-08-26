import DepCard from '../components/ui/DepCard'
import AnimatedCard from '../components/ui/AnimatedCard'
import { motion } from 'framer-motion'
import { getDepartmentLogo } from '../components/utils/departmentAssets'
import { useNavigate } from 'react-router-dom'
import departmentsData from '../data/departments.json'
import SearchIcon from '../assets/icons/search_icon.svg?react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useLanguage } from '../components/utils/LanguageContext'
import translatedContents from '../data/translated_contents.json'

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_DOTS = {
  'social services':      'bg-violet-500',
  'health':               'bg-red-500',
  'infrastructure':       'bg-slate-500',
  'education':            'bg-amber-500',
  'agriculture':          'bg-green-600',
  'environment':          'bg-teal-500',
  'economic development': 'bg-blue-500',
  'legal':                'bg-orange-500',
}

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionDivider({ label, count, category }) {
  const dot = CATEGORY_DOTS[category?.toLowerCase()] || 'bg-amber-500'
  return (
    <div className='flex items-center gap-3 mb-4 mt-2'>
      <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      <span className='font-goldman font-bold text-[11px] uppercase tracking-widest text-emerald-900'>{label}</span>
      <span className='text-[10px] font-jost text-gray-400 font-medium'>{count}</span>
      <div className='flex-1 h-px bg-gray-200' />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
function Departments() {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const departments = departmentsData.departments
  const t = translatedContents.departments

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [searchFocused, setSearchFocused] = useState(false)
  const tabsRef = useRef(null)

  // i18n helpers
  const getTitle = (dep) => {
    if (typeof dep.title === 'object') return dep.title[language] || dep.title['en'] || 'Department'
    if (typeof dep.name === 'object') return dep.name[language] || dep.name['en'] || 'Department'
    return dep.title || dep.name || 'Department'
  }

  const getDescription = (dep) => {
    if (dep.shortDescription?.[language]) return dep.shortDescription[language]
    if (typeof dep.mission === 'object') return dep.mission[language] || dep.mission['en'] || ''
    if (typeof dep.description === 'object') return dep.description[language] || dep.description['en'] || ''
    return ''
  }

  // All unique categories
  const rawCategories = useMemo(() => {
    const seen = new Set()
    departments.forEach(d => {
      if (d.category) seen.add(d.category)
    })
    return Array.from(seen)
  }, [departments])

  const tabs = useMemo(() => [
    { label: t.filters.all[language], value: 'All' },
    { label: t.filters.social_services[language], value: 'Social services' },
    { label: t.filters.health[language], value: 'Health' },
    { label: t.filters.infrastructure[language], value: 'Infrastructure' },
    { label: t.filters.education[language], value: 'Education' },
    { label: t.filters.agriculture[language], value: 'Agriculture' },
    { label: t.filters.environment[language], value: 'Environment' },
    { label: t.filters.economic_development[language], value: 'Economic Development' },
    { label: t.filters.legal[language], value: 'Legal' },
  ].filter(tab => tab.value === 'All' || rawCategories.some(c => c.toLowerCase() === tab.value.toLowerCase())), [rawCategories, language])

  // Filtered + searched list
  const filteredDeps = useMemo(() => {
    let list = departments
    if (filter !== 'All') {
      list = list.filter(d => d.category?.toLowerCase() === filter.toLowerCase())
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(d =>
        getTitle(d).toLowerCase().includes(term) ||
        getDescription(d).toLowerCase().includes(term)
      )
    }
    return list
  }, [departments, filter, searchTerm, language])

  // Group by category (only when showing "All" and no search)
  const groupedSections = useMemo(() => {
    if (filter !== 'All' || searchTerm.trim()) return null
    const map = new Map()
    filteredDeps.forEach(dep => {
      const cat = dep.category || 'Other'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat).push(dep)
    })
    return Array.from(map.entries()).map(([cat, deps]) => ({ cat, deps }))
  }, [filteredDeps, filter, searchTerm])

  const isGrouped = !!groupedSections

  // Scroll active tab into view
  useEffect(() => {
    if (!tabsRef.current) return
    const activeBtn = tabsRef.current.querySelector('[data-active="true"]')
    if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [filter])

  const getCategoryLabel = (catValue) => tabs.find(t => t.value.toLowerCase() === catValue.toLowerCase())?.label || catValue

  const totalLabel = `${departments.length} ${language === 'am' ? 'ቢሮዎች' : language === 'or' ? 'Waajjiroota' : 'departments'}`

  return (
    <div className='w-full bg-[#f6f9f7] min-h-screen'>

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='font-goldman font-bold text-2xl md:text-3xl text-emerald-950 leading-tight'>
              {t.title[language]}
            </h1>
            <p className='text-xs text-gray-400 font-jost mt-0.5'>
              {language === 'am' ? 'ልደታ ክፍለ ከተማ አስተዳደር' : language === 'or' ? 'Bulchiinsa Kutaa Magaalaa Lideta' : 'Lideta Sub-City Administration'}
              {' · '}
              <span className='text-emerald-700 font-medium'>{totalLabel}</span>
            </p>
          </div>

          {/* Search */}
          <div className={`relative transition-all duration-300 ${searchFocused ? 'w-72' : 'w-56'}`}>
            <SearchIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/50' />
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={t.search?.[language] || (language === 'am' ? 'ፈልግ…' : language === 'or' ? 'Barbaadi…' : 'Search departments…')}
              className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all font-roboto'
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none'
              >×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category tab bar ─────────────────────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3'>
          <div
            ref={tabsRef}
            className='flex items-center gap-1.5 overflow-x-auto'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map(tab => {
              const isActive = filter === tab.value
              const dot = CATEGORY_DOTS[tab.value.toLowerCase()]
              const count = tab.value === 'All'
                ? departments.length
                : departments.filter(d => d.category?.toLowerCase() === tab.value.toLowerCase()).length
              return (
                <button
                  key={tab.value}
                  data-active={isActive}
                  onClick={() => { setFilter(tab.value); setSearchTerm('') }}
                  className={`
                    shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-goldman font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer
                    ${isActive
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-800 hover:bg-emerald-50/50'
                    }
                  `}
                >
                  {dot && tab.value !== 'All' && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-amber-400' : dot}`} />
                  )}
                  {tab.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Department list ───────────────────────────────────────────────────── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'>

        {/* No results */}
        {filteredDeps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100'
          >
            <div className='w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4'>
              <SearchIcon className='w-8 h-8 text-emerald-700/30' />
            </div>
            <p className='font-goldman font-bold text-lg text-emerald-950 mb-2'>
              {language === 'am' ? 'ምንም ውጤት አልተገኘም' : language === 'or' ? 'Wanti hin argamne' : 'No departments found'}
            </p>
            <button
              onClick={() => { setFilter('All'); setSearchTerm('') }}
              className='mt-3 px-5 py-2.5 bg-emerald-900 text-white font-goldman font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all cursor-pointer'
            >
              {language === 'am' ? 'ሁሉንም አሳይ' : language === 'or' ? 'Hunda Agarsiisi' : 'Show All'}
            </button>
          </motion.div>
        )}

        {/* ── Grouped by category (default "All" view) ── */}
        {isGrouped && groupedSections.map(({ cat, deps }) => (
          <div key={cat} className='mb-10'>
            <SectionDivider
              label={getCategoryLabel(cat)}
              count={`${deps.length} ${language === 'am' ? 'ቢሮ' : language === 'or' ? 'waajjira' : deps.length === 1 ? 'dept' : 'depts'}`}
              category={cat}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {deps.map((dep, idx) => (
                <AnimatedCard key={dep.id} index={idx} stagger={60} maxDelay={480}>
                  <div onClick={() => navigate(`/departments/${dep.id}`)} className='cursor-pointer'>
                    <DepCard
                      title={getTitle(dep)}
                      description={getDescription(dep)}
                      logo={getDepartmentLogo(dep.id)}
                      category={dep.category}
                    />
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        ))}

        {/* ── Flat list (filtered or searched) ── */}
        {!isGrouped && filteredDeps.length > 0 && (
          <>
            {/* Active filter badge */}
            {(filter !== 'All' || searchTerm) && (
              <div className='flex items-center gap-2 mb-5 flex-wrap'>
                {filter !== 'All' && (
                  <span className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 text-white text-xs font-goldman font-bold uppercase tracking-wide rounded-full'>
                    {getCategoryLabel(filter)}
                    <button onClick={() => setFilter('All')} className='ml-1 hover:text-amber-400 transition-colors cursor-pointer text-sm leading-none'>×</button>
                  </span>
                )}
                {searchTerm && (
                  <span className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-jost font-medium rounded-full'>
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className='ml-1 hover:text-red-500 transition-colors cursor-pointer text-sm leading-none'>×</button>
                  </span>
                )}
                <span className='text-sm text-gray-400 font-jost ml-auto'>
                  <span className='font-bold text-emerald-900'>{filteredDeps.length}</span>
                  {' '}
                  {language === 'am' ? 'ቢሮዎች' : language === 'or' ? 'waajjiroota' : filteredDeps.length === 1 ? 'department' : 'departments'}
                </span>
              </div>
            )}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {filteredDeps.map((dep, idx) => (
                <AnimatedCard key={dep.id} index={idx} stagger={60} maxDelay={480}>
                  <div onClick={() => navigate(`/departments/${dep.id}`)} className='cursor-pointer'>
                    <DepCard
                      title={getTitle(dep)}
                      description={getDescription(dep)}
                      logo={getDepartmentLogo(dep.id)}
                      category={dep.category}
                    />
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Departments
