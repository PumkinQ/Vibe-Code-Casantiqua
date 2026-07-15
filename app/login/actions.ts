'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const password = formData.get('password');
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return { error: 'Konfigurasi password admin belum diset di server.' };
  }

  if (password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  } else {
    return { error: 'Password salah. Silakan coba lagi.' };
  }

  // Redirect to /admin on successful authentication
  redirect('/admin');
}
