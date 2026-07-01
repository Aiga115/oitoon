import { Suspense } from "react";
import AuthFormTemplate from "@/components/AuthFormTemplate";

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthFormTemplate mode="register" />
    </Suspense>
  );
}
