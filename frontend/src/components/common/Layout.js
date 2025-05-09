import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 2 : 4, 
          px: isMobile ? 1 : 3,
          overflow: 'hidden' 
        }}
        disableGutters={isMobile}
      >
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
