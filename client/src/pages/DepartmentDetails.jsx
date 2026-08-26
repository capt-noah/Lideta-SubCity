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
    <div className='w-full bg-[#f6f9f7] min-h-screen'>

      {/* ── Sticky breadcrumb / back bar ─────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-3'>
          <button
            onClick={() => navigate('/departments')}
            className='flex items-center gap-2 text-sm font-goldman font-bold text-emerald-900 hover:text-amber-600 transition-colors duration-200 cursor-pointer group'
          >
            <ArrowRight className='w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-200' />
            {t.back_button[language]}
          </button>
          <span className='text-gray-300'>›</span>
          {department.category && (
            <>
              <span className='text-sm font-jost text-gray-500 capitalize'>{department.category}</span>
              <span className='text-gray-300'>›</span>
            </>
          )}
          <span className='text-sm font-jost text-gray-400 line-clamp-1 flex-1 hidden sm:block'>
            {department?.title?.[language] || department?.title?.en || ''}
          </span>
        </div>
      </div>

      {/* ── Compact article header ────────────────────────────────────────── */}
      <div className='w-full bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-5'>
          <div className='max-w-3xl'>
            {/* Category pill + meta */}
            {department.category && (
              <span className='inline-block bg-amber-500 text-emerald-950 font-goldman font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full mb-3'>
                {department.category}
              </span>
            )}
            {/* Title */}
            <h1 className='font-goldman font-bold text-2xl sm:text-3xl md:text-4xl text-emerald-950 leading-tight'>
              {department?.title?.[language] || department?.title?.en || 'Department'}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className='w-full px-4 max-w-7xl mx-auto pb-24'>
        <div className='w-full py-8 font-roboto'>
          <div className='w-full flex flex-col gap-12 items-start lg:flex-row lg:gap-8'>
            {/* Main Content Area */}
            <div className='w-full flex flex-col md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'>
              {/* Department Leader — always shown, placeholder if no photo */}
              <div className="w-full mb-8">
                {/* Photo or placeholder */}
                {getDepartmentHead(department.id) ? (
                  <div className="relative w-full h-96 md:h-[480px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                    <img
                      src={getDepartmentHead(department.id)}
                      alt={`Head of ${department?.title?.[language] || 'Department'}`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ) : (
                  /* Placeholder when no photo available */
                  <div className="relative w-full h-56 bg-gradient-to-br from-emerald-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-400">Photo not available</p>
                    </div>
                  </div>
                )}

                {/* Leader name — always shown */}
                <div className="mt-4 flex items-start gap-3 p-4 bg-emerald-50/70 rounded-xl border border-emerald-900/8">
                  <div className="w-1 self-stretch bg-amber-500 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">
                      {t.department_head[language]}
                    </p>
                    <p className="text-lg font-goldman font-bold text-emerald-950">
                      {(() => {
                        const leader = department?.leader
                        if (!leader) return t.not_specified[language]
                        if (typeof leader === 'object') return leader[language] || leader.en || t.not_specified[language]
                        return leader || t.not_specified[language]
                      })()}
                    </p>
                  </div>
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
      </div>
    </div>
  );
}

export default DepartmentDetails;
