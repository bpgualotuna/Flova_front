/**
 * Página de Finanzas (Admin)
 * Muestra estadísticas financieras detalladas del sistema
 */

import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useGetFinanzasStatsQuery } from "../../services/statsApi";

export default function FinanzasPage() {
  const currentDate = new Date();
  const [mes, setMes] = useState(currentDate.getMonth() + 1);
  const [anio, setAnio] = useState(currentDate.getFullYear());

  const { data: finanzasStats, isLoading } = useGetFinanzasStatsQuery({ mes, anio });

  const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const anios = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!finanzasStats) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Error al cargar estadísticas financieras
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Panel de Finanzas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Estadísticas financieras y análisis de ingresos
          </Typography>
        </Box>

        {/* Filtros de fecha */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Mes</InputLabel>
            <Select value={mes} label="Mes" onChange={(e) => setMes(Number(e.target.value))}>
              {meses.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Año</InputLabel>
            <Select value={anio} label="Año" onChange={(e) => setAnio(Number(e.target.value))}>
              {anios.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Tarjetas de resumen financiero */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                  <MoneyIcon sx={{ color: "white" }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="white">
                    ${finanzasStats.resumen.ingresosTotal.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Ingresos Totales
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {finanzasStats.resumen.cantidadCitas.total} citas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                  <CheckCircleIcon sx={{ color: "white" }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="white">
                    ${finanzasStats.resumen.ingresosCompletados.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Ingresos Completados
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {finanzasStats.resumen.cantidadCitas.completadas} citas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                  <ScheduleIcon sx={{ color: "white" }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="white">
                    ${finanzasStats.resumen.ingresosPendientes.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Ingresos Pendientes
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {finanzasStats.resumen.cantidadCitas.pendientes + finanzasStats.resumen.cantidadCitas.confirmadas} citas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 56, height: 56 }}>
                  <CancelIcon sx={{ color: "white" }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="white">
                    ${finanzasStats.resumen.ingresosPerdidos.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Ingresos Perdidos
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {finanzasStats.resumen.cantidadCitas.canceladas} canceladas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ingresos por Terapia */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <HospitalIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Ingresos por Terapia
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell><strong>Terapia</strong></TableCell>
                  <TableCell><strong>Especialidad</strong></TableCell>
                  <TableCell align="center"><strong>Precio</strong></TableCell>
                  <TableCell align="center"><strong>Citas</strong></TableCell>
                  <TableCell align="center"><strong>Completadas</strong></TableCell>
                  <TableCell align="center"><strong>Pendientes</strong></TableCell>
                  <TableCell align="right"><strong>Ingresos Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finanzasStats.porTerapia.map((terapia) => (
                  <TableRow key={terapia.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {terapia.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={terapia.especialidad} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">${terapia.precio.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={terapia.cantidadCitas} size="small" color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={terapia.citasCompletadas} size="small" color="success" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={terapia.citasPendientes} size="small" color="warning" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        ${terapia.ingresosTotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {finanzasStats.porTerapia.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No hay datos de terapias para este período
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Ingresos por Médico */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <PersonIcon color="secondary" />
            <Typography variant="h6" fontWeight="bold">
              Ingresos por Médico
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell><strong>Médico</strong></TableCell>
                  <TableCell><strong>Especialidad</strong></TableCell>
                  <TableCell align="center"><strong>Total Citas</strong></TableCell>
                  <TableCell align="center"><strong>Completadas</strong></TableCell>
                  <TableCell align="right"><strong>Ingresos Generados</strong></TableCell>
                  <TableCell align="center"><strong>Rendimiento</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finanzasStats.porMedico.map((medico) => {
                  const tasaCompletadas = medico.cantidadCitas > 0 
                    ? (medico.citasCompletadas / medico.cantidadCitas) * 100 
                    : 0;
                  
                  return (
                    <TableRow key={medico.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          Dr. {medico.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={medico.especialidad} size="small" variant="outlined" color="secondary" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={medico.cantidadCitas} size="small" color="primary" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={medico.citasCompletadas} size="small" color="success" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          ${medico.ingresosTotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                          {tasaCompletadas >= 80 ? (
                            <TrendingUpIcon color="success" fontSize="small" />
                          ) : (
                            <TrendingDownIcon color="warning" fontSize="small" />
                          )}
                          <Typography variant="body2" fontWeight="600">
                            {tasaCompletadas.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {finanzasStats.porMedico.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No hay datos de médicos para este período
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
