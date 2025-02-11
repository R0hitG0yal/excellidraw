import React from "react";
import { AuthPage } from "@/components/AuthPage";
export default function SignUp() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthPage isSignin={false}></AuthPage>
    </div>
  );
}
