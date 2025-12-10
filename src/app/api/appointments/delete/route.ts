import { NextResponse } from 'next/server';
import { deleteAppointment } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    // Verificar autenticação
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do agendamento não fornecido' },
        { status: 400 }
      );
    }
    
    console.log('🔵 [API] Deletando agendamento:', id);
    
    const success = deleteAppointment(id);
    
    if (!success) {
      console.log('❌ [API] Agendamento não encontrado:', id);
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }
    
    console.log('✅ [API] Agendamento deletado com sucesso:', id);
    
    return NextResponse.json({ success: true, message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('❌ [API] Erro ao deletar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao cancelar agendamento' },
      { status: 500 }
    );
  }
}
