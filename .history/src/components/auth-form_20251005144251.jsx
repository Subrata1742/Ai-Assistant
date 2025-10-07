"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function AuthForm({ type }) {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (type === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) router.push("/login");
    } else {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!res.error) router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center capitalize">
        {type === "register" ? "Create Account" : "Login"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {type === "register" && (
          <div>
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>
        )}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </div>
        <Button className="w-full mt-4" type="submit">
          {type === "register" ? "Sign Up" : "Login"}
        </Button>
      </form>
    </div>
  );
}
