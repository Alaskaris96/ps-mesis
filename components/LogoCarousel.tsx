'use client';

import Image from 'next/image';

const goldenSponsor = { src: '/assets/logos/ladini_big.png', alt: 'Ladini - Χρυσός Χορηγός' };

const logos = [
  { src: '/assets/logos/euthumis.png', alt: 'Euthumis' },
  { src: '/assets/logos/golis.png', alt: 'Golis' },
  { src: '/assets/logos/matzilas.png', alt: 'Matzilas' },
  { src: '/assets/logos/nezir.png', alt: 'Nezir' },
  { src: '/assets/logos/sidiropoulos.png', alt: 'Sidiropoulos' },
  { src: '/assets/logos/tzaferis.png', alt: 'Tzaferis' },
];

export function LogoCarousel() {
  // We duplicate the logos array multiple times to ensure a seamless loop.
  // The container will translate by -50%, so exactly half of the total items need to represent an integer number of the original list.
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section className="w-full py-12 md:py-16 overflow-hidden bg-background border-y border-border/50">
      <div className="container px-4 md:px-6 mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-serif text-[var(--primary)] mb-12">
          Οι Υποστηρικτές μας
        </h2>

        {/* Golden Sponsor Section */}
        <div className="mb-10 flex flex-col items-center">
          <h3 className="text-lg md:text-xl font-medium text-muted-foreground mb-6 uppercase tracking-widest">
            Χρυσός Χορηγός
          </h3>
          <div className="relative w-56 h-28 md:w-72 md:h-36 transition-transform duration-300 hover:scale-105">
            <Image
              src={goldenSponsor.src}
              alt={goldenSponsor.alt}
              fill
              className="object-contain drop-shadow-md"
              sizes="(max-width: 768px) 224px, 288px"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Wrapper with gradient fade effect on both sides */}
      <div className="relative flex overflow-hidden group w-full before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[15%] before:max-w-32 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[15%] after:max-w-32 after:bg-gradient-to-l after:from-background after:to-transparent pt-4 pb-4 border-t border-border/30 mt-6 shadow-sm">
        
        <div className="animate-marquee flex w-max items-center gap-12 md:gap-24 px-6 md:px-12 hover:[animation-play-state:paused]">
          {duplicatedLogos.map((logo, index) => (
             <div 
               key={index} 
               className="relative w-32 h-16 md:w-48 md:h-24 transition-all duration-300 transform hover:scale-105"
             >
               <Image
                 src={logo.src}
                 alt={logo.alt}
                 fill
                 className="object-contain"
                 sizes="(max-width: 768px) 128px, 192px"
               />
             </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
      `}</style>
    </section>
  );
}
