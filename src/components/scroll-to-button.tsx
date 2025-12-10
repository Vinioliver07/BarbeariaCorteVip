'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';

interface ScrollToButtonProps extends ButtonProps {
  to: string;
}

export function ScrollToButton({ children, to, ...props }: ScrollToButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = () => {
    // Se não estiver na home, navegar primeiro para a home
    if (pathname !== '/') {
      router.push(`/#${to}`);
      // Aguardar navegação e fazer scroll
      setTimeout(() => {
        const section = document.getElementById(to);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Se já estiver na home, apenas fazer scroll
      const section = document.getElementById(to);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Button {...props} onClick={handleScroll}>
      {children}
    </Button>
  );
}
