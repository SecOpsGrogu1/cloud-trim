import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Timeline,
  Storage,
  AttachMoney,
  TrendingDown,
  Warning,
} from '@mui/icons-material';

interface Resource {
  id: string;
  name: string;
  type: string;
  region: string;
  cost: number;
  metrics: {
    cpu: number;
    memory: number;
  };
}

interface CostData {
  amount: number;
  currency: string;
  service: string;
}

const AWSResourcesDashboard: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [costs, setCosts] = useState<CostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo] = useState(true); // For demonstration purposes

  useEffect(() => {
    // Fetch resources and costs
    Promise.all([
      fetch('http://localhost:8080/api/resources'),
      fetch('http://localhost:8080/api/costs'),
    ])
      .then(async ([resourcesRes, costsRes]) => {
        if (!resourcesRes.ok || !costsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        const resourcesData = await resourcesRes.json();
        const costsData = await costsRes.json();
        setResources(resourcesData);
        setCosts(costsData);
      })
      .catch((err) => {
        setError(err.message);
        // Load demo data if API fails
        setResources([
          {
            id: 'i-123456',
            name: 'web-server-1',
            type: 'EC2',
            region: 'us-west-2',
            cost: 45.20,
            metrics: { cpu: 15, memory: 45 }
          },
          {
            id: 'i-789012',
            name: 'db-server-1',
            type: 'RDS',
            region: 'us-west-2',
            cost: 125.80,
            metrics: { cpu: 65, memory: 78 }
          }
        ]);
        setCosts([
          { amount: 45.20, currency: 'USD', service: 'EC2' },
          { amount: 125.80, currency: 'USD', service: 'RDS' },
          { amount: 25.50, currency: 'USD', service: 'S3' }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalCost = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const potentialSavings = totalCost * 0.3; // Example: 30% potential savings

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !isDemo) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Resources</Typography>
              </Box>
              <Typography variant="h4">{resources.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Monthly Cost</Typography>
              </Box>
              <Typography variant="h4">${totalCost.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Potential Savings</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                ${potentialSavings.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Optimization Alerts</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {resources.filter(r => r.metrics.cpu < 20).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resources Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>CPU Usage</TableCell>
              <TableCell>Memory Usage</TableCell>
              <TableCell>Monthly Cost</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.name}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell>{resource.region}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {resource.metrics.cpu.toFixed(1)}%
                    </Typography>
                    {resource.metrics.cpu < 20 && (
                      <Chip
                        label="Low Usage"
                        size="small"
                        color="warning"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{resource.metrics.memory.toFixed(1)}%</TableCell>
                <TableCell>${resource.cost.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      // Optimization logic would go here
                      console.log('Optimizing resource:', resource.id);
                    }}
                  >
                    Optimize
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cost Breakdown */}
      <Paper sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Cost Breakdown by Service
          </Typography>
          <Grid container spacing={2}>
            {costs.map((cost, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{cost.service}</Typography>
                    <Typography variant="h6">
                      {cost.currency} {cost.amount.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {isDemo && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            * This is example data. The actual dashboard will show your AWS resources and costs once you connect your account.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AWSResourcesDashboard;
