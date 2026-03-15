import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Πολιτιστικός Σύλλογος Μέσης',
    short_name: 'Π.Σ. Μέσης',
    description: 'Επίσημη ιστοσελίδα του Πολιτιστικού Συλλόγου Μέσης.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
