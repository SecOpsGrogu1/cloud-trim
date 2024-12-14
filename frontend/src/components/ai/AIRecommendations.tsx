import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SavingsIcon from '@mui/icons-material/Savings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiService, { OptimizationRecommendation } from '../../services/api';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  savings: number;
  category: string;
  automated: boolean;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getOptimizationRecommendations();
        setRecommendations(data);
      } catch (err) {
        setError('Failed to fetch recommendations');
        console.error('Recommendations fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SmartToyIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6">AI-Powered Recommendations</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Our AI has analyzed your cloud infrastructure and identified these optimization opportunities:
        </Typography>
        
        {recommendations.map((rec) => (
          <Box key={rec.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <AutoFixHighIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                    {rec.title}
                  </Typography>
                  {rec.automated && (
                    <Tooltip title="Can be automated">
                      <IconButton size="small" color="primary">
                        <SmartToyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {rec.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={`Impact: ${rec.impact}`}
                    size="small"
                    color={getImpactColor(rec.impact) as any}
                  />
                  <Chip
                    icon={<SavingsIcon />}
                    label={formatCurrency(rec.savings)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={rec.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={rec.automated ? <SmartToyIcon /> : <CheckCircleIcon />}
                  color="primary"
                >
                  {rec.automated ? 'Auto-Apply' : 'Apply'}
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}

        {recommendations.length === 0 && (
          <Typography align="center" color="text.secondary">
            No recommendations found at this time.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
