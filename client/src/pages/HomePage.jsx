import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../components/utils/LanguageContext";
import translatedContents from "../data/translated_contents.json";

import CeoImage from "../assets/ceo_final.png";
import BuildingHeader from "../assets/building_hero.jpg";
import Subtract from "../assets/subtract.png";

import ArrowRight from "../assets/icons/arrow_right.svg?react";

import SheildIcon from "../assets/icons/sheild_icon.svg?react";
import BoltIcon from "../assets/icons/bolt_icon.svg?react";
import GlobeIcon from "../assets/icons/globe_icon1.svg?react";
import CompliantIcon from "../assets/icons/compliant_icon.svg?react";

import NewsCard from "../components/ui/NewsCard";
import CutoutCard from "../components/ui/CutoutCard";
import Loading from "../components/ui/Loading";
import AnimatedSection from "../components/ui/AnimatedSection";
import AnimatedCard from "../components/ui/AnimatedCard";

function HomePage() {
  const { language } = useLanguage();
  const t = translatedContents;
  const [latestNews, setLatestNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Single hero image — no slider needed
  const heroBg = BuildingHeader;

  useEffect(() => {
    async function getNews() {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const data = await response.json();
          const formattedNews = data.map((item) => ({
            id: item.id.toString(),
            title: item.title,
            description:
              item.short_description ||
              item.description?.substring(0, 100) ||
              "",
            date: item.formatted_date || item.created_at?.split("T")[0] || "",
            category: item.category,
            photo: item.photo,
            amh: item.amh,
            orm: item.orm,
          }));

          if (Array.isArray(formattedNews)) {
            setLatestNews(formattedNews.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getNews();
  }, []);

  return (
    <div className="w-full flex flex-col gap-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[85vh] lg:min-h-190 flex flex-col overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/75 to-gray-900/30 z-10 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 py-20 lg:py-0 gap-8 h-full min-h-[inherit]">
          <div className="flex flex-col gap-4 mt-auto mb-auto lg:mt-0 lg:mb-0">

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-goldman w-80 text-4xl sm:text-5xl md:w-120 lg:text-6xl lg:w-150 xl:text-7xl xl:w-180 font-bold leading-tight text-white drop-shadow-lg max-w-4xl"
            >
              {t.landing.welcome_section.title[language]}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-gray-200 text-lg sm:text-xl font-light leading-relaxed max-w-lg drop-shadow-md"
            >
              {t.landing.welcome_section.description[language]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6"
            >
              <Link
                to="/departments"
                className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-goldman flex items-center font-medium overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-600/20 transition-all duration-300 transform hover:-translate-y-1 text-center sm:text-left"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  <span>{t.landing.departments_cta[language]}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>

              <Link
                to="/contacts"
                className="group px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-xl font-goldman font-medium shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <span>{t.landing.contact_cta[language]}</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Latest News ───────────────────────────────────────────────────── */}
      <div className="w-full bg-white flex flex-col items-center gap-12 py-20 px-4 md:px-6 lg:px-8">
        <AnimatedSection variant="up" threshold={0.1}>
          <div className="flex flex-col items-center gap-2 font-goldman font-bold text-center">
            <h1 className="text-3xl md:text-5xl text-emerald-900">
              {t.latest_news.title[language]}
            </h1>
            <p className="font-normal text-sm md:text-lg text-emerald-900/70 max-w-2xl">
              {t.latest_news.subtitle[language]}
            </p>
          </div>
        </AnimatedSection>

        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loading />
            </div>
          ) : (
            latestNews.map((news, idx) => {
              let title       = news.title;
              let description = news.description;
              let category    = news.category;

              if (language === "am" && news.amh) {
                title       = news.amh.title || title;
                description = news.amh.short_description || news.amh.description?.substring(0, 100) || description;
                category    = news.amh.category || category;
              } else if (language === "or" && news.orm) {
                title       = news.orm.title || title;
                description = news.orm.short_description || news.orm.description?.substring(0, 100) || description;
                category    = news.orm.category || category;
              }

              return (
                <AnimatedCard key={news.id} index={idx} stagger={100} className="h-full">
                  <NewsCard
                    id={news.id}
                    title={title}
                    description={description}
                    date={news.date}
                    category={category}
                    photo={news.photo}
                  />
                </AnimatedCard>
              );
            })
          )}
        </div>

        {/* View All News Button */}
        {!isLoading && latestNews.length > 0 && (
          <AnimatedSection variant="up" threshold={0.1}>
            <Link
              to="/news"
              className="group px-7 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-goldman font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-xl hover:shadow-emerald-700/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5"
            >
              <span>{t.latest_news?.view_all?.[language] || "View All News"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        )}
      </div>

      {/* ── Additional Services ───────────────────────────────────────────── */}
      <div className="w-full bg-white flex flex-col items-center gap-12 py-20 px-4 md:px-6 lg:px-12">
        <AnimatedSection variant="up" threshold={0.1}>
          <div className="flex flex-col items-center gap-2 font-goldman font-bold text-center">
            <h1 className="text-3xl md:text-5xl text-emerald-900">
              {t.additional_services.title[language]}
            </h1>
            <p className="font-normal text-sm md:text-lg text-emerald-900/70 max-w-2xl">
              {t.additional_services.description[language]}
            </p>
          </div>
        </AnimatedSection>

        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {[
            { to: "/news",    key: "news_updates",     variant: "news" },
            { to: "/vacancy", key: "job_opportunities", variant: "jobs" },
            { to: "/events",  key: "events",            variant: "events" },
          ].map(({ to, key, variant }, idx) => (
            <AnimatedCard key={key} index={idx} stagger={120} className="w-full">
              <Link to={to} className="w-full block">
                <CutoutCard
                  title={t.additional_services.services[key].title[language]}
                  description={t.additional_services.services[key].description[language]}
                  variant={variant}
                />
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* ── Our Commitment ────────────────────────────────────────────────── */}
      <div className="w-full bg-white flex flex-col items-center gap-12 py-20 px-4 md:px-6 lg:px-12">
        <AnimatedSection variant="up" threshold={0.1}>
          <div className="flex flex-col items-center gap-2 font-goldman font-bold text-center">
            <h1 className="text-3xl md:text-5xl text-emerald-900">
              {t.our_commitment.title[language]}
            </h1>
            <p className="font-normal text-sm md:text-lg text-emerald-900/70 max-w-2xl">
              {t.our_commitment.description[language]}
            </p>
          </div>
        </AnimatedSection>

        <div className="w-full flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:justify-center lg:gap-10 lg:max-w-6xl">
          {[
            { Icon: SheildIcon, key: "transparency" },
            { Icon: BoltIcon,   key: "efficient_service" },
            { Icon: GlobeIcon,  key: "innovation" },
          ].map(({ Icon, key }, idx) => (
            <AnimatedCard key={key} index={idx} stagger={120} variant="scale">
              <div className="w-full max-w-xs h-full mx-auto bg-emerald-50 rounded-3xl flex flex-col justify-center items-center gap-4 px-6 py-8 border border-emerald-800/10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-14 h-14 bg-emerald-800/5 flex justify-center items-center rounded-2xl border border-emerald-800/10">
                  <Icon className="text-emerald-900 w-7 h-7" />
                </div>
                <p className="font-goldman font-bold text-xl text-center text-emerald-900">
                  {t.commitment_cards[key].title[language]}
                </p>
                <p className="font-light text-sm md:text-base text-center text-emerald-800/70 leading-relaxed">
                  {t.commitment_cards[key].description[language]}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* ── Complaint CTA ─────────────────────────────────────────────────── */}
      <div className="w-full px-4 md:px-6 lg:px-12 pb-24">
        <AnimatedSection variant="scale" threshold={0.15}>
          <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500/20 rounded-3xl flex flex-col items-center justify-around py-12 px-6 md:px-10 gap-6 shadow-2xl relative overflow-hidden">
            {/* Subtle decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-xl" />

            <CompliantIcon className="w-16 h-16 md:w-20 md:h-20 text-emerald-400 relative z-10" />
            <h1 className="font-goldman font-bold text-3xl md:text-4xl text-emerald-400 text-center relative z-10">
              {t.complaints_section.title[language]}
            </h1>
            <p className="w-full md:w-3/4 font-light text-sm md:text-base text-emerald-100/80 text-center leading-relaxed relative z-10">
              {t.complaints_section.description[language]}
            </p>
            <Link
              to="/complaints"
              className="w-full sm:w-56 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-goldman font-bold rounded-xl flex justify-center items-center gap-3 cursor-pointer shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 relative z-10"
            >
              <p>{t.complaints_section.cta_button[language]}</p>
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
          </div>
        </AnimatedSection>
      </div>

    </div>
  );
}

export default HomePage;
