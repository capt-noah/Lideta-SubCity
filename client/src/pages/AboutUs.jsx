import React from 'react'
import { useLanguage } from '../components/utils/LanguageContext'
import translatedContents from '../data/translated_contents.json'
import { Link } from 'react-router-dom'
import ArrowRight from '../assets/icons/arrow_right.svg?react'
import SheildIcon from '../assets/icons/sheild_icon.svg?react'
import BoltIcon from '../assets/icons/bolt_icon.svg?react'
import GlobeIcon from '../assets/icons/globe_icon1.svg?react' // Using existing icons for Mission/Vision/Values for now
import CompliantIcon from '../assets/icons/compliant_icon.svg?react'
import LidetaImage from '../assets/city.jpeg'
import BuildingBackground from '../assets/building_background.jpeg'
import CeoImage from '../assets/ceo_final.png'
import AboutUsHero from '../assets/building_background.jpeg'

function AboutUs() {
  const { language } = useLanguage()
  const t = translatedContents.about_page

  return (
    <div className='w-full bg-white min-h-screen'>
      <div className='w-full flex flex-col gap-16'>
      
      {/* Hero Section */}
      <div className='relative w-full h-[40vh] md:h-[50vh] overflow-hidden flex justify-center items-center'>
        
        {/* Background Image */}
        <div className='absolute inset-0 z-0'>
            <img src={AboutUsHero} alt="Lideta Subcity Night View" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#03150c]/20"></div>
        </div>

        <div className='relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col gap-4'>
            <h1 className='text-white font-goldman font-bold text-3xl md:text-5xl lg:text-6xl drop-shadow-lg tracking-wider uppercase'>
                {t.title[language]}
            </h1>
            <p className='text-white font-roboto text-base md:text-xl lg:text-2xl font-light max-w-2xl mx-auto drop-shadow-sm'>
              {t.subtitle[language]}
            </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className='w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col gap-16 pb-16'>

        {/* Introduction */}
        <div className='max-w-4xl mx-auto text-center relative py-10 px-8 bg-emerald-50 rounded-2xl border border-emerald-900/10 shadow-md overflow-hidden'>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-emerald-600 rounded-full"></div>
            <p className='font-roboto text-emerald-950 font-medium leading-relaxed text-lg lg:text-xl italic'>
                 "{t.intro[language]}"
            </p>
        </div>

        {/* CEO Message Section */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div className='order-1 w-full h-[400px] md:h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl relative group border border-emerald-900/10'>
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-black/30 to-transparent z-10 transition-opacity duration-300 opacity-90 group-hover:opacity-75"></div>
                 <img 
                    src={CeoImage} 
                    alt="CEO" 
                    className='w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105' 
                 />
                 <div className="absolute bottom-6 left-6 z-20 text-white">
                    <p className="font-goldman font-bold text-xl md:text-2xl drop-shadow-md text-emerald-400">{t.ceo_section.name[language]}</p>
                    <div className="h-1 w-16 bg-emerald-600 my-2 rounded-full"></div>
                    <p className="font-roboto text-sm md:text-base font-light text-emerald-100/90">{t.ceo_section.title[language]}</p>
                  </div>
            </div>
            <div className='order-2 flex flex-col gap-6 justify-center'>
                <h2 className='font-goldman font-bold text-3xl md:text-4xl text-emerald-950 relative inline-block pb-3'>
                    Leadership
                    <span className='absolute bottom-0 left-0 w-16 h-1.5 bg-emerald-600 rounded-full'></span>
                </h2>
                <div className="flex flex-col gap-4">
                    <p className='font-roboto text-gray-700 leading-relaxed text-lg text-justify font-light'>
                        "Our administration is dedicated to serving the community with transparency, efficiency, and unwavering commitment. We believe in building a future where every resident of Lideta Sub-City thrives."
                    </p>
                    <p className='font-roboto text-gray-700 leading-relaxed text-lg text-justify font-light'>
                        Under the guidance of our leadership, we continue to implement innovative solutions to urban challenges, ensuring sustainable development and improved quality of life for all.
                    </p>
                </div>
                <div className="pt-4">
                     <Link to="/contacts" className="text-emerald-600 hover:text-emerald-700 font-bold font-goldman transition-colors flex items-center gap-2 text-lg">
                        Contact Office <ArrowRight className="w-5 h-5 text-emerald-600" />
                     </Link>
                </div>
            </div>
        </div>

        {/* History Section */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div className='order-2 md:order-1 flex flex-col gap-6'>
                <h2 className='font-goldman font-bold text-3xl md:text-4xl text-emerald-950 relative inline-block pb-3'>
                    {t.sections.history.title[language]}
                    <span className='absolute bottom-0 left-0 w-24 h-1.5 bg-emerald-600 rounded-full'></span>
                </h2>
                <p className='font-roboto text-gray-700 leading-relaxed text-lg text-justify font-light'>
                    {t.sections.history.content[language]}
                </p>
            </div>
            <div className='order-1 md:order-2 w-full h-64 md:h-[420px] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl border border-emerald-900/10'>
                 <img src={LidetaImage} className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' />
            </div>
        </div>

        {/* Mission, Vision & Values Cards */}
        <div className='w-full bg-white rounded-3xl p-8 md:p-12 border border-emerald-900/5 shadow-inner'>
            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                
                {/* Mission */}
                <div className='bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-6 border-t-4 border-emerald-600 h-full'>
                    <div className='w-16 h-16 bg-emerald-50 rounded-full flex justify-center items-center border border-emerald-900/5 shadow-inner'>
                        <BoltIcon className='text-emerald-600 w-8 h-8' /> 
                    </div>
                    <h3 className='font-goldman font-bold text-2xl text-emerald-950'>{t.sections.mission.title[language]}</h3>
                    <p className='font-roboto text-gray-650 leading-relaxed font-light'>
                        {t.sections.mission.content[language]}
                    </p>
                </div>

                {/* Vision */}
                <div className='bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-6 border-t-4 border-emerald-900 h-full'>
                    <div className='w-16 h-16 bg-emerald-50 rounded-full flex justify-center items-center border border-emerald-900/5 shadow-inner'>
                        <GlobeIcon className='text-emerald-900 w-8 h-8' />
                    </div>
                    <h3 className='font-goldman font-bold text-2xl text-emerald-950'>{t.sections.vision.title[language]}</h3>
                    <p className='font-roboto text-gray-650 leading-relaxed font-light'>
                        {t.sections.vision.content[language]}
                    </p>
                </div>

                {/* Values */}
                <div className='bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-6 border-t-4 border-emerald-600 h-full'>
                    <div className='w-16 h-16 bg-emerald-50 rounded-full flex justify-center items-center border border-emerald-900/5 shadow-inner'>
                        <SheildIcon className='text-emerald-600 w-8 h-8' />
                    </div>
                    <h3 className='font-goldman font-bold text-2xl text-emerald-950'>{t.sections.values.title[language]}</h3>
                    <div className='flex flex-wrap justify-center gap-2'>
                        {Object.entries(t.sections.values.items).map(([key, value]) => (
                            <span key={key} className='px-3.5 py-1.5 bg-emerald-50/80 text-emerald-850 font-semibold text-xs tracking-wider rounded-xl border border-emerald-900/10 shadow-sm'>
                                {value[language]}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Discover Lideta Video Section */}
        <div className="w-full bg-gradient-to-br from-[#042013] via-[#063821] to-[#02150c] border border-emerald-500/20 rounded-3xl flex flex-col items-center gap-8 py-16 px-4 md:px-8 lg:px-12 relative overflow-hidden shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
            {/* Section Header */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                <span>{language === 'am' ? 'ቪዲዮ' : language === 'or' ? 'Viidiyoo' : 'Video'}</span>
              </div>
              <h2 className="font-goldman font-bold text-3xl md:text-4xl lg:text-5xl text-emerald-400">
                {language === 'am' ? 'ልደታ ክ/ከተማን ያውቁ' : language === 'or' ? 'Magaalaa Lidetaa Beekaa' : 'Discover Lideta Sub-City'}
              </h2>
              <p className="text-emerald-100/80 text-base md:text-lg max-w-2xl font-light leading-relaxed">
                {language === 'am' 
                  ? 'የልደታ ክ/ከተማን ታሪክ፣ እሴቶች እና የማህበረሰብ አገልግሎት ቁርጠኝነት ይመልከቱ' 
                  : language === 'or' 
                  ? 'Seenaa, gatii fi kutannoo tajaajila hawaasaa Magaalaa Lidetaa ilaalaa'
                  : 'Watch our story, values, and commitment to community service'}
              </p>
            </div>

            {/* Video Container */}
            <div className="w-full max-w-4xl group">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300">
                {/* YouTube Embed */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/XtaFwC_RGzY?si=v_YhuhRN1kDgAkRc"
                  title="Lideta Sub-City Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                
                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-emerald-500 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-emerald-500 opacity-50 pointer-events-none"></div>
              </div>

              {/* Open in YouTube Button */}
              <div className="mt-6 flex justify-center">
                <a
                  href="https://youtu.be/XtaFwC_RGzY?si=v_YhuhRN1kDgAkRc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-goldman font-medium shadow-lg hover:shadow-xl hover:shadow-emerald-600/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>{language === 'am' ? 'በ YouTube ላይ ይመልከቱ' : language === 'or' ? 'YouTube irratti ilaalaa' : 'Watch on YouTube'}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  ) 
}

export default AboutUs