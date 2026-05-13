export const defaultContent = {
  settings: {
    brandName: 'Viviendas Podesta',
    navCtaLabel: 'Solicitar asesoramiento',
    heroEyebrow: 'Viviendas que combinan seguridad, estética y confort',
    heroTitle: 'Viviendas Podesta',
    heroDescription:
      'Construimos casas con atención personalizada, impecable cumplimiento de obra y soluciones adaptadas a modelos urbanos, rurales, cabañas, lofts o diseños aportados por cada cliente.',
    heroBadgePrimary: 'Entre Ríos + 400 km',
    heroBadgeSecondary: 'Modelos a medida',
    aboutEyebrow: 'Trayectoria y confianza',
    aboutTitle: 'Experiencia real para construir la casa que imaginás',
    aboutBody:
      'En Viviendas Podesta trabajamos con una atención cercana y resolutiva, acompañando a cada cliente desde la idea inicial hasta la entrega final. Nuestra trayectoria respalda obras seguras, estéticas, confortables y ejecutadas con foco en la mejor relación precio-calidad.',
    aboutPrimaryImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
    aboutSecondaryImage:
      'https://images.unsplash.com/photo-1600607687644-c7f34f2a7f0b?w=500&q=80',
    quoteText: 'Cumplir tiempos de obra también es construir confianza.',
    quoteLabel: 'Filosofía Viviendas Podesta',
    portfolioEyebrow: 'Tipologías y obras',
    portfolioTitle: 'Proyectos',
    portfolioWatermark: '//2026',
    reasonsTitle: 'Por qué elegir Viviendas Podesta para construir tu próxima casa',
    ctaTitle: 'Empezá tu proyecto con nosotros',
    ctaHighlight: 'proyecto con nosotros',
    ctaDescription:
      'Si buscás una constructora confiable para una casa urbana, rural, cabaña, loft o un diseño propio, en Viviendas Podesta te acompañamos con atención personalizada y ejecución responsable.',
    ctaBackgroundImage:
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600&q=80',
    footerDescription:
      'Constructora de viviendas con trayectoria, atención personalizada y proyectos ejecutados con seguridad, estética, confort y excelente relación precio-calidad.',
    contactEmail: 'hola@viviendaspodesta.com',
    contactPhone: '+54 11 5555 0186',
    contactAddress: 'Av. del Libertador 2040, Buenos Aires',
  },
  stats: [
    { id: crypto.randomUUID(), value: 40, suffix: '+', label: 'Años de Trayectoria' },
    { id: crypto.randomUUID(), value: 190, suffix: '+', label: 'Obras Entregadas' },
    { id: crypto.randomUUID(), value: 400, suffix: ' km', label: 'Radio de Cobertura' },
    { id: crypto.randomUUID(), value: 100, suffix: '%', label: 'Cumplimiento de Plazos' },
  ],
  portfolio: [
    {
      id: crypto.randomUUID(),
      title: 'Casa Familiar Podestá',
      location: 'Paraná, Entre Ríos',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      featured: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'Cabaña de Campo',
      location: 'Victoria, Entre Ríos',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80',
      featured: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Loft Contemporáneo',
      location: 'Santa Fe Capital',
      image: 'https://images.unsplash.com/photo-1600566753052-d70c7b608027?w=900&q=80',
      featured: false,
    },
  ],
  reasons: [
    {
      id: crypto.randomUUID(),
      icon: '🛠️',
      title: 'Experiencia y Trayectoria',
      copy: 'Décadas de trabajo sostenido nos permiten ejecutar obras con criterio técnico, previsión y resultados confiables.',
    },
    {
      id: crypto.randomUUID(),
      icon: '🤝',
      title: 'Atención Personalizada',
      copy: 'Cada cliente recibe seguimiento cercano, soluciones a medida y acompañamiento real durante todo el proceso.',
    },
    {
      id: crypto.randomUUID(),
      icon: '⭐',
      title: 'Precio y Calidad',
      copy: 'Buscamos el mejor equilibrio entre inversión, terminaciones, confort y durabilidad para cada tipo de vivienda.',
    },
  ],
}

export function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(defaultContent))
}

export function normalizeContent(raw = {}) {
  const fallback = cloneDefaultContent()
  return {
    settings: { ...fallback.settings, ...(raw.settings || {}) },
    stats: Array.isArray(raw.stats) && raw.stats.length ? raw.stats : fallback.stats,
    portfolio: Array.isArray(raw.portfolio) && raw.portfolio.length ? raw.portfolio : fallback.portfolio,
    reasons: Array.isArray(raw.reasons) && raw.reasons.length ? raw.reasons : fallback.reasons,
  }
}
