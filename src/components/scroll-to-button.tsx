'use client';
import { Button, type ButtonProps } from '@/components/ui/button';

interface ScrollToButtonProps extends ButtonProps {
  to: string;
}

export function ScrollToButton({ children, to, ...props }: ScrollToButtonProps) {
  const handleScroll = () => {
    const section = document.getElementById(to);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button {...props} onClick={handleScroll}>
      {children}
    </Button>
  );
}
