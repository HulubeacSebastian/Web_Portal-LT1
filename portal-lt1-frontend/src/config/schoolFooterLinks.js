/**
 * Linkuri externe în footer.
 * Setează VITE_SCHOOL_FACEBOOK_URL / VITE_SCHOOL_INSTAGRAM_URL în .env.development sau .env.production.
 */

function pickUrl(envValue, fallback) {
  const value = envValue?.trim();
  return value || fallback;
}

const websiteUrl = pickUrl(import.meta.env.VITE_SCHOOL_WEBSITE_URL, 'https://www.liceultehnologicnr1.ro');
const facebookUrl = pickUrl(
  import.meta.env.VITE_SCHOOL_FACEBOOK_URL,
  'https://www.facebook.com/liceultehnologicnr1campulungmoldovenesc',
);
const instagramUrl = pickUrl(import.meta.env.VITE_SCHOOL_INSTAGRAM_URL, '');

export const SCHOOL_FOOTER_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: facebookUrl,
    icon: 'facebook'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: instagramUrl,
    icon: 'instagram'
  },
  {
    id: 'website',
    label: 'Site-ul liceului',
    href: websiteUrl,
    icon: 'website'
  }
].filter((item) => item.href);
