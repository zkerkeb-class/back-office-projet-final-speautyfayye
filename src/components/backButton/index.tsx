'use client';

import useTranslation from '@/customHook/useTranslation';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface BackButtonProps {
  locale: string;
}

const BackButton = ({ locale }: BackButtonProps) => {
  const { t } = useTranslation(locale);
  const router = useRouter();

  return <Button onClick={() => router.back()}>{t('navigation.back')}</Button>;
};

export default BackButton;
