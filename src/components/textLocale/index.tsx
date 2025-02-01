'use client';

import useTranslation from '@/customHook/useTranslation';

interface TextProps {
  locale: string;
  text: string;
  style?: string;
}

const Text = ({ locale, text, style = '' }: TextProps) => {
  const { t } = useTranslation(locale);
  return (
    <p className={`${locale === 'ar' ? 'text-right' : ''} ${style ? style : ''}`}>{t(text)}</p>
  );
};

export default Text;
