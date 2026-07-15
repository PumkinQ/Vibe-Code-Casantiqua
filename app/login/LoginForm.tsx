'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form
      action={action}
      className="flex flex-col w-full max-w-sm px-6 py-8 sm:px-10 sm:py-12 bg-white border border-gray-100 rounded-3xl shadow-lg shadow-gray-200/50"
    >
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase text-gray-900 mb-2">
          ADMIN LOGIN
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 tracking-wider font-light">
          Masukkan kata sandi untuk mengakses dashboard
        </p>
      </div>

      {state?.error && (
        <div
          id="login-error-msg"
          className="text-xs sm:text-sm font-medium p-3.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 w-full mb-6"
        >
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-6 w-full mb-8">
        <div className="relative">
          <input
            id="password-input"
            type="password"
            name="password"
            required
            placeholder="Kata sandi"
            disabled={pending}
            className="border-b border-gray-900 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 py-3 w-full text-base sm:text-lg transition-colors duration-300"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          id="submit-button"
          type="submit"
          disabled={pending}
          className="px-8 py-3.5 border border-red-400 hover:border-red-500 rounded-full bg-transparent hover:bg-red-50 text-gray-800 text-xs sm:text-sm font-black tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-98 disabled:opacity-50 cursor-none"
        >
          {pending ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}
        </button>
      </div>
    </form>
  );
}
