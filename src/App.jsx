import { useEffect, useMemo, useRef, useState } from 'react'

const heroVideo = 'https://cdn.pixabay.com/video/2025/01/22/254016_large.mp4'

const navLinks = [
  { label: 'Nosotros', href: '#about' },
  { label: 'Servicios', href: '#services' },
  { label: 'Proyectos', href: '#portfolio' },
  { label: 'Blog', href: '#blog' },
]

const stats = [
  { value: 40, suffix: '+', label: 'Años de Trayectoria' },
  { value: 190, suffix: '+', label: 'Obras Entregadas' },
  { value: 400, suffix: ' km', label: 'Radio de Cobertura' },
  { value: 100, suffix: '%', label: 'Cumplimiento de Plazos' },
]

const services = [
  {
    tag: 'Modelos',
    title: 'Viviendas Urbanas y Rurales',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80',
    copy: 'Desarrollamos casas urbanas, rurales, cabañas y lofts con soluciones adaptadas al uso, al entorno y al presupuesto de cada familia.',
  },
  {
    tag: 'Personalización',
    title: 'Diseños Propios o del Cliente',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    copy: 'Podemos construir sobre modelos estándar, desarrollar propuestas a medida o materializar planos y diseños ya aportados por el cliente.',
  },
  {
    tag: 'Garantía',
    title: 'Obra con Plazos y Calidad',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    copy: 'Priorizamos confiabilidad, seguridad, estética y confort con una relación precio-calidad sólida y cumplimiento impecable de los tiempos de obra.',
  },
]

const portfolio = [
  {
    title: 'Casa Familiar Podestá',
    location: 'Paraná, Entre Ríos',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    className: 'md:row-span-2',
  },
  {
    title: 'Cabaña de Campo',
    location: 'Victoria, Entre Ríos',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80',
  },
  {
    title: 'Loft Contemporáneo',
    location: 'Santa Fe Capital',
    image: 'https://images.unsplash.com/photo-1600566753052-d70c7b608027?w=900&q=80',
  },
]

const blogPosts = [
  {
    category: 'Experiencia',
    title: 'Cómo una trayectoria sólida mejora cada etapa de obra',
    excerpt: 'La experiencia permite anticipar problemas, optimizar decisiones y sostener calidad real desde el replanteo hasta la entrega.',
    date: '13 May 2026',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80',
  },
  {
    category: 'Modelos',
    title: 'Qué tipo de vivienda conviene: urbana, rural, cabaña o loft',
    excerpt: 'Una mirada clara sobre cómo elegir el modelo adecuado según terreno, uso, inversión y estilo de vida.',
    date: '09 May 2026',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80',
  },
  {
    category: 'Calidad',
    title: 'Seguridad, estética y confort en una misma obra',
    excerpt: 'Cuando el proyecto está bien resuelto, la casa no solo luce mejor: también se vive mejor y dura más.',
    date: '30 Apr 2026',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
  },
  {
    category: 'Cobertura',
    title: 'Construimos en Entre Ríos y provincias vecinas hasta 400 km',
    excerpt: 'Nuestra logística y experiencia regional permiten sostener calidad y cumplimiento en una amplia área de trabajo.',
    date: '21 Apr 2026',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&q=80',
  },
]

const reasons = [
  {
    icon: '🛠️',
    title: 'Experiencia y Trayectoria',
    copy: 'Décadas de trabajo sostenido nos permiten ejecutar obras con criterio técnico, previsión y resultados confiables.',
  },
  {
    icon: '🤝',
    title: 'Atención Personalizada',
    copy: 'Cada cliente recibe seguimiento cercano, soluciones a medida y acompañamiento real durante todo el proceso.',
  },
  {
    icon: '⭐',
    title: 'Precio y Calidad',
    copy: 'Buscamos el mejor equilibrio entre inversión, terminaciones, confort y durabilidad para cada tipo de vivienda.',
  },
]

function useReveal() {
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
      const delay = node.dataset.delay
      if (delay) node.style.transitionDelay = `${delay}s`
      observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])
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
    <div className="border-b border-white/10 px-6 py-8 text-center border-r-white/10 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="font-heading text-4xl text-accent md:text-5xl">{formatted}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{label}</div>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  useReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <div className="bg-cream text-forest">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'nav-glass py-3' : 'bg-transparent py-5 backdrop-blur-md'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="font-heading text-2xl text-white md:text-3xl">Viviendas Podesta</a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/85 md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-accent">{link.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#cta" className="rounded-full bg-midgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent hover:text-forest">Solicitar asesoramiento</a>
          </div>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
        {menuOpen && (
          <div className="mx-4 mt-4 rounded-3xl border border-white/10 bg-forest/95 p-5 text-white shadow-2xl md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
              ))}
              <a href="#cta" onClick={() => setMenuOpen(false)} className="mt-2 rounded-full bg-accent px-5 py-3 text-center font-semibold text-forest">Solicitar asesoramiento</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative h-screen overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,31,14,0.95)_0%,rgba(13,31,14,0.35)_60%,transparent_100%)]" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl pb-10 lg:pb-0">
              <div className="hero-reveal mb-5 text-sm font-semibold uppercase tracking-[0.34em] text-accent" style={{ animationDelay: '0.2s' }}>
                // Viviendas que combinan seguridad, estética y confort
              </div>
              <h1 className="hero-reveal max-w-4xl font-heading text-[clamp(5rem,10vw,9rem)] leading-[0.88] font-black text-white" style={{ animationDelay: '0.4s' }}>
                Viviendas Podesta
              </h1>
            </div>
            <div className="max-w-xl lg:pb-6">
              <p className="hero-reveal text-lg leading-8 text-white/75 md:text-xl" style={{ animationDelay: '0.6s' }}>
                Construimos casas con atención personalizada, impecable cumplimiento de obra y soluciones adaptadas a modelos urbanos, rurales, cabañas, lofts o diseños aportados por cada cliente.
              </p>
              <div className="hero-reveal mt-8 flex flex-wrap gap-4" style={{ animationDelay: '0.8s' }}>
                <div className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-forest shadow-lg shadow-gold/20">Entre Ríos + 400 km</div>
                <div className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md">Modelos a medida</div>
              </div>
            </div>
          </div>
          <div className="scroll-indicator absolute bottom-7 left-1/2 z-10 h-10 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,#7dc47f,transparent)]" />
        </section>

        <section ref={statsRef} className="bg-forest">
          <div className="mx-auto grid max-w-7xl md:grid-cols-4">
            {stats.map((stat) => <Counter key={stat.label} {...stat} start={statsVisible} />)}
          </div>
        </section>

        <section id="about" className="bg-cream py-22 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
            <div data-reveal className="fade-left relative mx-auto w-full max-w-xl">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80" alt="Casa contemporánea" className="h-[520px] w-full rounded-[2rem] object-cover shadow-[0_30px_80px_rgba(13,31,14,0.12)]" />
              <img src="https://images.unsplash.com/photo-1600607687644-c7f34f2a7f0b?w=500&q=80" alt="Interior de casa" className="absolute -bottom-10 right-0 h-56 w-44 rounded-[1.5rem] border-[6px] border-cream object-cover shadow-2xl md:right-[-28px]" />
            </div>

            <div data-reveal data-delay="0.15" className="fade-right">
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-midgreen">// Trayectoria y confianza</div>
              <h2 className="mt-5 max-w-xl font-heading text-4xl leading-tight text-forest md:text-6xl">Experiencia real para construir la casa que imaginás</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-mutedgreen">
                En Viviendas Podesta trabajamos con una atención cercana y resolutiva, acompañando a cada cliente desde la idea inicial hasta la entrega final. Nuestra trayectoria respalda obras seguras, estéticas, confortables y ejecutadas con foco en la mejor relación precio-calidad.
              </p>
              <a href="#services" className="mt-8 inline-flex rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-midgreen">Descubrir opciones →</a>
            </div>
          </div>
        </section>

        <section id="services" className="bg-white py-22 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div data-reveal className="fade-up">
                <div className="text-sm font-semibold uppercase tracking-[0.32em] text-midgreen">// Qué construimos</div>
                <h2 className="mt-4 font-heading text-4xl text-forest md:text-6xl">Modelos y servicios para cada tipo de vivienda</h2>
              </div>
              <a data-reveal data-delay="0.1" href="#portfolio" className="fade-up text-sm font-semibold text-midgreen transition hover:text-forest">Ver proyectos →</a>
            </div>

            <div className="grid gap-7 md:grid-cols-3">
              {services.map((service, index) => (
                <article key={service.title} data-reveal data-delay={String(index * 0.1)} className="service-card scale-in group relative overflow-hidden rounded-[1.75rem]">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={service.image} alt={service.title} className="service-image h-full w-full object-cover transition duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,31,14,0.92)_0%,rgba(13,31,14,0.08)_60%,transparent_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] backdrop-blur-sm">{service.tag}</div>
                    <h3 className="font-heading text-3xl">{service.title}</h3>
                    <p className="service-copy mt-3 max-w-xs translate-y-3 text-sm leading-7 text-white/75 opacity-0 transition duration-500">{service.copy}</p>
                  </div>
                </article>
              ))}
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
              <blockquote className="font-heading text-4xl italic leading-tight md:text-6xl">Cumplir tiempos de obra también es construir confianza.</blockquote>
              <div className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-accent">// Filosofía Viviendas Podesta</div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="bg-[#e8e0d0] py-22 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div data-reveal className="fade-up">
                <div className="text-sm font-semibold uppercase tracking-[0.32em] text-midgreen">// Tipologías y obras</div>
                <h2 className="mt-4 font-heading text-4xl text-forest md:text-6xl">Proyectos</h2>
              </div>
              <div data-reveal data-delay="0.1" className="fade-up font-heading text-5xl text-forest/15 md:text-7xl">//2026</div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
              {portfolio.map((item, index) => (
                <article key={item.title} data-reveal data-delay={String(index * 0.1)} className={`portfolio-card scale-in group relative overflow-hidden rounded-[1.75rem] ${item.className ?? ''}`}>
                  <img src={item.image} alt={item.title} className="portfolio-image h-full min-h-[280px] w-full object-cover transition duration-700" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,31,14,0.9),transparent_55%)]" />
                  <div className="portfolio-copy absolute inset-x-0 bottom-0 translate-y-4 p-6 text-white opacity-0 transition duration-500">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{item.location}</div>
                    <h3 className="mt-2 font-heading text-3xl">{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="bg-cream py-22 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div data-reveal className="fade-up">
                <div className="text-sm font-semibold uppercase tracking-[0.32em] text-midgreen">// Ideas y guía</div>
                <h2 className="mt-4 font-heading text-4xl text-forest md:text-6xl">Nuestro blog</h2>
              </div>
              <a data-reveal data-delay="0.1" href="#" className="fade-up text-sm font-semibold text-midgreen transition hover:text-forest">Ver todo →</a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {blogPosts.map((post, index) => (
                <article key={post.title} data-reveal data-delay={String(index * 0.08)} className="blog-card scale-in overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_50px_rgba(13,31,14,0.05)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(13,31,14,0.12)]">
                  <div className="overflow-hidden">
                    <img src={post.image} alt={post.title} className="blog-image h-64 w-full object-cover transition duration-700" />
                  </div>
                  <div className="p-7">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-midgreen">{post.category}</div>
                    <h3 className="mt-4 font-heading text-3xl leading-tight text-forest">{post.title}</h3>
                    <p className="mt-4 text-base leading-7 text-mutedgreen">{post.excerpt}</p>
                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-forest/8 pt-5 text-sm font-medium text-mutedgreen">
                      <span>{post.date}</span>
                      <span className="font-semibold text-midgreen">Leer más →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-forest py-22 text-white md:py-28">
          <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
            <div data-reveal className="fade-up mx-auto max-w-4xl">
              <h2 className="font-heading text-4xl leading-tight md:text-6xl">Por qué elegir Viviendas Podesta para construir tu próxima casa</h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {reasons.map((reason, index) => (
                <article key={reason.title} data-reveal data-delay={String(index * 0.1)} className="scale-in rounded-[1.6rem] border border-accent/20 bg-white/5 p-8 text-left backdrop-blur-md transition hover:-translate-y-2 hover:border-accent/55 hover:shadow-[0_0_30px_rgba(125,196,127,0.12)]">
                  <div className="text-3xl">{reason.icon}</div>
                  <h3 className="mt-5 font-heading text-3xl">{reason.title}</h3>
                  <p className="mt-4 text-base leading-7 text-white/72">{reason.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="relative overflow-hidden bg-forest py-24 text-white md:py-32">
          <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600&q=80" alt="Proyecto residencial" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="leaf left-[12%] top-[58%] h-5 w-5" style={{ animationDuration: '12s' }} />
          <div className="leaf left-[28%] top-[78%] h-7 w-7" style={{ animationDuration: '14s' }} />
          <div className="leaf right-[20%] top-[65%] h-4 w-4" style={{ animationDuration: '11s' }} />
          <div className="leaf right-[10%] top-[78%] h-6 w-6" style={{ animationDuration: '13s' }} />

          <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
            <div data-reveal className="fade-up">
              <h2 className="font-heading text-4xl leading-tight md:text-7xl">Empezá tu <span className="italic text-accent">proyecto con nosotros</span></h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Si buscás una constructora confiable para una casa urbana, rural, cabaña, loft o un diseño propio, en Viviendas Podesta te acompañamos con atención personalizada y ejecución responsable.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <a href="#top" className="rounded-full bg-accent px-7 py-4 text-sm font-semibold text-forest transition hover:bg-white">Solicitar asesoramiento</a>
                <a href="#about" className="rounded-full border border-white/35 px-7 py-4 text-sm font-semibold text-white transition hover:border-accent hover:text-accent">Ver trayectoria</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-accent/30 bg-forest text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-heading text-4xl">Viviendas Podesta</a>
            <p className="mt-4 max-w-md text-base leading-7 text-white/68">
              Constructora de viviendas con trayectoria, atención personalizada y proyectos ejecutados con seguridad, estética, confort y excelente relación precio-calidad.
            </p>
            <div className="mt-6 flex gap-3 text-lg text-accent"><span>○</span><span>◐</span><span>◇</span></div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Empresa</div>
            <div className="mt-5 flex flex-col gap-3 text-white/70">
              <a href="#about">Nosotros</a>
              <a href="#services">Servicios</a>
              <a href="#portfolio">Proyectos</a>
              <a href="#">Carreras</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Recursos</div>
            <div className="mt-5 flex flex-col gap-3 text-white/70">
              <a href="#blog">Blog</a>
              <a href="#events">Eventos</a>
              <a href="#portfolio">Casos</a>
              <a href="#">FAQ</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Contacto</div>
            <div className="mt-5 space-y-3 text-white/70">
              <p>hola@viviendaspodesta.com</p>
              <p>+54 11 5555 0186</p>
              <p>Av. del Libertador 2040, Buenos Aires</p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-5 py-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 Viviendas Podesta. All rights reserved.</p>
          <div className="font-heading text-3xl text-white/8 md:text-5xl">Viviendas Podesta</div>
        </div>
      </footer>
    </div>
  )
}
