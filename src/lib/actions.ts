"use server";

import { z } from "zod";
import { services } from "./data";

const bookingSchema = z.object({
  serviceId: z.string(),
  date: z.date(),
  time: z.string(),
  name: z.string(),
  phone: z.string(),
});

export async function bookAppointment(values: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  // In a real application, you would save this to a database.
  // For this demo, we'll just log it to the server console.
  const service = services.find(s => s.id === parsed.data.serviceId);

  console.log("--- Novo Agendamento Recebido ---");
  console.log("Cliente:", parsed.data.name);
  console.log("Telefone:", parsed.data.phone);
  console.log("Serviço:", service?.name || "Não encontrado");
  console.log("Data:", parsed.data.date.toLocaleDateString('pt-BR'));
  console.log("Hora:", parsed.data.time);
  console.log("---------------------------------");

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Here you could also check for conflicts again on the server side
  // before confirming the booking.
  
  return { success: true };
}
