import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../utils/LanguageContext'
import translatedContents from '../../data/translated_contents.json'

// Icons
import FacebookIcon from '../../assets/icons/facebook_icon.svg?react'
import TelegramIcon from '../../assets/icons/telegram_icon.svg?react'
import TwitterIcon from '../../assets/icons/twitter_icon.svg?react'
import YoutubeIcon from '../../assets/icons/youtube_icon.svg?react'
import PhoneIcon from '../../assets/icons/phone_icon.svg?react'
import MapPinIcon from '../../assets/icons/location_icon.svg?react'
import MailIcon from '../../assets/icons/mail_icon.svg?react'


function Footer() {
  const { language } = useLanguage()
  const t = translatedContents.footer
  const navT = translatedContents.navbar

  return (
    <footer className='w-full bg-[#03150c] text-white pt-16 pb-8 px-4 md:px-6 lg:px-12 mt-auto border-t border-amber-500/20'>
      <div className='max-w-7xl mx-auto flex flex-col gap-6'>
        
        {/* Top Section: Grid Layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          
          {/* Column 1: Logo & About */}
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-3'>
              <h2 className='font-goldman font-bold text-2xl uppercase tracking-wider text-amber-400'>{navT.brand_name[language]}</h2>
            </div>
            <p className='font-roboto text-emerald-200/60 text-sm leading-relaxed'>
               {translatedContents.about_page.subtitle[language]}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className='flex flex-col gap-6'>
            <h3 className='font-goldman font-bold text-lg text-amber-400 border-b border-amber-500/10 pb-2'>{t.sections.quick_links.title[language]}</h3>
            <ul className='flex flex-col gap-3 font-roboto text-emerald-100/80 text-sm'>
              <li><Link to="/" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.home[language]}</Link></li>
              <li><Link to="/about_us" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.about_us[language]}</Link></li>
              <li><Link to="/departments" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.departments[language]}</Link></li>
              <li><Link to="/news" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.news[language]}</Link></li>
              <li><Link to="/vaccancy" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.vacancy[language]}</Link></li>
            </ul>
          </div>

           {/* Column 3: Services (using nav items as proxy for now) */}
           <div className='flex flex-col gap-6'>
            <h3 className='font-goldman font-bold text-lg text-amber-400 border-b border-amber-500/10 pb-2'>{t.sections.services.title[language]}</h3>
            <ul className='flex flex-col gap-3 font-roboto text-emerald-100/80 text-sm'>
              <li><Link to="/compliants" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.complaints[language]}</Link></li>
              <li><Link to="/events" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.events[language]}</Link></li>
              <li><Link to="/contacts" className='hover:text-amber-400 hover:translate-x-1 inline-block transition-all duration-200'>{navT.contacts[language]}</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className='flex flex-col gap-6'>
            <h3 className='font-goldman font-bold text-lg text-amber-400 border-b border-amber-500/10 pb-2'>{t.sections.contact.title[language]}</h3>
            <ul className='flex flex-col gap-4 font-roboto text-emerald-100/80 text-sm'>
              <li className='flex items-start gap-3'>
                <MapPinIcon className='w-5 h-5 text-amber-400 mt-0.5 shrink-0' />
                <span className='leading-relaxed'>{t.sections.contact.address[language]}</span>
              </li>
              <li className='flex items-center gap-3'>
                <PhoneIcon className='w-5 h-5 text-amber-400 shrink-0' />
                <span>{t.sections.contact.phone[language]}</span>
              </li>
              <li className='flex items-center gap-3'>
                <MailIcon className='w-5 h-5 text-amber-400 shrink-0' />
                <span className='break-all'>{t.sections.contact.email[language]}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className='w-full h-px bg-emerald-950/50 border-b border-amber-500/10'></div>

        {/* Bottom Section: Copyright & Socials */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <p className='font-roboto text-emerald-200/40 text-xs text-center md:text-left'>
            {t.copyright[language]}
          </p>

          <div className='flex gap-4'>
            {/* Social Icons - Hover effects */}
            <a href="#" className='w-10 h-10 bg-emerald-900/30 border border-amber-500/10 rounded-xl flex justify-center items-center group hover:bg-amber-400 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1'>
              <FacebookIcon className='w-5 h-5 text-emerald-100 group-hover:text-emerald-950 transition-colors' />
            </a>
            <a href="#" className='w-10 h-10 bg-emerald-900/30 border border-amber-500/10 rounded-xl flex justify-center items-center group hover:bg-amber-400 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1'>
              <TelegramIcon className='w-5 h-5 text-emerald-100 group-hover:text-emerald-950 transition-colors' />
            </a>
            <a href="#" className='w-10 h-10 bg-emerald-900/30 border border-amber-500/10 rounded-xl flex justify-center items-center group hover:bg-amber-400 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1'>
              <TwitterIcon className='w-5 h-5 text-emerald-100 group-hover:text-[#1E1E1E] transition-colors' />
            </a>
            <a href="#" className='w-10 h-10 bg-emerald-900/30 border border-amber-500/10 rounded-xl flex justify-center items-center group hover:bg-amber-400 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1'>
              <YoutubeIcon className='w-5 h-5 text-emerald-100 group-hover:text-emerald-950 transition-colors' />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer