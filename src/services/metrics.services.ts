interface SystemMetrics {
  memory: {
    heapUsed: string;
    heapTotal: string;
    rss: string;
  };
  cpu: {
    user: number;
    system: number;
  };
  uptime: number;
  timestamp: string;
}

interface RequestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: string;
  failureRate: string;
  requestsByEndpoint: Array<{
    endpoint: string;
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: string;
    successRate: string;
  }>;
  totalDbQueries: {
    totalQueries: number;
    averageQueryTime: string;
    totalQueryTime: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const fetchSystemMetrics = async (): Promise<SystemMetrics> => {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  const data = await response.json();
  return data.data;
};

export const fetchRequestMetrics = async (): Promise<RequestMetrics> => {
  const response = await fetch(`${API_BASE_URL}/metrics/requests`);
  const data = await response.json();
  return data.data;
};

export const fetchAllMetrics = async (): Promise<{
  systemMetrics: SystemMetrics;
  requestMetrics: RequestMetrics;
}> => {
  try {
    const [systemMetrics, requestMetrics] = await Promise.all([
      fetchSystemMetrics(),
      fetchRequestMetrics(),
    ]);

    return {
      systemMetrics,
      requestMetrics,
    };
  } catch (error) {
    console.log('Erreur lors de la récupération des métriques:', error);
    throw error;
  }
};

export type { SystemMetrics, RequestMetrics };
