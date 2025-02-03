'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage && localStorage.getItem('token')) {
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
      <input type="text" name="email" placeholder="Adresse mail" />
      <input type="password" name="password" placeholder="Mot de passe" />
      <button type="submit">Se connecter</button>
    </form>
  );
}
