import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | Casantiqua',
  description: 'Log masuk untuk mengelola area administrasi Casantiqua.',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6">
      <LoginForm />
    </main>
  );
}
