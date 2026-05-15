/**
 * Configuración del Store de Redux
 * Basado en el documento de especificaciones técnicas
 */

import { configureStore } from "@reduxjs/toolkit";
import { citasApi } from "../services/citasApi";
import { terapiasApi } from "../services/terapiasApi";
import { medicosApi } from "../services/medicosApi";
import { usersApi } from "../services/usersApi";

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [citasApi.reducerPath]: citasApi.reducer,
    [terapiasApi.reducerPath]: terapiasApi.reducer,
    [medicosApi.reducerPath]: medicosApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(citasApi.middleware)
      .concat(terapiasApi.middleware)
      .concat(medicosApi.middleware)
      .concat(usersApi.middleware),
});

export default store;
