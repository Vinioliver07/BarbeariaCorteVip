import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { services } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock, Tag } from 'lucide-react';

export function Services() {
  return (
    <section id="services" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Nossos Serviços</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Oferecemos uma gama de serviços premium para o homem moderno.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const serviceImage = PlaceHolderImages.find(p => p.id === service.imageId);
            return (
              <Card key={service.id} className="bg-card overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="p-0">
                  {serviceImage && (
                    <div className="relative h-56 w-full">
                       <Image
                        src={serviceImage.imageUrl}
                        alt={serviceImage.description}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint={serviceImage.imageHint}
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl text-primary">{service.name}</CardTitle>
                  <CardDescription className="mt-2 min-h-[3rem]">{service.description}</CardDescription>
                  <div className="mt-6 flex justify-between items-center text-muted-foreground">
                     <div className="flex items-center gap-2">
                       <Tag size={16} className="text-primary" />
                       <span className="font-bold text-lg text-foreground">R$ {service.price.toFixed(2).replace('.', ',')}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Clock size={16} className="text-primary" />
                       <span>{service.duration} min</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
