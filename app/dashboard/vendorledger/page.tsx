"use client";

import React, { useEffect, useState, useCallback } from "react";
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

// ✅ Schema for form validation
const formSchema = z.object({
    serviceName: z
        .string()
        .min(1, "Service is required")
        .refine((val) => val !== "default", {
            message: "Please select a service",
        }),
    transactionType: z.string().optional(),
    file1: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, {
            message: "File 1 is required",
        }),
    file2: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, {
            message: "File 2 is required",
        }),
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
];

const transactionOptions = [
    { value: "1", label: "Enquiry" },
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

const vendorLedger = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiResponse, setApiResponse] = useState<any>(null); // To store API response
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fileName1, setFileName1] = useState("No file chosen");
    const [fileName2, setFileName2] = useState("No file chosen");

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
            serviceName: "",
            transactionType: "default",
            file1: undefined,
            file2: undefined,
        },
    });

    // File change handler
    const handleFileChange1 = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                form.setValue("file1", file);
                setFileName1(file.name);
                form.clearErrors("file1");
            }
        },
        [form]
    );

    const handleFileChange2 = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                form.setValue("file2", file);
                setFileName2(file.name);
                form.clearErrors("file2");
            }
        },
        [form]
    );

    // Clear form handler
    const clearForm = useCallback(() => {
        form.reset();
        setFileName1("No file chosen");
        setFileName2("No file chosen");
        setApiResponse(null);
    }, [form]);

    // Normalize API response
    const normalizeResponse = (responseData: any) => {
        try {
            return typeof responseData === "string"
                ? JSON.parse(responseData)
                : responseData;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Save history to backend
    const savingHistory = useCallback(
        async (values: any, Message: string, status: string) => {
            await axios.post("/api/user-task-history", {
                uid: user?.id,
                userName: user?.name,
                serviceName: values.serviceName,
                uploadedFileName: `${values.file1?.name || ""}, ${values.file2?.name || ""}`,
                responseMessage: Message,
                responseStatus: status,
                transactionType: values.transactionType,
            });
        },
        [user]
    );

    // Form submit handler
    const processData = useCallback(
        async (values: FormValues) => {
            setIsSubmitting(true);
            setApiResponse(null);
            try {
                const formData = new FormData();
                formData.append("service_name", values.serviceName);
                if (values.transactionType && values.transactionType !== "default") {
                    formData.append("transaction_type", values.transactionType);
                }
                formData.append("file1", values.file1);
                formData.append("file2", values.file2);

                const res = await axios.post(
                    "http://192.168.1.157:5000/api/reconciliation",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        timeout: 120000,
                    }
                );

                const response = {
                    ...res,
                    data: normalizeResponse(res.data),
                };

                if (response.data?.isSuccess) {
                    let Message = response?.data?.message;
                    toast.success(Message, {
                        duration: 5000,
                        position: "top-center",
                    });
                    setApiResponse(response.data);
                    savingHistory(values, Message, "Success");
                } else {
                    let errorMessage =
                        response?.data?.message?.length > 0
                            ? response?.data?.message
                            : "NaN Error occured during processing.";

                    toast.error(errorMessage, {
                        duration: 5000,
                        position: "top-center",
                    });
                    savingHistory(values, errorMessage, "Failed");
                    setApiResponse(null);
                }
            } catch (error: unknown) {
                console.error("API Error:", error);

                if (axios.isAxiosError(error)) {
                    if (error.code === "ERR_NETWORK") {
                        toast.error(
                            "Network Error: Server is not reachable. Check your Internet connection and try again..!",
                            { duration: 5000, position: "top-center" }
                        );
                        savingHistory(values, error.message, "Failed");
                    } else if (error.code === "ECONNABORTED") {
                        toast.error(
                            "Request timed out. Server is taking too long to respond..!",
                            { duration: 5000, position: "top-center" }
                        );
                        savingHistory(values, error.message, "Failed");
                    } else if (error.response) {
                        toast.error(
                            `Server error (${error.response.status}): ${error.response.data?.message || "No error message"}`,
                            { duration: 5000, position: "top-center" }
                        );
                        savingHistory(values, error.response.data?.message, "Failed");
                    } else {
                        toast.error("Network request failed: " + error.message, {
                            duration: 5000,
                            position: "top-center",
                        });
                        savingHistory(values, error.message, "Failed");
                    }
                } else if (error instanceof Error) {
                    toast.error(error.message, {
                        duration: 5000,
                        position: "top-center",
                    });
                    savingHistory(values, error.message, "Failed");
                } else {
                    let message = "An unknown error occurred";
                    toast.error(message, { duration: 5000, position: "top-center" });
                    savingHistory(values, message, "Failed");
                }

                setApiResponse(null);
            } finally {
                setIsSubmitting(false);
            }
        },
        [savingHistory]
    );

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col min-h-screen p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 justify-center">
                    {/* Input Field Card */}
                    <Card className="col-span-12 lg:col-span-10 bg-[var(--card)] text-[var(--card-foreground)] shadow-2xl rounded-2xl border border-[var(--border)] p-0 m-0 overflow-hidden transition-colors">
                        <CardHeader className="flex flex-col items-center justify-center bg-gradient-to-r from-[var(--primary)] from-100% to-[var(--primary)]/80 to-80% px-6 py-6 sticky top-0 z-10 shadow-md mb-0 rounded-t-2xl">
                            <CardTitle className="text-3xl font-extrabold text-[var(--primary-foreground)] tracking-wide drop-shadow-lg">
                                Vendor Ledger Comparisions
                            </CardTitle>
                            <p className="text-[var(--primary-foreground)]/80 mt-2 text-sm font-medium text-center">
                                Please fill in the details below to process your Vendor Excel and Ledger.
                            </p>
                        </CardHeader>

                        <CardContent className="py-8 px-8 pt-4 bg-[var(--card)] text-[var(--card-foreground)]">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(processData)}
                                    className="flex flex-col gap-6"
                                    aria-label="Filter Form"
                                >
                                    {/* Inputs in one row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                        {/* Service Name */}
                                        <FormField
                                            control={form.control}
                                            name="serviceName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel
                                                        className="font-semibold text-[var(--primary)]"
                                                        htmlFor="service-name"
                                                    >
                                                        Select Service
                                                    </FormLabel>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className="w-full rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] transition bg-[var(--card)] text-[var(--card-foreground)]"
                                                                id="service-name"
                                                                aria-label="Select Service"
                                                            >
                                                                <SelectValue placeholder="--Select service--" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-[var(--card)] text-[var(--card-foreground)]">
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

                                        {/* File Upload 1 */}
                                        <FormField
                                            control={form.control}
                                            name="file1"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel
                                                        className="font-semibold text-[var(--primary)]"
                                                        htmlFor="file-upload-1"
                                                    >
                                                        Upload Vendor Statement 
                                                    </FormLabel>
                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            className="border-[var(--primary)] hover:bg-[var(--muted)] font-semibold"
                                                        >
                                                            <label
                                                                className="cursor-pointer"
                                                                htmlFor="file-upload-1"
                                                            >
                                                                Choose File
                                                                <Input
                                                                    id="file-upload-1"
                                                                    type="file"
                                                                    accept=".xlsx"
                                                                    className="hidden"
                                                                    onChange={handleFileChange1}
                                                                    aria-label="Upload Vendor Statement"
                                                                />
                                                            </label>
                                                        </Button>
                                                        <span className="text-sm text-[var(--primary)] font-medium">
                                                            {fileName1}
                                                        </span>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* File Upload 2 */}
                                        <FormField
                                            control={form.control}
                                            name="file2"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel
                                                        className="font-semibold text-[var(--primary)]"
                                                        htmlFor="file-upload-2"
                                                    >
                                                        Upload Vendor Ledger
                                                    </FormLabel>
                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            className="border-[var(--primary)] hover:bg-[var(--muted)] font-semibold"
                                                        >
                                                            <label
                                                                className="cursor-pointer"
                                                                htmlFor="file-upload-2"
                                                            >
                                                                Choose File
                                                                <Input
                                                                    id="file-upload-2"
                                                                    type="file"
                                                                    accept=".xlsx"
                                                                    className="hidden"
                                                                    onChange={handleFileChange2}
                                                                    aria-label="Upload Vendor Ledger"
                                                                />
                                                            </label>
                                                        </Button>
                                                        <span className="text-sm text-[var(--primary)] font-medium">
                                                            {fileName2}
                                                        </span>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

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
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4 justify-center">
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
        </div>
    );
};

export default vendorLedger;