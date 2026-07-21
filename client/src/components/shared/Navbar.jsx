import BASE_URL from '../../utils/api'
import React, { useEffect, useState } from 'react'
import LidetaLogo from '../../assets/LidetaLogo.svg?react'
import ArrowSvg from '../../assets/arrow.svg'
import UkFlag from '../../assets/uk_flag.png'
import AmFlag from '../../assets/am_flag.jpeg'
import OrFlag from '../../assets/or_flag.jpeg'
import BarsIcon from '../../assets/icons/bars_icon.svg?react'
import BellIcon from '../../assets/icons/bell_icon.svg?react'
import { useLanguage } from '../utils/LanguageContext'
import { useUser } from '../utils/UserContext'
import translatedContents from '../../data/translated_contents.json'
import { useLocation, Link } from 'react-router-dom'
import NotificationsPanel from '../ui/NotificationsPanel.jsx'



function Navbar() {

  const { pathname } = useLocation()
  const { language, changeLanguage } = useLanguage()
  const { user, userToken } = useUser()
  const [isLangOpen,   setIsLangOpen]   = useState(false)
  const [notifOpen,    setNotifOpen]    = useState(false)
  const [notifCount,   setNotifCount]   = useState(0)

  // Fetch notification count when user is logged in
  useEffect(() => {
    if (!user || !userToken) {
      const timer = setTimeout(() => setNotifCount(0), 0)
      return () => clearTimeout(timer)
    }
    fetch(`${BASE_URL}/api/user/dashboard`, { headers: { authorization: `Bearer ${userToken}` } })
      .then(r => r.json())
      .then(d => setNotifCount((d.complaints?.length || 0) + (d.applications?.length || 0)))
      .catch(() => {})
  }, [user, userToken])


  const t = translatedContents.navbar

  const navs = [
    {name: t.home[language], to: '/'},
    {name: t.departments[language], to: '/departments' },
    {name: t.about_us[language], to: '/about_us'},
    {name: t.contacts[language], to: '/contacts'},
    {name: t.complaints[language], to: '/compliants'},
    {name: t.events[language], to: '/events'},
    {name: t.news[language], to: '/news'},
    {name: t.vacancy[language], to: '/vaccancy'},
  ]

  const [menu, setMenu] = useState(false)


  return (
    <>
    <div className='relative z-50 w-full bg-white/95 border-b border-slate-200 backdrop-blur-md flex justify-between items-center px-4 py-4 md:px-8 lg:px-12 sticky top-0 shadow-md shadow-slate-200/50' >
          <Link to="/" className="flex items-center gap-3 group">
            <LidetaLogo className="w-28 md:w-36 text-amber-500 hover:scale-105 transition-transform" />
          </Link>
          
          <div className='hidden font-jost font-medium text-xs gap-1 lg:flex lg:justify-between lg:text-sm lg:gap-4 xl:text-base xl:gap-6 2xl:gap-8' >
            {
              navs.map((nav, index) => {
                const isActive = nav.to === pathname;
                return (
                  <Link 
                    to={nav.to} 
                    className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-300 relative group/item ${
                      isActive 
                        ? 'text-amber-600 bg-amber-50 font-semibold shadow-inner border border-amber-500/20' 
                        : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
                    }`} 
                    key={index} 
                  >
                    {nav.name}
                    {!isActive && (
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover/item:w-1/2 group-hover/item:left-1/4"></span>
                    )}
                  </Link>
                );
              })
            }
          </div>
        {
        menu && (
          <div className='absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl px-6 py-6 flex flex-col font-jost font-medium text-lg gap-3 lg:hidden animate-fade-in-up' >
            {
              navs.map((nav, index) => {
                const isActive = nav.to === pathname;
                return (
                  <Link 
                    to={nav.to} 
                    className={`cursor-pointer flex justify-center py-2.5 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'text-amber-600 bg-amber-50 border border-amber-500/20 font-bold' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`} 
                    key={index} 
                    onClick={() => setMenu(false)}  
                  >
                    {nav.name}
                  </Link>
                );
              })
            }
          </div>
          )
        }

      <div className='w-fit h-full flex justify-center items-center gap-3' >
        
        <BarsIcon className={`w-6 h-6 cursor-pointer lg:hidden text-slate-700 ${menu? '-rotate-90' : 'rotate-0'} transition-all duration-300`} onClick={() => setMenu(!menu)} />

        {/* User account button */}
        {user ? (
          <Link to='/account'
            className='hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0'>
            <span className='w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center text-[10px] font-black shadow-inner border border-amber-500/10'>
              {user.first_name?.charAt(0).toUpperCase()}
            </span>
            {user.first_name}
          </Link>
        ) : (
          <Link to='/account/auth'
            className='hidden sm:block px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0'>
            Sign In
          </Link>
        )}
        

        {/* Bell notification icon — only when logged in */}
        {user && (
          <button onClick={() => setNotifOpen(true)}
            className='relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-300 cursor-pointer group shadow-sm'
            aria-label='Notifications'>
            <BellIcon className='w-4.5 h-4.5 text-slate-700 group-hover:scale-110 transition-transform' />
            {notifCount > 0 && (
              <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none animate-pulse shadow'>
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            )}
          </button>
        )}

        <div className='relative'>
          <div 
            className='w-32 h-9 px-2 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-roboto font-normal cursor-pointer hover:bg-slate-100 transition-all duration-300 shadow-sm' 
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <div className="flex items-center gap-2">
              <img src={language === 'en' ? UkFlag : language === 'am' ? AmFlag : OrFlag} alt="" className="w-5 h-3.5 object-cover rounded shadow-inner" />
              <p className="capitalize text-xs font-medium tracking-wide">{language === 'en' ? 'English' : language === 'am' ? 'Amharic' : 'Oromiffa'}</p>
            </div>
            <img src={ArrowSvg} alt="" className={`w-2.5 h-2.5 opacity-80 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </div>

          {isLangOpen && (
             <div className='absolute top-11 right-0 w-36 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 flex flex-col animate-fade-in-up'>
               <div 
                 className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600 cursor-pointer transition-colors'
                 onClick={() => { changeLanguage('en'); setIsLangOpen(false); }}
               >
                 <img src={UkFlag} alt="English" className="w-5 h-3.5 object-cover rounded shadow" />
                 <span className="text-xs font-medium">English</span>
               </div>
               <div 
                 className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600 cursor-pointer transition-colors'
                 onClick={() => { changeLanguage('am'); setIsLangOpen(false); }}
               >
                 <img src={AmFlag} alt="Amharic" className="w-5 h-3.5 object-cover rounded shadow" />
                 <span className="text-xs font-medium">Amharic</span>
               </div>
               <div 
                 className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600 cursor-pointer transition-colors'
                 onClick={() => { changeLanguage('or'); setIsLangOpen(false); }}
               >
                 <img src={OrFlag} alt="Oromiffa" className="w-5 h-3.5 object-cover rounded shadow" />
                 <span className="text-xs font-medium">Oromiffa</span>
               </div>
             </div>
          )}
        </div>

      </div>
    </div>

    <NotificationsPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  )
}

export default Navbar