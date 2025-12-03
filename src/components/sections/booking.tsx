"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, CheckCircle, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { services, type Service } from "@/lib/data";
import { bookAppointment } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

const bookingSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  phone: z.string().min(10, { message: "Por favor, insira um telefone válido." }),
  serviceId: z.string({ required_error: "Por favor, selecione um serviço." }),
  date: z.date({ required_error: "Por favor, selecione uma data." }),
  time: z.string({ required_error: "Por favor, selecione um horário." }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function Booking() {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingFormValues | null>(null);
  const { toast } = useToast();
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    const todayISO = today.toISOString().split('T')[0];
    const nextDayISO = nextDay.toISOString().split('T')[0];

    setBookedSlots(new Set([
      `${todayISO}T14:00:00`,
      `${todayISO}T16:30:00`,
      `${nextDayISO}T10:00:00`,
    ]));
  }, []);
  
  useEffect(() => {
    if (bookingSuccess && lastBooking) {
      const barberPhone = '5511999998888'; // Número do WhatsApp do barbeiro
      const clientName = lastBooking.name;
      const message = `Olá, eu sou ${clientName}, agendei meu horário e estou confirmando que irei.`;
      const whatsappUrl = `https://wa.me/${barberPhone}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
    }
  }, [bookingSuccess, lastBooking]);


  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: ""
    }
  });

  const selectedServiceId = form.watch('serviceId');
  const selectedDate = form.watch('date');

  const generateTimeSlots = (date: Date, service: Service | undefined) => {
    if (!date || !service) return [];
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return []; // Barber doesn't work on Sundays

    const slots: string[] = [];
    const interval = 30; // Generate slots every 30 minutes

    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const potentialTime = new Date(date);
        potentialTime.setHours(hour, minute, 0, 0);

        const slotEndTime = new Date(potentialTime.getTime() + service.duration * 60000);
        const closingTime = new Date(date);
        closingTime.setHours(20, 0, 0, 0);

        if (slotEndTime > closingTime) continue;

        const isoString = potentialTime.toISOString().slice(0, 19);
        
        if (!bookedSlots.has(isoString) && potentialTime > new Date()) {
          slots.push(potentialTime.toTimeString().slice(0, 5));
        }
      }
    }
    return slots;
  };
  
  useEffect(() => {
    const service = services.find(s => s.id === selectedServiceId);
    if (selectedDate && service) {
      const slots = generateTimeSlots(selectedDate, service);
      setAvailableTimes(slots);
      form.resetField('time');
    }
  }, [selectedDate, selectedServiceId, bookedSlots]);


  async function onSubmit(values: BookingFormValues) {
    setIsSubmitting(true);
    setBookingSuccess(false);

    try {
      const result = await bookAppointment(values);
      if (result.success) {
        setLastBooking(values);
        setBookingSuccess(true);
        const bookingDateTime = new Date(values.date);
        const [hours, minutes] = values.time.split(':').map(Number);
        bookingDateTime.setHours(hours, minutes, 0, 0);
        const newSlot = bookingDateTime.toISOString().slice(0, 19);

        setBookedSlots(prev => new Set(prev).add(newSlot));
        form.reset();
        setAvailableTimes([]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao agendar",
          description: result.error || "Não foi possível concluir o agendamento. Tente novamente.",
        });
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Erro inesperado",
          description: "Ocorreu um erro no servidor. Por favor, tente mais tarde.",
        });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (bookingSuccess) {
    return (
      <section id="booking" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[500px]">
           <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
           <h2 className="font-headline text-4xl text-primary mb-4">Agendamento Confirmado!</h2>
           <p className="text-lg text-muted-foreground mb-8 max-w-md">Você será redirecionado para o WhatsApp para confirmar sua presença. Caso não aconteça, <a href={`https://wa.me/5511999998888?text=${encodeURIComponent(`Olá, eu sou ${lastBooking?.name}, agendei meu horário e estou confirmando que irei.`)}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">clique aqui</a>.</p>
           <Button onClick={() => { setBookingSuccess(false); setLastBooking(null); }}>Agendar outro horário</Button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Agende Seu Horário</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Escolha o serviço, o melhor dia e horário para você. É rápido e fácil.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-card shadow-lg">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Seu Nome</FormLabel>
                        <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Seu Telefone</FormLabel>
                        <FormControl><Input type="tel" placeholder="(11) 99999-8888" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <FormField control={form.control} name="serviceId" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Serviço</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Selecione um serviço" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {services.map(service => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} (R$ {service.price.toFixed(2).replace('.', ',')})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-primary">Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")} disabled={!selectedServiceId}>
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) || date.getDay() === 0}
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField control={form.control} name="time" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Horário Disponível</FormLabel>
                      <FormControl>
                        <div className='min-h-[96px]'>
                          {selectedDate && selectedServiceId ? (
                            availableTimes.length > 0 ? (
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {availableTimes.map(time => (
                                  <Button key={time} type="button" variant={field.value === time ? 'default' : 'outline'}
                                    onClick={() => field.onChange(time)} className={cn("font-mono", field.value === time && "bg-primary text-primary-foreground hover:bg-accent")}>
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            ) : (<p className="text-sm text-muted-foreground pt-2">Não há horários disponíveis para esta data. Por favor, selecione outro dia.</p>)
                          ) : (<p className="text-sm text-muted-foreground pt-2">Selecione um serviço e uma data para ver os horários.</p>)}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full bg-primary hover:bg-accent text-primary-foreground font-bold" size="lg">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmar Agendamento
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
