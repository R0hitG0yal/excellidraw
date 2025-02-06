"use client";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

export function AuthPage({ isSignin }: { isSignin?: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-2 m-2 bg-white rounded">
        <Input type="text" placeholder="Email"></Input>
        <Input type="password" placeholder="Password"></Input>
        <Button
          onClick={() => {
            console.log("Button Clicked");
          }}
        >
          {isSignin ? "Signin" : "Signup"}
        </Button>
      </div>
    </div>
  );
}
