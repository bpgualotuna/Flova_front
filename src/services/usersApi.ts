/**
 * API de Usuarios
 * Conectado al backend real usando RTK Query
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../types";
import { AUTH_TOKEN_KEY } from "../app/axiosClient";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const usersApi = createApi({
  reducerPath: "usersApi",
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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // Obtener todos los usuarios (Admin)
    getUsers: builder.query<User[], { role?: string } | void>({
      query: (params) => {
        const queryParams = params?.role ? `?role=${params.role}` : "";
        return `/users${queryParams}`;
      },
      transformResponse: (response: any[]) => {
        return response.map((u) => ({
          id: u.id,
          cedula: u.cedula,
          username: u.username || u.cedula,
          fullName: u.fullName,
          email: u.email,
          telefono: u.telefono,
          role: u.role,
          tipoSeguro: u.tipoSeguro,
          tieneSeguro: u.tipoSeguro !== "ninguno",
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          // Campos de médico si aplica
          especialidad: u.medico?.especialidad,
          numeroLicencia: u.medico?.numeroLicencia,
          calificacion: u.medico?.calificacion
            ? parseFloat(u.medico.calificacion)
            : undefined,
          pacientesAtendidos: u.medico?.pacientesAtendidos,
        }));
      },
      providesTags: ["Users"],
    }),

    // Obtener usuario por ID
    getUserById: builder.query<User, number | string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: any) => ({
        id: response.id,
        cedula: response.cedula,
        username: response.username || response.cedula,
        fullName: response.fullName,
        email: response.email,
        telefono: response.telefono,
        role: response.role,
        tipoSeguro: response.tipoSeguro,
        tieneSeguro: response.tipoSeguro !== "ninguno",
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        especialidad: response.medico?.especialidad,
        numeroLicencia: response.medico?.numeroLicencia,
        calificacion: response.medico?.calificacion
          ? parseFloat(response.medico.calificacion)
          : undefined,
        pacientesAtendidos: response.medico?.pacientesAtendidos,
      }),
      providesTags: ["Users"],
    }),

    // Actualizar usuario
    updateUser: builder.mutation<
      User,
      { id: number | string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: {
          ...(data.fullName && { fullName: data.fullName }),
          ...(data.email && { email: data.email }),
          ...(data.telefono && { telefono: data.telefono }),
          ...(data.tipoSeguro && { tipoSeguro: data.tipoSeguro }),
          ...(data.role && { role: data.role }),
          ...(data.password && { password: data.password }),
        },
      }),
      transformResponse: (response: any) => {
        const user = response.user || response;
        return {
          id: user.id,
          cedula: user.cedula,
          username: user.username || user.cedula,
          fullName: user.fullName,
          email: user.email,
          telefono: user.telefono,
          role: user.role,
          tipoSeguro: user.tipoSeguro,
          tieneSeguro: user.tipoSeguro !== "ninguno",
          updatedAt: user.updatedAt,
        };
      },
      invalidatesTags: ["Users"],
    }),

    // Eliminar usuario (Admin)
    deleteUser: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
