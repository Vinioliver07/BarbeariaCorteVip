import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollToButton } from '@/components/scroll-to-button';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-barbershop');

  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 text-center px-4">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Excelência em Cada Corte
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200 font-body drop-shadow-md">
          Bem-vindo à CorteVip, onde a tradição da barbearia encontra a arte moderna.
        </p>
        <ScrollToButton to="booking" size="lg" className="mt-8 bg-primary hover:bg-accent text-primary-foreground font-bold text-lg py-6 px-10 rounded-full shadow-lg transform transition-transform hover:scale-105">
          Agendar Horário
        </ScrollToButton>
      </div>
    </section>
  );
}
