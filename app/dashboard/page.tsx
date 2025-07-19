"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./loader/page";
import { set } from "zod";
import '../globals.css';

interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

interface Ebodata {
  data: {
    Active_list: any[];
    TN_Active_list: any[];
    UP_Active_list?: any[];
    current_month_expiry_list?: any[];
    current_month_active_list?: any[];
    last_month_inactive_list?: any[];
  };
  isSuccess: boolean;
  message: string;
  service_name: string;
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10);


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Ebodata | null>(null);
  // const [response, s] = useState<History[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUser(response?.data?.user);
      } catch (error) {
        toast.error("Failed to fetch user data");
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, [router]);


  useEffect(() => {
    const fetchebodata = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getEboData");
        setData(response?.data); // response.data is of type Ebodata
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchebodata();
  }, []);

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

      {user.role === "ADMIN" && (
        <div className="flex justify-between">
          <div className="flex items-start mb-8">
            <h1 className="text-2xl font-bold text-[var(--primary)]">Home Page / Dashboard</h1>
          </div>
          <div className="items-end flex-wrap gap-4">
            <Button
              onClick={() => router.push("/auth/register")}
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-bold hover:from-[var(--secondary)] hover:to-[var(--primary)] rounded-lg transition"
            >
              Register New User
            </Button>
            {/* Add more admin actions here */}
          </div>
        </div>)}
      {user.role === "USER" && (
        <div className="flex items-start mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary)]">Home Page</h1>
        </div>)}
      <div className="min-h-screen p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card className="glass-card hover-glow">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Inet Active User Count</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <p>{data?.data?.Active_list?.length ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Inet TN User Count</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <p>{data?.data?.TN_Active_list?.length ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Inet Other User Count</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <p>{data?.data?.UP_Active_list?.length ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Current Month Expiry User</CardTitle>
            </CardHeader>
            <CardContent className="card-content text-color-red">
              <p>{data?.data?.current_month_expiry_list?.length ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Next Month Active</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <p>{data?.data?.current_month_active_list?.length ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-glow">
            <CardHeader className="card-header">
              <CardTitle className="card-title">Past Month Expired Count</CardTitle>
            </CardHeader>
            <CardContent className="card-content">
              <p>{data?.data?.last_month_inactive_list?.length ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  );
}


