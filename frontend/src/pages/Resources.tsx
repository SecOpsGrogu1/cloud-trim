import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Storage as DatabaseIcon,
} from '@mui/icons-material';

const resourcesData = [
  {
    id: 'i-0123456789abcdef0',
    type: 'EC2 Instance',
    name: 'Production Web Server',
    status: 'Running',
    cost: 125.40,
    region: 'us-east-1',
    utilization: 75,
  },
  {
    id: 'rds-0123456789abcdef0',
    type: 'RDS Instance',
    name: 'Main Database',
    status: 'Running',
    cost: 230.15,
    region: 'us-east-1',
    utilization: 65,
  },
  {
    id: 's3-website-bucket',
    type: 'S3 Bucket',
    name: 'Website Assets',
    status: 'Active',
    cost: 45.20,
    region: 'us-east-1',
    utilization: 40,
  },
];

const Resources = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Resources</Typography>
              </Box>
              <Typography variant="h4">24</Typography>
              <Typography variant="body2" color="text.secondary">
                Across all regions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MemoryIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Resources</Typography>
              </Box>
              <Typography variant="h4">18</Typography>
              <Typography variant="body2" color="text.secondary">
                Currently running
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DatabaseIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Cost</Typography>
              </Box>
              <Typography variant="h4">$401.75</Typography>
              <Typography variant="body2" color="text.secondary">
                Current month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resources Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resource List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resource ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Utilization</TableCell>
                <TableCell>Cost (MTD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resourcesData.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.id}</TableCell>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.region}</TableCell>
                  <TableCell>
                    <Chip
                      label={resource.status}
                      color={resource.status === 'Running' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{resource.utilization}%</TableCell>
                  <TableCell>${resource.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Resources;
