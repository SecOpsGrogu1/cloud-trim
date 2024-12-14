import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CostAnalysis {
  total_cost: number;
  daily_costs: { date: string; cost: number }[];
  service_costs: { service: string; cost: number }[];
  trend_percentage: number;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  savings: number;
  category: string;
  automated: boolean;
}

export interface ResourceUtilization {
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  total_memory: number;
  total_storage: number;
}

export const apiService = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Cost analysis endpoints
  getCurrentCosts: async (): Promise<CostAnalysis> => {
    const response = await api.get('/costs/current');
    return response.data;
  },

  getHistoricalCosts: async (days: number): Promise<CostAnalysis> => {
    const response = await api.get(`/costs/historical?days=${days}`);
    return response.data;
  },

  // Optimization endpoints
  async getOptimizationRecommendations(): Promise<OptimizationRecommendation[]> {
    const response = await api.get('/recommendations');
    return response.data;
  },

  getUnderutilizedResources: async () => {
    const response = await api.get('/optimization/underutilized');
    return response.data;
  },

  getSavingsForecast: async () => {
    const response = await api.get('/optimization/forecast');
    return response.data;
  },

  // Resource utilization endpoints
  getResourceUtilization: async (): Promise<ResourceUtilization> => {
    const response = await api.get('/resources/utilization');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService;
