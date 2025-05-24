import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ✅ Aquí se imprime la data en la consola del servidor
    console.log('🟢 Datos recibidos desde el formulario:', data);

    // Puedes agregar validaciones mínimas si quieres
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json({ success: true, message: 'Datos recibidos' });
  } catch (error) {
    console.error('🔴 Error al procesar los datos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
