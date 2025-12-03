import { Phone, Mail, MapPin, LogIn } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary/20 py-12">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Logo />
          <p className="text-muted-foreground max-w-xs">Onde o estilo encontra a precisão. Agende seu horário e sinta a diferença.</p>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Contato</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
              <Phone size={16} />
              <span>(11) 99999-8888</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
              <Mail size={16} />
              <span>contato@cortevip.com</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
              <MapPin size={16} />
              <span>Rua dos Barbeiros, 123 - São Paulo, SP</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Horário de Funcionamento</h3>
          <p className="text-muted-foreground">Segunda a Sábado</p>
          <p className="text-muted-foreground">08:00 - 20:00</p>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Acesso Restrito</h3>
          <Link href="/admin" className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
            <LogIn size={16} />
            <span>Painel do Barbeiro</span>
          </Link>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CorteVip. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
