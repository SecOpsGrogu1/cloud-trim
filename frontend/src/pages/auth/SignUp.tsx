import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Up to $10k monthly cloud spend',
      'Basic cost analysis',
      'Up to 3 cloud accounts',
      'Daily cost updates',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$299/month',
    features: [
      'Up to $100k monthly cloud spend',
      'Advanced cost analysis',
      'Unlimited cloud accounts',
      'Real-time cost updates',
      'AI-powered recommendations',
      'Slack integration',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited cloud spend',
      'Custom integration',
      'Dedicated support team',
      'ROI tracking',
      'Custom reporting',
      'Training sessions',
      'SLA guarantee',
    ],
  },
];

const SignUp = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    selectedPlan: 'Free',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === steps.length - 1) {
      // Submit the form
      console.log('Form submitted:', formData);
      navigate('/dashboard');
    } else {
      handleNext();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const steps = ['Account Details', 'Select Plan', 'Confirmation'];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <RadioGroup
              name="selectedPlan"
              value={formData.selectedPlan}
              onChange={handleInputChange}
            >
              <Grid container spacing={3}>
                {plans.map((plan) => (
                  <Grid item xs={12} md={4} key={plan.name}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: formData.selectedPlan === plan.name ? 2 : 1,
                        borderColor: formData.selectedPlan === plan.name ? 'primary.main' : 'grey.300',
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value={plan.name}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="h6" component="div">
                                {plan.name}
                              </Typography>
                              <Typography variant="h4" color="primary" gutterBottom>
                                {plan.price}
                              </Typography>
                              {plan.features.map((feature) => (
                                <Typography
                                  key={feature}
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  ✓ {feature}
                                </Typography>
                              ))}
                            </Box>
                          }
                          sx={{ m: 0, width: '100%' }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Company: {formData.companyName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Email: {formData.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Selected Plan: {formData.selectedPlan}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleSubmit}>
                Complete Sign Up
              </Button>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          CloudTrim
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 500 }} gutterBottom>
          Start Optimizing Your Cloud Costs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          14-day free trial, no credit card required
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            mt: 3,
          }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </Paper>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{' '}
            <Link href="/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
