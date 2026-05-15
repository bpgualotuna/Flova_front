/**
 * Página de Dashboard
 * Muestra resumen de citas y accesos rápidos
 */

import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  LocalHospital as HospitalIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useGetProximasCitasQuery } from "../../services/citasApi";
import { useGetTerapiasQuery } from "../../services/terapiasApi";
import { useGetAdminStatsQuery } from "../../services/statsApi";
import { Cita } from "../../types";
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Obtener datos solo si es paciente
  const { data: proximasCitas = [], isLoading: loadingCitas } =
    useGetProximasCitasQuery(undefined, { skip: user?.role !== "paciente" });

  const { data: terapias = [] } = useGetTerapiasQuery();

  // Obtener estadísticas de admin
  const { data: adminStats, isLoading: loadingAdminStats } = useGetAdminStatsQuery(undefined, {
    skip: user?.role !== 'admin'
  });

  const handleOpenModal = (cita: Cita) => {
    setSelectedCita(cita);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCita(null);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "success";
      case "pendiente":
        return "warning";
      case "completada":
        return "info";
      case "cancelada":
        return "error";
      default:
        return "default";
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bienvenido, {user?.fullName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.role === "paciente"
            ? "Gestiona tus citas y terapias desde aquí"
            : "Panel de administración del sistema médico"}
        </Typography>
      </Box>

      {/* Estadísticas rápidas */}
      {user?.role === "paciente" && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                  >
                    <CalendarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {proximasCitas.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Próximas Citas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "secondary.main", width: 56, height: 56 }}
                  >
                    <HospitalIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {terapias.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Terapias Disponibles
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "success.main", width: 56, height: 56 }}
                  >
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {
                        proximasCitas.filter((c) => c.estado === "confirmada")
                          .length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confirmadas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "warning.main", width: 56, height: 56 }}
                  >
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {
                        proximasCitas.filter((c) => c.estado === "pendiente")
                          .length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pendientes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Acciones rápidas */}
      {user?.role === "paciente" && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/terapias")}
                  sx={{ py: 1.5 }}
                >
                  Reservar Nueva Cita
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate("/mis-citas")}
                  sx={{ py: 1.5 }}
                >
                  Ver Mis Citas
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<HospitalIcon />}
                  onClick={() => navigate("/terapias")}
                  sx={{ py: 1.5 }}
                >
                  Explorar Terapias
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Próximas citas */}
      {user?.role === "paciente" && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Próximas Citas
            </Typography>

            {loadingCitas ? (
              <Typography variant="body2" color="text.secondary">
                Cargando citas…
              </Typography>
            ) : proximasCitas.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CalendarIcon
                  sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No tienes citas programadas
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/terapias")}
                  sx={{ mt: 2 }}
                >
                  Reservar Cita
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {proximasCitas.map((cita) => (
                  <Grid size={{ xs: 12, md: 6 }} key={cita.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => handleOpenModal(cita)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" fontWeight="600">
                            {cita.terapia?.nombre || "Terapia"}
                          </Typography>
                          <Chip
                            label={cita.estado}
                            color={getEstadoColor(cita.estado)}
                            size="small"
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatFecha(cita.fecha)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="body2">{cita.hora}</Typography>
                        </Box>

                        {cita.medico && (
                          <Typography variant="body2" color="text.secondary">
                            Dr. {cita.medico.fullName}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(cita);
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vista para admin/médico */}
      {user?.role !== "paciente" && (
        <>
          {user?.role === "admin" && adminStats && (
            <>
              {/* Estadísticas principales para Admin */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                          <PeopleIcon sx={{ color: 'white' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            {adminStats.usuarios.total}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Usuarios Registrados
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            +{adminStats.usuarios.nuevosUltimos7Dias} últimos 7 días
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                          <CalendarIcon sx={{ color: 'white' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            {adminStats.citas.total}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Citas Agendadas
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {adminStats.citas.pendientes} pendientes
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                          <MoneyIcon sx={{ color: 'white' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            ${adminStats.finanzas.ingresosEsperados.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Ingresos Esperados
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            ${adminStats.finanzas.ingresosCompletados.toFixed(2)} completados
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                          <MedicalIcon sx={{ color: 'white' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            {adminStats.terapias.activas}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Terapias Activas
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            de {adminStats.terapias.total} totales
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Desglose de usuarios */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Distribución de Usuarios
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="primary" />
                            <Typography variant="body1">Pacientes</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">{adminStats.usuarios.pacientes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MedicalIcon color="secondary" />
                            <Typography variant="body1">Médicos</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">{adminStats.usuarios.medicos}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" />
                            <Typography variant="body1">Administradores</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">{adminStats.usuarios.admins}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Estado de Citas
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ color: '#ff9800' }} />
                            <Typography variant="body1">Pendientes</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">{adminStats.citas.pendientes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: '#4caf50' }} />
                            <Typography variant="body1">Confirmadas</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">{adminStats.citas.confirmadas}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon sx={{ color: '#2196f3' }} />
                            <Typography variant="body1">Completadas</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">{adminStats.citas.completadas}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Acciones rápidas para admin */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Acciones Rápidas
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PeopleIcon />}
                        onClick={() => navigate("/admin/usuarios")}
                        sx={{ py: 1.5 }}
                      >
                        Gestionar Usuarios
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        startIcon={<HospitalIcon />}
                        onClick={() => navigate("/admin/terapias")}
                        sx={{ py: 1.5 }}
                      >
                        Gestionar Terapias
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<MoneyIcon />}
                        onClick={() => navigate("/admin/finanzas")}
                        sx={{ py: 1.5 }}
                      >
                        Ver Finanzas
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CalendarIcon />}
                        onClick={() => navigate("/mis-citas")}
                        sx={{ py: 1.5 }}
                      >
                        Ver Todas las Citas
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Citas recientes */}
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Citas Recientes
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell><strong>Fecha</strong></TableCell>
                          <TableCell><strong>Hora</strong></TableCell>
                          <TableCell><strong>Paciente</strong></TableCell>
                          <TableCell><strong>Médico</strong></TableCell>
                          <TableCell><strong>Terapia</strong></TableCell>
                          <TableCell><strong>Estado</strong></TableCell>
                          <TableCell align="right"><strong>Precio</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {adminStats.citas.recientes.map((cita) => (
                          <TableRow key={cita.id} hover>
                            <TableCell>{new Date(cita.fecha).toLocaleDateString('es-ES')}</TableCell>
                            <TableCell>{cita.hora}</TableCell>
                            <TableCell>{cita.paciente}</TableCell>
                            <TableCell>{cita.medico}</TableCell>
                            <TableCell>{cita.terapia}</TableCell>
                            <TableCell>
                              <Chip
                                label={cita.estado}
                                color={getEstadoColor(cita.estado)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="600" color="primary">
                                ${cita.precio.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </>
          )}

          {user?.role === "medico" && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Panel de Médico
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Gestiona tus citas y pacientes desde aquí
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate("/medico/citas")}
                >
                  Ver Mis Citas
                </Button>
              </CardContent>
            </Card>
          )}

          {loadingAdminStats && user?.role === "admin" && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </>
      )}

      {/* Modal de Detalles de Cita */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Detalles de la Cita
          </Typography>
          <Button
            onClick={handleCloseModal}
            color="inherit"
            sx={{ minWidth: "auto" }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          {selectedCita && (
            <Grid container spacing={3}>
              {/* Información de la Terapia */}
              <Grid size={12}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                  >
                    <HospitalIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {selectedCita.terapia?.nombre || "Terapia"}
                    </Typography>
                    <Chip
                      label={selectedCita.estado}
                      color={getEstadoColor(selectedCita.estado)}
                      size="small"
                    />
                  </Box>
                </Box>
                <Divider />
              </Grid>

              {/* Fecha y Hora */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {formatFecha(selectedCita.fecha)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                  <AccessTimeIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Hora
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedCita.hora}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Información del Médico */}
              {selectedCita.medico && (
                <>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "start", gap: 1.5 }}
                    >
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Médico
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          Dr. {selectedCita.medico.fullName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {selectedCita.medico.telefono && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "start", gap: 1.5 }}
                      >
                        <PhoneIcon color="primary" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Teléfono
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {selectedCita.medico.telefono}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </>
              )}

              {/* Información Médica */}
              <Grid size={12}>
                <Divider />
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                  <DescriptionIcon color="primary" />
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="caption" color="text.secondary">
                      Síntomas
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {selectedCita.sintomas}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
                  <CheckCircleIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Exámenes Médicos
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {selectedCita.tieneExamenes
                        ? "Sí tiene exámenes"
                        : "No tiene exámenes"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Duración y Precio */}
              {selectedCita.terapia && (
                <>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Duración
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedCita.terapia.duracion} minutos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Precio
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        ${selectedCita.terapia.precio.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}

              {/* Notas adicionales */}
              {selectedCita.notas && (
                <>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={12}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Notas del Médico
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {selectedCita.notas}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={() => {
              handleCloseModal();
              navigate("/mis-citas");
            }}
            variant="contained"
          >
            Ver Todas Mis Citas
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
