
"use server";

import { z } from "zod";
import { services } from "./data";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase Admin SDK
// This ensures that initialization only happens once.
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Production: Use the service account key from environment variables
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Development: Fallback to client-side config for emulators or ADC
      // This is less secure for production but useful for local dev.
      console.warn("Initializing Firebase Admin with client-side config. This is intended for local development only.");
      initializeApp({ projectId: firebaseConfig.projectId });
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
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
    const docRef = await appointmentsCollection.add(newAppointment);
    
    console.log(`--- New Appointment Saved (ID: ${docRef.id}) ---`);
    console.log("Client:", parsed.data.name);
    console.log("Service:", service?.name);
    console.log("DateTime:", bookingDateTime.toISOString());
    console.log("---------------------------------------");

    return { success: true, appointment: newAppointment };

  } catch (error) {
    console.error("Error saving appointment to Firestore:", error);
    // Provide a more generic error to the client for security.
    return { success: false, error: "Não foi possível salvar o agendamento no banco de dados." };
  }
}
