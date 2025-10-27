"use client";

import { useParams } from "next/navigation";
import { userCards } from "@/app/data/userCards";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Loader from "../../loader/page";
import * as XLSX from 'xlsx';
import { ChevronLeft, ArrowLeft, Download } from 'lucide-react';
import Link from "next/link";

interface FormDataType {
    from_date: string;
    to_date: string;
    status?: string;
}

interface TableData {
    [key: string]: any;
}

export default function UserDetailsForm() {
    const { type } = useParams();
    const [formData, setFormData] = useState<FormDataType>({
        from_date: "",
        to_date: "",
        status: "",
    });
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [touched, setTouched] = useState({
        from_date: false,
        to_date: false,
        status: false,
    });
    const [isClient, setIsClient] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(20);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

    const card = userCards.find((c) => c.value === type);
    const tenantName = card ? card.key : "Unknown Type";

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const normalizeResponse = (responseData: any) => {
        try {
            return typeof responseData === "string" ? JSON.parse(responseData) : responseData;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const validateDates = () => {
        if (
            formData.from_date &&
            formData.to_date &&
            new Date(formData.from_date) > new Date(formData.to_date)
        ) {
            setError("From date cannot be after To date");
            return false;
        }
        setError("");
        return true;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setTouched({ from_date: true, to_date: true, status: true });

        if (!formData.from_date || !formData.to_date || !formData.status) {
            setError("All fields are mandatory.");
            return;
        }

        if (!validateDates()) return;

        setIsSubmitting(true);
        try {
            const payload = { ...formData, tenantName };
            // const res = await axios.post("http://localhost:5000/api/getEbodetailedData", payload, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            //     timeout: 120000,
            // });

            const res = await axios.post("http://192.168.1.157:5000/api/getEbodetailedData", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
            });

            const response = {
                ...res,
                data: normalizeResponse(res.data)
            };

            if (response.status === 200) {
                if (response.data?.isSuccess) {
                    toast.success(response?.data?.message || "Success", {
                        duration: 5000,
                        position: 'top-center'
                    });
                    setApiResponse(response.data);
                } else {
                    const errorMessage = response?.data?.message || "Error processing file. Check inputs and try again.";
                    toast.error(errorMessage, {
                        duration: 5000,
                        position: 'top-center'
                    });
                    setApiResponse(null);
                }
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error: unknown) {
            console.error("API Error:", error);

            if (error instanceof Error && error.message === "SERVER_UNREACHABLE") {
                toast.error("Server is not reachable. Please check your network connection and try again.", {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#ffebee',
                        color: '#b71c1c',
                        fontWeight: 'bold',
                    }
                });
            } else if (axios.isAxiosError(error)) {
                if (error.code === "ERR_NETWORK") {
                    toast.error("Network Error: Server is not reachable. Check your Internet connection and try again.", {
                        duration: 5000,
                        position: 'top-center'
                    });
                } else if (error.code === "ECONNABORTED") {
                    toast.error("Request timed out. Server is taking too long to respond.", {
                        duration: 5000,
                        position: 'top-center'
                    });
                } else if (error.response) {
                    toast.error(`Server error (${error.response.status}): ${error.response.data?.message || 'No error message'}`, {
                        duration: 5000,
                        position: 'top-center'
                    });
                } else {
                    toast.error("Network request failed: " + error.message, {
                        duration: 5000,
                        position: 'top-center'
                    });
                }
            } else if (error instanceof Error) {
                toast.error(error.message, {
                    duration: 5000,
                    position: 'top-center'
                });
            } else {
                toast.error("An unknown error occurred", {
                    duration: 5000,
                    position: 'top-center'
                });
            }

            setApiResponse(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setFormData({
            from_date: "",
            to_date: "",
            status: "",
        });
        setError("");
        setApiResponse(null);
    };
    const getMainArray = () => {
        if (!apiResponse?.data || typeof apiResponse.data !== "object") return [];

        // Look through all values inside data and return the first one that's an array
        const firstArray = Object.values(apiResponse.data).find(
            (value) => Array.isArray(value)
        );

        return Array.isArray(firstArray) ? firstArray : [];
    };

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        const data = getMainArray();

        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
    };
    let columnOrder: string[] = [];

    if (tenantName === "ITI UP Users") {
        columnOrder = [
            "UserName", "Vle_Id", "Customer_Name", "Phone_Num", "Email",
            "total_due_dates", "payment_done", "payment_not_done", "Expiry_Date"
        ];
    } else if (tenantName === "UPe-District Chitrakoot PS Users") {
        columnOrder = [
            "UserName", "Vle_Id", "Customer_Name", "Phone_Num", "Email", "Expiry_Date"
        ];
    } else if (
        tenantName === "I-NET UP Users") {
        columnOrder = [
            "UserName", "Vle_Id", "Customer_Name", "Phone_Num", "Email", "Package_Name", "Expiry_Date"]
    }
    else {
        columnOrder = [
            "UserName", "Customer_Name", "Phone_Num", "Email", "Package_Name", "Expiry_Date"
        ];
    }

    const exportToExcel = () => {
        if (!isClient) return;

        const data = getMainArray();
        if (data.length === 0) return;

        // Reorder the data according to columnOrder
        const orderedData = data.map((row) => {
            const newRow: any = {};
            columnOrder.forEach((col) => {
                newRow[col] = row[col] ?? "";
            });
            return newRow;
        });

        const ws = XLSX.utils.json_to_sheet(orderedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(
            wb,
            `${tenantName}_Report_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="p-8">
            <div className="flex items-center gap-3">
                <Link href="/dashboard/ihubuserdetails">
                    <ArrowLeft className="w-10 h-10 border rounded-sm p-2 cursor-pointer hover:opacity-75" />
                </Link>

                <h1 className="text-3xl font-bold text-[var(--primary)]">
                    {tenantName}
                </h1>
            </div>

            <div className="flex flex-col items-center justify-center mt-10">
                <Card className="border border-[var(--border)] shadow-xl rounded-2xl bg-[var(--card)] w-3/4">

                    <CardHeader className="rounded-t-2xl text-xl font-bold py-3">
                        <div className="flex flex-col items-center w-full">
                            <span>{tenantName} Reports</span>
                            <div className="w-full h-[2px] mt-2 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"></div>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-5">
                        <form onSubmit={handleSubmit} aria-label="Filter form">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-end gap-6">
                                    <div className="flex-1 min-w-[200px] max-w-[250px]">
                                        <label htmlFor="from-date" className="block text-m font-semibold mb-1 text-[var(--primary)]">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            name="from_date"
                                            value={formData.from_date}
                                            onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                                            onBlur={() => handleBlur("from_date")}
                                            className={`border rounded-lg p-2 w-full ${touched.from_date && !formData.from_date ? "border-red-500" : "border-gray-300"
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px] max-w-[250px]">
                                        <label className="block text-m font-semibold mb-1 text-[var(--primary)]">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            name="to_date"
                                            value={formData.to_date}
                                            onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                                            onBlur={() => handleBlur("to_date")}
                                            className={`border rounded-lg p-2 w-full ${touched.to_date && !formData.to_date ? "border-red-500" : "border-gray-300"
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px] max-w-[250px]">
                                        <label htmlFor="status" className="block text-m font-semibold mb-1 text-[var(--primary)]">
                                            User Status
                                        </label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => handleChange("status", value)}
                                        >
                                            <SelectTrigger
                                                className={`border rounded-lg p-2 w-full focus:ring-2 text-[var(--foreground)] ${touched.status && !formData.status
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-[var(--border)] focus:ring-[var(--primary)]"
                                                    }`}
                                            >
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                {tenantName === "ITI UP Users" && (
                                                    <SelectItem value="emi-not-paid">EMI Not Paid</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 min-w-[100px] max-w-[150px]">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]  hover:from-[var(--primary)] hover:to-[var(--secondary)] cursor-pointer text-[var(--primary-foreground)] px-5 py-2 rounded-lg  font-bold transition w-full focus:ring-2 focus:ring-blue-400"
                                        >
                                            {isSubmitting ? "Loading..." : "Search"}
                                        </Button>
                                    </div>

                                    <div className="flex-1 min-w-[80px] max-w-[150px]">
                                        <Button
                                            type="button"
                                            onClick={handleClear}
                                            variant="outline"
                                            className="border border-[var(--primary)] dark:text-[var(--primary-foreground)] cursor-pointer dark:border-[var(--primary-foreground)] text-[var(--primary)] px-5 py-2 rounded-lg hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold transition w-full"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {isSubmitting ? (
                    <div className="flex justify-center w-full py-12">
                        <Loader />
                    </div>
                ) : (
                    isClient && apiResponse?.isSuccess && (
                        <Card className="border border-[var(--border)] shadow-xl rounded-2xl mt-5 bg-[var(--card)]">
                            <CardHeader className="rounded-t-2xl py-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold"> Showing user details for <strong>{tenantName}</strong></h2>
                                    <Button
                                        onClick={exportToExcel}
                                        variant="outline"
                                        className="flex items-center gap-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)]"
                                    >
                                        <Download size={16} />
                                        Export to Excel
                                    </Button>
                                </div>
                                <div className="w-full h-[2px] mt-2 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"></div>
                            </CardHeader>

                            <CardContent className="p-0 overflow-x-auto">
                                <div className="min-w-full">
                                    <table className="w-full divide-y divide-[var(--border)]">
                                        <thead className="bg-00">
                                            <tr>
                                                {columnOrder.map((col) => (
                                                    <th
                                                        key={col}
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-sm font-bold  text-[var(--primary)] uppercase tracking-wider cursor-pointer hover:bg-[var(--muted-hover)]"
                                                        onClick={() => requestSort(col)}
                                                    >
                                                        <div className="flex items-center">
                                                            {col.replace(/_/g, " ")}
                                                            {sortConfig?.key === col && (
                                                                <span className="ml-1">
                                                                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                                            {getSortedData()
                                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                                .map((row: TableData, index: number) => (
                                                    <tr
                                                        key={index}
                                                        className={index % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--muted)]"}
                                                    >
                                                        {columnOrder.map((col) => (
                                                            <td
                                                                key={col}
                                                                className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]"
                                                            >
                                                                {row[col] ?? ""}

                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                {getMainArray().length > recordsPerPage && (
                                    <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border)]">
                                        <div className="text-sm text-[var(--muted-foreground)]">
                                            Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                                            {Math.min(currentPage * recordsPerPage, getMainArray().length)} of{" "}
                                            {getMainArray().length} entries
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="border-[var(--border)] text-[var(--foreground)]"
                                            >
                                                &laquo; Previous
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage >= Math.ceil(getMainArray().length / recordsPerPage)}
                                                className="border-[var(--border)] text-[var(--foreground)]"
                                            >
                                                Next &raquo;
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            </CardContent>
                        </Card>
                    )
                )}
            </div>

        </div >

    );
}