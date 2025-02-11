"use client";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { AuthService } from "./AuthService";

export function AuthPage({ isSignin = false }: { isSignin?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await AuthService.handleAuth(isSignin, {
        username: email,
        password,
        ...(!isSignin && { name }),
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An Unexpected error occurred"
      );
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {isSignin ? (
            <LogIn className="w-12 h-12 text-indigo-600" />
          ) : (
            <UserPlus className="w-12 h-12 text-indigo-600" />
          )}{" "}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignin ? "Sign in to your account" : "Create your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignin ? "Or " : "Already have an account? "}
          <Link
            href={isSignin ? "/signup" : "/signin"}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isSignin ? "Create a new account" : "Sign in"}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignin ? null : (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    isRequired={true}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  isRequired={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  isRequired={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSignin ? "Sign In" : "Create Account"}{" "}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
