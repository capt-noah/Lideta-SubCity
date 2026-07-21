import BASE_URL from '../utils/api'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../components/utils/LanguageContext'
import { useUser } from '../components/utils/UserContext'
import translatedContents from '../data/translated_contents.json'
import ArrowRight from '../assets/icons/arrow_right.svg?react'
import MailIcon from '../assets/icons/mail_icon.svg?react'
import ClockIcon from '../assets/icons/clock_icon.svg?react'
import LocationIcon from '../assets/icons/location_icon.svg?react'
import CalenderIcon from '../assets/icons/calender_icon.svg?react'
import AttachIcon from '../assets/icons/attach_icon.svg?react'
import TrashIcon from '../assets/icons/trash_icon2.svg?react'
import UploadIcon from '../assets/icons/upload_icon.svg?react'
import Notification from '../components/ui/Notification'
import LoadingButton from '../components/ui/LoadingButton'
import Loading from '../components/ui/Loading'

function VacancyDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useUser()
  const [selectedFile, setSelectedFile] = useState(null)
  const [vacancy, setVacancy] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [fullName, setFullName] = useState(() => `${user?.first_name || ''} ${user?.last_name || ''}`.trim())
  const [email, setEmail] = useState(() => user?.email || '')
  const [phone, setPhone] = useState(() => user?.phone || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedRef, setSubmittedRef] = useState(null)
  const [cvSizeError, setCvSizeError] = useState(false)
  const { language } = useLanguage()
  const t = translatedContents.jobs_page.details

  const [notification, setNotification] = useState({isOpen: false, message: '', type: 'success'})

  const [prevUser, setPrevUser] = useState(user)
  if (user !== prevUser) {
    setPrevUser(user)
    setFullName(`${user?.first_name || ''} ${user?.last_name || ''}`.trim())
    setEmail(user?.email || '')
    setPhone(user?.phone || '')
  }

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const response = await fetch(`${BASE_URL}/api/vacancies`)
        if (response.ok) {
          const data = await response.json()
          setVacancy(data?.find(item => item.id.toString() === id))
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching vacancies:', error)
      }
    }
    fetchVacancies()
  }, [id])


  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setNotification({ isOpen: true, message: 'Only PDF files are accepted', type: 'error' })
      e.target.value = ''
      return
    }
    const MAX_SIZE = 30 * 1024 * 1024 // 30 MB
    if (file.size > MAX_SIZE) {
      setCvSizeError(true)
      setSelectedFile(file)
      return
    }
    setCvSizeError(false)
    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setCvSizeError(false)
  }

  const handleApply = async (e) => {
    e.preventDefault()

    // Auth gate
    if (!user) {
      window.location.href = `/account/auth?next=/vaccancy/${id}`
      return
    }

    if (cvSizeError) {
      setNotification({ isOpen: true, message: 'Please attach a CV under 30 MB', type: 'error' })
      return
    }

    if (!selectedFile) {
      setNotification({ isOpen: true, message: 'Please Attach A CV', type:'error'})
      return
    }

    setIsSubmitting(true)

    try {
      let cvPath = null
      
      // Step 1: Upload CV if selected
      if (selectedFile) {
        const fileFormData = new FormData()
        fileFormData.append('cv', selectedFile)
        
        const uploadResponse = await fetch(`${BASE_URL}/api/upload-cv`, {
           method: 'POST',
           body: fileFormData
        })
        
        if (!uploadResponse.ok) {
           throw new Error('Failed to upload CV')
        }
        
        const uploadData = await uploadResponse.json()
        cvPath = uploadData.path
      }

      // Step 2: Submit Application
      const response = await fetch(`${BASE_URL}/api/applicants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vacancy_id: vacancy?.id || id,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          cv_path: cvPath,
          user_id: user?.id || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit application')
      }

      const resData = await response.json()
      setSubmittedRef(resData.ref)
      setShowSuccessModal(true)
      // Reset only if not pre-filled from user account
      if (!user) {
        setFullName('')
        setEmail('')
        setPhone('')
      }
      setSelectedFile(null)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert(error.message || 'An error occurred while submitting your application')
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full px-4 max-w-7xl mx-auto bg-transparent mb-24 animate-fade-in'>

      {isLoading || !vacancy ? (
        <div className='w-full flex justify-center items-center h-screen'>
          <Loading />
        </div>
      ) : (
        <div className='w-full py-6 font-roboto'>
          {/* Back Button */}
          <button
            onClick={() => navigate('/vaccancy')}
            className='bg-emerald-900 flex items-center gap-2 mb-8 font-goldman font-bold text-sm text-white py-2.5 px-5 rounded-xl hover:bg-amber-500 hover:text-emerald-950 active:scale-95 transition-all cursor-pointer shadow-md'
          >
            <ArrowRight className='w-4 h-4 rotate-180' />
            <span>{t.back_to_jobs[language]}</span>
          </button>

          <div className='w-full flex flex-col gap-12 items-start lg:flex-row lg:gap-8'>
            {/* Main Content Area */}
            <div className='w-full flex flex-col md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'>
              {/* Job Title */}
              <h1 className='font-goldman font-bold text-3xl md:text-4xl lg:text-5xl mb-2 text-emerald-950 leading-tight'>
                {(() => {
                    if (language === 'am' && vacancy.amh?.title) return vacancy.amh.title
                    if (language === 'or' && vacancy.orm?.title) return vacancy.orm.title
                    return vacancy.title
                })()}
              </h1>

              {/* Category */}
              <p className='text-lg text-emerald-900 font-medium mb-4 uppercase tracking-wider font-goldman'>
                {(() => {
                    if (language === 'am' && vacancy.amh?.category) return vacancy.amh.category
                    if (language === 'or' && vacancy.orm?.category) return vacancy.orm.category
                    return vacancy.category
                })()}
              </p>

              {/* Metadata */}
              <div className='flex items-center gap-3 mb-8 text-xs font-mono text-emerald-800/80 uppercase tracking-wider flex-wrap bg-emerald-50 border border-emerald-900/10 px-3.5 py-1.5 rounded-lg w-fit'>
                <span>{vacancy.formatted_date}</span>
                <span>•</span>
                <span>{vacancy.location}</span>
              </div>

              {/* Job Description */}
              <div className='mb-10 bg-white/60 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.job_description[language]}</h2>
                <p className='text-base leading-relaxed text-gray-700 font-light px-1'>
                  {(() => {
                      if (language === 'am' && vacancy.amh?.description) return vacancy.amh.description
                      if (language === 'or' && vacancy.orm?.description) return vacancy.orm.description
                      return vacancy.description
                  })()}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className='mb-10 bg-white/60 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.key_responsibilities[language]}</h2>
                <ul className='list-disc space-y-3 px-6 text-base text-gray-700 font-light'>
                  {(() => {
                      let items = vacancy.responsibilities
                      if (language === 'am' && vacancy.amh) {
                          items = vacancy.amh.responsibility || vacancy.amh.responsibilities || items
                      } else if (language === 'or' && vacancy.orm) {
                          items = vacancy.orm.responsibility || vacancy.orm.responsibilities || items
                      }
                      
                      if (!items || !Array.isArray(items)) return null;

                      return items.map((responsibility, index) => (
                        <li key={index} className='marker:text-amber-500'>{responsibility}</li>
                      ))
                  })()}
                </ul>
              </div>

              {/* Required Qualification */}
              <div className='mb-10 bg-white/60 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.required_qualification[language]}</h2>
                <ul className='list-disc space-y-3 px-6 text-base text-gray-700 font-light'>
                  {(() => {
                      let items = vacancy.qualifications
                       if (language === 'am' && vacancy.amh) {
                          items = vacancy.amh.qualification || vacancy.amh.qualifications || items
                      } else if (language === 'or' && vacancy.orm) {
                          items = vacancy.orm.qualification || vacancy.orm.qualifications || items
                      }

                       if (!items || !Array.isArray(items)) return null;
                       
                      return items.map((qualification, index) => (
                        <li key={index} className='marker:text-amber-500'>{qualification}</li>
                      ))
                  })()}
                </ul>
              </div>

              {/* Skills and Expertise */}
              <div className='mb-10 bg-white/60 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.skills_and_expertise[language]}</h2>
                <div className='flex flex-wrap gap-2.5 px-1'>
                  {(() => {
                      let items = vacancy.skills
                       if (language === 'am' && vacancy.amh) {
                          items = vacancy.amh.skill || vacancy.amh.skills || items
                      } else if (language === 'or' && vacancy.orm) {
                          items = vacancy.orm.skill || vacancy.orm.skills || items
                      }

                      if (!items || !Array.isArray(items)) return null;

                      return items.map((skill, index) => (
                        <span key={index} className='px-4 py-2 bg-emerald-900 text-white rounded-xl text-sm font-goldman font-bold uppercase tracking-wider border border-emerald-900/10 shadow-sm'>
                            {skill}
                        </span>
                      ))
                  })()}
                </div>
              </div>
            </div>

            <hr className='text-emerald-900/10 w-full lg:hidden my-4' />

            {/* Application Sidebar */}
            <div className='flex mx-auto flex-col gap-8 lg:max-w-sm xl:max-w-100 2xl:max-w-150 relative min-w-[320px] md:min-w-[380px]'>
              <div className='relative w-full h-full'>

                {/* Auth overlay — shown when not logged in */}
                {!user && (
                  <div className='absolute inset-0 z-10 rounded-2xl overflow-hidden'>
                    <div className='absolute inset-0 backdrop-blur-sm bg-white/75 rounded-2xl' />
                    <div className='absolute inset-0 flex items-center justify-center p-4'>
                      <div className='bg-gradient-to-b from-white to-[#edf3ef] rounded-2xl shadow-2xl border border-emerald-900/15 p-6 md:p-8 w-full text-center'>
                        <div className='w-14 h-14 bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md'>
                          <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                          </svg>
                        </div>
                        <h3 className='font-goldman font-bold text-xl text-emerald-950 mb-2 uppercase tracking-wide'>
                          {{ en: 'Sign in to apply', am: 'ለማመልከት ይግቡ', or: 'Iyyachuuf seenaa' }[language]}
                        </h3>
                        <p className='font-roboto text-sm text-gray-650 mb-6 font-light leading-relaxed'>
                          {{ en: 'You need an account to apply for this position and track your application status.', am: 'ለዚህ ቦታ ለማመልከት እና ሁኔታዎን ለመከታተል መለያ ያስፈልጋዎታል።', or: 'Bakka kanaaf iyyachuuf fi haala iyyata keessan hordofuuf herrega barbaachisaa dha.' }[language]}
                        </p>
                        <div className='flex flex-col gap-3'>
                          <a href={`/account/auth?next=/vaccancy/${id}`}
                            className='w-full py-3 bg-emerald-900 text-white font-bold font-goldman uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all text-sm shadow-md'>
                            {{ en: 'Sign In', am: 'ግባ', or: 'Seeni' }[language]}
                          </a>
                          <a href={`/account/auth?next=/vaccancy/${id}`}
                            className='w-full py-3 border border-emerald-900/20 text-emerald-950 font-bold font-goldman uppercase tracking-wider rounded-xl hover:bg-emerald-50 transition-all text-sm'>
                            {{ en: 'Create Account', am: 'መለያ ፍጠር', or: 'Herrega Uumi' }[language]}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleApply} method='POST' className='bg-gradient-to-b from-white to-[#edf3ef] border border-emerald-900/10 rounded-2xl p-6 sticky top-6 shadow-xl'>
                  {/* Heading */}
                  <h2 className='font-goldman font-bold text-xl lg:text-2xl mb-1 text-emerald-950'>{t.apply_for_job[language]}</h2>
                  <p className='text-xs font-light text-gray-550 mb-6 leading-relaxed'>{t.attach_cv[language]}</p>

                  {/* Job Details Summary */}
                  <div className='space-y-3.5 mb-6 bg-white/40 rounded-xl p-4 border border-emerald-900/5 shadow-inner'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-emerald-50 flex justify-center items-center rounded-xl border border-emerald-900/10 text-emerald-900'><MailIcon className='w-4.5 h-4.5' /></div>
                      <span className='text-sm text-emerald-950 font-medium truncate'>applyforthisjob@gmail.com</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-emerald-50 flex justify-center items-center rounded-xl border border-emerald-900/10 text-emerald-900'><ClockIcon className='w-4.5 h-4.5' /></div>
                      <span className='text-sm text-emerald-950 font-medium'>{vacancy.type}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-emerald-50 flex justify-center items-center rounded-xl border border-emerald-900/10 text-emerald-900'><LocationIcon className='w-4.5 h-4.5' /></div>
                      <span className='text-sm text-emerald-950 font-medium'>{vacancy.location}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-emerald-50 flex justify-center items-center rounded-xl border border-emerald-900/10 text-emerald-900'><CalenderIcon className='w-4.5 h-4.5' /></div>
                      <span className='text-sm text-emerald-950 font-medium'>{vacancy.formatted_date}</span>
                    </div>
                  </div>

                  {/* Applicant Info */}
                  <div className='mb-6 space-y-4 text-left'>
                    <div>
                      <label className='block text-xs uppercase tracking-wider font-semibold text-gray-650 mb-1.5'>
                        {t.full_name[language]} <span className='text-red-500'>*</span>
                      </label>
                      <input required type='text' value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder={{ en: 'Enter your full name', am: 'ሙሉ ስምዎን ያስገቡ', or: 'Maqaa guutuu kee galchi' }[language]}
                        className='w-full px-4 py-2 border border-emerald-900/15 rounded-xl bg-white/75 focus:outline-none focus:ring-2 focus:ring-emerald-900/20 text-sm' />
                    </div>
                    <div>
                      <label className='block text-xs uppercase tracking-wider font-semibold text-gray-650 mb-1.5'>
                        {t.email[language]} <span className='text-red-500'>*</span>
                      </label>
                      <input required type='email' value={email} onChange={e => setEmail(e.target.value)}
                        placeholder={{ en: 'Enter your email', am: 'ኢሜልዎን ያስገቡ', or: 'Imeelii kee galchi' }[language]}
                        className='w-full px-4 py-2 border border-emerald-900/15 rounded-xl bg-white/75 focus:outline-none focus:ring-2 focus:ring-emerald-900/20 text-sm' />
                    </div>
                    <div>
                      <label className='block text-xs uppercase tracking-wider font-semibold text-gray-650 mb-1.5'>
                        {t.phone_number[language]} <span className='text-red-500'>*</span>
                      </label>
                      <input required type='tel' value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder={{ en: 'Enter your phone number', am: 'ስልክ ቁጥርዎን ያስገቡ', or: 'Lakkoofsa bilbilaa kee galchi' }[language]}
                        className='w-full px-4 py-2 border border-emerald-900/15 rounded-xl bg-white/75 focus:outline-none focus:ring-2 focus:ring-emerald-900/20 text-sm' />
                    </div>
                  </div>

                  {/* CV Upload Section */}
                  <div className='mb-6 text-left'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='font-semibold text-xs uppercase tracking-wider text-gray-650'>{t.attach_cv_label[language]} <span className='text-red-500'>*</span></h3>
                      <span className='text-[10px] font-mono text-emerald-800/80 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-900/10'>PDF only · max 30 MB</span>
                    </div>

                    {/* Size error */}
                    {cvSizeError && (
                      <div className='mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-start gap-2'>
                        <span className='text-red-500 text-sm mt-0.5'>⚠️</span>
                        <div>
                          <p className='text-xs font-semibold text-red-700'>
                            {{ en: 'File too large', am: 'ፋይሉ በጣም ትልቅ ነው', or: 'Faayilli baay\'ee guddaa dha' }[language]}
                          </p>
                          <p className='text-[11px] text-red-500 mt-0.5 leading-relaxed'>
                            {{ en: 'Your CV must be under 30 MB. Please use a smaller file.', am: 'ሲቪዎ ከ30 MB ያነሰ መሆን አለበት። እባክዎ ፋይሉን ያሳንሱ።', or: 'CV keessan 30 MB gadi ta\'uu qaba. Maaloo faayila xiqqaa fayyadamaa.' }[language]}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedFile && !cvSizeError ? (
                      <div className='bg-white rounded-xl p-4 flex items-center justify-between border border-emerald-900/10 shadow-sm'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 bg-emerald-50 border border-emerald-900/10 rounded-lg flex items-center justify-center text-emerald-900'>
                            <AttachIcon className='w-5 h-5' />
                          </div>
                          <div className='overflow-hidden text-left'>
                            <span className='text-sm font-medium text-emerald-950 block truncate max-w-[130px]'>{selectedFile.name}</span>
                            <span className='text-xs text-gray-400 font-mono'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                        <button type='button' onClick={handleRemoveFile} className='cursor-pointer p-1 rounded-full hover:bg-red-50 transition-colors'>
                          <TrashIcon className='w-5 h-5 text-red-400 hover:text-red-600' />
                        </button>
                      </div>
                    ) : (
                      <label className={`bg-white rounded-xl p-1 flex items-center justify-between cursor-pointer border-2 border-dashed transition-all ${cvSizeError ? 'border-red-350 bg-red-50/50' : 'border-emerald-900/15 hover:border-emerald-900/30'}`}>
                        <div className='flex items-center gap-3 p-1.5'>
                          <div className='w-10 h-10 bg-emerald-50 border border-emerald-900/10 rounded-xl flex justify-center items-center text-emerald-900'>
                            <AttachIcon className='w-5 h-5' />
                          </div>
                          <div className='text-left'>
                            <span className='text-sm text-emerald-950 font-medium block'>
                              {{ en: 'Attach CV (.pdf)', am: 'ሲቪ ያያይዙ (.pdf)', or: 'CV qabsiisaa (.pdf)' }[language]}
                            </span>
                            <span className='text-xs text-gray-400 font-light'>PDF only · max 30 MB</span>
                          </div>
                        </div>
                        <input type='file' accept='.pdf' onChange={handleFileChange} className='hidden' />
                      </label>
                    )}
                  </div>

                  {/* Apply Button */}
                  <LoadingButton type='submit' isLoading={isSubmitting}
                    className='w-full bg-emerald-900 hover:bg-amber-500 text-white hover:text-emerald-950 font-goldman font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer text-base uppercase tracking-wider'>
                    {t.apply_for_job[language]}
                  </LoadingButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Notification isOpen={notification.isOpen} message={notification.message} type={notification.type} onClose={() => setNotification({...notification, isOpen: false})} />

      {/* ── Success modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-white to-[#edf3ef] rounded-2xl shadow-2xl w-full max-w-md p-8 text-center font-roboto border border-emerald-900/10">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <svg className="w-8 h-8 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-goldman font-bold text-2xl text-emerald-950 mb-2">
              {{ en: 'Application Submitted!', am: 'ማመልከቻ ቀርቧል!', or: 'Gaaffiin Ergame!' }[language]}
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed font-light">
              {{ en: 'Your application has been received. Save your reference number to track its progress.', am: 'ማመልከቻዎ ደርሷል። ሂደቱን ለመከታተል የማጣቀሻ ቁጥርዎን ያስቀምጡ።', or: 'Gaaffii keessan ni argame. Lakkoofsa wabii kuusuun hordofaa.' }[language]}
            </p>

            <div className="bg-white/70 border-2 border-dashed border-emerald-900/15 rounded-2xl px-6 py-4 mb-6 shadow-inner">
              <p className="text-[10px] font-mono text-emerald-800/80 uppercase tracking-widest mb-1.5 font-bold">
                {{ en: 'Reference Number', am: 'የማጣቀሻ ቁጥር', or: 'Lakkoofsa Wabii' }[language]}
              </p>
              <p className="text-3xl font-goldman font-bold text-emerald-950 tracking-widest">{submittedRef}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { navigator.clipboard.writeText(submittedRef) }}
                className="px-5 py-2.5 border border-emerald-900/10 text-emerald-950 text-sm font-goldman font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-50 transition-all cursor-pointer shadow-sm"
              >
                {{ en: 'Copy', am: 'ቅዳ', or: 'Koppii' }[language]}
              </button>
              {user && (
                <a href="/account"
                  className="px-5 py-2.5 bg-emerald-900 text-white text-sm font-goldman font-bold uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all shadow-sm block text-center"
                >
                  {{ en: 'Track Progress', am: 'ሂደቱን ይከታተሉ', or: 'Deemi Hordofi' }[language]}
                </a>
              )}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-2.5 bg-amber-500 text-emerald-950 text-sm font-goldman font-bold uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-all cursor-pointer shadow-sm"
              >
                {{ en: 'Done', am: 'ተጠናቋል', or: 'Xumurami' }[language]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VacancyDetails





