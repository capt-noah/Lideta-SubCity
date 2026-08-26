import BASE_URL from '../utils/api'
import React, { useState, useEffect } from 'react'
import { useLanguage } from '../components/utils/LanguageContext'
import { useNavigate, useParams } from 'react-router-dom'
import RelatedNewsItem from '../components/ui/RelatedNewsItem'
import { FeatureCard } from '../components/ui/NewsCard'
import AnimatedCard from '../components/ui/AnimatedCard'
import Loading from '../components/ui/Loading'
import translatedContents from '../data/translated_contents.json'
import ArrowRight   from '../assets/icons/arrow_right.svg?react'
import ImageIcon    from '../assets/icons/image_icon.svg?react'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'
import InstagramIcon from '../assets/icons/instagram_icon.svg?react'
import FacebookIcon  from '../assets/icons/facebook_icon.svg?react'
import TwitterIcon   from '../assets/icons/twitter_icon.svg?react'
import MailIcon      from '../assets/icons/mail_icon.svg?react'
import TelegramIcon  from '../assets/icons/telegram_icon.svg?react'

// ─── Image helper ─────────────────────────────────────────────────────────────
function getImageSrc(photo) {
  if (!photo) return null
  if (typeof photo === 'object' && photo.path) return photo.path
  if (typeof photo === 'string') {
    try { const p = JSON.parse(photo); if (p.path) return p.path } catch { if (photo.startsWith('/')) return photo }
  }
  return null
}

// ─── Share button ─────────────────────────────────────────────────────────────
function ShareButton({ Icon, label, color }) {
  return (
    <button
      className={`group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-sm font-jost font-medium ${color}`}
      title={label}
    >
      <Icon className='w-4 h-4 shrink-0' />
      <span className='hidden sm:block'>{label}</span>
    </button>
  )
}

// ─── Reading progress bar ─────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className='fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none'>
      <div
        className='h-full bg-amber-500 transition-all duration-100 ease-out'
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function NewsDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { language } = useLanguage()
  const t = translatedContents.news_page.details

  const [currentNews, setCurrentNews]   = useState(null)
  const [relatedNews, setRelatedNews]   = useState([])
  const [moreFromCat, setMoreFromCat]   = useState([])
  const [isLoading, setIsLoading]       = useState(true)
  const [imgLoaded, setImgLoaded]       = useState(false)
  const [imgError, setImgError]         = useState(false)
  const [copied, setCopied]             = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setImgLoaded(false)
    setImgError(false)

    async function fetchNews() {
      try {
        const res = await fetch(`${BASE_URL}/api/news`)
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()

        const newsItem = data.find(item => item.id.toString() === id) || data[0]

        // i18n
        let title       = newsItem.title
        let description = newsItem.description
        let category    = newsItem.category
        if (language === 'am' && newsItem.amh) {
          title       = newsItem.amh.title       || title
          description = newsItem.amh.description || description
          category    = newsItem.amh.category    || category
        } else if (language === 'or' && newsItem.orm) {
          title       = newsItem.orm.title       || title
          description = newsItem.orm.description || description
          category    = newsItem.orm.category    || category
        }

        const paragraphs = description
          ? description.split('\n').map(p => p.trim()).filter(Boolean)
          : ['No content available.']

        setCurrentNews({
          id:         newsItem.id.toString(),
          title,
          category,
          date:       newsItem.formatted_date || newsItem.created_at?.split('T')[0] || '',
          paragraphs,
          photo:      newsItem.photo,
          rawCategory: newsItem.category,
        })

        // sidebar: 6 latest excluding current
        const others = data.filter(item => item.id.toString() !== id)

        setRelatedNews(others.slice(0, 6).map(item => {
          let rTitle    = item.title
          let rCategory = item.category
          let rDate     = item.formatted_date || item.created_at?.split('T')[0] || ''
          if (language === 'am' && item.amh) { rTitle = item.amh.title || rTitle; rCategory = item.amh.category || rCategory }
          else if (language === 'or' && item.orm) { rTitle = item.orm.title || rTitle; rCategory = item.orm.category || rCategory }
          return { id: item.id.toString(), title: rTitle, category: rCategory, date: rDate, photo: item.photo }
        }))

        // "More from this category" — same category, max 3
        const sameCat = others
          .filter(item => item.category === newsItem.category)
          .slice(0, 3)
          .map(item => {
            let rTitle    = item.title
            let rCategory = item.category
            let rDate     = item.formatted_date || item.created_at?.split('T')[0] || ''
            let rDesc     = item.short_description || item.description?.substring(0, 100) || ''
            if (language === 'am' && item.amh) { rTitle = item.amh.title || rTitle; rCategory = item.amh.category || rCategory; rDesc = item.amh.short_description || item.amh.description?.substring(0, 100) || rDesc }
            else if (language === 'or' && item.orm) { rTitle = item.orm.title || rTitle; rCategory = item.orm.category || rCategory; rDesc = item.orm.short_description || item.orm.description?.substring(0, 100) || rDesc }
            return { id: item.id.toString(), title: rTitle, description: rDesc, category: rCategory, date: rDate, photo: item.photo }
          })
        setMoreFromCat(sameCat)

      } catch (err) {
        console.error('Error fetching news:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNews()
  }, [id, language])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (isLoading || !currentNews) {
    return (
      <div className='w-full flex justify-center items-center min-h-screen bg-[#f0f4f2]'>
        <Loading />
      </div>
    )
  }

  const imageSrc = getImageSrc(currentNews.photo)

  const backLabel      = t?.back_to_news?.[language]   || 'Back to News'
  const relatedLabel   = { en: 'Latest News',           am: 'የቅርብ ጊዜ ዜናዎች', or: 'Oduu Haaraa'           }[language] || 'Latest News'
  const moreFromLabel  = { en: 'More from',             am: 'ተጨማሪ ዜናዎች',    or: 'Dabalataan'            }[language] || 'More from'
  const shareLabel     = { en: 'Share this article',    am: 'ዚህን ዜና አጋራ',    or: 'Oduu Kana Qoodi'      }[language] || 'Share this article'
  const readingLabel   = { en: 'min read',              am: 'ደቂቃ ንባብ',        or: 'daqiiqaa dubbisuu'    }[language] || 'min read'

  // rough reading time
  const wordCount  = currentNews.paragraphs.join(' ').split(/\s+/).length
  const readMins   = Math.max(1, Math.round(wordCount / 200))

  return (
    <>
      <ReadingProgress />

      <div className='w-full bg-[#f0f4f2] min-h-screen'>

        {/* ── Breadcrumb / back bar ─────────────────────────────────────── */}
        <div className='w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-3'>
            <button
              onClick={() => navigate('/news')}
              className='flex items-center gap-2 text-sm font-goldman font-bold text-emerald-900 hover:text-amber-600 transition-colors duration-200 cursor-pointer group'
            >
              <ArrowRight className='w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-200' />
              {backLabel}
            </button>
            <span className='text-gray-300'>›</span>
            {currentNews.category && (
              <>
                <button
                  onClick={() => navigate('/news')}
                  className='text-sm font-jost text-gray-500 hover:text-emerald-800 transition-colors duration-200 cursor-pointer'
                >
                  {currentNews.category}
                </button>
                <span className='text-gray-300'>›</span>
              </>
            )}
            <span className='text-sm font-jost text-gray-400 line-clamp-1 flex-1 hidden sm:block'>
              {currentNews.title}
            </span>
          </div>
        </div>

        {/* ── Article header ────────────────────────────────────────────── */}
        <div className='w-full bg-white border-b border-gray-100'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 py-5'>
            <div className='max-w-3xl'>
              {/* Meta row */}
              <div className='flex items-center gap-2.5 mb-3 flex-wrap'>
                {currentNews.category && (
                  <span className='bg-amber-500 text-emerald-950 font-goldman font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full'>
                    {currentNews.category}
                  </span>
                )}
                <span className='flex items-center gap-1.5 text-xs text-gray-400 font-jost'>
                  <CalenderIcon className='w-3 h-3 text-emerald-600/40' />
                  {currentNews.date}
                </span>
                <span className='text-gray-300'>·</span>
                <span className='text-xs text-gray-400 font-jost'>{readMins} {readingLabel}</span>
              </div>

              {/* Headline */}
              <h1 className='font-goldman font-bold text-2xl sm:text-3xl md:text-4xl leading-tight text-emerald-950'>
                {currentNews.title}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Main layout: article + sidebar ───────────────────────────── */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24'>
          <div className='flex flex-col lg:flex-row gap-8 items-start'>

            {/* ── Article body column ───────────────────────────────────── */}
            <article className='flex-1 min-w-0'>

              {/* Hero image */}
              <div className='relative w-full rounded-2xl overflow-hidden bg-emerald-50 mb-10 shadow-[0_4px_32px_rgba(6,78,59,0.12)]'
                style={{ aspectRatio: '16/9', maxHeight: '520px' }}
              >
                {imageSrc && !imgError ? (
                  <>
                    {/* Blur-up placeholder */}
                    {!imgLoaded && (
                      <div className='absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 animate-pulse' />
                    )}
                    <img
                      src={imageSrc}
                      alt={currentNews.title}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImgLoaded(true)}
                      onError={() => setImgError(true)}
                    />
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 min-h-[240px]'>
                    <ImageIcon className='w-16 h-16 text-emerald-300' />
                  </div>
                )}

                {/* Category badge on image */}
                {currentNews.category && (
                  <div className='absolute bottom-4 left-4'>
                    <span className='bg-emerald-950/80 backdrop-blur-sm text-white font-goldman font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10'>
                      {currentNews.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Article body — constrained reading column */}
              <div className='max-w-2xl'>
                {currentNews.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={`
                      leading-8 text-gray-700 font-roboto mb-6
                      ${idx === 0
                        ? 'text-[1.1rem] font-light text-gray-800 border-l-4 border-amber-500 pl-5 py-1 bg-amber-50/30 rounded-r-lg'
                        : 'text-base font-light'
                      }
                    `}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* ── Share bar ─────────────────────────────────────────── */}
              <div className='max-w-2xl mt-10 pt-8 border-t border-gray-200'>
                <p className='text-xs font-goldman font-bold uppercase tracking-widest text-gray-400 mb-4'>{shareLabel}</p>
                <div className='flex items-center gap-2 flex-wrap'>
                  <ShareButton Icon={FacebookIcon}  label='Facebook'  color='border-blue-200 text-blue-700 hover:bg-blue-50' />
                  <ShareButton Icon={TelegramIcon}  label='Telegram'  color='border-sky-200 text-sky-600 hover:bg-sky-50' />
                  <ShareButton Icon={TwitterIcon}   label='X / Twitter' color='border-gray-200 text-gray-700 hover:bg-gray-50' />
                  <ShareButton Icon={InstagramIcon} label='Instagram' color='border-pink-200 text-pink-600 hover:bg-pink-50' />
                  <ShareButton Icon={MailIcon}      label='Email'     color='border-emerald-200 text-emerald-700 hover:bg-emerald-50' />
                  <button
                    onClick={handleCopyLink}
                    className='flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-sm font-jost font-medium'
                  >
                    {copied
                      ? <span className='text-emerald-600 font-goldman font-bold text-xs uppercase tracking-wide'>✓ { { en: 'Copied!', am: 'ተቀድቷል!', or: 'Kopii ta\'e!' }[language] }</span>
                      : <span>{ { en: 'Copy link', am: 'አገናኝ ቅዳ', or: 'Hidhaa Koopii' }[language] || 'Copy link' }</span>
                    }
                  </button>
                </div>
              </div>

              {/* ── More from this category ───────────────────────────── */}
              {moreFromCat.length > 0 && (
                <div className='mt-14'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-1 h-6 rounded-full bg-amber-500' />
                    <h2 className='font-goldman font-bold text-lg uppercase tracking-wider text-emerald-950'>
                      {moreFromLabel} {currentNews.category}
                    </h2>
                    <div className='flex-1 h-px bg-gray-200' />
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {moreFromCat.map((item, idx) => (
                      <AnimatedCard key={item.id} index={idx} stagger={80}>
                        <FeatureCard
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          date={item.date}
                          category={item.category}
                          photo={item.photo}
                        />
                      </AnimatedCard>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ── Sticky sidebar ────────────────────────────────────────── */}
            <aside className='w-full lg:w-72 xl:w-80 shrink-0 sticky top-[4.5rem] self-start space-y-5'>

              {/* Related / Latest news */}
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='px-5 py-4 bg-emerald-950'>
                  <h2 className='font-goldman font-bold text-[13px] uppercase tracking-widest text-white'>{relatedLabel}</h2>
                </div>
                <div className='px-4 py-2'>
                  {relatedNews.map((item) => (
                    <RelatedNewsItem
                      key={item.id}
                      title={item.title}
                      category={item.category}
                      date={item.date}
                      path={item.photo}
                      onClick={() => navigate(`/news/${item.id}`)}
                    />
                  ))}
                </div>
                <div className='px-5 py-3 border-t border-gray-100 bg-gray-50/50'>
                  <button
                    onClick={() => navigate('/news')}
                    className='flex items-center gap-1.5 text-[11px] font-goldman font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors duration-200 cursor-pointer'
                  >
                    { { en: 'All News', am: 'ሁሉም ዜና', or: 'Oduu Hunda' }[language] || 'All News' }
                    <ArrowRight className='w-3 h-3' />
                  </button>
                </div>
              </div>

              {/* Current article quick-nav card */}
              <div className='bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-2xl p-5 border border-emerald-800'>
                <p className='text-[10px] font-goldman font-bold uppercase tracking-widest text-emerald-400/70 mb-2'>
                  { { en: 'You are reading', am: 'እያነበቡ ያሉት', or: 'Dubbisaa jirtu' }[language] || 'You are reading' }
                </p>
                <p className='text-sm font-goldman font-bold text-white leading-snug line-clamp-3 mb-3'>
                  {currentNews.title}
                </p>
                <div className='flex items-center gap-2'>
                  {currentNews.category && (
                    <span className='text-[10px] font-goldman font-bold uppercase tracking-widest bg-amber-500 text-emerald-950 px-2.5 py-1 rounded-full'>
                      {currentNews.category}
                    </span>
                  )}
                  <span className='text-[10px] text-emerald-400/60 font-jost'>{readMins} {readingLabel}</span>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewsDetails
