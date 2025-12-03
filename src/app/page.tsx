import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { Booking } from '@/components/sections/booking';
import { Footer } from '@/components/layout/footer';

export default function Home() {
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
