"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/app/features/auth/types/auth-schema";
import { registerAction } from "@/app/features/auth/actions/register-action";
import { useState } from "react";
import Link from "next/link";
import type { z } from "zod";

type RegisterInput = z.infer<typeof signUpSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await registerAction(data);

      if (!result.success) {
        const firstError = Object.values(result.errors)[0]?.[0];
        if (firstError) {
          setFormError(firstError);
        }
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Create an account</h1>
          <p className="text-slate-400">Start your hiring flow with a secure login</p>
        </div>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-200">
            Full Name
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="John Doe"
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg focus:outline-none transition-colors ${
              errors.name
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            } text-white placeholder-slate-500`}
          />
          {errors.name && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-200">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg focus:outline-none transition-colors ${
              errors.email
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            } text-white placeholder-slate-500`}
          />
          {errors.email && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-200">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg focus:outline-none transition-colors ${
              errors.password
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            } text-white placeholder-slate-500`}
          />
          {errors.password && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
