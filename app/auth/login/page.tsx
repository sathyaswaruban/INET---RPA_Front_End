"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      if (response.data.success) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Invalid credentials");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-[var(--background)] to-blue-200 text-[var(--foreground)]">
      {/* Left Image Column - now col-6 */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-[0_0_50%] h-full">
        <img
          src="/images/loginpage/loginpg.jpg"
          alt="Login Illustration"
          className="object-cover rounded-2xl shadow-2xl w-4/5 h-[420px] max-w-xl"
          style={{ minWidth: 0 }}
        />
      </div>
      {/* Login Card Column */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-md w-full space-y-8 bg-[var(--card)] p-10 rounded-2xl shadow-2xl border border-[var(--border)]">
          <div className="flex justify-center">
            <Image
              src="/images/inet/inetlogo.png"
              alt="INET Logo"
              width={200}
              height={200}
              className="rounded mb-4"
            />
          </div>
          <div className="text-center">
            <h6 className="text-3xl md:text-4xl font-extrabold text-[var(--primary)] mb-2">
              Welcome Back
            </h6>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              Sign in to continue to Report Reconciliation
            </p>
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
              <div className="text-red-700">{error}</div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[var(--primary)]"
                >
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full px-4 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm bg-[var(--input)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--primary)]"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full px-4 py-2 border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm bg-[var(--input)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-[var(--secondary)] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-semibold text-[var(--primary-foreground)] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
