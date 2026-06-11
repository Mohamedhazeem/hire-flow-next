import { SignUpForm } from "@/app/features/auth/components/signup-form";

export const metadata = {
  title: "Register",
  description: "Create a new account",
};

export default function RegisterPage() {
  return <SignUpForm />;
}
