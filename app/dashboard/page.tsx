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
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import WelcomePopup from "./popup";

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
    AP_Active_list?: any[];
    last_month_inactive_list?: any[];
  };
  isSuccess: boolean;
  message: string;
  service_name: string;
}

const exportListToExcel = (list: any[], fileName: string) => {
  if (!Array.isArray(list) || list.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Map data to ensure correct column order
  const mappedList = list.map((item) => ({
    UserName: item.UserName || "",
    FirstName: item.FirstName || "",
    VleId: item.VleId || "",
    MobileNo: item.MobileNo || "",
    Email: item.Email || "",
    Expiry_Date: formatDate(item.Expiry_Date),
  }));

  const worksheet = XLSX.utils.json_to_sheet(mappedList);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Ebodata | null>(null);

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
        // const response = await axios.get("http://localhost:5000/api/getEboData");
        const response = await axios.get("http://192.168.1.157:5000/api/getEboData");
        setData(response?.data);
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
    <>
      {/* Pass the user ID to make popup user-specific */}
      {/* <WelcomePopup userId={user.id} /> */}

      <div className="flex flex-col bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8">
        {user.role === "ADMIN" && (
          <div className="flex justify-between">
            <div className="flex items-start mb-8">
              <h1 className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary-foreground)]">Home Page / Dashboard</h1>
            </div>
            <div className="items-end flex-wrap gap-4">
              <Button
                onClick={() => router.push("/auth/register")}
                className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] text-[var(--primary-foreground)] font-bold hover:from-[var(--primary)] hover:to-[var(--secondary)] rounded-lg transition cursor-pointer">
                Register New User
              </Button>
            </div>
          </div>
        )}

        {user.role === "USER" && (
          <div className="flex items-start mb-8">
            <h1 className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary-foreground)]">Home Page / Dashboard</h1>
          </div>
        )}

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card hover-glow cursor-pointer relative">
              <CardHeader className="card-header flex justify-between items-start">
                <CardTitle className="card-title">Inet Active User Count</CardTitle>
              </CardHeader>
              <CardContent className="card-content text-green-600">
                <p>{data?.data?.Active_list?.length ?? 0}</p>
                <button
                  onClick={() => exportListToExcel(data?.data?.Active_list ?? [], "Inet_Active_Users")}
                  className="absolute bottom-2 right-2 bg-white-600 text-green-600 border border-green-600 text-sm px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow cursor-pointer relative">
              <CardHeader className="card-header flex justify-between items-start">
                <CardTitle className="card-title">Inet TN User Count</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <p>{data?.data?.TN_Active_list?.length ?? 0}</p>
                <button
                  onClick={() =>
                    exportListToExcel(
                      data?.data?.TN_Active_list ?? [],
                      `TN_Active_list_${new Date().toISOString().slice(0, 10)}`
                    )
                  }
                  className="absolute bottom-2 right-2 bg-white-600 text-green-600 border border-green-600 text-sm px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow cursor-pointer relative">
              <CardHeader className="card-header flex justify-between items-start">
                <CardTitle className="card-title">Inet UP User Count</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <p>{data?.data?.UP_Active_list?.length ?? 0}</p>
                <button
                  onClick={() => exportListToExcel(data?.data?.UP_Active_list ?? [], `UP_Active_list_${new Date().toISOString().slice(0, 10)}`)}
                  className="absolute bottom-2 right-2 bg-white-600 text-green-600 border border-green-600 text-sm px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow cursor-pointer relative">
              <CardHeader className="card-header flex justify-between items-start">
                <CardTitle className="card-title">Inet AP User Count</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <p>{data?.data?.AP_Active_list?.length ?? 0}</p>
                <button
                  onClick={() => exportListToExcel(data?.data?.AP_Active_list ?? [], `AP_Active_list_${new Date().toISOString().slice(0, 10)}`)}
                  className="absolute bottom-2 right-2 bg-white-600 text-green-600 border border-green-600 text-sm px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow cursor-pointer relative">
              <CardHeader className="card-header rd-card-header flex justify-between items-start">
                <CardTitle className="card-title">Current Month Expiry User</CardTitle>
              </CardHeader>
              <CardContent className="card-content text-red-600">
                <p>{data?.data?.current_month_expiry_list?.length ?? 0}</p>
                <button
                  onClick={() => exportListToExcel(data?.data?.current_month_expiry_list ?? [], `current_month_expiry_list_${new Date().toISOString().slice(0, 10)}`)}
                  className="absolute bottom-2 right-2 bg-white-600 text-green-600 border border-green-600 text-sm px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow cursor-pointer relative">
              <CardHeader className="card-header rd-card-header dark:bg-red-800 flex justify-between items-start">
                <CardTitle className="card-title">Past Month Expired Count</CardTitle>
              </CardHeader>
              <CardContent className="card-content text-red-600">
                <p>{data?.data?.last_month_inactive_list?.length ?? 0}</p>
                <button
                  onClick={() => exportListToExcel(data?.data?.last_month_inactive_list ?? [], `last_month_inactive_list_${new Date().toISOString().slice(0, 10)}`)}
                  className="absolute bottom-2 right-2 bg-white-600 text-green-600 border border-green-600 text-sm px-3 py-1 rounded hover:bg-green-100 flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}