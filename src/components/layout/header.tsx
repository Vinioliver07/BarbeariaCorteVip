import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ScrollToButton } from '../scroll-to-button';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Página inicial da CorteVip">
          <Logo />
        </Link>
        <nav className='hidden md:flex items-center gap-4'>
            <ScrollToButton to="services" variant="ghost">Serviços</ScrollToButton>
            <ScrollToButton to="booking" variant="ghost">Agendamento</ScrollToButton>
        </nav>
        <ScrollToButton to="booking" className="bg-primary hover:bg-accent text-primary-foreground font-bold">
          Agendar
        </ScrollToButton>
      </div>
    </header>
  );
}
