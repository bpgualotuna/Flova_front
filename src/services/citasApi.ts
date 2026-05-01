import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cita, AppointmentFormData, HorarioDisponible } from '../types';
import { mockCitas, mockHorariosDisponibles } from './mocks/citasMock';
import { validarCreacionCita, formatearErroresCita, validarCancelacion } from '../utils/citasValidations';

export const citasApi = createApi({
  reducerPath: 'citasApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Citas'],
  endpoints: (builder) => ({
    // Obtener todas las citas del paciente
    getCitasPaciente: builder.query<Cita[], number | string>({
      queryFn: async (pacienteId) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const citas = mockCitas.filter(c => c.pacienteId === pacienteId);
        return { data: citas };
      },
      providesTags: ['Citas'],
    }),
    
    // Obtener próximas citas del paciente
    getProximasCitas: builder.query<Cita[], number | string>({
      queryFn: async (pacienteId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const ahora = new Date();
        const citas = mockCitas
          .filter(c => c.pacienteId === pacienteId)
          .filter(c => new Date(c.fecha) >= ahora)
          .filter(c => c.estado !== 'cancelada')
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(0, 5);
        
        return { data: citas };
      },
      providesTags: ['Citas'],
    }),
    
    // Obtener horarios disponibles
    getHorariosDisponibles: builder.query<HorarioDisponible[], { terapiaId: number | string; fecha: string }>({
      queryFn: async ({ fecha }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const horarios = mockHorariosDisponibles.filter(
          h => h.fecha === fecha && h.disponible
        );
        
        return { data: horarios };
      },
    }),
    
    // Crear nueva cita
    createCita: builder.mutation<Cita, { pacienteId: number | string; data: AppointmentFormData }>({
      queryFn: async ({ pacienteId, data }) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Validar reglas de negocio
        const validacion = validarCreacionCita(pacienteId, data.fecha, data.hora, mockCitas);
        
        if (!validacion.valid) {
          return { 
            error: { 
              status: 400, 
              data: formatearErroresCita(validacion.errors) 
            } 
          };
        }
        
        const nuevaCita: Cita = {
          id: Date.now(),
          pacienteId,
          medicoId: data.medicoId,
          terapiaId: data.terapiaId,
          fecha: data.fecha,
          hora: data.hora,
          estado: 'pendiente',
          sintomas: data.sintomas,
          tieneExamenes: data.tieneExamenes,
          examenes: data.tieneExamenes ? [] : undefined,
          createdAt: new Date().toISOString(),
        };
        
        mockCitas.push(nuevaCita);
        
        return { data: nuevaCita };
      },
      invalidatesTags: ['Citas'],
    }),
    
    // Cancelar cita
    cancelarCita: builder.mutation<Cita, { citaId: number | string; motivo: string }>({
      queryFn: async ({ citaId, motivo }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const cita = mockCitas.find(c => c.id === citaId);
        if (!cita) {
          return { error: { status: 404, data: 'Cita no encontrada' } };
        }
        
        // Validar que se pueda cancelar (24 horas de anticipación)
        const validacion = validarCancelacion(cita.fecha, cita.hora);
        if (!validacion.valid) {
          return { 
            error: { 
              status: 400, 
              data: validacion.message || 'No se puede cancelar la cita' 
            } 
          };
        }
        
        cita.estado = 'cancelada';
        cita.motivoCancelacion = motivo;
        cita.updatedAt = new Date().toISOString();
        
        return { data: cita };
      },
      invalidatesTags: ['Citas'],
    }),
  }),
});

export const {
  useGetCitasPacienteQuery,
  useGetProximasCitasQuery,
  useGetHorariosDisponiblesQuery,
  useCreateCitaMutation,
  useCancelarCitaMutation,
} = citasApi;
