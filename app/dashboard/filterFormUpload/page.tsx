"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultsViewer } from "@/components/ResultsViewer";
import Loader from "../loader/page";

// Schema for form validation
const formSchema = z.object({
    fromDate: z.string().min(1, "From Date is required"),
    toDate: z.string().min(1, "To Date is required"),
    serviceName: z.string().min(1, "Service is required").refine(val => val !== "default", {
        message: "Please select a service",
    }),
    transactionType: z.string().optional(),
    file: z.instanceof(File).refine(file => file.size > 0, {
        message: "File is required",
    }),
}).refine(data => {
    if (data.fromDate && data.toDate) {
        const from = new Date(data.fromDate);
        const to = new Date(data.toDate);
        return to >= from;
    }
    return true;
}, {
    message: "To Date must be after From Date",
    path: ["toDate"],
});

// Types
type FormValues = z.infer<typeof formSchema>;

const serviceOptions = [
    { value: "ASTRO", label: "Astro Horoscope" },
    { value: "ABHIBUS", label: "Abhibus" },
    { value: "BBPS", label: "BBPS" },
    { value: "DMT", label: "DMT" },
    { value: "INSURANCE_OFFLINE", label: "Insurance - Offline" },
    { value: "LIC", label: "LIC - Premium" },
    { value: "MANUAL_TB", label: "Manual TB" },
    { value: "MATM", label: "Micro ATM (M-ATM)" },
    { value: "MOVETOBANK", label: "Move To Bank" },
    { value: "RECHARGE", label: "PaySprint-Recharge" },
    { value: "AEPS", label: "PaySprint-Aeps" },
    { value: "PANUTI", label: "Pan-UTI" },
    { value: "PANNSDL", label: "Pan - NSDL" },
    { value: "PASSPORT", label: "Passport" },
    { value: "UPIQR", label: "UPI - QR" },
    { value: "SULTANPURSCA", label: "Sultanpur RPT_SCA" },
    { value: "SULTANPUR_IS", label: "Sultanpur IS_Quota" },
    { value: "CHITRAKOOT_SCA", label: "Chitrakoot RPT_SCA" },
    { value: "CHITRAKOOT_IS", label: "Chitrakoot IS_Quota" },
    { value: "IMPS", label: "ITI - IMPS" },
];

const transactionOptions = [
    { value: "2", label: "Withdrawal" },
    { value: "3", label: "Mini Statement" },
];

interface User {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
    createdAt: string;
}

const FilterForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState("No file chosen");
    const [apiResponse, setApiResponse] = useState<any>(null); // To store API response
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [vendorStatementFile, setVendorStatementFile] = useState<File | null>(null);
    const fileInput1Ref = useRef<HTMLInputElement>(null);


    // Fetch user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/me");
                setUser(response?.data?.user);
            } catch (error) {
                toast.error("Failed to fetch user data");
                router.push("/auth/login");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    // Form setup
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromDate: "",
            toDate: "",
            serviceName: "",
            transactionType: "default",
            file: undefined,
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    // 👇 Add this effect to trigger validation when fromDate changes
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "fromDate" && value.fromDate) {
                form.trigger("toDate"); // force validate To Date when From Date changes
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);
    // Watch service selection
    const selectedService = form.watch("serviceName");
    useEffect(() => {
        if (selectedService !== "AEPS") {
            form.setValue("transactionType", "default", { shouldValidate: false });
        }
    }, [selectedService, form]);

    // File change handler
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVendorStatementFile(file);
            form.setValue("file", file);
            setFileName(file.name);
            form.clearErrors("file");
        }
    }, [form]);

    // Clear form handler
    const clearForm = useCallback(() => {
        form.reset();
        setFileName("No file chosen");
        setApiResponse(null);
        if (fileInput1Ref.current) fileInput1Ref.current.value = "";

    }, [form]);



    // Normalize API response
    const normalizeResponse = (responseData: any) => {
        try {
            return typeof responseData === "string" ? JSON.parse(responseData) : responseData;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Save history to backend
    const savingHistory = useCallback(async (values: any, Message: string, status: string) => {
        await axios.post("/api/user-task-history", {
            uid: user?.id,
            userName: user?.name,
            serviceName: values.serviceName,
            fromDate: values.fromDate,
            toDate: values.toDate,
            uploadedFileName: values.file.name,
            responseMessage: Message,
            responseStatus: status,
            transactionType: values.transactionType,
        });
    }, [user]);

    // Form submit handler
    const processData = useCallback(async (values: FormValues) => {
        setIsSubmitting(true);
        setApiResponse(null);
        try {
            const formData = new FormData();
            formData.append("from_date", values.fromDate);
            formData.append("to_date", values.toDate);
            formData.append("service_name", values.serviceName);
            if (values.transactionType && values.transactionType !== "default") {
                formData.append("transaction_type", values.transactionType);
            }
            formData.append("file", values.file);
            // const res = await axios.post("http://localhost:5000/api/reconciliation", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            //     timeout: 120000,
            // });
            const res = await axios.post("http://192.168.1.157:5000/api/reconciliation", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
            });
            const response = {
                ...res,
                data: normalizeResponse(res.data)
            };

            if (response.data?.isSuccess) {
                let Message = response?.data?.message;
                toast.success(Message, {
                    duration: 5000,
                    position: 'top-center'
                });
                console.log("API RESPONSE STATE:", response.data);
                console.log("SET API RESPONSE:", {
                    ...response.data.data,
                    isSuccess: response.data.isSuccess,
                    message: response.data.message,
                    service_name: response.data.service_name,
                    fromDate: values.fromDate,
                    toDate: values.toDate,
                });
                setApiResponse({
                    ...response.data.data,    // spread inner data
                    isSuccess: response.data.isSuccess,
                    message: response.data.message,
                    service_name: response.data.service_name,
                    fromDate: values.fromDate,
                    toDate: values.toDate,
                });
                const status = 'Success';
                savingHistory(values, Message, status);
            } else {
                let errorMessage = "NaN Error occured during processing.";

                if (response?.data?.message.length > 0) {
                    errorMessage = response?.data?.message;
                }
                toast.error(errorMessage, {
                    duration: 5000,
                    position: 'top-center'
                });
                let status = 'Failed';
                savingHistory(values, errorMessage, status);
                setApiResponse(null);
            }


        } catch (error: unknown) {
            console.error("API Error:", error);

            // First check if it's our custom SERVER_UNREACHABLE error
            if (error instanceof Error && error.message === "SERVER_UNREACHABLE") {
                let errorMessage = "Server is not reachable. Please check your network connection and try again."
                toast.error(errorMessage, {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#ffebee',
                        color: '#b71c1c',
                        fontWeight: 'bold',
                    }
                });
                let status = 'Failed'
                savingHistory(values, errorMessage, status);
            }
            // Then check for Axios errors
            else if (axios.isAxiosError(error)) {
                console.log("Axios error details:", {
                    code: error.code,
                    message: error.message,
                    response: error.response,
                    request: error.request
                });

                if (error.code === "ERR_NETWORK") {
                    let errorMessage = "Network Error: Server is not reachable. Check your Internet connection and try again..!";
                    toast.error(errorMessage, {
                        duration: 5000,
                        position: 'top-center'
                    });
                    let status = 'Failed'
                    savingHistory(values, errorMessage, status);

                }
                else if (error.code === "ECONNABORTED") {
                    let errorMessage = "Request timed out. Server is taking too long to respond..!";
                    toast.error(errorMessage, {
                        duration: 5000,
                        position: 'top-center'

                    });
                    let status = 'Failed'
                    savingHistory(values, errorMessage, status);
                }
                else if (error.response) {
                    // Server responded with error status
                    toast.error(`Server error (${error.response.status}): ${error.response.data?.message || 'No error message'}`,
                        {
                            duration: 5000,
                            position: 'top-center'

                        }
                    );
                    let status = 'Failed'
                    savingHistory(values, error.response.data?.message, status);
                }
                else {
                    toast.error("Network request failed: " + error.message,
                        {
                            duration: 5000,
                            position: 'top-center'

                        }
                    );
                    let status = 'Failed'
                    savingHistory(values, error.message, status);

                }
            }
            // Handle other types of errors
            else if (error instanceof Error) {
                toast.error(error.message,
                    {
                        duration: 5000,
                        position: 'top-center'

                    }
                );
                let status = 'Failed'
                savingHistory(values, error.message, status);
            }
            // Final fallback
            else {
                let message = '"An unknown error occurred"'
                toast.error(message,
                    {
                        duration: 5000,
                        position: 'top-center'

                    }
                );
                let status = 'Failed'
                savingHistory(values, message, status);
            }

            setApiResponse(null);
        } finally {
            setIsSubmitting(false);
        }
    }, [savingHistory]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 justify-center">
                    {/* Input Field Card: 5 columns on large screens */}
                    <Card className="col-span-12 lg:col-span-5 bg-[var(--card)] text-[var(--card-foreground)] shadow-2xl rounded-2xl border border-[var(--border)] p-0 m-0 overflow-hidden transition-colors">
                        <CardHeader className="flex flex-col items-center justify-center card-header px-6 py-6 sticky top-0 z-10 shadow-md mb-0 rounded-t-2xl">
                            <CardTitle className="text-3xl font-extrabold text-[var(--primary-foreground)] tracking-wide drop-shadow-lg">
                                Select Input Details
                            </CardTitle>
                            <p className="text-[var(--primary-foreground)]/80 mt-2 text-sm font-medium text-center">
                                Please fill in the details below to process your reconciliation.
                            </p>
                        </CardHeader>
                        <CardContent className="py-8 px-8 pt-4 bg-[var(--card)] text-[var(--card-foreground)]">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(processData)} className="space-y-8" aria-label="Filter Form">
                                    <div className="flex gap-4 flex-col md:flex-row justify-between">
                                        {/* From Date */}
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="fromDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold text-[var(--primary)]" htmlFor="from-date">From Date</FormLabel>
                                                        <FormControl>
                                                            <Input id="from-date" type="date" {...field} aria-label="From Date"
                                                                className="rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] transition bg-[var(--card)] text-[var(--card-foreground)]" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {/* To Date */}
                                        {/* To Date */}
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="toDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold text-[var(--primary)]" htmlFor="to-date">To Date</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                id="to-date"
                                                                type="date"
                                                                {...field}
                                                                min={form.watch("fromDate") || ""}  // 👈 restrict To Date to be >= From Date
                                                                aria-label="To Date"
                                                                className="rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] transition bg-[var(--card)] text-[var(--card-foreground)]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* Service Name */}
                                    <FormField
                                        control={form.control}
                                        name="serviceName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-[var(--primary)]" htmlFor="service-name">Select Service</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] transition bg-[var(--card)] text-[var(--card-foreground)]" id="service-name" aria-label="Select Service">
                                                            <SelectValue placeholder="--Select service--" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-[var(--card)] font-semibold text-[var(--card-foreground)]">
                                                        {serviceOptions.map((option) => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                                className="hover:bg-[var(--muted)]"
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Transaction Type (only visible for Aeps) */}
                                    {selectedService === "AEPS" && (
                                        <FormField
                                            control={form.control}
                                            name="transactionType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-[var(--primary)]" htmlFor="transaction-type">Transaction Type</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] transition bg-[var(--card)] text-[var(--card-foreground)]" id="transaction-type" aria-label="Select Transaction Type">
                                                                <SelectValue placeholder="--Select transaction--" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-[var(--card)] text-[var(--card-foreground)]">
                                                            {transactionOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value} className="hover:bg-[var(--muted)]">
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    {/* File Upload */}
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-[var(--primary)]" htmlFor="file-upload">Upload Excel File</FormLabel>
                                                <div className="flex items-center gap-4">
                                                    <Button asChild variant="outline" className="border-[var(--primary)] hover:bg-[var(--muted)] font-semibold">
                                                        <label className="cursor-pointer" htmlFor="file-upload">
                                                            Choose File
                                                            <Input
                                                                id="file-upload"
                                                                type="file"
                                                                accept=".xlsx"
                                                                className="hidden"
                                                                ref={fileInput1Ref}
                                                                onChange={handleFileChange}
                                                                aria-label="Upload Excel File"
                                                            />
                                                        </label>
                                                    </Button>
                                                    <span className="text-sm text-[var(--primary)] font-medium">
                                                        {fileName}
                                                    </span>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 font-bold flex items-center justify-center bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] hover:from-[var(--secondary)] hover:to-[var(--primary)] shadow-lg rounded-lg transition"
                                            disabled={isSubmitting}
                                            aria-label="Process"
                                        >
                                            {isSubmitting ? <span className="loader mr-2" /> : null}
                                            {isSubmitting ? "Processing..." : "Process"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 border-[var(--primary)] text-[var(--primary)] font-bold hover:bg-[var(--muted)] rounded-lg transition"
                                            onClick={clearForm}
                                            disabled={isSubmitting}
                                            aria-label="Clear"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                    {/* Status Label Card: 7 columns on large screens */}
                    <Card className="col-span-12 lg:col-span-7 max-h-[70vh] m-0 p-0 overflow-y-auto shadow-xl rounded-2xl border-0 bg-[var(--card)] text-[var(--card-foreground)]">
                        <CardHeader className="flex flex-row items-center gap-3 card-header sticky top-0 z-10 rounded-t-2xl px-6 py-4 mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
                            </svg>
                            <CardTitle className="text-2xl font-bold text-[var(--primary-foreground)] tracking-wide">
                                Status Labels
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4 px-6 bg-[var(--card)] text-[var,--card-foreground]">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-blue-600 text-sm px-2 py-1 mr-2 text-center">
                                        Not_In_Vendor
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Data Present in Ihub Portal But not in Vendor Excel.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-blue-500 text-sm px-2 py-1 mr-2 text-center">
                                        Not in Portal
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Data Present in Vendor Excel But not in Ihub Portal.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-green-600 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_suc - Not_In_IhubPortal
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Success in Vendor Excel but not in Ihub Portal.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-green-700 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_IHub_Succ - NIL
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Success in both Vendor and Ihub But not in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-red-500 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_IHub_Fail - NIL
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Failed in both Vendor and Ihub But not in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-yellow-600 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Suc - IHub_Fail - NIL
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Success in Vendor and Failed in Ihub But not in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-yellow-700 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Suc - Ihub_Ini - NIL
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Success in Vendor and Initiated in Ihub But not in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-red-600 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Fail - Ihub_Ini - NIL
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Failed in Vendor and Initiated in Ihub But not in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-green-800 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Suc - Ihub_Suc
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Success in both Vendor and Ihub and Present in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-red-700 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Fail - Ihub_Suc
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Failed in Vendor and Success in Ihub and Present in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-purple-600 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Suc - Ihub_Fail
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Failed in Ihub and Success in Vendor and Present in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-red-800 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Fail - Ihub_Fail
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Failed in both Vendor and Ihub and Present in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-cyan-700 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Suc - Ihub_Ini
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Success in Vendor and Initiated in Ihub and Present in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-orange-600 text-sm px-2 py-1 mr-2 text-center">
                                        Vend_Fail - Ihub_Ini
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Failed in Vendor and Initiated in Ihub and Present in Ihub Ledger.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-pink-600 text-sm px-2 py-1 mr-2 text-center">
                                        Tenant_Ini_Not_In_Hub
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Initiated in Tenant Database but not present in Ihub Database.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2 bg-[var(--muted)]/80 hover:bg-[var(--primary)]/10 transition rounded-lg px-3 py-2 shadow-sm">
                                    <span className="font-bold text-gray-700 text-sm px-2 py-1 mr-2 text-center">
                                        Matched_Values
                                    </span>
                                    <span className="text-gray-600 text-sm px-2 py-1 mr-2 text-center">
                                        Values with matched status.
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mt-4 justify-center" >
                {/* Results Section - Only show if apiResponse exists and isSuccess is true */}
                {isSubmitting ? (
                    <div className="flex justify-center w-full">
                        <Loader />
                    </div>
                ) : (
                    apiResponse?.isSuccess && (
                        <ResultsViewer responseData={apiResponse} />
                    )
                )}
            </div>
        </div >
    );
};

export default FilterForm;