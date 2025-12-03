'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Loader2, LogOut, Calendar, User, Clock, Scissors, Phone } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { getAuth } from 'firebase/auth';
import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  // Check if the user has the barber role
  const barberRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'roles_barber', user.uid);
  }, [firestore, user]);
  const { data: barberRole, isLoading: isLoadingRole } = useDoc(barberRoleRef);

  // Fetch appointments
  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    return query(
      collection(firestore, 'appointments'),
      where('startTime', '>=', today.toISOString()),
      orderBy('startTime', 'asc')
    );
  }, [firestore]);

  const { data: appointments, isLoading: isLoadingAppointments } = useCollection(appointmentsQuery);

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
    // If loading is finished and user is not a barber, redirect to home
    if (!isLoadingRole && user && !barberRole) {
        console.log("Usuário não é barbeiro. Redirecionando...");
        router.push('/');
    }
  }, [user, isUserLoading, barberRole, isLoadingRole, router]);

  const handleLogout = async () => {
    await getAuth().signOut();
    router.push('/admin/login');
  };

  // Show a loading screen while checking auth and role
  if (isUserLoading || isLoadingRole || !user || !barberRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // User is a barber, show the dashboard
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
                            <span className="text-primary">{app.customerName}</span>
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
                                <span>{app.serviceName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary"/>
                                <span>{app.customerPhone}</span>
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
