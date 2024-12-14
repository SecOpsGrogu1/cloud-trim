import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
} from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* AWS Credentials */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AWS Credentials
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="AWS Access Key ID"
                  variant="outlined"
                  margin="normal"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="AWS Secret Access Key"
                  variant="outlined"
                  margin="normal"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="AWS Region"
                  variant="outlined"
                  margin="normal"
                  defaultValue="us-east-1"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Update Credentials
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Cost Alerts"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive alerts when costs exceed thresholds
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Resource Usage Alerts"
                />
                <Typography variant="body2" color="text.secondary">
                  Get notified about underutilized resources
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Optimization Recommendations"
                />
                <Typography variant="body2" color="text.secondary">
                  Receive weekly optimization suggestions
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Cost Thresholds */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cost Thresholds
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Set thresholds for cost alerts. You'll be notified when costs exceed these values.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Daily Cost Threshold ($)"
                  variant="outlined"
                  type="number"
                  defaultValue={100}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Cost Threshold ($)"
                  variant="outlined"
                  type="number"
                  defaultValue={3000}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Save Thresholds
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
