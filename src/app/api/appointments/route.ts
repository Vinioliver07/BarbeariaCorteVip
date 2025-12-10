import { NextResponse } from 'next/server';
import { getAppointments } from '@/lib/db';

export async function GET() {
  try {
    const appointments = getAppointments();
    
    // Filtrar apenas appointments futuros
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate >= today;
    }).sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
    
    return NextResponse.json(futureAppointments);
  } catch (error) {
    console.error('Erro ao buscar appointments:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}
