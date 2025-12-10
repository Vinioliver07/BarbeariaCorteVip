import { NextResponse } from 'next/server';
import { addAppointment } from '@/lib/db';

export async function POST(request: Request) {
  try {
    console.log('🔵 [API] Recebendo requisição de agendamento...');
    const body = await request.json();
    console.log('🔵 [API] Dados recebidos:', body);
    
    const { customerName, customerPhone, serviceId, serviceName, startTime } = body;
    
    if (!customerName || !customerPhone || !serviceId || !serviceName || !startTime) {
      console.log('❌ [API] Dados incompletos:', { customerName, customerPhone, serviceId, serviceName, startTime });
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    console.log('🔵 [API] Salvando agendamento no banco de dados...');
    const appointment = addAppointment({
      customerName,
      customerPhone,
      serviceId,
      serviceName,
      startTime,
    });
    
    console.log('✅ [API] Agendamento salvo com sucesso!');
    console.log('✅ [API] ID:', appointment.id);
    console.log('✅ [API] Cliente:', customerName);
    console.log('✅ [API] Serviço:', serviceName);
    console.log('✅ [API] Data/Hora:', startTime);
    
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('❌ [API] Erro ao criar appointment:', error);
    console.error('❌ [API] Stack:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { error: 'Erro ao criar agendamento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
