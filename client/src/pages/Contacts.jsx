import BASE_URL from '../utils/api'
import { useState } from 'react'
import Upload from '../components/ui/Upload'
import LoadingButton from '../components/ui/LoadingButton'
import { useLanguage } from '../components/utils/LanguageContext'
import translatedContents from '../data/translated_contents.json'
import Notification from '../components/ui/Notification'

function Contacts() {
  const { language } = useLanguage()
  const t = translatedContents.contact_page
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    photo: null
  })
  
  const [notification, setNotification] = useState({
      isOpen: false,
      message: '',
      type: 'success'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
        // Format photo as JSON array if present
        let photoData = []
        if (formData.photo) {
            if (Array.isArray(formData.photo)) {
                photoData = formData.photo
            } else if (typeof formData.photo === 'object' && formData.photo.name) {
                photoData = [formData.photo]
            }
        }

        const submitData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            description: formData.message,
            photos: photoData
        }

        const response = await fetch(`${BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitData)
        })

        if (!response.ok) {
            throw new Error('Failed to submit message')
        }

        setNotification({
            isOpen: true,
            message: 'Message sent successfully!',
            type: 'success'
        })
        
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: '',
            photo: null
        })

    } catch (error) {
        console.error('Error submitting form:', error)
        setNotification({
            isOpen: true,
            message: 'Failed to send message. Please try again.',
            type: 'error'
        })
    } finally {
        setIsSubmitting(false)
    }
  }
// grid grid-cols-[1fr_1.2fr]
  return (
    <div className='w-full bg-transparent max-w-7xl mx-auto mb-20 px-4 animate-fade-in'>
      <div className='w-full'>
        <div className='flex flex-col justify-center gap-8 lg:flex-row lg:justify-around lg:gap-12'>

          <div className='max-w-md flex flex-col mx-auto mt-12 text-center lg:text-start xl:max-w-lg px-4'>

            <h1 className='font-goldman font-bold text-4xl lg:text-5xl mb-6 text-emerald-950 border-b-[6px] border-amber-500 pb-3 w-fit mx-auto lg:mx-0'>{t.title[language]}</h1>
            
            <p className='w-full font-roboto text-lg text-gray-600 mb-8 leading-relaxed'>
              {t.description[language]}
            </p>
            
            <div className='bg-gradient-to-br from-[#f8faf9] to-[#edf3ef] rounded-2xl p-6 border border-emerald-900/10 shadow-md text-left'>
              <p className='font-goldman font-bold text-base mb-4 text-emerald-950 uppercase tracking-wider'>{t.contact_methods.direct_contact.title[language]}</p>

              <div className='space-y-4 font-roboto text-sm'>

                <div className='border-l-4 border-amber-500 pl-3'>
                  <p className='text-gray-500 uppercase tracking-wider text-xs'>{t.contact_methods.direct_contact.email.label[language]}</p>
                  <p className='font-bold text-emerald-950 text-base'>{t.contact_methods.direct_contact.email.value[language]}</p>
                </div>

                <div className='border-l-4 border-amber-500 pl-3'>
                  <p className='text-gray-500 uppercase tracking-wider text-xs'>{t.contact_methods.direct_contact.phone.label[language]}</p>
                  <p className='font-bold text-emerald-950 text-base'>{t.contact_methods.direct_contact.phone.value[language]}</p>
                </div>

                <div className='pt-2 border-t border-emerald-900/5 text-gray-550 text-xs italic font-medium'>
                  {t.contact_methods.direct_contact.hours[language]}
                </div>

              </div>
            </div>

          </div>

          {/* Right Form Section */}
          <div className='bg-gradient-to-b from-white to-[#edf3ef] w-full max-w-lg rounded-2xl shadow-xl p-6 md:p-8 mx-auto border border-emerald-900/10 mt-10 mb-10 lg:min-w-xl'>
            <h2 className='font-goldman font-bold text-2xl lg:text-3xl mb-6 text-emerald-950'>{t.contact_form.title[language]}</h2>
            
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* First Name and Last Name - Two Columns on md+ */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block font-roboto font-medium text-xs uppercase tracking-wider mb-1 text-gray-650'>{t.contact_form.fields.first_name.label[language]} <span className='text-red-500'>*</span></label>
                  <input 
                    type='text' 
                    name='firstName' 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder={t.contact_form.fields.first_name.placeholder[language]} 
                    className='w-full px-4 py-2 border border-emerald-900/10 rounded-xl font-roboto text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/20 bg-white/50' 
                    required 
                  />
                </div>

                <div>
                  <label className='block font-roboto font-medium text-xs uppercase tracking-wider mb-1 text-gray-650'>{t.contact_form.fields.last_name.label[language]} <span className='text-red-500'>*</span></label>
                  <input 
                    type='text' 
                    name='lastName' 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder={t.contact_form.fields.last_name.placeholder[language]}
                    className='w-full px-4 py-2 border border-emerald-900/10 rounded-xl font-roboto text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/20 bg-white/50' 
                    required 
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className='block font-roboto font-medium text-xs uppercase tracking-wider mb-1 text-gray-650'>{t.contact_form.fields.email.label[language]} <span className='text-red-500'>*</span></label>
                <input 
                  type='email' 
                  name='email' 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder={t.contact_form.fields.email.placeholder[language]}
                  className='w-full px-4 py-2 border border-emerald-900/10 rounded-xl font-roboto text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/20 bg-white/50' 
                  required 
                />
              </div>

              {/* Message Text Area */}
              <div>
                <label className='block font-roboto font-medium text-xs uppercase tracking-wider mb-1 text-gray-650'>
                  {t.contact_form.fields.message.label[language]} <span className='text-red-500'>*</span>
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.contact_form.fields.message.placeholder[language]}
                  rows={6}
                  className='w-full px-4 py-3 border border-emerald-900/10 rounded-xl font-roboto text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/20 bg-white/50 resize-none'
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className='block font-roboto font-medium text-xs uppercase tracking-wider mb-1 text-gray-650'>
                  {t.contact_form.fields.photo_upload.label[language]}
                </label>
                <div className='min-h-[150px]'>
                  <Upload photo={formData.photo} setFormData={setFormData} />
                </div>
              </div>

              {/* Submit Button */}
              <LoadingButton
                type='submit'
                isLoading={isSubmitting}
                className='w-full bg-emerald-900 hover:bg-amber-500 text-white hover:text-emerald-950 font-goldman font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer text-base uppercase tracking-wider'
              >
                {t.contact_form.submit_button[language]}
              </LoadingButton>
            </form>
          </div>

        </div>

        {/* Google Maps Section */}
        <div className='w-full mt-12 mb-10'>
          <div className='bg-gradient-to-br from-white to-[#edf3ef] rounded-2xl shadow-xl border border-emerald-900/10 p-6 md:p-8'>
            <h2 className='font-goldman font-bold text-2xl md:text-3xl mb-6 text-emerald-950'>{t.location.title[language]}</h2>
            <div className='w-full h-96 rounded-xl overflow-hidden border border-emerald-900/10 shadow-inner'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.1234567890123!2d38.7636!3d9.0054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnMTkuNCJOIDM4wrA0NSc0OS4wIkU!5e0!3m2!1sen!2set!4v1234567890123!5m2!1sen!2set'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Lideta Sub-City Location'
                className='w-full h-full'
              ></iframe>
            </div>
            <div className='mt-6 font-roboto text-sm border-l-4 border-amber-500 pl-4 py-1'>
              <p className='font-goldman font-bold text-emerald-950 mb-1 text-sm uppercase tracking-wider'>{t.location.address_label[language]}:</p>
              <p className='text-gray-650 text-base leading-relaxed'>{t.location.address_value[language]}</p>
            </div>
          </div>
        </div>
      </div>
      <Notification
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        message={notification.message}
        type={notification.type}
      />
    </div>
  )
}

export default Contacts
