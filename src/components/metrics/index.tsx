'use client';

import useTranslation from '@/customHook/useTranslation';
import {
  fetchAllMetrics,
  type RequestMetrics,
  type SystemMetrics,
} from '@/services/metrics.services';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Metrics = ({ locale }: { locale: string }) => {
  const { t } = useTranslation(locale);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [requestMetrics, setRequestMetrics] = useState<RequestMetrics | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage?.getItem('token')) {
      router.push(`/${locale}/login`);
    }
  }, []);

  useEffect(() => {
    const updateMetrics = async () => {
      try {
        const { systemMetrics, requestMetrics } = await fetchAllMetrics();
        setSystemMetrics(systemMetrics);
        setRequestMetrics(requestMetrics);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des métriques:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        {/* Métriques Système */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-bold">{t('metrics.sysmet')}</h2>
          {systemMetrics && (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold">{t('metrics.memory')}</h3>
                <p>
                  {t('metrics.usedHeap')}: {systemMetrics.memory.heapUsed}
                </p>
                <p>
                  {t('metrics.totalHeap')}: {systemMetrics.memory.heapTotal}
                </p>
                <p>
                  {t('metrics.rss')}: {systemMetrics.memory.rss}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">{t('metrics.cpu')}</h3>
                <p>
                  {t('metrics.user')}: {(systemMetrics.cpu.user / 1000000).toFixed(2)}s
                </p>
                <p>
                  {t('metrics.system')}: {(systemMetrics.cpu.system / 1000000).toFixed(2)}s
                </p>
              </div>
              <p className="mt-4">
                {t('metrics.uptime')}: {(systemMetrics.uptime / 3600).toFixed(2)}
                {t('metrics.hours')}
              </p>
            </>
          )}
        </div>

        {/* Métriques des Requêtes */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-bold">Métriques des Requêtes</h2>
          {requestMetrics && (
            <>
              <div className="space-y-2">
                <p>Total Requêtes: {requestMetrics.totalRequests}</p>
                <p>Requêtes Réussies: {requestMetrics.successfulRequests}</p>
                <p>Requêtes Échouées: {requestMetrics.failedRequests}</p>
                <p>Taux de Succès: {requestMetrics.successRate}</p>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Top 5 Endpoints</h3>
                <div className="space-y-2">
                  {requestMetrics.requestsByEndpoint
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5)
                    .map((endpoint, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{endpoint.endpoint}</p>
                        <p className="text-gray-600">
                          Total: {endpoint.total} | Temps moyen: {endpoint.averageResponseTime}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">Requêtes Base de Données</h3>
                <p>Total Requêtes: {requestMetrics.totalDbQueries.totalQueries}</p>
                <p>Temps Moyen: {requestMetrics.totalDbQueries.averageQueryTime}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
