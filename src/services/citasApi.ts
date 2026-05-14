/**
 * API de Citas
 * Conectado al backend real usando RTK Query
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Cita, AppointmentFormData, HorarioDisponible } from "../types";
import { AUTH_TOKEN_KEY } from "../app/axiosClient";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const citasApi = createApi({
  reducerPath: "citasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Citas"],
  endpoints: (builder) => ({
    // Obtener todas las citas del paciente
    getCitasPaciente: builder.query<Cita[], void>({
      query: () => "/citas",
      transformResponse: (response: any[]) => {
        // Adaptar respuesta del backend al formato del frontend
        return response.map((c) => ({
          id: c.id,
          pacienteId: c.pacienteId,
          medicoId: c.medicoId,
          terapiaId: c.terapiaId,
          fecha: c.fecha,
          hora: c.hora,
          estado: c.estado,
          sintomas: c.sintomas,
          tieneExamenes: c.tieneExamenes,
          examenes: c.examenes || [],
          motivoCancelacion: c.motivoCancelacion,
          notas: c.notasMedico,
          paciente: c.paciente
            ? {
                id: c.paciente.id,
                cedula: c.paciente.cedula,
                username: c.paciente.cedula,
                fullName: c.paciente.fullName,
                email: c.paciente.email,
                telefono: c.paciente.telefono,
                role: c.paciente.role,
                tipoSeguro: c.paciente.tipoSeguro,
                tieneSeguro: c.paciente.tipoSeguro !== "ninguno",
              }
            : undefined,
          medico: c.medico
            ? {
                id: c.medico.id,
                cedula: c.medico.cedula || "",
                username: c.medico.cedula || "",
                fullName: c.medico.fullName,
                email: c.medico.email,
                telefono: c.medico.telefono,
                role: "medico" as const,
                especialidad: c.medico.especialidad,
                numeroLicencia: c.medico.numeroLicencia,
                calificacion: c.medico.calificacion
                  ? parseFloat(c.medico.calificacion)
                  : 0,
                tipoSeguro: "ninguno" as const,
                tieneSeguro: false,
              }
            : undefined,
          terapia: c.terapia
            ? {
                id: c.terapia.id,
                nombre: c.terapia.nombre,
                descripcion: c.terapia.descripcion,
                especialidad: c.terapia.especialidad,
                duracion: c.terapia.duracion,
                precio: parseFloat(c.terapia.precio),
                imagen: c.terapia.imagen,
                activa: c.terapia.activa,
              }
            : undefined,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
      },
      providesTags: ["Citas"],
    }),

    // Obtener próximas citas del paciente
    getProximasCitas: builder.query<Cita[], void>({
      query: () => "/citas?estado=pendiente,confirmada",
      transformResponse: (response: any[]) => {
        // Obtener la fecha de hoy en formato YYYY-MM-DD (hora local)
        // IMPORTANTE: NO usar new Date(fecha) >= new Date() porque el backend
        // devuelve fechas como strings "YYYY-MM-DD" que JavaScript parsea como
        // medianoche UTC, causando que las citas de HOY sean incorrectamente filtradas.
        const hoy = new Date();
        const hoyStr = [
          hoy.getFullYear(),
          String(hoy.getMonth() + 1).padStart(2, "0"),
          String(hoy.getDate()).padStart(2, "0"),
        ].join("-");

        return (
          response
            .map((c) => ({
              id: c.id,
              pacienteId: c.pacienteId,
              medicoId: c.medicoId,
              terapiaId: c.terapiaId,
              fecha: c.fecha,
              hora: c.hora,
              estado: c.estado,
              sintomas: c.sintomas,
              tieneExamenes: c.tieneExamenes,
              examenes: c.examenes || [],
              motivoCancelacion: c.motivoCancelacion,
              notas: c.notasMedico,
              terapia: c.terapia
                ? {
                    id: c.terapia.id,
                    nombre: c.terapia.nombre,
                    descripcion: c.terapia.descripcion,
                    especialidad: c.terapia.especialidad,
                    duracion: c.terapia.duracion,
                    precio: parseFloat(c.terapia.precio),
                    imagen: c.terapia.imagen,
                    activa: c.terapia.activa,
                  }
                : undefined,
              medico: c.medico
                ? {
                    id: c.medico.id,
                    cedula: c.medico.cedula || "",
                    username: c.medico.cedula || "",
                    fullName: c.medico.fullName,
                    email: c.medico.email,
                    role: "medico" as const,
                    especialidad: c.medico.especialidad,
                    numeroLicencia: c.medico.numeroLicencia,
                    tipoSeguro: "ninguno" as const,
                    tieneSeguro: false,
                  }
                : undefined,
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
            }))
            // Comparar strings YYYY-MM-DD directamente: seguro, sin problemas de timezone
            .filter((c) => c.fecha >= hoyStr)
            .sort((a, b) => {
              // Ordenar por fecha y luego por hora
              if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
              return a.hora.localeCompare(b.hora);
            })
            .slice(0, 5)
        );
      },
      providesTags: ["Citas"],
    }),

    // Obtener horarios disponibles
    getHorariosDisponibles: builder.query<
      HorarioDisponible[],
      { medicoId: number | string; fecha: string }
    >({
      query: ({ medicoId, fecha }) =>
        `/citas/horarios-disponibles?medicoId=${medicoId}&fecha=${fecha}`,
      transformResponse: (response: any[]) => {
        return response.map((h) => ({
          fecha: h.fecha,
          hora: h.hora,
          disponible: h.disponible,
          medicoId: h.medicoId,
          medicoNombre: h.medicoNombre,
        }));
      },
      // Deshabilitar caché para siempre obtener horarios actualizados
      keepUnusedDataFor: 0,
    }),

    // Crear nueva cita
    createCita: builder.mutation<Cita, AppointmentFormData>({
      query: (data) => ({
        url: "/citas",
        method: "POST",
        body: {
          medicoId: data.medicoId,
          terapiaId: data.terapiaId,
          fecha: data.fecha,
          hora: data.hora,
          sintomas: data.sintomas,
          tieneExamenes: data.tieneExamenes,
          examenes: data.tieneExamenes ? [] : undefined,
        },
      }),
      transformResponse: (response: any) => {
        const cita = response.cita || response;
        return {
          id: cita.id,
          pacienteId: cita.pacienteId,
          medicoId: cita.medicoId,
          terapiaId: cita.terapiaId,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
          sintomas: cita.sintomas,
          tieneExamenes: cita.tieneExamenes,
          examenes: cita.examenes || [],
          paciente: cita.paciente,
          medico: cita.medico,
          terapia: cita.terapia,
          createdAt: cita.createdAt,
        };
      },
      invalidatesTags: ["Citas"],
    }),

    // Cancelar cita
    cancelarCita: builder.mutation<
      Cita,
      { citaId: number | string; motivo: string }
    >({
      query: ({ citaId, motivo }) => ({
        url: `/citas/${citaId}`,
        method: "DELETE",
        body: { motivo },
      }),
      transformResponse: (response: any) => {
        const cita = response.cita || response;
        return {
          id: cita.id,
          pacienteId: cita.pacienteId,
          medicoId: cita.medicoId,
          terapiaId: cita.terapiaId,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
          sintomas: cita.sintomas,
          tieneExamenes: cita.tieneExamenes,
          examenes: cita.examenes || [],
          motivoCancelacion: cita.motivoCancelacion,
          updatedAt: cita.updatedAt,
        };
      },
      invalidatesTags: ["Citas"],
    }),

    // Actualizar cita (para médicos: confirmar, completar, agregar notas)
    updateCita: builder.mutation<
      Cita,
      { citaId: number | string; estado?: string; notasMedico?: string }
    >({
      query: ({ citaId, estado, notasMedico }) => ({
        url: `/citas/${citaId}`,
        method: "PUT",
        body: {
          ...(estado && { estado }),
          ...(notasMedico !== undefined && { notasMedico }),
        },
      }),
      transformResponse: (response: any) => {
        const cita = response.cita || response;
        return {
          id: cita.id,
          pacienteId: cita.pacienteId,
          medicoId: cita.medicoId,
          terapiaId: cita.terapiaId,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
          sintomas: cita.sintomas,
          tieneExamenes: cita.tieneExamenes,
          examenes: cita.examenes || [],
          notas: cita.notasMedico,
          updatedAt: cita.updatedAt,
        };
      },
      invalidatesTags: ["Citas"],
    }),
  }),
});

export const {
  useGetCitasPacienteQuery,
  useGetProximasCitasQuery,
  useGetHorariosDisponiblesQuery,
  useCreateCitaMutation,
  useCancelarCitaMutation,
  useUpdateCitaMutation,
} = citasApi;
