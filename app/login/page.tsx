"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // This checks the hidden Supabase Auth table for the password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid login credentials. Please check your email and password.");
      setLoading(false);
    } else {
      // Success! Middleware will now allow access to /dashboard
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">HSI Payroll</h1>
          <p className="text-sm text-zinc-500 font-medium">Internal Administration Portal</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="admin@hsi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-50 h-12 focus:ring-blue-600"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-[10px] text-blue-500 hover:text-blue-400 font-bold uppercase tracking-tighter">Forgot?</button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-50 h-12 focus:ring-blue-600"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 text-center font-medium">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-sm font-bold transition-all shadow-lg shadow-blue-600/20" 
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Access"}
            </Button>
          </form>
        </div>
        
        <p className="text-center text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em]">
          Secured by Supabase Auth & Row Level Security
        </p>
      </div>
    </div>
  );
}