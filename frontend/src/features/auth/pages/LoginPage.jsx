"use client";

import { ShieldCheck } from "lucide-react";
import { LoginForm } from "../components";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to HireQuest HR
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to manage assessments, candidate pipelines & hiring rounds
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
