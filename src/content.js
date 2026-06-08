const makeId = () => crypto.randomUUID()

const makeProject = ({
  title,
  slug,
  location,
  image,
  featured,
  summary,
  description,
  specs,
  gallery,
}) => ({
  id: makeId(),
  title,
  slug,
  location,
  image,
  featured,
  summary,
  description,
  specs,
  gallery,
})

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
    heroImages: [
      '/hero/hero-1.png',
      '/hero/hero-2.png',
      '/hero/hero-3.png',
      '/hero/hero-4.png',
      '/hero/hero-5.png',
    ],
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
    contactAddress: 'Villa Las Lomas Norte',
  },
  stats: [
    { id: makeId(), value: 40, suffix: '+', label: 'Años de Trayectoria' },
    { id: makeId(), value: 190, suffix: '+', label: 'Obras Entregadas' },
    { id: makeId(), value: 400, suffix: ' km', label: 'Radio de Cobertura' },
    { id: makeId(), value: 100, suffix: '%', label: 'Cumplimiento de Plazos' },
  ],
  models: [
    {
      id: makeId(),
      title: 'Viviendas Urbanas',
      description: 'Casas modernas pensadas para lotes urbanos, con distribución eficiente, diseño contemporáneo y excelente aprovechamiento del espacio.',
      image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80',
    },
    {
      id: makeId(),
      title: 'Viviendas Rurales',
      description: 'Proyectos robustos y funcionales para entornos abiertos, con foco en durabilidad, confort térmico y conexión con el paisaje.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    },
    {
      id: makeId(),
      title: 'Cabañas',
      description: 'Soluciones cálidas y versátiles para descanso, turismo o vivienda permanente, con identidad propia y construcción eficiente.',
      image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80',
    },
    {
      id: makeId(),
      title: 'Lofts',
      description: 'Espacios contemporáneos, abiertos y luminosos para quienes buscan una vivienda moderna con impronta urbana.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
    },
    {
      id: makeId(),
      title: 'Diseños a Medida',
      description: 'Desarrollamos viviendas totalmente personalizadas o construimos sobre planos aportados por el cliente, respetando cada necesidad.',
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=80',
    },
  ],
  portfolio: [
    makeProject({
      title: 'Casa Familiar Podestá',
      slug: 'casa-familiar-podesta',
      location: 'Paraná, Entre Ríos',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      featured: true,
      summary: 'Una casa contemporánea de líneas limpias, ambientes amplios y fuerte conexión entre interior y exterior.',
      description:
        'Proyecto residencial de estilo contemporáneo pensado para una familia que buscaba amplitud, iluminación natural y circulaciones simples. La vivienda combina espacios sociales integrados, un sector privado bien resuelto y una materialidad cálida y duradera. La obra fue desarrollada con foco en confort diario, mantenimiento eficiente y calidad constructiva en todos los detalles.',
      specs: {
        squareMeters: '186 m²',
        rooms: '6 ambientes',
        bedrooms: '3 cuartos',
        bathrooms: '2 baños',
        floors: '2 pisos',
      },
      gallery: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7f34f2a7f0b?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80',
      ],
    }),
    makeProject({
      title: 'Cabaña de Campo',
      slug: 'cabana-de-campo',
      location: 'Victoria, Entre Ríos',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80',
      featured: false,
      summary: 'Una vivienda de descanso con impronta natural, visuales abiertas y una implantación pensada para el entorno rural.',
      description:
        'Esta cabaña fue proyectada para disfrutar del paisaje y resolver estancias prolongadas con el máximo confort. Se priorizó una construcción eficiente, con materiales nobles, galerías amplias y una distribución que permite integrar descanso, estar y exterior con naturalidad.',
      specs: {
        squareMeters: '98 m²',
        rooms: '4 ambientes',
        bedrooms: '2 cuartos',
        bathrooms: '1 baño',
        floors: '1 piso',
      },
      gallery: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80',
      ],
    }),
    makeProject({
      title: 'Loft Contemporáneo',
      slug: 'loft-contemporaneo',
      location: 'Santa Fe Capital',
      image: 'https://images.unsplash.com/photo-1600566753052-d70c7b608027?w=900&q=80',
      featured: false,
      summary: 'Un loft urbano de estética sobria, espacios flexibles y una identidad moderna para vivir y trabajar.',
      description:
        'Diseñado para una vida urbana dinámica, este loft resuelve áreas integradas, doble altura y sectores funcionales con una imagen contemporánea. Se trabajó una distribución abierta, mucha luz natural y terminaciones que combinan calidez con bajo mantenimiento.',
      specs: {
        squareMeters: '122 m²',
        rooms: '5 ambientes',
        bedrooms: '2 cuartos',
        bathrooms: '2 baños',
        floors: '2 pisos',
      },
      gallery: [
        'https://images.unsplash.com/photo-1600566753052-d70c7b608027?w=1400&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
      ],
    }),
  ],
  reasons: [
    {
      id: makeId(),
      icon: '🛠️',
      title: 'Experiencia y Trayectoria',
      copy: 'Décadas de trabajo sostenido nos permiten ejecutar obras con criterio técnico, previsión y resultados confiables.',
    },
    {
      id: makeId(),
      icon: '🤝',
      title: 'Atención Personalizada',
      copy: 'Cada cliente recibe seguimiento cercano, soluciones a medida y acompañamiento real durante todo el proceso.',
    },
    {
      id: makeId(),
      icon: '⭐',
      title: 'Precio y Calidad',
      copy: 'Buscamos el mejor equilibrio entre inversión, terminaciones, confort y durabilidad para cada tipo de vivienda.',
    },
  ],
}

export function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(defaultContent))
}

function normalizeProject(project, fallbackProject) {
  return {
    ...fallbackProject,
    ...project,
    specs: {
      ...fallbackProject.specs,
      ...(project?.specs || {}),
    },
    gallery: Array.isArray(project?.gallery) && project.gallery.length ? project.gallery : fallbackProject.gallery,
  }
}

export function normalizeContent(raw = {}) {
  const fallback = cloneDefaultContent()
  const normalizedSettings = { ...fallback.settings, ...(raw.settings || {}) }

  return {
    settings: normalizedSettings,
    stats: Array.isArray(raw.stats) && raw.stats.length ? raw.stats : fallback.stats,
    models: Array.isArray(raw.models) && raw.models.length ? raw.models : fallback.models,
    portfolio: Array.isArray(raw.portfolio) && raw.portfolio.length
      ? raw.portfolio.map((project, index) => normalizeProject(project, fallback.portfolio[Math.min(index, fallback.portfolio.length - 1)] || fallback.portfolio[0]))
      : fallback.portfolio,
    reasons: Array.isArray(raw.reasons) && raw.reasons.length ? raw.reasons : fallback.reasons,
  }
}
