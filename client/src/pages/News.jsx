import BASE_URL from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FeatureCard, ListCard } from '../components/ui/NewsCard'
import AnimatedCard from '../components/ui/AnimatedCard'
import Loading from '../components/ui/Loading'
import { useLanguage } from '../components/utils/LanguageContext'
import translatedContents from '../data/translated_contents.json'

import SearchIcon   from '../assets/icons/search_icon.svg?react'
import ImageIcon    from '../assets/icons/image_icon.svg?react'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'
import ArrowRight   from '../assets/icons/arrow_right.svg?react'

// ─── Image helper ─────────────────────────────────────────────────────────────
function getImageSrc(photo) {
  if (!photo) return null
  if (typeof photo === 'object' && photo.path) return photo.path
  if (typeof photo === 'string') {
    try { const p = JSON.parse(photo); if (p.path) return p.path } catch { if (photo.startsWith('/')) return photo }
  }
  return null
}

// ─── Breaking / date banner ───────────────────────────────────────────────────
function BreakingBanner({ language, totalCount }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString(
    language === 'am' ? 'en-ET' : language === 'or' ? 'om-ET' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )
  const label = { en: 'Latest Updates', am: 'የቅርብ ጊዜ ዜናዎች', or: 'Oduu Haaraa' }[language] || 'Latest Updates'
  const articlesLabel = { en: `${totalCount} articles`, am: `${totalCount} ዜናዎች`, or: `${totalCount} oduu` }[language] || `${totalCount} articles`

  return (
    <div className='w-full bg-emerald-950 border-b border-emerald-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <span className='flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse' />
            <span className='text-[11px] font-goldman font-bold uppercase tracking-widest text-amber-400'>{label}</span>
          </span>
          <span className='hidden sm:block w-px h-3.5 bg-emerald-700' />
          <span className='hidden sm:block text-[11px] text-emerald-400/70 font-jost'>{dateStr}</span>
        </div>
        <span className='text-[11px] text-emerald-500/60 font-jost'>{articlesLabel}</span>
      </div>
    </div>
  )
}

// ─── Hero lead story ──────────────────────────────────────────────────────────
function HeroStory({ item, language }) {
  const navigate = useNavigate()
  if (!item) return null
  const imageSrc = getImageSrc(item.photo)

  return (
    <div
      onClick={() => navigate(`/news/${item.id}`)}
      className='group relative w-full rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_32px_rgba(6,78,59,0.18)] hover:shadow-[0_8px_48px_rgba(6,78,59,0.26)] transition-shadow duration-500'
      style={{ minHeight: '420px' }}
    >
      {/* Background image */}
      <div className='absolute inset-0'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title}
            className='w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out'
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800' />
        )}
        {/* Multi-stop gradient overlay for text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/50 to-emerald-950/10' />
        <div className='absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 md:p-10' style={{ minHeight: '420px' }}>
        {/* Label row */}
        <div className='flex items-center gap-3 mb-4'>
          <span className='bg-amber-500 text-emerald-950 font-goldman font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg'>
            {item.category}
          </span>
          <span className='flex items-center gap-1.5 text-emerald-300/70 text-[11px] font-jost'>
            <CalenderIcon className='w-3 h-3' />
            {item.date}
          </span>
        </div>

        {/* Headline */}
        <h1 className='font-goldman font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-3 max-w-3xl group-hover:text-amber-50 transition-colors duration-300'>
          {item.title}
        </h1>

        {/* Description */}
        {item.description && (
          <p className='text-emerald-200/70 text-sm sm:text-base font-roboto font-light leading-relaxed max-w-2xl line-clamp-2 mb-6'>
            {item.description}
          </p>
        )}

        {/* CTA */}
        <div className='flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors duration-200'>
          <span className='font-goldman font-bold text-sm uppercase tracking-wider'>
            { { en: 'Read Full Story', am: 'ሙሉ ዜናውን አንብብ', or: 'Oduu Guutuu Dubbisi' }[language] || 'Read Full Story' }
          </span>
          <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
        </div>
      </div>

      {/* Top-right badge */}
      <div className='absolute top-4 right-4 z-10'>
        <span className='bg-white/10 backdrop-blur-sm border border-white/20 text-white font-goldman font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full'>
          { { en: 'Featured', am: 'ተመርጦ', or: 'Filatame' }[language] || 'Featured' }
        </span>
      </div>
    </div>
  )
}

// ─── Category tab bar ─────────────────────────────────────────────────────────
function CategoryTabs({ categories, activeFilter, setFilter, news }) {
  const tabsRef = useRef(null)
  const countFor = (val) => val === 'All' ? news.length : news.filter(n => n.category === val).length

  return (
    <div className='relative'>
      <div
        ref={tabsRef}
        className='flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map(cat => {
          const count = countFor(cat.value)
          const isActive = activeFilter === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`
                shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-goldman font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-800 hover:bg-emerald-50'
                }
              `}
            >
              {cat.label}
              {count > 0 && (
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {/* Fade edge hint */}
      <div className='absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-[#f0f4f2] to-transparent pointer-events-none rounded-r-full' />
    </div>
  )
}

// ─── Latest sidebar ───────────────────────────────────────────────────────────
function LatestSidebar({ items, onNavigate, language }) {
  const heading = { en: 'Latest News', am: 'የቅርብ ጊዜ ዜናዎች', or: 'Oduu Haaraa' }[language] || 'Latest News'
  const moreLabel = { en: 'See all news', am: 'ሁሉንም ዜና ይመልከቱ', or: 'Oduu hunda ilaali' }[language] || 'See all news'

  return (
    <aside className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='px-5 py-4 border-b border-gray-100 bg-emerald-950'>
        <h2 className='font-goldman font-bold text-[13px] uppercase tracking-widest text-white'>{heading}</h2>
      </div>

      {/* Items */}
      <div className='divide-y divide-gray-50'>
        {items.slice(0, 8).map((item, idx) => {
          const imageSrc = getImageSrc(item.photo)
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className='group w-full flex items-start gap-3 px-4 py-3.5 hover:bg-emerald-50/60 transition-colors duration-200 text-left cursor-pointer'
            >
              {/* Number */}
              <span className='shrink-0 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mt-0.5'>
                <span className='text-[10px] font-goldman font-bold text-emerald-700'>{idx + 1}</span>
              </span>
              {/* Text */}
              <div className='flex-1 min-w-0'>
                {item.category && (
                  <p className='text-[9px] font-goldman font-bold uppercase tracking-widest text-amber-600 mb-0.5'>{item.category}</p>
                )}
                <p className='text-[12px] font-goldman font-bold leading-snug text-emerald-950 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2'>
                  {item.title}
                </p>
                <p className='text-[10px] text-gray-400 font-jost mt-1'>{item.date}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className='px-5 py-3 border-t border-gray-100 bg-gray-50/50'>
        <button
          onClick={() => onNavigate(null)}
          className='text-[11px] font-goldman font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors duration-200 cursor-pointer'
        >
          {moreLabel}
          <ArrowRight className='w-3 h-3' />
        </button>
      </div>
    </aside>
  )
}

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionDivider({ label }) {
  return (
    <div className='flex items-center gap-3 my-6'>
      <div className='w-1 h-5 rounded-full bg-amber-500' />
      <span className='font-goldman font-bold text-[11px] uppercase tracking-widest text-emerald-800'>{label}</span>
      <div className='flex-1 h-px bg-gray-200' />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
function News() {
  const { language } = useLanguage()
  const t = translatedContents.news_page
  const navigate = useNavigate()

  const [news, setNews]           = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter]       = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  // fetch
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`${BASE_URL}/api/news`)
        if (res.ok) {
          const data = await res.json()
          setNews(data.map(item => ({
            id:          item.id.toString(),
            title:       item.title,
            description: item.short_description || item.description?.substring(0, 120) || '',
            date:        item.formatted_date || item.created_at?.split('T')[0] || '',
            category:    item.category || '',
            photo:       item.photo,
            amh:         item.amh,
            orm:         item.orm,
          })))
        }
      } catch (err) {
        console.error('Error fetching news:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNews()
  }, [])

  // i18n getters
  const getTitle = (item) => {
    if (language === 'am' && item.amh?.title) return item.amh.title
    if (language === 'or' && item.orm?.title) return item.orm.title
    return item.title
  }
  const getDesc = (item) => {
    if (language === 'am' && item.amh) return item.amh.short_description || item.amh.description?.substring(0, 120) || item.description
    if (language === 'or' && item.orm) return item.orm.short_description || item.orm.description?.substring(0, 120) || item.description
    return item.description
  }
  const getCat = (item) => {
    if (language === 'am' && item.amh?.category) return item.amh.category
    if (language === 'or' && item.orm?.category) return item.orm.category
    return item.category
  }

  // localized news list
  const localizedNews = useMemo(() => news.map(item => ({
    ...item,
    title:       getTitle(item),
    description: getDesc(item),
    category:    getCat(item),
  })), [news, language])

  // filtered + searched list
  const filteredNews = useMemo(() => {
    let list = localizedNews
    if (filter !== 'All') list = list.filter(n => n.category === filter || news.find(r => r.id === n.id)?.category === filter)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(n =>
        n.title?.toLowerCase().includes(term) ||
        n.description?.toLowerCase().includes(term) ||
        n.category?.toLowerCase().includes(term)
      )
    }
    return list
  }, [localizedNews, filter, searchTerm])

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

  const isSearching = searchTerm.trim().length > 0

  // Structural split (only when not searching/filtering)
  const heroItem   = filteredNews[0]   || null
  const featurePair = filteredNews.slice(1, 3)
  const listItems  = filteredNews.slice(3)

  // "Latest" sidebar always shows raw chronological list regardless of filter
  const latestItems = localizedNews.slice(0, 8)

  const noResultsLabel = { en: 'No articles found', am: 'ምንም ዜና አልተገኘም', or: 'Oduu hin argamne' }[language] || 'No articles found'
  const storiesLabel   = { en: 'More Stories',       am: 'ተጨማሪ ዜናዎች',    or: 'Oduu Dabalataa'  }[language] || 'More Stories'
  const searchLabel    = { en: 'Search results for', am: 'ፍለጋ ውጤቶች',      or: 'Buʼaa barbaachaa' }[language] || 'Search results for'

  return (
    <div className='w-full bg-[#f0f4f2] min-h-screen'>

      {/* ── Breaking banner ────────────────────────────────────────────────── */}
      <BreakingBanner language={language} totalCount={news.length} />

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='font-goldman font-bold text-2xl md:text-3xl text-emerald-950 leading-tight'>
              {t.title[language]}
            </h1>
            <p className='text-xs text-gray-400 font-jost mt-0.5'>
              { { en: 'Lideta Sub-City Administration', am: 'ልደታ ክፍለ ከተማ አስተዳደር', or: 'Bulchiinsa Kutaa Magaalaa Lideta' }[language] }
            </p>
          </div>

          {/* Search bar */}
          <div className={`relative transition-all duration-300 ${searchFocused ? 'w-72' : 'w-56'}`}>
            <SearchIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/50' />
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={t.search[language] + '…'}
              className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-all font-roboto'
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-lg leading-none'>×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Loading />
          </div>
        ) : filteredNews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100'
          >
            <div className='w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4'>
              <SearchIcon className='w-8 h-8 text-emerald-700/30' />
            </div>
            <p className='font-goldman font-bold text-lg text-emerald-950 mb-2'>{noResultsLabel}</p>
            {(filter !== 'All' || searchTerm) && (
              <button
                onClick={() => { setFilter('All'); setSearchTerm('') }}
                className='mt-3 px-5 py-2.5 bg-emerald-900 text-white font-goldman font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all cursor-pointer'
              >
                { { en: 'Clear filters', am: 'ማጣሪያ አጽዳ', or: 'Qaxxaamura haqii' }[language] || 'Clear filters' }
              </button>
            )}
          </motion.div>
        ) : isSearching ? (
          // ── Search results view ──────────────────────────────────────────
          <div className='flex flex-col lg:flex-row gap-6 items-start'>
            <div className='flex-1 min-w-0'>
              <SectionDivider label={`${searchLabel}: "${searchTerm}" — ${filteredNews.length} ${{ en: 'results', am: 'ውጤቶች', or: 'buʼaa' }[language] || 'results'}`} />
              <div className='space-y-3'>
                {filteredNews.map((item, idx) => (
                  <AnimatedCard key={item.id} index={idx} stagger={50} maxDelay={500}>
                    <ListCard id={item.id} title={item.title} description={item.description} date={item.date} category={item.category} photo={item.photo} index={idx} />
                  </AnimatedCard>
                ))}
              </div>
            </div>
            <div className='w-full lg:w-72 xl:w-80 shrink-0 sticky top-6 self-start'>
              <LatestSidebar items={latestItems} onNavigate={(id) => id ? navigate(`/news/${id}`) : setSearchTerm('')} language={language} />
            </div>
          </div>
        ) : filter !== 'All' ? (
          // ── Category-filtered view ───────────────────────────────────────
          <div className='flex flex-col lg:flex-row gap-6 items-start'>
            <div className='flex-1 min-w-0'>
              {/* Tab bar */}
              <div className='mb-5'>
                <CategoryTabs categories={categories} activeFilter={filter} setFilter={setFilter} news={news} />
              </div>
              <SectionDivider label={categories.find(c => c.value === filter)?.label || filter} />

              {/* Hero + list for this category */}
              {heroItem && (
                <AnimatedCard index={0} stagger={0}>
                  <div className='mb-5'>
                    <HeroStory item={heroItem} language={language} />
                  </div>
                </AnimatedCard>
              )}
              <div className='space-y-3'>
                {filteredNews.slice(1).map((item, idx) => (
                  <AnimatedCard key={item.id} index={idx + 1} stagger={55} maxDelay={500}>
                    <ListCard id={item.id} title={item.title} description={item.description} date={item.date} category={item.category} photo={item.photo} index={idx} />
                  </AnimatedCard>
                ))}
              </div>
            </div>
            <div className='w-full lg:w-72 xl:w-80 shrink-0 sticky top-6 self-start'>
              <LatestSidebar items={latestItems} onNavigate={(id) => id ? navigate(`/news/${id}`) : setFilter('All')} language={language} />
            </div>
          </div>
        ) : (
          // ── Default "All" editorial view ─────────────────────────────────
          <div className='flex flex-col lg:flex-row gap-6 items-start'>

            {/* Left: editorial content */}
            <div className='flex-1 min-w-0 space-y-0'>

              {/* Category tabs */}
              <div className='mb-6'>
                <CategoryTabs categories={categories} activeFilter={filter} setFilter={setFilter} news={news} />
              </div>

              {/* Hero */}
              {heroItem && (
                <AnimatedCard index={0} stagger={0}>
                  <div className='mb-5'>
                    <HeroStory item={heroItem} language={language} />
                  </div>
                </AnimatedCard>
              )}

              {/* Feature pair */}
              {featurePair.length > 0 && (
                <>
                  <SectionDivider label={{ en: 'Top Stories', am: 'ዋና ዜናዎች', or: 'Oduu Gurguddaa' }[language] || 'Top Stories'} />
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
                    {featurePair.map((item, idx) => (
                      <AnimatedCard key={item.id} index={idx + 1} stagger={80}>
                        <FeatureCard id={item.id} title={item.title} description={item.description} date={item.date} category={item.category} photo={item.photo} />
                      </AnimatedCard>
                    ))}
                  </div>
                </>
              )}

              {/* More stories list */}
              {listItems.length > 0 && (
                <>
                  <SectionDivider label={storiesLabel} />
                  <div className='space-y-3'>
                    {listItems.map((item, idx) => (
                      <AnimatedCard key={item.id} index={idx} stagger={55} maxDelay={550}>
                        <ListCard id={item.id} title={item.title} description={item.description} date={item.date} category={item.category} photo={item.photo} index={idx} />
                      </AnimatedCard>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: sticky sidebar */}
            <div className='w-full lg:w-72 xl:w-80 shrink-0 sticky top-6 self-start space-y-5'>
              <LatestSidebar items={latestItems} onNavigate={(id) => id && navigate(`/news/${id}`)} language={language} />

              {/* Category quick links */}
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='px-5 py-4 border-b border-gray-100'>
                  <h2 className='font-goldman font-bold text-[13px] uppercase tracking-widest text-emerald-950'>
                    { { en: 'Browse by Topic', am: 'በርዕሰ ጉዳይ ፈልግ', or: 'Mata Dureen Barbaadi' }[language] || 'Browse by Topic' }
                  </h2>
                </div>
                <div className='p-3 flex flex-wrap gap-1.5'>
                  {categories.slice(1).map(cat => {
                    const count = news.filter(n => n.category === cat.value).length
                    if (count === 0) return null
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setFilter(cat.value)}
                        className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 hover:bg-emerald-900 hover:text-white hover:border-emerald-900 text-gray-700 text-[11px] font-goldman font-bold uppercase tracking-wide rounded-full transition-all duration-200 cursor-pointer'
                      >
                        {cat.label}
                        <span className='text-[9px] opacity-60'>{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default News
