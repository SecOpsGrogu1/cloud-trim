import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  useScrollTrigger,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  transition: 'all 0.3s ease-in-out',
  '&.scrolled': {
    background: alpha(theme.palette.background.default, 0.9),
    backdropFilter: 'blur(10px)',
    boxShadow: theme.shadows[1],
  },
}));

const Logo = styled('img')({
  height: 40,
  marginRight: 8,
});

const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <StyledAppBar position="fixed" className={trigger ? 'scrolled' : ''}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo src="/logo.svg" alt="CloudTrim" />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
              }}
            >
              Start Free Trial
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default LandingHeader;
