/**
 * Página de Calendario
 * Paso 1: Selección de fecha y hora
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useGetHorariosDisponiblesQuery } from '../../services/citasApi';
import { ROUTES } from '../../app/router';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHora, setSelectedHora] = useState<string>('');
  const [selectedMedicoId, setSelectedMedicoId] = useState<number | string | null>(null);

  // Obtener terapia seleccionada
  const terapiaStr = sessionStorage.getItem('selectedTerapia');
  const terapia = terapiaStr ? JSON.parse(terapiaStr) : null;

  // Generar próximos 7 días
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = generateDates();
  const { data: horarios = [], isLoading } = useGetHorariosDisponiblesQuery(
    { terapiaId: terapia?.id || 0, fecha: selectedDate || dates[0] },
    { skip: !terapia }
  );

  const handleContinue = () => {
    if (!selectedDate || !selectedHora || !selectedMedicoId) {
      return;
    }

    // Guardar selección en sessionStorage
    sessionStorage.setItem('appointmentData', JSON.stringify({
      terapiaId: terapia.id,
      fecha: selectedDate,
      hora: selectedHora,
      medicoId: selectedMedicoId,
    }));

    navigate(ROUTES.FORMULARIO_CITA);
  };

  if (!terapia) {
    return (
      <Box>
        <Alert severity="error">
          No se ha seleccionado una terapia. Por favor, selecciona una terapia primero.
        </Alert>
        <Button onClick={() => navigate(ROUTES.TERAPIAS)} sx={{ mt: 2 }}>
          Volver a Terapias
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.TERAPIAS)}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Selecciona Fecha y Hora
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Terapia: <strong>{terapia.nombre}</strong>
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Selección de fecha */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                1. Selecciona una Fecha
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {dates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  
                  return (
                    <Grid item xs={6} sm={4} key={date}>
                      <Button
                        fullWidth
                        variant={isSelected ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedHora('');
                          setSelectedMedicoId(null);
                        }}
                        sx={{ py: 2, flexDirection: 'column' }}
                      >
                        <Typography variant="caption">
                          {dateObj.toLocaleDateString('es-ES', { weekday: 'short' })}
                        </Typography>
                        <Typography variant="h6">
                          {dateObj.getDate()}
                        </Typography>
                        <Typography variant="caption">
                          {dateObj.toLocaleDateString('es-ES', { month: 'short' })}
                        </Typography>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Selección de hora */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                2. Selecciona una Hora
              </Typography>
              
              {!selectedDate ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Primero selecciona una fecha
                </Alert>
              ) : isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : horarios.length === 0 ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No hay horarios disponibles para esta fecha
                </Alert>
              ) : (
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {horarios.map((horario) => {
                    const isSelected = selectedHora === horario.hora && selectedMedicoId === horario.medicoId;
                    
                    return (
                      <Grid item xs={6} sm={4} key={`${horario.hora}-${horario.medicoId}`}>
                        <Button
                          fullWidth
                          variant={isSelected ? 'contained' : 'outlined'}
                          onClick={() => {
                            setSelectedHora(horario.hora);
                            setSelectedMedicoId(horario.medicoId);
                          }}
                          disabled={!horario.disponible}
                          sx={{ py: 1.5 }}
                        >
                          {horario.hora}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumen y botón continuar */}
      {selectedDate && selectedHora && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Resumen de tu Selección
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Chip label={`Fecha: ${new Date(selectedDate).toLocaleDateString('es-ES')}`} color="primary" />
              <Chip label={`Hora: ${selectedHora}`} color="primary" />
            </Box>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinue}
              sx={{ mt: 3 }}
            >
              Continuar al Formulario
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
