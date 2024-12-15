import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SavingsIcon from '@mui/icons-material/Savings';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`,
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const features = [
  {
    title: 'AI-Powered Optimization',
    description: 'Our advanced AI algorithms analyze your cloud usage patterns to identify cost-saving opportunities automatically.',
    icon: AutoFixHighIcon,
  },
  {
    title: 'Real-Time Cost Tracking',
    description: 'Monitor your cloud spending in real-time with detailed breakdowns and customizable dashboards.',
    icon: SavingsIcon,
  },
  {
    title: 'Predictive Analytics',
    description: 'Forecast future costs and receive proactive recommendations for resource optimization.',
    icon: TimelineIcon,
  },
  {
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with full compliance for AWS, Azure, and Google Cloud Platform.',
    icon: SecurityIcon,
  },
];

const plans = [
  {
    title: 'Starter',
    price: '$99',
    period: '/month',
    features: [
      'Up to $10k monthly cloud spend',
      'Basic cost analytics',
      'Email support',
      'Single cloud provider',
    ],
    buttonText: 'Start Free Trial',
    highlighted: false,
  },
  {
    title: 'Professional',
    price: '$299',
    period: '/month',
    features: [
      'Up to $50k monthly cloud spend',
      'Advanced cost optimization',
      'Priority support',
      'Multi-cloud support',
    ],
    buttonText: 'Start Free Trial',
    highlighted: true,
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited cloud spend',
      'Custom AI models',
      'Dedicated support',
      'Full platform access',
    ],
    buttonText: 'Contact Sales',
    highlighted: false,
  },
];

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8 }}>
            <GradientText variant="h1" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Optimize Your Cloud Costs with AI
            </GradientText>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              Reduce your cloud spending by up to 30% with our intelligent optimization platform.
              Powered by AI, trusted by enterprises.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 700 }}>
          Why Choose CloudTrim?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <feature.icon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 700 }}>
            Simple, Transparent Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transform: plan.highlighted ? 'scale(1.05)' : 'none',
                    border: plan.highlighted ? `2px solid ${theme.palette.primary.main}` : 'none',
                    boxShadow: plan.highlighted ? theme.shadows[10] : theme.shadows[1],
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      {plan.title}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" component="span" sx={{ fontWeight: 700 }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="subtitle1" component="span" color="text.secondary">
                        {plan.period}
                      </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ mb: 4 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <Typography key={featureIndex} variant="body1">
                          • {feature}
                        </Typography>
                      ))}
                    </Stack>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      onClick={() => navigate('/signup')}
                      sx={{
                        borderRadius: '28px',
                        py: 1.5,
                        textTransform: 'none',
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Ready to Optimize Your Cloud Costs?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of companies saving millions on their cloud infrastructure.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              borderRadius: '28px',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              textTransform: 'none',
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
