/**
 * API de Estadísticas
 * Conectado al backend real usando RTK Query
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_TOKEN_KEY } from "../app/axiosClient";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface AdminStats {
  usuarios: {
    total: number;
    pacientes: number;
    medicos: number;
    admins: number;
    nuevosUltimos7Dias: number;
  };
  citas: {
    total: number;
    pendientes: number;
    confirmadas: number;
    completadas: number;
    canceladas: number;
    recientes: Array<{
      id: number;
      fecha: string;
      hora: string;
      estado: string;
      paciente: string;
      medico: string;
      terapia: string;
      precio: number;
    }>;
  };
  terapias: {
    total: number;
    activas: number;
  };
  finanzas: {
    ingresosEsperados: number;
    ingresosCompletados: number;
    ingresosPendientes: number;
  };
}

export interface FinanzasStats {
  resumen: {
    ingresosCompletados: number;
    ingresosConfirmados: number;
    ingresosPendientes: number;
    ingresosPerdidos: number;
    ingresosTotal: number;
    cantidadCitas: {
      completadas: number;
      confirmadas: number;
      pendientes: number;
      canceladas: number;
      total: number;
    };
  };
  porTerapia: Array<{
    id: number;
    nombre: string;
    especialidad: string;
    precio: number;
    cantidadCitas: number;
    ingresosTotal: number;
    citasCompletadas: number;
    citasPendientes: number;
    citasCanceladas: number;
  }>;
  porMedico: Array<{
    id: number;
    nombre: string;
    especialidad: string;
    cantidadCitas: number;
    ingresosTotal: number;
    citasCompletadas: number;
  }>;
}

export const statsApi = createApi({
  reducerPath: "statsApi",
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
  tagTypes: ["Stats"],
  endpoints: (builder) => ({
    // Obtener estadísticas generales del admin
    getAdminStats: builder.query<AdminStats, void>({
      query: () => "/stats/admin",
      providesTags: ["Stats"],
    }),

    // Obtener estadísticas financieras
    getFinanzasStats: builder.query<
      FinanzasStats,
      { mes?: number; anio?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.mes) queryParams.append("mes", params.mes.toString());
        if (params?.anio) queryParams.append("anio", params.anio.toString());
        const queryString = queryParams.toString();
        return `/stats/finanzas${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetFinanzasStatsQuery } = statsApi;
