'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { Booking } from '@/components/sections/booking';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  useEffect(() => {
    // Fazer scroll para a seção quando a página carregar com hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const section = document.getElementById(hash);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
