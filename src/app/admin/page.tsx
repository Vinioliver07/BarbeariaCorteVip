
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Loader2, LogOut, Calendar, User, Clock, Scissors, Phone } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  startTime: string;
  createdAt: string;
}

function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Carregar appointments da API
    if (session) {
      fetch('/api/appointments')
        .then(res => res.json())
        .then(data => {
          setAppointments(data);
          setIsLoadingAppointments(false);
        })
        .catch(err => {
          console.error('Erro ao carregar appointments:', err);
          setIsLoadingAppointments(false);
        });
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, don't render (will redirect via useEffect)
  if (!session) {
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-secondary/20 py-24 pt-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Painel do Barbeiro
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Próximos Agendamentos</h2>

          {isLoadingAppointments && (
             <div className="flex justify-center mt-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
             </div>
          )}
          
          {!isLoadingAppointments && (!appointments || appointments.length === 0) && (
            <p className="text-muted-foreground text-center mt-10">Nenhum agendamento futuro encontrado.</p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {appointments?.map(app => {
                 const startTime = new Date(app.startTime);
                 return (
                    <Card key={app.id} className="bg-card shadow-md">
                        <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span className="text-primary">{app.customerName || 'Cliente não informado'}</span>
                            <span className="text-sm font-medium text-muted-foreground">{format(startTime, "dd/MM/yy")}</span>
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary"/>
                                <span className="font-bold text-lg">{format(startTime, "HH:mm")}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Scissors className="w-5 h-5 text-primary"/>
                                <span>{app.serviceName || 'Serviço não informado'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary"/>
                                <span>{app.customerPhone || 'Telefone não informado'}</span>
                            </div>
                        </CardContent>
                    </Card>
                 )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
