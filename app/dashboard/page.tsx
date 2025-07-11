"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./loader/page";

interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response.data.user);
      } catch (error) {
        toast.error("Failed to fetch user data");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.data.success) {
        toast.success("Logged out successfully");
      }
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary)]">Dashboard</h1>
          {/* <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[var(--muted)] rounded-lg transition">
            <LogOut className="h-4 w-4" />
            Logout
          </Button> */}
        </div>

        <Card className="p-0 shadow-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
          <CardHeader className="bg-gradient-to-r from-[var(--primary)] from-100% to-[var(--primary)]/80 to-80% rounded-t-2xl px-6 py-4">
            <CardTitle className="text-xl font-bold text-[var(--primary-foreground)]">User Information</CardTitle>
          </CardHeader>
          <CardContent className="py-6 px-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "ADMIN"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
                }`}>
                {user.role}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--primary)]">Name</p>
                <p className="mt-1 text-sm text-[var(--foreground)]">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--primary)]">Email</p>
                <p className="mt-1 text-sm text-[var(--foreground)]">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--primary)]">Account Created</p>
                <p className="mt-1 text-sm text-[var(--foreground)]">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--primary)]">User ID</p>
                <p className="mt-1 text-sm text-[var(--foreground)]">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.role === "ADMIN" && (
          <Card className="mt-6 p-0 shadow-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
            <CardHeader className="bg-gradient-to-r from-[var(--primary)] from-100% to-[var(--primary)]/80 to-80% rounded-t-2xl px-6 py-4">
              <CardTitle className="text-xl font-bold text-[var(--primary-foreground)]">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="py-6 px-6">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => router.push("/auth/register")}
                  className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-bold hover:from-[var(--secondary)] hover:to-[var(--primary)] rounded-lg transition"
                >
                  Register New User
                </Button>
                {/* Add more admin actions here */}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


