import React from 'react';
import { Fab, Box, useMediaQuery, useTheme } from '@mui/material';
import { Add as AddIcon, Speed as SpeedIcon } from '@mui/icons-material';

function FloatingActionButtons({ onAdd, onQuickAction, showQuickAction = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {showQuickAction && (
        <Fab
          color="secondary"
          size="small"
          onClick={onQuickAction}
          sx={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <SpeedIcon />
        </Fab>
      )}
      <Fab
        color="primary"
        onClick={onAdd}
        sx={{
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default FloatingActionButtons;
