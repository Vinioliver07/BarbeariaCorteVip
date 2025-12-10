import { NextResponse } from 'next/server';
import { addAppointment } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { customerName, customerPhone, serviceId, serviceName, startTime } = body;
    
    if (!customerName || !customerPhone || !serviceId || !serviceName || !startTime) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    const appointment = addAppointment({
      customerName,
      customerPhone,
      serviceId,
      serviceName,
      startTime,
    });
    
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Erro ao criar appointment:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    );
  }
}
