'use server';
import Header from '@/components/header';
import LoginForm from '@/components/login/loginForm';
import { headers } from 'next/headers';

export default async function LoginPage() {
  const locale = (await headers()).get('locale') || 'fr';

  return (
    <div>
      <Header locale={locale} />
      <div className="flex h-screen w-screen items-center justify-center">
        <LoginForm locale={locale} />
      </div>
    </div>
  );
}
