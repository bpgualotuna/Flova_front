/**
 * API de Terapias
 * Conectado al backend real usando RTK Query
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Terapia } from "../types";
import { AUTH_TOKEN_KEY } from "../app/axiosClient";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const terapiasApi = createApi({
  reducerPath: "terapiasApi",
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
  tagTypes: ["Terapias"],
  endpoints: (builder) => ({
    // Obtener todas las terapias activas
    getTerapias: builder.query<Terapia[], void>({
      query: () => "/terapias",
      transformResponse: (response: any[]) => {
        // Adaptar respuesta del backend al formato del frontend
        return response.map((t) => ({
          id: t.id,
          nombre: t.nombre,
          descripcion: t.descripcion,
          especialidad: t.especialidad,
          duracion: t.duracion,
          precio: parseFloat(t.precio),
          imagen: t.imagen,
          activa: t.activa,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
      },
      providesTags: ["Terapias"],
    }),

    // Obtener terapia por ID
    getTerapiaById: builder.query<Terapia, number | string>({
      query: (id) => `/terapias/${id}`,
      transformResponse: (response: any) => ({
        id: response.id,
        nombre: response.nombre,
        descripcion: response.descripcion,
        especialidad: response.especialidad,
        duracion: response.duracion,
        precio: parseFloat(response.precio),
        imagen: response.imagen,
        activa: response.activa,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }),
      providesTags: ["Terapias"],
    }),

    // Obtener terapias por especialidad
    getTerapiasByEspecialidad: builder.query<Terapia[], string>({
      query: (especialidad) => `/terapias?especialidad=${especialidad}`,
      transformResponse: (response: any[]) => {
        return response.map((t) => ({
          id: t.id,
          nombre: t.nombre,
          descripcion: t.descripcion,
          especialidad: t.especialidad,
          duracion: t.duracion,
          precio: parseFloat(t.precio),
          imagen: t.imagen,
          activa: t.activa,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
      },
      providesTags: ["Terapias"],
    }),

    // Crear terapia (Admin)
    createTerapia: builder.mutation<Terapia, Partial<Terapia>>({
      query: (data) => ({
        url: "/terapias",
        method: "POST",
        body: {
          nombre: data.nombre,
          descripcion: data.descripcion,
          especialidad: data.especialidad,
          duracion: data.duracion,
          precio: data.precio,
          imagen: data.imagen,
        },
      }),
      transformResponse: (response: any) => {
        const terapia = response.terapia || response;
        return {
          id: terapia.id,
          nombre: terapia.nombre,
          descripcion: terapia.descripcion,
          especialidad: terapia.especialidad,
          duracion: terapia.duracion,
          precio: parseFloat(terapia.precio),
          imagen: terapia.imagen,
          activa: terapia.activa,
          createdAt: terapia.createdAt,
          updatedAt: terapia.updatedAt,
        };
      },
      invalidatesTags: ["Terapias"],
    }),

    // Actualizar terapia (Admin)
    updateTerapia: builder.mutation<
      Terapia,
      { id: number | string; data: Partial<Terapia> }
    >({
      query: ({ id, data }) => ({
        url: `/terapias/${id}`,
        method: "PUT",
        body: {
          ...(data.nombre && { nombre: data.nombre }),
          ...(data.descripcion && { descripcion: data.descripcion }),
          ...(data.especialidad && { especialidad: data.especialidad }),
          ...(data.duracion && { duracion: data.duracion }),
          ...(data.precio !== undefined && { precio: data.precio }),
          ...(data.imagen && { imagen: data.imagen }),
          ...(data.activa !== undefined && { activa: data.activa }),
        },
      }),
      transformResponse: (response: any) => {
        const terapia = response.terapia || response;
        return {
          id: terapia.id,
          nombre: terapia.nombre,
          descripcion: terapia.descripcion,
          especialidad: terapia.especialidad,
          duracion: terapia.duracion,
          precio: parseFloat(terapia.precio),
          imagen: terapia.imagen,
          activa: terapia.activa,
          createdAt: terapia.createdAt,
          updatedAt: terapia.updatedAt,
        };
      },
      invalidatesTags: ["Terapias"],
    }),

    // Eliminar terapia (Admin)
    deleteTerapia: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/terapias/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Terapias"],
    }),
  }),
});

export const {
  useGetTerapiasQuery,
  useGetTerapiaByIdQuery,
  useGetTerapiasByEspecialidadQuery,
  useCreateTerapiaMutation,
  useUpdateTerapiaMutation,
  useDeleteTerapiaMutation,
} = terapiasApi;
