import { Suspense } from "react";
import AuthFormTemplate from "@/components/AuthFormTemplate";

export default function LoginPage() {
  return (
    <Suspense>
      <AuthFormTemplate mode="login" />
    </Suspense>
  );
}
