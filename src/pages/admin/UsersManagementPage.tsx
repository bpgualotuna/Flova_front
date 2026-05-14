/**
 * Página de Gestión de Usuarios (Admin)
 * Permite visualizar y gestionar usuarios del sistema
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '../../services/usersApi';
import { UserRole, User } from '../../types';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'todos'>('todos');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Obtener usuarios desde el API
  const { data: usuarios = [], isLoading } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'medico':
        return 'primary';
      case 'paciente':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'medico':
        return 'Médico';
      case 'paciente':
        return 'Paciente';
      default:
        return role;
    }
  };

  const handleOpenEditDialog = (user: User) => {
    setEditingUser(user);
    reset({
      fullName: user.fullName,
      email: user.email,
      telefono: user.telefono,
      tipoSeguro: user.tipoSeguro,
      role: user.role,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUser(null);
    reset();
  };

  const onSubmitEdit = async (data: any) => {
    if (!editingUser) return;

    try {
      await updateUser({
        id: editingUser.id,
        data: {
          fullName: data.fullName,
          email: data.email,
          telefono: data.telefono,
          tipoSeguro: data.tipoSeguro,
          role: data.role,
        },
      }).unwrap();
      await Swal.fire('Actualizado', 'El usuario ha sido actualizado exitosamente', 'success');
      handleCloseEditDialog();
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      await Swal.fire('Error', error.data?.error || 'No se pudo actualizar el usuario', 'error');
    }
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${user.fullName}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id).unwrap();
        await Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      } catch (error: any) {
        console.error('Error al eliminar usuario:', error);
        await Swal.fire('Error', error.data?.error || 'No se pudo eliminar el usuario', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {params.row.fullName.charAt(0).toUpperCase()}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'fullName',
      headerName: 'Nombre Completo',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'cedula',
      headerName: 'Cédula',
      width: 130,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={getRoleLabel(params.value)}
          color={getRoleColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 'N/A'}</Typography>
        </Box>
      ),
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 'N/A'}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra todos los usuarios del sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          size="large"
        >
          Nuevo Usuario
        </Button>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {usuarios.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Usuarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {usuarios.filter((u) => u.role === 'paciente').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pacientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {usuarios.filter((u) => u.role === 'medico').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Médicos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {usuarios.filter((u) => u.role === 'admin').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administradores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, cédula o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Filtrar por Rol"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'todos')}
              >
                <MenuItem value="todos">Todos los roles</MenuItem>
                <MenuItem value="paciente">Pacientes</MenuItem>
                <MenuItem value="medico">Médicos</MenuItem>
                <MenuItem value="admin">Administradores</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent>
          <DataGrid
            rows={usuariosFiltrados}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog para editar usuario */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmitEdit)}>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  {...register('fullName', { required: 'El nombre es requerido' })}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message as string}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message as string}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  {...register('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message as string}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="tipoSeguro"
                  control={control}
                  defaultValue="ninguno"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      select
                      label="Tipo de Seguro"
                      {...field}
                    >
                      <MenuItem value="ninguno">Ninguno</MenuItem>
                      <MenuItem value="iess">IESS</MenuItem>
                      <MenuItem value="issfa">ISSFA</MenuItem>
                      <MenuItem value="isspol">ISSPOL</MenuItem>
                      <MenuItem value="privado">Privado</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="role"
                  control={control}
                  defaultValue="paciente"
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      select
                      label="Rol"
                      {...field}
                    >
                      <MenuItem value="paciente">Paciente</MenuItem>
                      <MenuItem value="medico">Médico</MenuItem>
                      <MenuItem value="admin">Administrador</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Actualizar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
