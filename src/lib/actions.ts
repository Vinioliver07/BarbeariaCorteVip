"use server";

import { z } from "zod";
import { services } from "./data";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

const bookingSchema = z.object({
  serviceId: z.string(),
  date: z.date(),
  time: z.string(),
  name: z.string(),
  phone: z.string(),
  // Add a customerId for linking to a user account if needed in the future
  customerId: z.string().optional(), 
});

export async function bookAppointment(values: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  const { firestore } = initializeFirebase();
  const appointmentsCollection = collection(firestore, 'appointments');

  const service = services.find(s => s.id === parsed.data.serviceId);
  if (!service) {
    return { success: false, error: "Serviço não encontrado." };
  }

  const bookingDateTime = new Date(parsed.data.date);
  const [hours, minutes] = parsed.data.time.split(':').map(Number);
  bookingDateTime.setHours(hours, minutes, 0, 0);

  const newAppointment = {
    customerName: parsed.data.name,
    customerPhone: parsed.data.phone,
    serviceId: parsed.data.serviceId,
    serviceName: service.name,
    startTime: bookingDateTime.toISOString(),
    // customerId will be useful when users can create accounts
    // customerId: parsed.data.customerId || null, 
  };
  
  try {
    // This function is non-blocking, but we can await it on the server
    await addDoc(appointmentsCollection, newAppointment);
    
    console.log("--- Novo Agendamento Salvo no Firestore ---");
    console.log("Cliente:", parsed.data.name);
    console.log("Serviço:", service?.name);
    console.log("Data e Hora:", bookingDateTime.toLocaleString('pt-BR'));
    console.log("---------------------------------------");

    return { success: true, appointment: newAppointment };

  } catch (error) {
    console.error("Error saving appointment to Firestore:", error);
    return { success: false, error: "Não foi possível salvar o agendamento no banco de dados." };
  }
}

// Re-exporting addDoc from firebase/firestore to use it here.
// In a real app, you might have a central place for db functions.
import { addDoc } from 'firebase/firestore';
