import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Tooltip,
  Container,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { SvgIconComponent } from '@mui/icons-material';
import AIRecommendations from '../../components/ai/AIRecommendations';
import apiService, { CostAnalysis, ResourceUtilization } from '../../services/api';

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  description: string;
  icon: SvgIconComponent;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  description, 
  icon: Icon,
  isLoading = false 
}) => (
  <Card sx={{ height: '100%', boxShadow: 2 }}>
    <CardContent sx={{ p: 2 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: '8px',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              <Icon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mt: 0.5 }}>
                {value}
              </Typography>
            </Box>
            <Tooltip title={description} arrow placement="top">
              <IconButton size="small">
                <InfoIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 1
          }}>
            {trend > 0 ? (
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'error.main', fontSize: 18, mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend > 0 ? 'success.main' : 'error.main',
                fontWeight: 500
              }}
            >
              {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        </>
      )}
    </CardContent>
  </Card>
);

interface ResourceUtilizationCardProps {
  title: string;
  value: number;
  total: number;
}

const ResourceUtilizationCard: React.FC<ResourceUtilizationCardProps> = ({ title, value, total }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{title}</Typography>
      <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
        {value} / {total}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(value / total) * 100}
      sx={{ 
        height: 8, 
        borderRadius: 4,
        backgroundColor: 'grey.100',
      }}
    />
  </Box>
);

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [costData, setCostData] = useState<CostAnalysis | null>(null);
  const [utilization, setUtilization] = useState<ResourceUtilization | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [costs, resources] = await Promise.all([
          apiService.getCurrentCosts(),
          apiService.getResourceUtilization(),
        ]);
        setCostData(costs);
        setUtilization(resources);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false} sx={{ mt: 3, mb: 3, pl: 3, pr: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitor and optimize your cloud resources
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Monthly Cost"
              value={costData ? formatCurrency(costData.total_cost) : '$0'}
              trend={costData?.trend_percentage || 0}
              description="Total cloud spending this month"
              icon={AttachMoneyIcon}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Resources"
              value={utilization ? String(utilization.cpu_usage) : '0'}
              trend={5}
              description="Total number of running cloud resources"
              icon={StorageIcon}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Optimization Score"
              value="86%"
              trend={8}
              description="Overall resource optimization rating"
              icon={MemoryIcon}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Savings Found"
              value="$2,845"
              trend={12}
              description="Potential monthly savings identified"
              icon={CloudQueueIcon}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Resource Utilization
                </Typography>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : utilization ? (
                  <>
                    <ResourceUtilizationCard 
                      title="CPU Usage" 
                      value={utilization.cpu_usage} 
                      total={100} 
                    />
                    <ResourceUtilizationCard 
                      title="Memory Usage" 
                      value={utilization.memory_usage} 
                      total={utilization.total_memory} 
                    />
                    <ResourceUtilizationCard 
                      title="Storage Usage" 
                      value={utilization.storage_usage} 
                      total={utilization.total_storage} 
                    />
                  </>
                ) : (
                  <Typography color="error">Failed to load resource utilization data</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <AIRecommendations />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
