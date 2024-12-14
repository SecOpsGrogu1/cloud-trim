import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingDown,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

const recommendationsData = [
  {
    id: 1,
    resourceType: 'EC2 Instance',
    resourceId: 'i-0123456789abcdef0',
    currentConfig: 't3.xlarge',
    recommendedConfig: 't3.large',
    potentialSavings: 45.20,
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 2,
    resourceType: 'RDS Instance',
    resourceId: 'db-0123456789abcdef0',
    currentConfig: 'db.r5.xlarge',
    recommendedConfig: 'db.r5.large',
    potentialSavings: 82.50,
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 3,
    resourceType: 'EC2 Instance',
    resourceId: 'i-0123456789abcdef1',
    currentConfig: 'm5.2xlarge',
    recommendedConfig: 'm5.xlarge',
    potentialSavings: 125.30,
    priority: 'High',
    status: 'In Progress',
  },
];

const Recommendations = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Potential Savings</Typography>
              </Box>
              <Typography variant="h4">$253.00</Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly savings if all recommendations are implemented
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Recommendations</Typography>
              </Box>
              <Typography variant="h4">3</Typography>
              <Typography variant="body2" color="text.secondary">
                Pending optimization actions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Implemented Savings</Typography>
              </Box>
              <Typography variant="h4">$1,250.00</Typography>
              <Typography variant="body2" color="text.secondary">
                Total savings from implemented recommendations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendations Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Optimization Recommendations</Typography>
          <Button variant="contained" color="primary">
            Apply All
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resource Type</TableCell>
                <TableCell>Resource ID</TableCell>
                <TableCell>Current Config</TableCell>
                <TableCell>Recommended Config</TableCell>
                <TableCell>Potential Savings</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recommendationsData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.resourceType}</TableCell>
                  <TableCell>{row.resourceId}</TableCell>
                  <TableCell>{row.currentConfig}</TableCell>
                  <TableCell>{row.recommendedConfig}</TableCell>
                  <TableCell>${row.potentialSavings.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.priority}
                      color={row.priority === 'High' ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Pending' ? 'primary' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                    >
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Recommendations;
