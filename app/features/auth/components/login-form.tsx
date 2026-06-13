"use client";

import Link from "next/link";
import { AuthLayout } from "./auth-layout";
import { FormButton } from "./form-button";
import { FormInput } from "./form-input";
import { loginAction } from "../actions/login-action";
import { useForm } from "react-hook-form";
import { SignInSchema } from "../schema/auth-schema";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type SignInInput = z.infer<typeof SignInSchema>;
// LoginForm.tsx
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await loginAction(data);
      if (!result.success) {
        const firstError = Object.values(result.errors)[0]?.[0];
        if (firstError) setFormError(firstError);
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={onSubmit} className="space-y-6">
        {formError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <FormInput
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          register={register("email")}
          error={errors.email}
        />

        <FormInput
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          register={register("password")}
          error={errors.password}
        />

        <FormButton isLoading={isLoading} loadingText="Signing in..." submitText="Sign In" />

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
