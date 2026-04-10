import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import heroBg from '../assets/hero-bg.jpg';

/* ── Typewriter hook ─────────────────────────────────────────── */
function useTypewriter(words, { typingSpeed = 80, deletingSpeed = 45, pauseMs = 2000 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const current = words[wordIndex];
    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typingSpeed
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('deleting'), pauseMs);
      return () => clearTimeout(t);
    }
    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed);
        return () => clearTimeout(t);
      }
      setWordIndex((i) => (i + 1) % words.length);
      setPhase('typing');
    }
  }, [displayed, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return displayed;
}

/* ── Data ────────────────────────────────────────────────────── */
const TYPE_WORDS = ['Open-Source Skills', 'Technical Mastery', 'Career-Ready Skills', 'Innovation'];


const features = [
  {
    number: '01',
    title: 'Hands-on Mastery',
    desc: 'Deep dive into Python, Scilab, OpenFOAM and more with structured labs and real-world exercises.',
    barColor: 'bg-indigo-500',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    number: '02',
    title: 'IITB Certified',
    desc: 'Earn certificates from FOSSEE, IIT Bombay, validating your skills to institutions and employers.',
    barColor: 'bg-violet-500',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    badgeText: 'text-violet-600 dark:text-violet-400',
  },
  {
    number: '03',
    title: 'Institutional Scaling',
    desc: 'A standardized platform for coordinators to bring top-tier expertise to their campus with ease.',
    barColor: 'bg-purple-500',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-600 dark:text-purple-400',
  },
];

const stats = [
  { value: '500+', label: 'Workshops Conducted' },
  { value: '50K+', label: 'Students Trained' },
  { value: '200+', label: 'Partner Institutions' },
  { value: '30+', label: 'Expert Instructors' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const typed = useTypewriter(TYPE_WORDS);

  return (
    <>
      <SEO
        title="FOSSEE Workshops | IIT Bombay"
        description="Book hands-on FOSSEE workshops, collaborate with instructors, and build practical open-source skills guided by IIT Bombay experts."
      />

      <div className="animate-fade-in bg-white dark:bg-gray-950">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          className="relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden bg-cover bg-center md:bg-fixed"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-950/65 backdrop-blur-[2px]" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white dark:from-gray-950 via-white/50 dark:via-gray-950/50 to-transparent" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center gap-7">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
                New Sessions Open
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.07]">
              Build{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {typed}
              </span>
              <br />
              That Actually Matters
            </h1>

            {/* Sub */}
            <p className="text-lg sm:text-xl text-white/65 max-w-2xl leading-relaxed">
              Join the FOSSEE initiative by IIT Bombay. Empower your institution with
              world-class open-source workshops delivered by industry-leading instructors.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
              <Link
                to={isAuthenticated ? '/propose' : '/register'}
                className="px-9 py-4 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Propose a Workshop
              </Link>
              <Link
                to="/workshop-types"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-base font-semibold text-white/85 border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/12 hover:border-white/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Catalog
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Scroll arrow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/30">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────── */}
        <section className="border-b border-gray-100 dark:border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`
                  py-8 px-4 text-center flex flex-col gap-1
                  ${i !== stats.length - 1 ? 'sm:border-r border-gray-100 dark:border-white/[0.06]' : ''}
                  ${i === 0 || i === 1 ? 'border-b sm:border-b-0 border-gray-100 dark:border-white/[0.06]' : ''}
                  ${i === 1 ? 'border-r border-gray-100 dark:border-white/[0.06] sm:border-r' : ''}
                `}
              >
                <span className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                  {s.value}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────── */}
        <section className="py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-16 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                Why FOSSEE
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                Everything you need to
                <br className="hidden sm:block" /> upskill your campus
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <article
                  key={i}
                  className="group relative flex flex-col gap-5 p-8 rounded-3xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                >
                  {/* Hover accent bar */}
                  <div
                    className={`absolute bottom-0 left-0 h-[3px] w-full ${f.barColor} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`}
                  />

                  {/* Number badge */}
                  <span className={`self-start text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full ${f.badgeBg} ${f.badgeText}`}>
                    {f.number}
                  </span>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {f.title}
                    </h3>
                    <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden px-8 sm:px-16 py-20 text-center isolate">

              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center grayscale opacity-20"
                style={{ backgroundImage: `url(${heroBg})` }}
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700" />

              {/* Content */}
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Ready to begin?
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  Propose a Workshop Today
                </h2>
                <p className="text-lg text-white/65 leading-relaxed max-w-xl">
                  Take the first step in transforming your academic environment. Join the FOSSEE
                  community and bridge the gap between theory and innovation.
                </p>
                <Link
                  to={isAuthenticated ? '/propose' : '/register'}
                  className="inline-flex items-center gap-2 mt-3 px-10 py-4 rounded-2xl text-base font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-2xl shadow-black/20 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
