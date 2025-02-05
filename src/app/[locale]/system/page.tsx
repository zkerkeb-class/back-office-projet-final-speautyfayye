'use server';
import Header from '@/components/header';
import Metrics from '@/components/metrics';
import { headers } from 'next/headers';
import React from 'react';

interface SystemPerformance {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage?: string;
}

interface ApiPerformance {
  averageResponseTime: number;
}

const SystemPerformancePage: React.FC = async () => {
  const locale = (await headers()).get('locale') || 'fr';

  return (
    <div>
      <Header locale={locale} />
      <Metrics locale={locale} />
    </div>
  );
};

export default SystemPerformancePage;
