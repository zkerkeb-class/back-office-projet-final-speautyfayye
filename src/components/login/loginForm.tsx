'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Text from '../textLocale';

export default function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();

  useEffect(() => {
    if (window && localStorage && localStorage.getItem('token')) {
      router.push(`/${locale}/dashboard`);
    }
  }, []);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      window.location.href = `/${locale}/dashboard`;
    }
  };

  return (
    <form className="flex flex-col items-center justify-center gap-2" onSubmit={login}>
      <div className="flex">
        <Text locale={locale} text="login.email" style="pr-2" />
        <input type="text" name="email" placeholder="Adresse mail" />
      </div>
      <div className="flex">
        <Text locale={locale} text="login.password" style="pr-2" />
        <input type="password" name="password" placeholder="Mot de passe" />
      </div>
      <button type="submit">
        <Text locale={locale} text="login.submit" />
      </button>
    </form>
  );
}
