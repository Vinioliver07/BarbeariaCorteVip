
"use server";

import { z } from "zod";
import { services } from "./data";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // This is for local development without the service account key in env.
    // It uses the client-side config, which works for emulators or if ADC are set up.
    initializeApp({ projectId: firebaseConfig.projectId });
  }
}

const db = getFirestore();

const bookingSchema = z.object({
  serviceId: z.string(),
  date: z.date(),
  time: z.string(),
  name: z.string(),
  phone: z.string(),
  customerId: z.string().optional(), 
});

export async function bookAppointment(values: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  const appointmentsCollection = db.collection('appointments');

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
  };
  
  try {
    await appointmentsCollection.add(newAppointment);
    
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
