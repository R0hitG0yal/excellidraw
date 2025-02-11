import React from "react";
import { AuthPage } from "@/components/AuthPage";
// import { Button } from "@repo/ui/button";

export default function SignIn() {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     // Handle sign in logic here
  //   };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthPage isSignin={true}></AuthPage>
    </div>
  );
}
