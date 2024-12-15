import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Paper,
  Stack,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  CheckCircle,
  TrendingDown,
  Speed,
  Security,
  CloudQueue,
  Analytics,
  AutoAwesome,
} from '@mui/icons-material';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <TrendingDown sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Cost Optimization',
      description: 'Reduce your cloud costs by up to 30% with AI-powered recommendations',
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Monitoring',
      description: 'Monitor resource utilization and costs in real-time',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Automation',
      description: 'Automate resource scaling and optimization based on usage patterns',
    },
  ];

  const pricingTiers = [
    {
      title: 'Free Trial',
      price: '0',
      period: '14 days',
      features: [
        'Basic cost analysis',
        'Resource monitoring',
        'Up to 10 resources',
        'Email support',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'outlined' as const,
    },
    {
      title: 'Professional',
      price: '30',
      period: 'per month',
      features: [
        'Advanced cost optimization',
        'Unlimited resources',
        'Custom alerts',
        'Priority email support',
        'API access',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'contained' as const,
      highlighted: true,
    },
    {
      title: 'Enterprise',
      price: '200',
      period: 'per month',
      features: [
        'Everything in Professional',
        'Custom integration',
        'Dedicated support',
        'Multi-cloud support',
        'Advanced analytics',
        'Custom reporting',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outlined' as const,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 0,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <CloudQueue 
                sx={{ 
                  fontSize: 32,
                  color: 'white',
                  mr: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }} 
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                CloudTrim
              </Typography>
            </Box>

            {/* Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {['Features', 'Pricing', 'About', 'Contact'].map((page) => (
                <Button
                  key={page}
                  sx={{
                    mx: 1,
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
              <Button
                variant="text"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
          color: 'white',
          pt: 12,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Optimize Your Cloud Costs with AI
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: 'grey.100' }}>
                Save up to 30% on your cloud infrastructure costs with our intelligent optimization platform
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Mock Navigation */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28c940' }} />
                </Box>

                {/* Mock Dashboard Content */}
                <Grid container spacing={2}>
                  {/* Cost Summary Cards */}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {[
                        { title: 'Total Cost', value: '$1,234.56', color: 'primary.main' },
                        { title: 'Potential Savings', value: '$432.10', color: 'success.main' },
                        { title: 'Resources', value: '24', color: 'info.main' },
                      ].map((card, index) => (
                        <Grid item xs={4} key={index}>
                          <Paper
                            sx={{
                              p: 1.5,
                              textAlign: 'center',
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {card.title}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ color: card.color, fontWeight: 'bold' }}
                            >
                              {card.value}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Mock Chart */}
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 2,
                        height: 200,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        Cost Trend
                      </Typography>
                      {/* Mock Chart Lines */}
                      {[...Array(8)].map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'absolute',
                            bottom: 20 + Math.random() * 100,
                            left: `${index * 14 + 10}%`,
                            width: '8%',
                            height: Math.random() * 100 + 20,
                            bgcolor: 'primary.main',
                            opacity: 0.7,
                            borderRadius: '4px 4px 0 0',
                          }}
                        />
                      ))}
                    </Paper>
                  </Grid>

                  {/* Mock Resource Table */}
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        Resources
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Cost</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { name: 'web-server-1', type: 'EC2', cost: '$123.45' },
                            { name: 'db-server', type: 'RDS', cost: '$234.56' },
                            { name: 'storage-1', type: 'S3', cost: '$45.67' },
                          ].map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.type}</TableCell>
                              <TableCell align="right">{row.cost}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ mb: 6, fontWeight: 700 }}
          color="primary"
        >
          Why Choose CloudTrim?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6, fontWeight: 700 }}
            color="primary"
          >
            Simple, Transparent Pricing
          </Typography>
          <Grid container spacing={4} alignItems="stretch">
            {pricingTiers.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    ...(tier.highlighted && {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                      borderStyle: 'solid',
                      transform: 'scale(1.05)',
                    }),
                    '&:hover': {
                      transform: tier.highlighted ? 'scale(1.05)' : 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      component="h2"
                      align="center"
                      gutterBottom
                      color={tier.highlighted ? 'primary.main' : 'inherit'}
                      sx={{ fontWeight: 700 }}
                    >
                      {tier.title}
                    </Typography>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h3" component="span">
                        ${tier.price}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        /{tier.period}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <List dense>
                      {tier.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex}>
                          <ListItemIcon>
                            <CheckCircle color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={tier.buttonVariant}
                      color="primary"
                      size="large"
                      onClick={() => navigate('/signup')}
                    >
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Ready to Optimize Your Cloud Costs?
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Join thousands of companies saving money with CloudTrim
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.500', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" gutterBottom>
                CloudTrim
              </Typography>
              <Typography variant="body2">
                AI-powered cloud cost optimization platform helping businesses save money and improve efficiency.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                Email: support@cloudtrim.io
                <br />
                Phone: (555) 123-4567
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Legal
              </Typography>
              <Typography variant="body2">
                Terms of Service
                <br />
                Privacy Policy
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            {new Date().getFullYear()} CloudTrim. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
