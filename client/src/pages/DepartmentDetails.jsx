import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import departmentsData from '../data/departments.json';
import translatedContents from '../data/translated_contents.json';
import ArrowRight from '../assets/icons/arrow_right.svg?react';
import MailIcon from '../assets/icons/mail_icon.svg?react';
import ClockIcon from '../assets/icons/clock_icon.svg?react';
import LocationIcon from '../assets/icons/location_icon.svg?react';
import PhoneIcon from '../assets/icons/phone_icon.svg?react';
import WebsiteIcon from '../assets/icons/globe_icon.svg?react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Loading from '../components/ui/Loading';
import { useLanguage } from '../components/utils/LanguageContext';
import { getDepartmentHead } from '../components/utils/departmentAssets';

function DepartmentDetails() {
  const { language } = useLanguage();
  const t = translatedContents.departments.details;
  const navigate = useNavigate();
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        // Find the department by ID from the URL
        const data = departmentsData.departments.find(dept => dept.id === id);
        if (data) {
          setDepartment(data);
        } else {
          console.error('Department not found');
        }
      } catch (error) {
        console.error('Error fetching department:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Department not found</h2>
        <button
          onClick={() => navigate('/departments')}
          className="px-6 py-2 bg-[#3A3A3A] text-white rounded-md hover:bg-[#2A2A2A] transition-colors flex items-center"
        >
          <ArrowRight className="w-5 h-5 mr-2 transform rotate-180" />
          Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div className='w-full px-4 max-w-7xl mx-auto bg-transparent mb-24 animate-fade-in'>
      {!department ? (
        'Loading...'
      ) : (
        <div className='w-full py-6 font-roboto'>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className='bg-emerald-900 flex items-center gap-2 mb-8 font-goldman font-bold text-sm text-white py-2.5 px-5 rounded-xl hover:bg-amber-500 hover:text-emerald-950 active:scale-95 transition-all cursor-pointer shadow-md'
          >
            <ArrowRight className='w-4 h-4 rotate-180' />
            <span>{t.back_button[language]}</span>
          </button>

          <div className='w-full flex flex-col gap-12 items-start lg:flex-row lg:gap-8'>
            {/* Main Content Area */}
            <div className='w-full flex flex-col md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'>
              {/* Department Title */}
              <h1 className='font-goldman font-bold text-3xl md:text-4xl lg:text-5xl mb-2 text-emerald-950 leading-tight'>
                {department?.title?.[language] || 'Department Title'}
              </h1>
              <p className='text-lg text-emerald-900 font-medium mb-6 uppercase font-goldman tracking-wider'>{department?.name?.[language] || ''}</p>
              
              {/* Department Leader */}
              <div className="w-full mb-8">
                <div className="relative w-full h-120 bg-gradient-to-br from-emerald-950/20 to-emerald-900/5 rounded-2xl overflow-hidden flex items-center justify-center border border-emerald-900/10 shadow-lg">
                  {getDepartmentHead(department.id) ? (
                     <img 
                       src={getDepartmentHead(department.id)} 
                       alt={`Head of ${department?.title?.[language] || 'Department'}`} 
                       className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-102"
                     />
                  ) : (
                    <svg className="w-32 h-32 text-emerald-900/20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="mt-6 border-l-4 border-amber-500 pl-4 py-1.5 bg-emerald-50/50 rounded-r-xl border-r border-t border-b border-emerald-900/5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-800/80 mb-1">{t.department_head[language]}</p>
                  <p className="text-lg font-goldman font-bold text-emerald-950">{department?.leader?.[language] || t.not_specified[language]}</p>
                </div>
              </div>

              {/* Mission statement description */}
              <p className='text-lg text-gray-700 mb-8 font-light leading-relaxed italic'>
                "{department?.mission?.[language] || 'No mission statement available.'}"
              </p>

              {/* About Department */}
              <div className='mb-8 bg-white/65 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.sections.about[language]}</h2>
                <p className='text-base leading-relaxed text-gray-700 font-light px-1'>
                  {department.mission?.[language]}
                </p>
              </div>

              {/* Vision */}
              <div className='mb-8 bg-white/65 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.sections.vision[language]}</h2>
                <p className='text-base leading-relaxed text-gray-700 font-light px-1'>
                  {department?.vision?.[language] || t.not_specified[language]}
                </p>
              </div>

              {/* Services */}
              <div className='mb-8 bg-white/65 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.sections.services[language]}</h2>
                <ul className='list-disc space-y-3 px-6 text-base text-gray-700 font-light'>
                  {department?.services?.[language]?.length > 0 ? (
                    department.services[language].map((service, index) => (
                      <li key={index} className='marker:text-amber-500'>{service}</li>
                    ))
                  ) : (
                    <li className='marker:text-amber-500'>{t.sections.no_services[language]}</li>
                  )}
                </ul>
              </div>

              {/* Core Values */}
              <div className='mb-8 bg-white/65 rounded-2xl p-6 border border-emerald-900/10 shadow-sm'>
                <h2 className='font-goldman font-bold text-xl mb-4 text-emerald-950 border-l-4 border-amber-500 pl-3 uppercase tracking-wider'>{t.sections.values[language]}</h2>
                <div className='flex flex-wrap gap-2.5 px-1'>
                  {department?.values?.[language]?.length > 0 ? (
                    department.values[language].map((value, index) => (
                      <span
                        key={index}
                        className='px-4 py-2 bg-emerald-900 text-white font-goldman font-bold text-xs uppercase tracking-wider rounded-xl border border-emerald-900/10 shadow-sm'
                      >
                        {value}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-500 italic'>{t.sections.no_values[language]}</span>
                  )}
                </div>
              </div>
            </div>

            <hr className='text-emerald-900/10 w-full lg:hidden my-4' />

            {/* Contact Information Sidebar */}
            <div className='flex mx-auto flex-col gap-8 lg:max-w-sm xl:max-w-100 2xl:max-w-150 min-w-[320px] md:min-w-[380px]'>
              <div className='bg-gradient-to-b from-white to-[#edf3ef] border border-emerald-900/10 rounded-2xl p-6 md:p-8 sticky top-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-left'>
                {/* Heading */}
                <h2 className='font-goldman font-bold text-xl lg:text-2xl mb-1 text-emerald-950 uppercase tracking-wide'>{t.contact_info.title[language]}</h2>
                <p className='text-xs font-light text-gray-550 mb-8'>
                  {t.contact_info.subtitle[language]}
                </p>

                {/* Department Details */}
                <div className='flex flex-col gap-6'>
                  <div className='flex items-start gap-4 group'>
                    <div className='w-12 h-12 bg-emerald-50 border border-emerald-900/10 group-hover:bg-amber-500/15 flex justify-center items-center rounded-xl transition-colors duration-300 shrink-0 text-emerald-900'>
                      <LocationIcon className='w-6 h-6' />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1'>{t.contact_info.location[language]}</p>
                      <p className='text-base text-emerald-950 font-medium leading-tight'>{department?.contacts?.location || t.not_specified[language]}</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4 group'>
                    <div className='w-12 h-12 bg-emerald-50 border border-emerald-900/10 group-hover:bg-amber-500/15 flex justify-center items-center rounded-xl transition-colors duration-300 shrink-0 text-emerald-900'>
                      <MailIcon className='w-5 h-5' />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1'>{t.contact_info.email[language]}</p>
                      {(department?.contacts?.email) ? (
                        <a 
                          href={`mailto:${department.contacts.email}`}
                          className='text-base text-emerald-900 hover:text-amber-500 font-medium transition-colors break-all'
                        >
                          {department.contacts.email}
                        </a>
                      ) : (
                        <p className='text-base text-emerald-950 font-medium'>{t.not_specified[language]}</p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-start gap-4 group'>
                    <div className='w-12 h-12 bg-emerald-50 border border-emerald-900/10 group-hover:bg-amber-500/15 flex justify-center items-center rounded-xl transition-colors duration-300 shrink-0 text-emerald-900'>
                      <PhoneIcon className='w-6 h-6' />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1'>{t.contact_info.phone[language]}</p>
                      {(department?.contacts?.phone) ? (
                        <a 
                          href={`tel:${department.contacts.phone}`}
                          className='text-base text-emerald-950 hover:text-amber-500 font-medium transition-colors'
                        >
                          {department.contacts.phone}
                        </a>
                      ) : (
                        <p className='text-base text-emerald-950 font-medium'>{t.not_specified[language]}</p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-start gap-4 group'>
                    <div className='w-12 h-12 bg-emerald-50 border border-emerald-900/10 group-hover:bg-amber-500/15 flex justify-center items-center rounded-xl transition-colors duration-300 shrink-0 text-emerald-900'>
                      <ClockIcon className='w-6 h-6' />
                    </div>
                    <div>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1'>
                        {t.contact_info.office_hours[language]}
                      </p>
                      <p className='text-base text-emerald-950 font-medium leading-tight'>
                        {department?.contacts?.office_hours || t.not_specified[language]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Website Button */}
                {(department?.contacts?.website) && (
                  <a 
                    href={department.contacts.website.startsWith('http') ? department.contacts.website : `https://${department.contacts.website}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-8 w-full bg-emerald-900 text-white font-goldman font-bold py-4 rounded-xl hover:bg-amber-500 hover:text-emerald-950 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group text-sm uppercase tracking-wider'
                  >
                    <WebsiteIcon className='w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform' />
                    <span>{t.contact_info.visit_website[language]}</span>
                    <ArrowRight className='w-4 h-4 text-white hover:text-inherit group-hover:translate-x-1 transition-all' />
                  </a>
                )}

                {/* Video Guide Section */}
                {(department?.contacts?.video_guide) && (
                  <div className='mt-8 pt-6 border-t border-emerald-900/10'>
                    <h3 className='font-goldman font-bold text-base mb-4 text-emerald-950 flex items-center gap-2 uppercase tracking-wider'>
                       <span className='w-2 h-6 bg-amber-500 rounded-full'></span>
                       {t.video_guide.title[language]}
                    </h3>
                    <div className='w-full aspect-video rounded-xl overflow-hidden shadow-md border border-emerald-900/10 group relative'>
                       <iframe
                        className='w-full h-full'
                        src={department.contacts.video_guide}
                        title="Website Guide"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                       ></iframe>
                    </div>
                    <p className='mt-3 text-xs text-center text-gray-500 font-light italic'>
                      {t.video_guide.watch_guide[language]}
                    </p>
                  </div>
                )}

                {/* Social Media Links */}
                <div className='mt-8 pt-6 border-t border-emerald-900/10'>
                  <h3 className='font-goldman font-bold text-sm mb-4 text-emerald-950 uppercase tracking-wider'>{t.social_media.title[language]}</h3>
                  <div className='flex gap-3'>
                    <a 
                      href='#' 
                      className='w-10 h-10 bg-emerald-900 text-white hover:bg-amber-500 hover:text-emerald-950 rounded-xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all duration-300'
                      aria-label='Facebook'
                    >
                      <Facebook className='w-5 h-5' />
                    </a>
                    <a 
                      href='#' 
                      className='w-10 h-10 bg-emerald-900 text-white hover:bg-amber-500 hover:text-emerald-950 rounded-xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all duration-300'
                      aria-label='Twitter'
                    >
                      <Twitter className='w-5 h-5' />
                    </a>
                    <a 
                      href='#' 
                      className='w-10 h-10 bg-emerald-900 text-white hover:bg-amber-500 hover:text-emerald-950 rounded-xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all duration-300'
                      aria-label='Instagram'
                    >
                      <Instagram className='w-5 h-5' />
                    </a>
                    <a 
                      href='#' 
                      className='w-10 h-10 bg-emerald-900 text-white hover:bg-amber-500 hover:text-emerald-950 rounded-xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all duration-300'
                      aria-label='LinkedIn'
                    >
                      <Linkedin className='w-5 h-5' />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentDetails;
