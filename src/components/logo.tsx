import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image 
        src="https://placehold.co/40x40/b48940/1a1a1a?text=CV" 
        alt="CorteVip Logo" 
        width={40} 
        height={40} 
        className="rounded-full" 
      />
      <span className="font-headline text-3xl font-bold text-primary hidden sm:inline">
        CorteVip
      </span>
    </div>
  );
}
