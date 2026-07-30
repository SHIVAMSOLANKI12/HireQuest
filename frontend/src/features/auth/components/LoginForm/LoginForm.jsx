"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../context";

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("rohit@hirequest.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="hr@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <span className="text-xs text-primary cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In to Dashboard"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Don&apos;t have an HR account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create Account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
