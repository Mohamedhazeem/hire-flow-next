"use client";

import Link from "next/link";
import { AuthLayout } from "./auth-layout";
import { FormButton } from "./form-button";
import { FormInput } from "./form-input";
import { registerAction } from "../actions/register-action";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "../schema/auth-schema";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterInput = z.input<typeof SignUpSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: { role: "JOB_SEEKER" },
  });

  const [selectedRole, setSelectedRole] = useState<"RECRUITER" | "JOB_SEEKER">("JOB_SEEKER");

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await registerAction(data);
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
    <AuthLayout title="Create an account" subtitle="Start your hiring flow with a secure login">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Role tabs */}
        <div className="flex gap-2 bg-slate-700/30 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setSelectedRole("RECRUITER");
              setValue("role", "RECRUITER", { shouldDirty: true, shouldTouch: true });
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedRole === "RECRUITER"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-700/40"
            }`}
          >
            Looking to hire
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole("JOB_SEEKER");
              setValue("role", "JOB_SEEKER", { shouldDirty: true, shouldTouch: true });
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedRole === "JOB_SEEKER"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-700/40"
            }`}
          >
            Looking for job
          </button>
        </div>

        {/* hidden role input registered with RHF */}
        <input type="hidden" {...register("role")} />
        {formError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <FormInput
          label="Full Name"
          id="name"
          type="text"
          placeholder="John Doe"
          register={register("name")}
          error={errors.name}
        />

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

        <FormButton isLoading={isLoading} loadingText="Creating account..." submitText="Sign Up" />

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
    </AuthLayout>
  );
}
