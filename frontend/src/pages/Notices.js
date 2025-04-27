import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Container, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getAllNotices, createNotice, updateNotice, deleteNotice, toggleNoticeStatus, reset } from '../features/notices/noticeSlice';

const Notices = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notices, isLoading, isError, isSuccess, message } = useSelector((state) => state.notices);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState({ title: '', content: '', isActive: true });
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getAllNotices());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, user]);

  // Abrir diálogo para crear/editar aviso
  const handleOpenDialog = (notice = null) => {
    if (notice) {
      setCurrentNotice(notice);
      setIsEditing(true);
    } else {
      setCurrentNotice({ title: '', content: '', isActive: true });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentNotice({ title: '', content: '', isActive: true });
    setIsEditing(false);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentNotice({
      ...currentNotice,
      [name]: name === 'isActive' ? checked : value,
    });
  };

  // Guardar aviso (crear o actualizar)
  const handleSaveNotice = () => {
    if (isEditing) {
      dispatch(updateNotice({
        noticeId: currentNotice._id,
        noticeData: currentNotice,
      }));
      toast.success('Aviso actualizado correctamente');
    } else {
      dispatch(createNotice(currentNotice));
      toast.success('Aviso creado correctamente');
    }

    handleCloseDialog();
  };

  // Abrir diálogo de confirmación para eliminar
  const handleOpenDeleteDialog = (id) => {
    setSelectedNoticeId(id);
    setDeleteDialogOpen(true);
  };

  // Cerrar diálogo de confirmación para eliminar
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedNoticeId(null);
  };

  // Eliminar aviso
  const handleDeleteNotice = () => {
    dispatch(deleteNotice(selectedNoticeId));
    toast.success('Aviso eliminado correctamente');
    handleCloseDeleteDialog();
  };

  // Cambiar estado activo/inactivo
  const handleToggleActive = (id) => {
    dispatch(toggleNoticeStatus(id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Administración de Avisos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Aviso
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Contenido</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <TableRow key={notice._id}>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell>{notice.content.length > 50 ? `${notice.content.substring(0, 50)}...` : notice.content}</TableCell>
                    <TableCell>{new Date(notice.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notice.isActive}
                            onChange={() => handleToggleActive(notice._id, notice.isActive)}
                            color="primary"
                          />
                        }
                        label={notice.isActive ? 'Activo' : 'Inactivo'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(notice)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(notice._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay avisos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para crear/editar aviso */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Aviso' : 'Crear Nuevo Aviso'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Título"
            type="text"
            fullWidth
            value={currentNotice.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Contenido"
            multiline
            rows={4}
            fullWidth
            value={currentNotice.content}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={currentNotice.isActive}
                onChange={handleChange}
                name="isActive"
                color="primary"
              />
            }
            label="Activo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveNotice} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este aviso? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteNotice} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notices;
