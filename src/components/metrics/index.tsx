'use client';

import React, { useEffect, useState } from 'react';

interface SystemPerformance {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: string;
}

interface ApiPerformance {
  averageResponseTime: number;
}

const Metrics: React.FC = () => {
  const [performance, setPerformance] = useState<SystemPerformance>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: '5To',
  });

  const [apiPerformance, setApiPerformance] = useState<ApiPerformance>({
    averageResponseTime: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fetching system performance data
      const cpuUsage = Math.random() * 100;
      const memoryUsage = Math.random() * 100;
      const averageResponseTime = Math.random() * 250;

      setPerformance({ cpuUsage, memoryUsage, diskUsage: '5To' });
      setApiPerformance({ averageResponseTime });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>System Performance</h2>

      <p>CPU Usage: {performance.cpuUsage.toFixed(2)}%</p>
      <p>Memory Usage: {performance.memoryUsage.toFixed(2)}%</p>
      <p>Disk Usage: {performance.diskUsage}</p>
      <h2>API Performance</h2>
      <p>Average Response Time: {apiPerformance.averageResponseTime.toFixed(2)}ms</p>
    </div>
  );
};

export default Metrics;
