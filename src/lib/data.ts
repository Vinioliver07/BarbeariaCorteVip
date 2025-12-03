export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  imageId: string;
};

export const services: Service[] = [
  {
    id: 'haircut',
    name: 'Corte de Cabelo',
    description: 'Estilo moderno e clássico, adaptado à sua preferência.',
    price: 50,
    duration: 45,
    imageId: 'service-haircut',
  },
  {
    id: 'beard',
    name: 'Design de Barba',
    description: 'Modelagem e aparo da barba com toalha quente e navalha.',
    price: 40,
    duration: 30,
    imageId: 'service-beard',
  },
  {
    id: 'combo',
    name: 'Corte + Barba',
    description: 'O pacote completo para um visual impecável.',
    price: 80,
    duration: 75,
    imageId: 'service-combo',
  },
];
