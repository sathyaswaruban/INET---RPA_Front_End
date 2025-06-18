"use client";

import React, { useState } from "react";
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

type FormValues = z.infer<typeof formSchema>;

const serviceOptions = [
    { value: "RECHARGE", label: "PaySprint-Recharge" },
    { value: "AEPS", label: "PaySprint-Aeps" },
    { value: "IMT", label: "PaySprint-IMT" },
    { value: "BBPS", label: "BBPS" },
    { value: "Pan_UTI", label: "Pan_UTI" },
    { value: "Pan_NSDL", label: "Pan_NSDL", disabled: true },
];

const transactionOptions = [
    { value: "1", label: "Enquiry" },
    { value: "2", label: "Withdrawal" },
    { value: "3", label: "Mini Statement" },
];

const FilterForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState("No file chosen");
    const [apiResponse, setApiResponse] = useState<any>(null); // To store API response

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromDate: "",
            toDate: "",
            serviceName: "",
            transactionType: "default",
            file: undefined,
        },
    });

    const selectedService = form.watch("serviceName");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("file", file);
            setFileName(file.name);
            form.clearErrors("file");
        }
    };

    const clearForm = () => {
        form.reset();
        setFileName("No file chosen");
        setApiResponse(null);
    };

    const normalizeResponse = (responseData: any) => {
        try {
            return typeof responseData === "string" ? JSON.parse(responseData) : responseData;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const processData = async (values: FormValues) => {
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

            // console.log("Before axios request");

            // Remove the .catch() here and let the try/catch handle it
            // const res = await axios.post("http://192.168.1.157:5000/api/reconciliation", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            //     timeout: 60000,
            // });
            const res = await axios.post("http://localhost:5000/api/reconciliation", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000,
            });

            // console.log("After axios request", res);

            const response = {
                ...res,
                data: normalizeResponse(res.data)
            };

            if (response.status === 200) {
                if (response.data?.isSuccess) {
                    let Message = response?.data?.message
                    toast.success(Message);
                    setApiResponse(response.data);
                } else {
                    let errorMessage = " Error processing file..! Check Inputs and try again..!";
                    if (response?.data?.message.length > 0) {
                        errorMessage = response?.data?.message
                    }
                    toast.error(errorMessage, { duration: 5000 });
                    setApiResponse(null);
                }
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error: unknown) {
            console.error("API Error:", error);

            // First check if it's our custom SERVER_UNREACHABLE error
            if (error instanceof Error && error.message === "SERVER_UNREACHABLE") {
                toast.error("Server is not reachable. Please check your network connection and try again.", {
                    duration: 10000,
                    position: 'top-center',
                    style: {
                        background: '#ffebee',
                        color: '#b71c1c',
                        fontWeight: 'bold',
                    }
                });
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
                    toast.error("Network Error: Could not connect to server. Check your Internet connection and try again..!", {
                        duration: 15000,
                        position: 'top-center'
                    });
                }
                else if (error.code === "ECONNABORTED") {
                    toast.error("Request timed out. Server is taking too long to respond..!", {
                        duration: 100000
                    });
                }
                else if (error.response) {
                    // Server responded with error status
                    toast.error(`Server error (${error.response.status}): ${error.response.data?.message || 'No error message'}`);
                }
                else {
                    toast.error("Network request failed: " + error.message);
                }
            }
            // Handle other types of errors
            else if (error instanceof Error) {
                toast.error(error.message);
            }
            // Final fallback
            else {
                toast.error("An unknown error occurred");
            }

            setApiResponse(null);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex flex-col min-h-screen p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-center">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            SELECT INPUT DETAILS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(processData)} className="space-y-6">
                                <div className="flex gap-4 justify-between">
                                    {/* From Date */}
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="fromDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>From Date</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="w-full">
                                        {/* To Date */}
                                        <FormField
                                            control={form.control}
                                            name="toDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>To Date</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    {/* Service Name */}
                                    <FormField
                                        control={form.control}
                                        name="serviceName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Service</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="--Select service--" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {serviceOptions.map((option) => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                                disabled={option.disabled}
                                                                className={option.disabled ? "text-red-500" : ""}
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
                                </div>

                                {/* Transaction Type (only visible for Aeps) */}
                                {selectedService === "AEPS" && (
                                    <FormField
                                        control={form.control}
                                        name="transactionType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Transaction Type</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="--Select transaction--" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {transactionOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
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
                                            <FormLabel>Upload Excel File</FormLabel>
                                            <div className="flex items-center gap-4">
                                                <Button asChild variant="outline">
                                                    <label className="cursor-pointer">
                                                        Choose File
                                                        <Input
                                                            type="file"
                                                            accept=".xlsx"
                                                            className="hidden"
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                </Button>
                                                <span className="text-sm text-muted-foreground">
                                                    {fileName}
                                                </span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                        {isSubmitting ? "Processing..." : "Process"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={clearForm}
                                        disabled={isSubmitting}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Card className="w-full lg:w-1/2 max-h-[60vh] overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-center">
                            Status Labels
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                            <li><b>Not in Portal</b> : Data Present in Vendor Excel But not in Ihub Portal</li>
                            <li><b>Vend_suc - Not_In_IhubPortal</b> : Success in Vendor Excel but not in Ihub Portal</li>
                            <li><b>Vend_IHub_Succ - NIL</b> : Success in both Vendor and Ihub But not in Ihub Ledger</li>
                            <li><b>Vend_IHub_Fail - NIL</b> : Failed in both Vendor and Ihub But not in Ihub Ledger</li>
                            <li><b>Vend_Suc - IHub_Fail - NIL</b> : Success in Vendor and Failed in Ihub But not in Ihub Ledger</li>
                            <li><b>Vend_Suc - Ihub_Ini - NIL</b> : Success in Vendor and Initiated in Ihub But not in Ihub Ledger</li>
                            <li><b>Vend_Fail - Ihub_Ini - NIL</b> : Failed in Vendor and Initiated in Ihub But not in Ihub Ledger</li>
                            <li><b>Vend_Suc - Ihub_Suc</b> : Success in both Vendor and Ihub and Present in Ihub Ledger</li>
                            <li><b>Vend_Fail - Ihub_Suc</b> : Failed in Vendor and Success in Ihub and Present in Ihub Ledger</li>
                            <li><b>Vend_Suc - Ihub_Fail</b> : Failed in Ihub and Success in Vendor and Present in Ihub Ledger</li>
                            <li><b>Vend_Fail - Ihub_Fail</b> : Failed in both Vendor and Ihub and Present in Ihub Ledger</li>
                            <li><b>Vend_Suc - Ihub_Ini</b> : Success in Vendor and Initiated in Ihub and Present in Ihub Ledger</li>
                            <li><b>Vend_Fail - Ihub_Ini</b> : Failed in Vendor and Initiated in Ihub and Present in Ihub Ledger</li>
                            <li><b>Tenant_Ini_Not_In_Hub</b> : Initiated in Tenant Database but not present in Ihub Database</li>
                            <li><b>Matched_Values</b> : Values with matched status</li>
                            <li><b>Not_In_Vendor</b> : Data Present in Ihub Portal But not in Vendor Excel</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <br/><br/>
            <div className="flex flex-col lg:flex-row gap-4 justify-center" >
            {/* Results Section - Only show if apiResponse exists and isSuccess is true */}
            {apiResponse?.isSuccess && (
                <ResultsViewer responseData={apiResponse} />
            )}</div>
        </div>
    );
};

export default FilterForm;