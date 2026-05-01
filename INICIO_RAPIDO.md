# 🚀 INICIO RÁPIDO

## ⚡ Ejecutar en 3 Pasos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Ejecutar el Proyecto
```bash
npm run dev
```

### 3. Abrir en el Navegador
```
http://localhost:3000
```

---

## 🔑 Credenciales de Prueba

### Paciente
- **Usuario:** `1234567890`
- **Contraseña:** `password123`

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 📱 Flujo de Prueba Recomendado

### Como Paciente:

1. **Login** con credenciales de paciente
2. **Dashboard** - Ver resumen de citas
3. **Terapias** - Explorar terapias disponibles
4. **Reservar Cita:**
   - Seleccionar una terapia
   - Elegir fecha y hora
   - Completar formulario médico
   - Confirmar cita
5. **Mis Citas** - Ver citas creadas
6. **Perfil** - Ver información personal

---

## 📂 Archivos Importantes

### Documentación
- `README.md` - Documentación completa del proyecto
- `BACKEND_TECHNICAL_SPECIFICATION.md` - Especificaciones del backend
- `RESUMEN_PROYECTO.md` - Resumen ejecutivo
- `ADAPTACION_DOCUMENTO.md` - Cómo se adaptó el documento original

### Configuración
- `package.json` - Dependencias y scripts
- `.env` - Variables de entorno
- `vite.config.ts` - Configuración de Vite

### Código Principal
- `src/App.tsx` - Componente principal
- `src/main.tsx` - Punto de entrada
- `src/app/router.tsx` - Configuración de rutas
- `src/contexts/AuthContext.tsx` - Autenticación

---

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo (puerto 3000)
npm run build        # Compilar para producción
npm run build:check  # Compilar con verificación de tipos
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar linter
```

---

## 🎨 Características Principales

✅ **Autenticación completa** (Login + Registro)  
✅ **Dashboard interactivo** con estadísticas  
✅ **Catálogo de terapias** con imágenes  
✅ **Reserva de citas** en 3 pasos  
✅ **Gestión de citas** (ver, cancelar)  
✅ **Perfil de usuario**  
✅ **Diseño responsive**  
✅ **Datos mock** (sin necesidad de backend)  

---

## 📊 Estructura del Proyecto

```
gestion-citas-medicas/
├── src/
│   ├── app/                 # Configuración (theme, store, router)
│   ├── components/          # Componentes reutilizables
│   ├── contexts/            # Contextos React (Auth)
│   ├── pages/               # Páginas de la aplicación
│   ├── services/            # APIs y servicios mock
│   └── types/               # Tipos TypeScript
├── public/                  # Assets estáticos
├── .env                     # Variables de entorno
├── package.json             # Dependencias
└── README.md                # Documentación completa
```

---

## 🔧 Tecnologías Utilizadas

- **React 19.2.0** + TypeScript
- **Vite 6.3.5** (Build tool)
- **Material-UI 7.3.7** (Componentes UI)
- **Redux Toolkit 2.11.2** (Estado global)
- **React Router DOM 7.13.0** (Navegación)
- **React Hook Form + Zod** (Formularios)
- **Axios** (HTTP client)
- **SweetAlert2** (Notificaciones)

---

## 🎯 Próximos Pasos

### Para Desarrollo
1. Explorar el código en `src/`
2. Revisar componentes en `src/components/`
3. Entender el flujo en `src/pages/`
4. Modificar estilos en `src/app/theme/`

### Para Producción
1. Leer `BACKEND_TECHNICAL_SPECIFICATION.md`
2. Implementar backend según especificaciones
3. Reemplazar servicios mock por APIs reales
4. Configurar variables de entorno de producción
5. Ejecutar `npm run build`

---

## 💡 Tips

### Desarrollo
- Los datos son **mock** (simulados en memoria)
- Las citas se guardan en **sessionStorage**
- Puedes crear múltiples citas de prueba
- El sistema es **completamente funcional** sin backend

### Personalización
- Colores: `src/app/theme/colors.ts`
- Tipografía: `src/app/theme/typography.ts`
- Rutas: `src/app/router.tsx`
- Datos mock: `src/services/mocks/`

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ocupado
Editar `vite.config.ts`:
```typescript
server: {
  port: 3001, // Cambiar puerto
}
```

### Errores de TypeScript
```bash
npm run build:check
```

---

## 📞 Soporte

Para más información, consultar:
- `README.md` - Documentación completa
- `RESUMEN_PROYECTO.md` - Resumen del proyecto
- `BACKEND_TECHNICAL_SPECIFICATION.md` - Especificaciones del backend

---

## 🎓 Frase del Sistema

> **"Lo importante no es poder, lo importante es intentar"**

---

**¡Listo para empezar! 🚀**

```bash
npm install && npm run dev
```
