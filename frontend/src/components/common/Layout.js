import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(220, 38, 38, 0.05) 100%)',
        pointerEvents: 'none',
      }
    }}>
      <Container 
        maxWidth={isMobile ? "sm" : isTablet ? "md" : "lg"} 
        sx={{ 
          py: isMobile ? 1.5 : isTablet ? 2.5 : 4, 
          px: isMobile ? 1 : isTablet ? 2 : 3,
          overflow: 'hidden',
          maxWidth: '100% !important',
          position: 'relative',
          zIndex: 1
        }}
        disableGutters={isMobile}
      >
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
