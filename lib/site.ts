/** Studio contacts — same values as the current site's assets/js/config.js. Empty string = hidden. */
export const site = {
  name: 'Ruben Pap Ceramics',
  email: 'rubenpappottery@gmail.com',
  phone: '+374 95 688 684',
  whatsapp: '',
  telegram: '+374 95 688 684', // a username ("rubenpap") is more reliable than a number
  instagram: 'rubenpap',
  facebook: 'https://www.facebook.com/Rubenpap-Ceramics',
  mapQuery: 'Komitas Avenue 49/3, Yerevan, Armenia',
}

export const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const digits = (v: string) => v.replace(/\D/g, '')

export const links = {
  email: `mailto:${site.email}`,
  phone: `tel:+${digits(site.phone)}`,
  whatsapp: site.whatsapp && `https://wa.me/${digits(site.whatsapp)}`,
  telegram: site.telegram && `https://t.me/${/^[\d+\s-]+$/.test(site.telegram) ? `+${digits(site.telegram)}` : site.telegram}`,
  instagram: site.instagram && `https://www.instagram.com/${site.instagram}/`,
  facebook: site.facebook,
  googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`,
  yandexMaps: `https://yandex.com/maps/?text=${encodeURIComponent(site.mapQuery)}`,
}

export const mailto = (subject: string, body = '') =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
