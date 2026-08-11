import DepCard from '../components/ui/DepCard';
import AnimatedCard from '../components/ui/AnimatedCard';
import { motion } from 'framer-motion';
import { getDepartmentLogo } from '../components/utils/departmentAssets';
import { useNavigate } from 'react-router-dom';
import departmentsData from '../data/departments.json';
import SearchIcon from '../assets/icons/search_icon.svg?react';
import ChevronDown from '../assets/icons/arrow_right.svg?react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../components/utils/LanguageContext';
import translatedContents from '../data/translated_contents.json';

function Departments() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const departments = departmentsData.departments;
  const t = translatedContents.departments;

  const [results, setResults] = useState(null);
  const [noResultFound, setNoResultFound] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const filtered = filter.toLowerCase() === 'all'
    ? departments
    : departments.filter(dep => dep.category.toLowerCase() === filter.toLowerCase());
  const finalList = results !== null ? results : filtered;

  const categories = [
    { label: t.filters.all[language], value: 'All' },
    { label: t.filters.social_services[language], value: 'Social services' },
    { label: t.filters.agriculture[language], value: 'Agriculture' },
    { label: t.filters.economic_development[language], value: 'Economic Development' },
    { label: t.filters.environment[language], value: 'Environment' },
    { label: t.filters.infrastructure[language], value: 'Infrastructure' },
    { label: t.filters.health[language], value: 'Health' },
    { label: t.filters.education[language], value: 'Education' },
    { label: t.filters.legal[language], value: 'Legal' }
  ];

  const getCurrentCategoryLabel = () => {
    const cat = categories.find(c => c.value === filter);
    return cat ? cat.label : t.filters.all[language];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDepartmentClick = (departmentId) => {
    navigate(`/departments/${departmentId}`);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase().trim();

    if (term === '') {
      setNoResultFound(false);
      setResults(null);
      return;
    }

    const searchResults = filtered.filter(dep => {
      let title = '';
      let description = '';

      if (typeof dep.title === 'object') {
        title = (dep.title[language] || dep.title['en'] || '').toLowerCase();
      } else if (typeof dep.name === 'object') {
        title = (dep.name[language] || dep.name['en'] || 'Department').toLowerCase();
      } else {
        title = (dep.title || dep.name || 'Department').toLowerCase();
      }

      if (dep.shortDescription?.[language]) {
        description = dep.shortDescription[language].toLowerCase();
      } else if (typeof dep.mission === 'object') {
        description = (dep.mission[language] || dep.mission['en'] || '').toLowerCase();
      } else if (typeof dep.description === 'object') {
        description = (dep.description[language] || dep.description['en'] || '').toLowerCase();
      }

      return title.includes(term) || description.includes(term);
    });

    if (searchResults.length === 0) {
      setNoResultFound(true);
      setResults([]);
    } else {
      setNoResultFound(false);
      setResults(searchResults);
    }
  };

  return (
    <div className='w-full bg-white min-h-screen'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-7xl mx-auto px-4 pt-8 pb-24'
      >
        <div className='mb-8'>
          <h1 className='font-goldman font-bold text-3xl md:text-4xl text-emerald-900 mb-6'>
            {t.title[language]}
          </h1>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1 max-w-lg'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2'>
                <SearchIcon className='w-5 h-5 text-emerald-700/50' />
              </div>
              <input
                type='text'
                placeholder={t.search?.[language] || (language === 'am' ? 'ፈልግ' : language === 'or' ? 'Barbaadi' : 'Search')}
                onChange={handleSearch}
                className='w-full pl-12 pr-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 font-roboto text-sm transition-all'
              />
            </div>

            <div className='relative' ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className='flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-emerald-200 bg-white hover:bg-emerald-50 shadow-sm font-jost font-medium text-sm text-emerald-900 cursor-pointer transition-all min-w-[160px]'
              >
                <span>{getCurrentCategoryLabel()}</span>
                <ChevronDown
                  className={`w-3 h-3 text-emerald-700/70 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isFilterDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-200 rounded-2xl shadow-lg z-50 overflow-hidden'>
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setFilter(cat.value);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-jost text-sm transition-all ${
                        cat.value === filter
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-slate-700 hover:bg-emerald-50/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'>
          {noResultFound || finalList.length < 1 ? (
            <div className='w-full col-span-full flex flex-col gap-3 justify-center items-center text-slate-400 py-16'>
              <SearchIcon className="w-14 h-14 text-emerald-700/30" />
              <p className='text-lg font-goldman font-bold text-slate-600'>
                {language === 'am' ? 'ምንም ውጤት የለም' : language === 'or' ? 'Bu\'aa Hin Argamne' : 'No Results Found'}
              </p>
            </div>
          ) : (
            finalList.map((dep, idx) => {
              const title = typeof dep.title === 'object'
                ? (dep.title[language] || dep.title['en'])
                : (typeof dep.name === 'object'
                  ? (dep.name[language] || dep.name['en'])
                  : (dep.title || dep.name || 'Department'));
              const description = dep.shortDescription?.[language]
                || (typeof dep.mission === 'object'
                  ? (dep.mission[language] || dep.mission['en'])
                  : (typeof dep.description === 'object'
                    ? (dep.description[language] || dep.description['en'])
                    : 'No description available'));

              return (
                <AnimatedCard key={dep.id} index={idx} stagger={70} maxDelay={560} className="w-full">
                  <div
                    onClick={() => handleDepartmentClick(dep.id)}
                    className="cursor-pointer w-full h-full"
                  >
                    <DepCard
                      title={title}
                      description={description}
                      logo={getDepartmentLogo(dep.id)}
                    />
                  </div>
                </AnimatedCard>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Departments;
