import { useEffect, useMemo, useRef, useState } from 'react'
import { cloneDefaultContent, normalizeContent } from './content'
import { isSupabaseConfigured, supabase, SUPABASE_BUCKET } from './supabase'

const heroVideo = 'https://cdn.pixabay.com/video/2025/01/22/254016_large.mp4'
const CONTENT_KEYS = ['settings', 'stats', 'portfolio', 'reasons']

const projectSpecLabels = {
  squareMeters: 'Metros cuadrados',
  rooms: 'Ambientes',
  bedrooms: 'Cuartos',
  bathrooms: 'Baños',
  floors: 'Pisos',
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getHouseSlug() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('house') || ''
}

function useReveal(deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    nodes.forEach((node) => {
      node.classList.remove('visible')
      const delay = node.dataset.delay
      if (delay) node.style.transitionDelay = `${delay}s`
      observer.observe(node)
    })

    return () => observer.disconnect()
  }, deps)
}

function useSiteContent() {
  const [content, setContent] = useState(cloneDefaultContent())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    if (!isSupabaseConfigured()) {
      setContent(cloneDefaultContent())
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: fetchError } = await supabase.from('site_content').select('key, value')

    if (fetchError) {
      setError(fetchError.message)
      setContent(cloneDefaultContent())
      setLoading(false)
      return
    }

    const mapped = (data || []).reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    setContent(normalizeContent(mapped))
    setError('')
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return { content, setContent, loading, error, refresh }
}

function Counter({ value, prefix = '', suffix = '', label, start }) {
  const [count, setCount] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!start || done.current) return
    done.current = true
    const duration = 1600
    const startTime = performance.now()

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(value * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [start, value])

  const formatted = useMemo(() => {
    const number = value >= 1000 ? count.toLocaleString() : count
    return `${prefix}${number}${suffix}`
  }, [count, prefix, suffix, value])

  return (
    <div className="border-r-white/10 border-b border-white/10 px-6 py-8 text-center md:border-r md:border-b-0 md:last:border-r-0">
      <div className="font-heading text-4xl text-accent md:text-5xl">{formatted}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{label}</div>
    </div>
  )
}

function PublicSite({ content }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [selectedHouseSlug, setSelectedHouseSlug] = useState(getHouseSlug())
  const statsRef = useRef(null)
  const { settings, stats, portfolio, reasons } = content
  const heroImages = settings.heroImages?.length ? settings.heroImages : [content.settings.aboutPrimaryImage]

  const navLinks = [
    { label: 'Nosotros', href: '#about' },
    { label: 'Proyectos', href: '#portfolio' },
  ]

  useReveal([selectedHouseSlug])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (heroImages.length <= 1) return undefined
    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    const syncHouse = () => setSelectedHouseSlug(getHouseSlug())
    window.addEventListener('popstate', syncHouse)
    return () => window.removeEventListener('popstate', syncHouse)
  }, [])

  const openHouse = (slug) => {
    const nextUrl = `${window.location.pathname}?house=${slug}`
    window.history.pushState({}, '', nextUrl)
    setSelectedHouseSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeHouse = () => {
    const nextUrl = window.location.pathname
    window.history.pushState({}, '', nextUrl)
    setSelectedHouseSlug('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedHouse = portfolio.find((item) => (item.slug || slugify(item.title)) === selectedHouseSlug)

  if (selectedHouse) {
    return (
      <HouseDetailPage
        settings={settings}
        house={selectedHouse}
        onBack={closeHouse}
      />
    )
  }

  return (
    <div className="bg-cream text-forest">
      <header className="absolute inset-x-0 top-0 z-50 pt-5 md:pt-7">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-[#b89a67]/75 bg-[#081521]/88 px-5 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-4 md:gap-5">
            <a href="#top" className="flex items-center gap-3 text-white">
              <img src="/branding/logo-podesta.png" alt="Logo Viviendas Podesta" className="h-10 w-10 object-contain md:h-12 md:w-12" />
              <span className="font-heading text-xl text-white md:text-2xl">{settings.brandName}</span>
            </a>
            <span className="hidden h-10 w-px bg-[#b89a67]/55 md:block" />
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/88 md:flex lg:gap-10">
            {navLinks.map((link, index) => (
              <a key={link.label} href={link.href} className="relative pb-1 transition hover:text-white">
                {link.label}
                {index === 0 ? <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-10 bg-[#b89a67]" /> : null}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a href="#cta" className="inline-flex items-center gap-3 rounded-full border border-[#b89a67]/80 bg-[#2b3822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#35452a]">
              <span>{settings.navCtaLabel}</span>
              <span className="text-[#c5a059]">→</span>
            </a>
          </div>

          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b89a67]/45 text-white md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <span className="text-xl">☰</span>
          </button>
        </div>
        {menuOpen && (
          <div className="mx-4 mt-4 rounded-[2rem] border border-[#b89a67]/55 bg-[#081521]/95 p-5 text-white shadow-2xl backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
              ))}
              <a href="#cta" onClick={() => setMenuOpen(false)} className="mt-2 rounded-full border border-[#b89a67]/80 bg-[#2b3822] px-5 py-3 text-center font-semibold text-white">{settings.navCtaLabel}</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Hero ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover object-[68%_center] transition-opacity duration-[1600ms] ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.42)_42%,rgba(0,0,0,0.08)_74%,rgba(0,0,0,0.02)_100%)]" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-6 pt-24 md:px-12 md:pt-28 lg:px-20 xl:px-24">
            <div className="max-w-5xl pt-16">
              <div className="hero-reveal mb-8 flex items-center gap-4" style={{ animationDelay: '0.2s' }}>
                <span className="h-px w-10 bg-[#c29b61]/70" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c29b61] md:text-[14px]">
                  {settings.heroEyebrow}
                </span>
              </div>

              <h1 className="hero-reveal font-heading text-[clamp(3.8rem,8.2vw,7rem)] leading-[0.9] font-black tracking-[-0.03em] text-white" style={{ animationDelay: '0.4s' }}>
                Viviendas<br />Podesta
              </h1>

              <div className="hero-reveal mt-12 max-w-[480px]" style={{ animationDelay: '0.6s' }}>
                <span className="mb-5 block h-px w-10 bg-[#c29b61]/70" />
                <p className="text-[15px] leading-7 text-white/80 md:text-[18px] md:leading-[1.65]">
                  {settings.heroDescription}
                </p>
              </div>

              <div className="hero-reveal mt-16 flex flex-col gap-6 text-white md:flex-row md:items-start md:gap-8" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-start gap-4">
                  <span className="pt-1 text-xl text-[#c29b61]">⌖</span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c29b61] md:text-[11px]">Ubicación</div>
                    <div className="mt-2 font-heading text-[22px] leading-[1.05] text-white md:text-[28px]">
                      Entre Ríos<br />+ 400 km
                    </div>
                  </div>
                </div>

                <div className="hidden h-16 w-px bg-[#c29b61]/55 md:block" />

                <div className="flex items-start gap-4">
                  <span className="pt-1 text-xl text-[#c29b61]">⌂</span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c29b61] md:text-[11px]">Diseños</div>
                    <div className="mt-2 font-heading text-[22px] leading-[1.05] text-white md:text-[28px]">
                      Modelos a medida
                    </div>
                    <span className="mt-3 block h-px w-16 bg-[#c29b61]/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {heroImages.length > 1 ? (
            <div className="absolute bottom-8 right-6 z-10 flex gap-2 md:right-10">
              {heroImages.map((image, index) => (
                <button
                  key={`${image}-dot-${index}`}
                  type="button"
                  aria-label={`Ir a imagen ${index + 1}`}
                  onClick={() => setHeroIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${index === heroIndex ? 'bg-[#c29b61]' : 'bg-white/45 hover:bg-white/70'}`}
                />
              ))}
            </div>
          ) : null}
          <div className="scroll-indicator absolute bottom-7 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,#c4a470,transparent)]" />
        </section>

        <section ref={statsRef} className="bg-forest">
          <div className="mx-auto grid max-w-7xl md:grid-cols-4">
            {stats.map((stat) => <Counter key={stat.id || stat.label} {...stat} start={statsVisible} />)}
          </div>
        </section>

        <section id="about" className="bg-cream py-22 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
            <div data-reveal className="fade-left relative mx-auto w-full max-w-xl">
              <img src={settings.aboutPrimaryImage} alt="Casa contemporánea" className="h-[520px] w-full rounded-[2rem] object-cover shadow-[0_30px_80px_rgba(13,31,14,0.12)]" />
              <img src={settings.aboutSecondaryImage} alt="Interior de casa" className="absolute -bottom-10 right-0 h-56 w-44 rounded-[1.5rem] border-[6px] border-cream object-cover shadow-2xl md:right-[-28px]" />
            </div>

            <div data-reveal data-delay="0.15" className="fade-right">
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-midgreen">// {settings.aboutEyebrow}</div>
              <h2 className="mt-5 max-w-xl font-heading text-4xl leading-tight text-forest md:text-6xl">{settings.aboutTitle}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-mutedgreen">{settings.aboutBody}</p>
            </div>
          </div>
        </section>

        <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[rgba(13,31,14,0.65)]" />
          <div className="relative z-10 flex h-full items-center justify-center px-5 text-center md:px-8">
            <div data-reveal className="fade-up max-w-4xl text-white">
              <blockquote className="font-heading text-4xl italic leading-tight md:text-6xl">{settings.quoteText}</blockquote>
              <div className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-accent">// {settings.quoteLabel}</div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="bg-[#e8e0d0] py-22 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div data-reveal className="fade-up">
                <div className="text-sm font-semibold uppercase tracking-[0.32em] text-midgreen">// {settings.portfolioEyebrow}</div>
                <h2 className="mt-4 font-heading text-4xl text-forest md:text-6xl">{settings.portfolioTitle}</h2>
              </div>
              <div data-reveal data-delay="0.1" className="fade-up font-heading text-5xl text-forest/15 md:text-7xl">{settings.portfolioWatermark}</div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
              {portfolio.map((item, index) => (
                <button
                  key={item.id || item.title}
                  type="button"
                  data-reveal
                  data-delay={String(index * 0.1)}
                  onClick={() => openHouse(item.slug || slugify(item.title))}
                  className={`portfolio-card scale-in group relative overflow-hidden rounded-[1.75rem] text-left ${item.featured ? 'md:row-span-2' : ''}`}
                >
                  <img src={item.image} alt={item.title} className="portfolio-image h-full min-h-[280px] w-full object-cover transition duration-700" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,31,14,0.9),transparent_55%)]" />
                  <div className="portfolio-copy absolute inset-x-0 bottom-0 translate-y-4 p-6 text-white opacity-0 transition duration-500">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{item.location}</div>
                    <h3 className="mt-2 font-heading text-3xl">{item.title}</h3>
                    {item.summary ? <p className="mt-3 max-w-md text-sm leading-6 text-white/80">{item.summary}</p> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-forest py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(20,42,22,0.55),transparent)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
            <div data-reveal className="fade-up mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-14 bg-gold/40" />
                <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0">
                  <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="#c9a84c" opacity="0.65" />
                </svg>
                <span className="h-px w-14 bg-gold/40" />
              </div>
              <h2 className="mt-8 font-heading text-4xl leading-[1.1] text-white md:text-[3.6rem] md:leading-[1.1]">
                Por qué elegir <span className="italic text-gold">Viviendas Podesta</span><br />
                para construir tu próxima casa
              </h2>
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gold/40" />
                <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0">
                  <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="#c9a84c" opacity="0.65" />
                </svg>
                <span className="h-px w-10 bg-gold/40" />
              </div>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {reasons.map((reason, index) => {
                const svgIcons = [
                  <svg key="wrench" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>,
                  <svg key="handshake" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                    <path d="m21 3 1 11h-2" />
                    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                    <path d="M3 4h8" />
                  </svg>,
                  <svg key="award" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                    <circle cx="12" cy="8" r="6" />
                  </svg>,
                ]
                return (
                  <article
                    key={reason.id || reason.title}
                    data-reveal
                    data-delay={String(index * 0.1)}
                    className="scale-in relative overflow-hidden rounded-[1.8rem] border border-gold/30 bg-[#0f1e10] p-8 text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-2 hover:border-gold/55 hover:shadow-[0_28px_65px_rgba(0,0,0,0.45)] md:p-10"
                  >
                    <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-gold/50 bg-forest">
                      {svgIcons[index] ?? <span className="text-xl text-gold">{reason.icon}</span>}
                    </div>
                    <h3 className="mt-7 font-heading text-[1.6rem] leading-tight text-[#f7f2ea]">{reason.title}</h3>
                    <p className="mx-auto mt-4 max-w-xs text-[0.9rem] leading-[1.75] text-white/60">{reason.copy}</p>
                    <div className="absolute bottom-5 right-5">
                      <svg width="9" height="9" viewBox="0 0 10 10">
                        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="#c9a84c" opacity="0.45" />
                      </svg>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="cta" className="relative overflow-hidden bg-forest py-24 text-white md:py-32">
          <img src={settings.ctaBackgroundImage} alt="Proyecto residencial" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="leaf left-[12%] top-[58%] h-5 w-5" style={{ animationDuration: '12s' }} />
          <div className="leaf left-[28%] top-[78%] h-7 w-7" style={{ animationDuration: '14s' }} />
          <div className="leaf right-[20%] top-[65%] h-4 w-4" style={{ animationDuration: '11s' }} />
          <div className="leaf right-[10%] top-[78%] h-6 w-6" style={{ animationDuration: '13s' }} />

          <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
            <div data-reveal className="fade-up">
              <h2 className="font-heading text-4xl leading-tight md:text-7xl">
                {settings.ctaTitle.replace(settings.ctaHighlight, '')}
                <span className="italic text-accent">{settings.ctaHighlight}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">{settings.ctaDescription}</p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <a href="#top" className="rounded-full bg-accent px-7 py-4 text-sm font-semibold text-forest transition hover:bg-white">{settings.navCtaLabel}</a>
                <a href="#about" className="rounded-full border border-white/35 px-7 py-4 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">Ver trayectoria</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-accent/30 bg-forest text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-heading text-4xl">{settings.brandName}</a>
            <p className="mt-4 max-w-md text-base leading-7 text-white/68">{settings.footerDescription}</p>
            <div className="mt-6 flex gap-3 text-lg text-accent"><span>○</span><span>◐</span><span>◇</span></div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Empresa</div>
            <div className="mt-5 flex flex-col gap-3 text-white/70">
              <a href="#about">Nosotros</a>
              <a href="#portfolio">Proyectos</a>
              <a href="#cta">Contacto</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Panel</div>
            <div className="mt-5 flex flex-col gap-3 text-white/70">
              <a href="/?admin=1">Admin</a>
              <a href="#cta">Asesoramiento</a>
              <a href="#portfolio">Casos</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Contacto</div>
            <div className="mt-5 space-y-3 text-white/70">
              <p>{settings.contactEmail}</p>
              <p>{settings.contactPhone}</p>
              <p>{settings.contactAddress}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-5 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 {settings.brandName}. All rights reserved.</p>
          <div className="font-heading text-3xl text-white/8 md:text-5xl">{settings.brandName}</div>
        </div>
      </footer>
    </div>
  )
}

function AdminField({ label, value, onChange, type = 'text', rows = 3 }) {
  const baseClass = 'w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-midgreen'
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-forest">{label}</span>
      {type === 'textarea' ? (
        <textarea className={baseClass} rows={rows} value={value || ''} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={baseClass} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function HouseDetailPage({ settings, house, onBack }) {
  const gallery = house.gallery?.length ? house.gallery : [house.image]
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const closeLightbox = () => setLightboxIndex(null)
  const showPrev = () => setLightboxIndex((current) => (current === null ? 0 : (current - 1 + gallery.length) % gallery.length))
  const showNext = () => setLightboxIndex((current) => (current === null ? 0 : (current + 1) % gallery.length))

  useEffect(() => {
    if (lightboxIndex === null) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, gallery.length])

  return (
    <div className="min-h-screen bg-cream text-forest">
      <section className="relative overflow-hidden bg-forest px-5 pb-18 pt-8 text-white md:px-8 md:pb-24">
        <div className="absolute inset-0 opacity-25">
          <img src={house.image} alt={house.title} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,31,14,0.88),rgba(13,31,14,0.95))]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ← Volver a proyectos
            </button>
            <div className="font-heading text-2xl text-white md:text-3xl">{settings.brandName}</div>
          </div>

          <div className="mt-16 max-w-4xl">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-accent">// Proyecto residencial</div>
            <h1 className="mt-5 font-heading text-5xl leading-tight text-white md:text-7xl">{house.title}</h1>
            <p className="mt-4 text-lg text-white/70 md:text-xl">{house.location}</p>
            {house.summary ? <p className="mt-8 max-w-3xl text-lg leading-8 text-white/78">{house.summary}</p> : null}
          </div>
        </div>
      </section>

      <section className="bg-cream py-18 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={`${index === 0 ? 'md:col-span-2' : ''} overflow-hidden rounded-[1.75rem] bg-white text-left shadow-[0_24px_60px_rgba(13,31,14,0.08)]`}
                >
                  <img
                    src={image}
                    alt={`${house.title} ${index + 1}`}
                    className={`w-full object-cover transition duration-500 hover:scale-[1.02] ${index === 0 ? 'h-[440px]' : 'h-[280px]'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_24px_60px_rgba(13,31,14,0.08)]">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-midgreen">// Ficha técnica</div>
              <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-forest/10">
                {Object.entries(projectSpecLabels).map(([key, label], index) => (
                  <div key={key} className={`grid grid-cols-2 gap-4 px-5 py-4 ${index !== Object.keys(projectSpecLabels).length - 1 ? 'border-b border-forest/10' : ''}`}>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-mutedgreen">{label}</div>
                    <div className="text-right font-heading text-2xl text-forest">{house.specs?.[key] || '-'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_24px_60px_rgba(13,31,14,0.08)]">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-midgreen">// Descripción general</div>
              <p className="mt-6 text-base leading-8 text-mutedgreen md:text-lg">{house.description}</p>
            </div>
          </div>
        </div>
      </section>

      {lightboxIndex !== null ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 px-4 py-8">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cerrar ✕
          </button>

          {gallery.length > 1 ? (
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20 md:left-8"
              aria-label="Imagen anterior"
            >
              ←
            </button>
          ) : null}

          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5">
            <img
              src={gallery[lightboxIndex]}
              alt={`${house.title} ampliada ${lightboxIndex + 1}`}
              className="max-h-[78vh] w-auto max-w-full rounded-[1.5rem] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            />
            <div className="text-sm font-medium text-white/75">
              Imagen {lightboxIndex + 1} de {gallery.length}
            </div>
          </div>

          {gallery.length > 1 ? (
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20 md:right-8"
              aria-label="Imagen siguiente"
            >
              →
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function AdminImageField({ label, value, onChange, onUpload, uploading }) {
  return (
    <div className="space-y-3">
      <AdminField label={label} value={value} onChange={onChange} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white">
          {uploading ? 'Subiendo...' : 'Subir imagen'}
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
        {value ? <img src={value} alt={label} className="h-16 w-24 rounded-xl object-cover" /> : null}
      </div>
    </div>
  )
}

function AdminListSection({ title, children, onAdd }) {
  return (
    <section className="space-y-5 rounded-[1.75rem] bg-white p-6 shadow-[0_20px_50px_rgba(13,31,14,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-heading text-3xl text-forest">{title}</h3>
        {onAdd ? <button className="rounded-full bg-midgreen px-4 py-2 text-sm font-semibold text-white" onClick={onAdd}>Agregar</button> : null}
      </div>
      {children}
    </section>
  )
}

function AdminPage({ content, setContent, refresh }) {
  const [session, setSession] = useState(null)
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const updateSettings = (field, value) => {
    setContent((current) => ({ ...current, settings: { ...current.settings, [field]: value } }))
  }

  const updateListItem = (listKey, index, patch) => {
    setContent((current) => ({
      ...current,
      [listKey]: current[listKey].map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }))
  }

  const addListItem = (listKey, template) => {
    setContent((current) => ({ ...current, [listKey]: [...current[listKey], { id: crypto.randomUUID(), ...template }] }))
  }

  const removeListItem = (listKey, index) => {
    setContent((current) => ({ ...current, [listKey]: current[listKey].filter((_, itemIndex) => itemIndex !== index) }))
  }

  const uploadImage = async (file, pathPrefix = 'general') => {
    if (!supabase) throw new Error('Supabase no configurado')
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(path, file, { upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const persistContent = async (nextContent, successMessage = 'Cambios guardados.') => {
    if (!supabase) return false
    const rows = CONTENT_KEYS.map((key) => ({ key, value: nextContent[key] }))
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
    if (error) {
      setStatus(error.message)
      return false
    }
    setStatus(successMessage)
    return true
  }

  const handleUpload = async (field, pathPrefix, file, listKey, index) => {
    if (!file) return
    const normalizedField = field.includes('.') ? field.replaceAll('.', '-') : field
    const uploadKey = typeof index === 'number' ? `${listKey}-${index}-${normalizedField}` : normalizedField
    try {
      setUploadingField(uploadKey)
      setStatus('Subiendo imagen...')
      const url = await uploadImage(file, pathPrefix)
      let nextContent
      setContent((current) => {
        if (!listKey && field.startsWith('heroImages.')) {
          const imageIndex = Number(field.split('.')[1])
          nextContent = {
            ...current,
            settings: {
              ...current.settings,
              heroImages: (current.settings.heroImages || []).map((item, idx) => (idx === imageIndex ? url : item)),
            },
          }
        } else if (listKey === 'portfolio' && typeof index === 'number' && field.startsWith('gallery.')) {
          const galleryIndex = Number(field.split('.')[1])
          nextContent = {
            ...current,
            portfolio: current.portfolio.map((item, itemIndex) =>
              itemIndex === index
                ? {
                    ...item,
                    gallery: (item.gallery || []).map((galleryItem, currentGalleryIndex) =>
                      currentGalleryIndex === galleryIndex ? url : galleryItem,
                    ),
                  }
                : item,
            ),
          }
        } else {
          nextContent = typeof index === 'number'
            ? {
                ...current,
                [listKey]: current[listKey].map((item, itemIndex) =>
                  itemIndex === index ? { ...item, [field]: url } : item,
                ),
              }
            : {
                ...current,
                settings: { ...current.settings, [field]: url },
              }
        }
        return nextContent
      })
      await persistContent(nextContent, 'Imagen subida y guardada.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setUploadingField('')
    }
  }

  const signIn = async (event) => {
    event.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword(authForm)
    if (error) setAuthError(error.message)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    setStatus('Guardando cambios...')
    await persistContent(content)
    setSaving(false)
    refresh()
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-cream px-5 py-16 text-forest md:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_rgba(13,31,14,0.08)]">
          <h1 className="font-heading text-5xl">Admin Viviendas Podesta</h1>
          <p className="mt-4 text-lg text-mutedgreen">Falta configurar Supabase. Completá <code>.env</code> usando <code>.env.example</code> y creá la tabla/bucket indicados en el README.</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream px-5 py-16 md:px-8">
        <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_rgba(13,31,14,0.08)]">
          <h1 className="font-heading text-5xl text-forest">Admin</h1>
          <p className="mt-4 text-mutedgreen">Ingresá con un usuario de Supabase Auth para administrar imágenes y contenido.</p>
          <form className="mt-8 space-y-4" onSubmit={signIn}>
            <AdminField label="Email" value={authForm.email} onChange={(value) => setAuthForm((current) => ({ ...current, email: value }))} type="email" />
            <AdminField label="Contraseña" value={authForm.password} onChange={(value) => setAuthForm((current) => ({ ...current, password: value }))} type="password" />
            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
            <button className="w-full rounded-full bg-forest px-5 py-3 font-semibold text-white">Ingresar</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_rgba(13,31,14,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-5xl text-forest">Panel admin</h1>
            <p className="mt-3 text-mutedgreen">Desde acá pueden agregar, quitar o reemplazar imágenes ya subidas y editar el contenido visible del sitio.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" className="rounded-full border border-forest/15 px-5 py-3 text-sm font-semibold text-forest">Ver sitio</a>
            <button className="rounded-full bg-midgreen px-5 py-3 text-sm font-semibold text-white" onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
            <button className="rounded-full border border-forest/15 px-5 py-3 text-sm font-semibold text-forest" onClick={signOut}>Salir</button>
          </div>
        </div>

        {status ? <div className="rounded-2xl bg-white px-5 py-4 text-sm text-forest shadow-[0_12px_35px_rgba(13,31,14,0.08)]">{status}</div> : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5 rounded-[1.75rem] bg-white p-6 shadow-[0_20px_50px_rgba(13,31,14,0.08)]">
            <h3 className="font-heading text-3xl text-forest">Generales</h3>
            <AdminField label="Nombre de marca" value={content.settings.brandName} onChange={(value) => updateSettings('brandName', value)} />
            <AdminField label="CTA navegación" value={content.settings.navCtaLabel} onChange={(value) => updateSettings('navCtaLabel', value)} />
            <AdminField label="Título hero" value={content.settings.heroTitle} onChange={(value) => updateSettings('heroTitle', value)} />
            <AdminField label="Bajada hero" value={content.settings.heroDescription} onChange={(value) => updateSettings('heroDescription', value)} type="textarea" rows={4} />
            <AdminField label="Badge hero 1" value={content.settings.heroBadgePrimary} onChange={(value) => updateSettings('heroBadgePrimary', value)} />
            <AdminField label="Badge hero 2" value={content.settings.heroBadgeSecondary} onChange={(value) => updateSettings('heroBadgeSecondary', value)} />
          </div>

          <div className="space-y-5 rounded-[1.75rem] bg-white p-6 shadow-[0_20px_50px_rgba(13,31,14,0.08)]">
            <h3 className="font-heading text-3xl text-forest">Nosotros / CTA</h3>
            <AdminField label="Título nosotros" value={content.settings.aboutTitle} onChange={(value) => updateSettings('aboutTitle', value)} />
            <AdminField label="Texto nosotros" value={content.settings.aboutBody} onChange={(value) => updateSettings('aboutBody', value)} type="textarea" rows={5} />
            <AdminImageField label="Imagen principal nosotros" value={content.settings.aboutPrimaryImage} onChange={(value) => updateSettings('aboutPrimaryImage', value)} uploading={uploadingField === 'aboutPrimaryImage'} onUpload={(event) => handleUpload('aboutPrimaryImage', 'about', event.target.files?.[0])} />
            <AdminImageField label="Imagen secundaria nosotros" value={content.settings.aboutSecondaryImage} onChange={(value) => updateSettings('aboutSecondaryImage', value)} uploading={uploadingField === 'aboutSecondaryImage'} onUpload={(event) => handleUpload('aboutSecondaryImage', 'about', event.target.files?.[0])} />
            <AdminImageField label="Imagen fondo CTA" value={content.settings.ctaBackgroundImage} onChange={(value) => updateSettings('ctaBackgroundImage', value)} uploading={uploadingField === 'ctaBackgroundImage'} onUpload={(event) => handleUpload('ctaBackgroundImage', 'cta', event.target.files?.[0])} />
          </div>
        </section>

        <AdminListSection
          title="Imágenes del hero"
          onAdd={() => setContent((current) => ({
            ...current,
            settings: {
              ...current.settings,
              heroImages: [...(current.settings.heroImages || []), ''],
            },
          }))}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {(content.settings.heroImages || []).map((image, index) => (
              <div key={`hero-image-${index}`} className="space-y-3 rounded-2xl border border-forest/10 p-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-semibold text-forest">Imagen {index + 1}</span>
                  <button
                    className="text-sm font-semibold text-red-600"
                    onClick={() => setContent((current) => ({
                      ...current,
                      settings: {
                        ...current.settings,
                        heroImages: (current.settings.heroImages || []).filter((_, imageIndex) => imageIndex !== index),
                      },
                    }))}
                  >
                    Eliminar
                  </button>
                </div>
                <AdminImageField
                  label="Imagen"
                  value={image}
                  onChange={(value) => setContent((current) => ({
                    ...current,
                    settings: {
                      ...current.settings,
                      heroImages: (current.settings.heroImages || []).map((item, imageIndex) => imageIndex === index ? value : item),
                    },
                  }))}
                  uploading={uploadingField === `heroImages-${index}`}
                  onUpload={(event) => handleUpload(`heroImages.${index}`, `hero/${index + 1}`, event.target.files?.[0])}
                />
              </div>
            ))}
          </div>
        </AdminListSection>

        <AdminListSection
          title="Estadísticas"
          onAdd={() => addListItem('stats', { value: 0, prefix: '', suffix: '', label: 'Nueva métrica' })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {content.stats.map((stat, index) => (
              <div key={stat.id} className="space-y-3 rounded-2xl border border-forest/10 p-4">
                <div className="flex justify-end"><button className="text-sm font-semibold text-red-600" onClick={() => removeListItem('stats', index)}>Eliminar</button></div>
                <AdminField label="Valor" value={stat.value} onChange={(value) => updateListItem('stats', index, { value: Number(value) || 0 })} type="number" />
                <AdminField label="Prefijo" value={stat.prefix || ''} onChange={(value) => updateListItem('stats', index, { prefix: value })} />
                <AdminField label="Sufijo" value={stat.suffix || ''} onChange={(value) => updateListItem('stats', index, { suffix: value })} />
                <AdminField label="Etiqueta" value={stat.label} onChange={(value) => updateListItem('stats', index, { label: value })} />
              </div>
            ))}
          </div>
        </AdminListSection>

        <AdminListSection
          title="Proyectos / imágenes"
          onAdd={() => addListItem('portfolio', {
            title: 'Nuevo proyecto',
            slug: 'nuevo-proyecto',
            location: 'Ubicación',
            image: '',
            featured: false,
            summary: 'Resumen breve del proyecto.',
            description: 'Descripción general del proyecto.',
            specs: {
              squareMeters: '0 m²',
              rooms: '0 ambientes',
              bedrooms: '0 cuartos',
              bathrooms: '0 baños',
              floors: '1 piso',
            },
            gallery: [''],
          })}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {content.portfolio.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-2xl border border-forest/10 p-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-semibold text-forest">Proyecto {index + 1}</span>
                  <button className="text-sm font-semibold text-red-600" onClick={() => removeListItem('portfolio', index)}>Eliminar</button>
                </div>
                <AdminField label="Título" value={item.title} onChange={(value) => updateListItem('portfolio', index, { title: value })} />
                <AdminField label="Slug / URL" value={item.slug || ''} onChange={(value) => updateListItem('portfolio', index, { slug: slugify(value) })} />
                <AdminField label="Ubicación" value={item.location} onChange={(value) => updateListItem('portfolio', index, { location: value })} />
                <AdminField label="Resumen" value={item.summary || ''} onChange={(value) => updateListItem('portfolio', index, { summary: value })} type="textarea" rows={3} />
                <AdminField label="Descripción general" value={item.description || ''} onChange={(value) => updateListItem('portfolio', index, { description: value })} type="textarea" rows={5} />
                <label className="flex items-center gap-3 text-sm font-semibold text-forest">
                  <input type="checkbox" checked={Boolean(item.featured)} onChange={(event) => updateListItem('portfolio', index, { featured: event.target.checked })} />
                  Destacado (ocupa doble alto)
                </label>
                <AdminImageField label="Imagen" value={item.image} onChange={(value) => updateListItem('portfolio', index, { image: value })} uploading={uploadingField === `portfolio-${index}-image`} onUpload={(event) => handleUpload('image', `portfolio/${index + 1}`, event.target.files?.[0], 'portfolio', index)} />

                <div className="space-y-3 rounded-2xl bg-cream/60 p-4">
                  <div className="text-sm font-semibold text-forest">Ficha técnica</div>
                  {Object.entries(projectSpecLabels).map(([specKey, label]) => (
                    <AdminField
                      key={specKey}
                      label={label}
                      value={item.specs?.[specKey] || ''}
                      onChange={(value) => updateListItem('portfolio', index, { specs: { ...(item.specs || {}), [specKey]: value } })}
                    />
                  ))}
                </div>

                <div className="space-y-3 rounded-2xl bg-cream/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-forest">Galería de la casa</div>
                    <button
                      className="rounded-full bg-midgreen px-3 py-1.5 text-xs font-semibold text-white"
                      onClick={() => updateListItem('portfolio', index, { gallery: [...(item.gallery || []), ''] })}
                    >
                      Agregar imagen
                    </button>
                  </div>
                  {(item.gallery || []).map((galleryImage, galleryIndex) => (
                    <div key={`${item.id}-gallery-${galleryIndex}`} className="space-y-3 rounded-2xl border border-forest/10 bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedgreen">Imagen {galleryIndex + 1}</span>
                        <button
                          className="text-xs font-semibold text-red-600"
                          onClick={() => updateListItem('portfolio', index, { gallery: (item.gallery || []).filter((_, imgIndex) => imgIndex !== galleryIndex) })}
                        >
                          Eliminar
                        </button>
                      </div>
                      <AdminImageField
                        label="URL imagen"
                        value={galleryImage}
                        onChange={(value) => updateListItem('portfolio', index, { gallery: (item.gallery || []).map((img, imgIndex) => imgIndex === galleryIndex ? value : img) })}
                        uploading={uploadingField === `portfolio-${index}-gallery-${galleryIndex}`}
                        onUpload={(event) => handleUpload(`gallery.${galleryIndex}`, `portfolio/${index + 1}/gallery`, event.target.files?.[0], 'portfolio', index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AdminListSection>

        <AdminListSection
          title="Diferenciales"
          onAdd={() => addListItem('reasons', { icon: '⭐', title: 'Nuevo diferencial', copy: 'Texto del diferencial' })}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {content.reasons.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-2xl border border-forest/10 p-4">
                <div className="flex justify-end"><button className="text-sm font-semibold text-red-600" onClick={() => removeListItem('reasons', index)}>Eliminar</button></div>
                <AdminField label="Ícono" value={item.icon} onChange={(value) => updateListItem('reasons', index, { icon: value })} />
                <AdminField label="Título" value={item.title} onChange={(value) => updateListItem('reasons', index, { title: value })} />
                <AdminField label="Texto" value={item.copy} onChange={(value) => updateListItem('reasons', index, { copy: value })} type="textarea" rows={4} />
              </div>
            ))}
          </div>
        </AdminListSection>

        <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_20px_50px_rgba(13,31,14,0.08)]">
          <h3 className="font-heading text-3xl text-forest">Contacto</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <AdminField label="Email" value={content.settings.contactEmail} onChange={(value) => updateSettings('contactEmail', value)} />
            <AdminField label="Teléfono" value={content.settings.contactPhone} onChange={(value) => updateSettings('contactPhone', value)} />
            <AdminField label="Dirección" value={content.settings.contactAddress} onChange={(value) => updateSettings('contactAddress', value)} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default function App() {
  const { content, setContent, loading, refresh } = useSiteContent()
  const isAdmin = typeof window !== 'undefined' && (window.location.search.includes('admin=1') || window.location.pathname === '/admin')

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-cream text-lg text-forest">Cargando contenido...</div>
  }

  return isAdmin ? <AdminPage content={content} setContent={setContent} refresh={refresh} /> : <PublicSite content={content} />
}
