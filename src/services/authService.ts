/**
 * Servicio de Autenticación
 * Conectado al backend real
 */

import axiosClient, { AUTH_TOKEN_KEY } from "../app/axiosClient";
import { LoginCredentials, RegisterData, LoginResult, User } from "../types";

/**
 * Login de usuario
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResult> => {
  try {
    const response = await axiosClient.post("/auth/login", credentials);

    const { token, user, message } = response.data;

    // Guardar token en sessionStorage
    if (token) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    return {
      success: true,
      user,
      token,
      message: message || "Inicio de sesión exitoso",
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error al iniciar sesión";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Registro de nuevo usuario (solo pacientes)
 */
export const register = async (data: RegisterData): Promise<LoginResult> => {
  try {
    // Adaptar datos del frontend al formato del backend
    const backendData = {
      cedula: data.cedula,
      fullName: data.nombresCompletos,
      email: data.email,
      telefono: data.telefono,
      tipoSeguro: data.tipoSeguro,
      password: data.password,
    };

    const response = await axiosClient.post("/auth/register", backendData);

    const { message } = response.data;

    // Después del registro, hacer login automático
    const loginResult = await login({
      cedula: data.cedula,
      password: data.password,
    });

    return {
      success: true,
      user: loginResult.user,
      token: loginResult.token,
      message: message || "Registro exitoso. Bienvenido al sistema.",
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error al registrar usuario";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Obtener información del usuario actual
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return null;
    }

    const response = await axiosClient.get("/auth/me");

    // Adaptar respuesta del backend al formato del frontend
    const backendUser = response.data;
    const user: User = {
      id: backendUser.id,
      cedula: backendUser.cedula,
      username: backendUser.username || backendUser.cedula,
      fullName: backendUser.fullName,
      email: backendUser.email,
      telefono: backendUser.telefono,
      role: backendUser.role,
      tipoSeguro: backendUser.tipoSeguro,
      tieneSeguro: backendUser.tipoSeguro !== "ninguno",
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,

      // Campos de médico si aplica
      especialidad: backendUser.medico?.especialidad,
      numeroLicencia: backendUser.medico?.numeroLicencia,
    };

    return user;
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
};

/**
 * Cerrar sesión
 */
export const logout = async (): Promise<void> => {
  try {
    // Llamar al endpoint de logout del backend
    await axiosClient.post("/auth/logout");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    // Siempre eliminar el token del almacenamiento local
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * Actualizar perfil de usuario
 */
export const updateProfile = async (
  userId: number | string,
  updates: Partial<User>,
): Promise<User | null> => {
  try {
    // Adaptar datos del frontend al formato del backend
    const backendUpdates: any = {};

    if (updates.fullName) backendUpdates.fullName = updates.fullName;
    if (updates.email) backendUpdates.email = updates.email;
    if (updates.telefono) backendUpdates.telefono = updates.telefono;
    if (updates.tipoSeguro) backendUpdates.tipoSeguro = updates.tipoSeguro;

    const response = await axiosClient.put(`/users/${userId}`, backendUpdates);

    const backendUser = response.data.user;
    const user: User = {
      id: backendUser.id,
      cedula: backendUser.cedula,
      username: backendUser.username || backendUser.cedula,
      fullName: backendUser.fullName,
      email: backendUser.email,
      telefono: backendUser.telefono,
      role: backendUser.role,
      tipoSeguro: backendUser.tipoSeguro,
      tieneSeguro: backendUser.tipoSeguro !== "ninguno",
      updatedAt: backendUser.updatedAt,
    };

    return user;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return null;
  }
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
  updateProfile,
};
