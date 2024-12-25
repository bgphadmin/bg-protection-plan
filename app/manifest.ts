import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BG Protection Plan App',
    short_name: 'BGPPA',
    description: 'Monitors and maintains the protection plans of BG customers',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/BG_logo5.png',
        sizes: '196x196',
        type: 'image/png',
      },
      
    ],
  }
}