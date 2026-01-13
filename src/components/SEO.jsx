import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, keywords }) {
  const baseTitle = 'Riski DEV - Jasa Pembuatan Website Profesional'
  const finalTitle = title ? `${title} | Riski DEV` : baseTitle
  const metaDesc = description || 'Jasa pembuatan website profesional murah untuk mahasiswa, fresh graduate, dan UMKM. Desain modern, responsive, dan SEO friendly.'
  
  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content="/hero-preview.png" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content="/hero-preview.png" />
    </Helmet>
  )
}
