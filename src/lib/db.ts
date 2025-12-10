import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'barbers.json');

export interface Barber {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  startTime: string;
  createdAt: string;
}

interface Database {
  barbers: Barber[];
  appointments: Appointment[];
}

// Garante que o arquivo existe
function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ barbers: [], appointments: [] }, null, 2));
  }
}

// Ler banco de dados
export function readDb(): Database {
  ensureDbFile();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Escrever banco de dados
export function writeDb(data: Database) {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Buscar barbeiro por email
export function getBarberByEmail(email: string): Barber | null {
  const db = readDb();
  return db.barbers.find(b => b.email === email) || null;
}

// Adicionar barbeiro
export function addBarber(barber: Omit<Barber, 'id' | 'createdAt'>): Barber {
  const db = readDb();
  const newBarber: Barber = {
    ...barber,
    id: barber.email,
    createdAt: new Date().toISOString(),
  };
  db.barbers.push(newBarber);
  writeDb(db);
  return newBarber;
}

// Buscar appointments
export function getAppointments(): Appointment[] {
  const db = readDb();
  return db.appointments;
}

// Adicionar appointment
export function addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
  const db = readDb();
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(newAppointment);
  writeDb(db);
  return newAppointment;
}
