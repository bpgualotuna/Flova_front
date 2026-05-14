/**
 * API de Médicos
 * Conectado al backend real usando RTK Query
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Medico } from "../types";
import { AUTH_TOKEN_KEY } from "../app/axiosClient";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const medicosApi = createApi({
  reducerPath: "medicosApi",
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
  tagTypes: ["Medicos"],
  endpoints: (builder) => ({
    // Obtener todos los médicos
    getMedicos: builder.query<Medico[], void>({
      query: () => "/medicos",
      transformResponse: (response: any[]) => {
        // Adaptar respuesta del backend al formato del frontend
        return response.map((m) => ({
          id: m.id,
          cedula: m.cedula,
          username: m.cedula,
          fullName: m.fullName,
          email: m.email,
          telefono: m.telefono,
          role: "medico" as const,
          especialidad: m.especialidad,
          numeroLicencia: m.numeroLicencia,
          calificacion: m.calificacion ? parseFloat(m.calificacion) : 0,
          pacientesAtendidos: m.pacientesAtendidos || 0,
          horarioAtencion: m.horarioAtencion || [],
          tipoSeguro: "ninguno" as const,
          tieneSeguro: false,
        }));
      },
      providesTags: ["Medicos"],
    }),

    // Obtener médico por ID
    getMedicoById: builder.query<Medico, number | string>({
      query: (id) => `/medicos/${id}`,
      transformResponse: (response: any) => ({
        id: response.id,
        cedula: response.cedula,
        username: response.cedula,
        fullName: response.fullName,
        email: response.email,
        telefono: response.telefono,
        role: "medico" as const,
        especialidad: response.especialidad,
        numeroLicencia: response.numeroLicencia,
        calificacion: response.calificacion
          ? parseFloat(response.calificacion)
          : 0,
        pacientesAtendidos: response.pacientesAtendidos || 0,
        horarioAtencion: response.horarioAtencion || [],
        tipoSeguro: "ninguno" as const,
        tieneSeguro: false,
      }),
      providesTags: ["Medicos"],
    }),

    // Obtener médicos por especialidad
    getMedicosByEspecialidad: builder.query<Medico[], string>({
      query: (especialidad) => `/medicos/especialidad/${especialidad}`,
      transformResponse: (response: any[]) => {
        return response.map((m) => ({
          id: m.id,
          cedula: m.cedula,
          username: m.cedula,
          fullName: m.fullName,
          email: m.email,
          telefono: m.telefono,
          role: "medico" as const,
          especialidad: m.especialidad,
          numeroLicencia: m.numeroLicencia,
          calificacion: m.calificacion ? parseFloat(m.calificacion) : 0,
          pacientesAtendidos: m.pacientesAtendidos || 0,
          horarioAtencion: m.horarioAtencion || [],
          tipoSeguro: "ninguno" as const,
          tieneSeguro: false,
        }));
      },
      providesTags: ["Medicos"],
    }),
  }),
});

export const {
  useGetMedicosQuery,
  useGetMedicoByIdQuery,
  useGetMedicosByEspecialidadQuery,
} = medicosApi;
