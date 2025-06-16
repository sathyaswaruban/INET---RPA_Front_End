import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { memo, useEffect, useState } from "react";
import { FileSpreadsheet, LockIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { saveAs } from 'file-saver';

interface DataItem {
    [key: string]: any;
}

interface ResultsViewerProps {
    responseData: any;
}

export const ResultsViewer = memo(({ responseData }: ResultsViewerProps) => {
    const localData = responseData;
    const combinedData = localData?.data?.combined || [];
    const Total_success_count = localData?.data?.Total_Success_count || 0;
    const Total_failed_count = localData?.data?.Total_Failed_count || 0;
    const otherSections = { ...localData.data };
    const message = localData?.data?.message || " "
    const dataSections = [
        { key: "not_in_Portal", label: "Not in Portal" },
        { key: "NOT_IN_PORTAL_VENDOR_SUCC", label: "Vendor_success - Not_In_IhubPortal" },
        { key: "VEND_IHUB_SUC-NIL", label: "Ven_IHub_Success - Not_In_IHubLedger" },
        { key: "VEND_FAIL_IHUB_SUC-NIL", label: "Ven_IHub_Failed - Not_In_IHubLedger" },
        { key: "VEND_SUC_IHUB_FAIL-NIL", label: "Ven_Suc - IHub_Fail - Not_In_IhubLedger" },
        { key: "IHUB_INT_VEND_SUC-NIL", label: "Vendor_Suc - Ihub_Ini - Not_In_IhubLedger" },
        { key: "VEND_FAIL_IHUB_INT-NIL", label: "Vendor_Fail - Ihub_Ini - Not_In_IhubLedger" },
        { key: "VEND_IHUB_SUC", label: "Vendor_Suc - Ihub_Suc" },
        { key: "VEND_FAIL_IHUB_SUC", label: "Vendor_Fail - Ihub_Suc" },
        { key: "VEND_SUC_IHUB_FAIL", label: "Vendor_Suc - Ihub_Fail" },
        { key: "IHUB_VEND_FAIL", label: "Vendor_Fail - Ihub_Fail" },
        { key: "IHUB_INT_VEND_SUC", label: "Vendor_Suc - Ihub_Ini" },
        { key: "VEND_FAIL_IHUB_INT", label: "Vendor_Fail - Ihub_Ini" },
        { key: "Tenant_db_ini_not_in_hubdb", label: "TENANT_DB_INI_NOT_IN_HUB" },
        { key: "matched", label: "Matched_Values" },
        { key: "not_in_vendor", label: "Not_In_Vendor" },
    ];

    const activeSections = dataSections.filter(section => {
        const sectionData = otherSections[section.key];
        return Array.isArray(sectionData) && sectionData.length > 0;
    });
    const service_name = localData?.service_name || " "
    // console.log(service_name)

    const orderedColumns = [
        "CATEGORY",
        "TENANT_ID",
        "IHUB_REFERENCE",
        "REFID",
        "IHUB_USERNAME",
        "AMOUNT",
        "SERVICE_DATE",
        "VENDOR_DATE",
        "VENDOR_STATUS",
        "IHUB_MASTER_STATUS",
        "IHUB_LEDGER_STATUS",
        `${service_name}_STATUS`,
        // "TENANT_LEDGER_STATUS",
        "TRANSACTION_DEBIT",
        "TRANSACTION_CREDIT",
        "COMMISSION_CREDIT",
        "COMMISSION_REVERSAL"
    ];

    const exportToExcel = (data: DataItem[], fileName: string) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const exportAllTabsToExcel = () => {
        const workbook = XLSX.utils.book_new();

        activeSections.forEach((section) => {
            const data = otherSections[section.key] || [];
            if (data.length > 0) {
                const worksheet = XLSX.utils.json_to_sheet(data, { header: orderedColumns });
                XLSX.utils.book_append_sheet(workbook, worksheet, section.label || section.key);
            }
        });

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'detailed_results.xlsx');
    };


    ``
    const formatValue = (value: any) => {
        if (value === null || value === undefined || value === "") return "N/A";
        if (typeof value === "number" && isNaN(value)) return "N/A";
        return String(value);
    };

    const [paginationState, setPaginationState] = useState<{ [key: string]: number }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(combinedData.length / itemsPerPage);
    const paginatedData = combinedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6 w-full max-w-6xl">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                    <CardTitle className="font-bold text-xl">TOTAL : {Total_success_count + Total_failed_count + combinedData.length}</CardTitle>
                    <CardTitle className="font-bold text-green-600">Total Success : {Total_success_count}</CardTitle>
                    <CardTitle className="font-bold text-red-600">Total Failed : {Total_failed_count}</CardTitle>
                    <CardTitle className="font-bold text-orange-600">Combined Data Count : {combinedData.length}</CardTitle>
                    {combinedData.length > 0 && (

                        <Button
                            onClick={() => exportToExcel(combinedData, 'combined_data')}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            Export Combined Data to Excel
                        </Button>
                    )}
                </CardHeader>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-bold text-xl">DETAILED RESULTS</CardTitle>
                    {activeSections.length > 0 && (
                        <Button onClick={exportAllTabsToExcel} variant="outline" className="flex items-center  gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            Export All Tabs
                        </Button>

                    )}
                </CardHeader>
                <CardContent>
                    {activeSections.length === 0 ? (
                        <div className="text-center p-4">
                            <p>{message}</p>
                        </div>
                    ) : (
                        <Tabs defaultValue={activeSections[0]?.key || ''} className="w-full">
                            <div className="overflow-x-auto pb-2">
                                <TabsList className="flex w-full justify-start bg-[#1c9eda] rounded-md p-1">
                                    {activeSections.map((section) => (
                                        <TabsTrigger
                                            key={section.key}
                                            value={section.key}
                                            className="text-white px-4 py-2 rounded-md hover:bg-[#1580b5] data-[state=active]:bg-white data-[state=active]:text-[#1c9eda] transition-colors"
                                        >
                                            {section.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            {activeSections.map((section) => {
                                const data = otherSections[section.key] || [];
                                const currentPage = paginationState[section.key] || 1;
                                const totalPages = Math.ceil(data.length / itemsPerPage);
                                const paginatedData = data.slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage
                                );

                                const changePage = (newPage: number) => {
                                    setPaginationState((prev) => ({
                                        ...prev,
                                        [section.key]: newPage,
                                    }));
                                };

                                return (
                                    <TabsContent key={section.key} value={section.key} className="pt-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="font-bold text-xl">{section.label}</CardTitle>
                                                <span className="font-bold">Total count: {data.length}</span>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader className="bg-[#0097eb]">
                                                            <TableRow >
                                                                {orderedColumns.map((column) => (
                                                                    <TableHead key={column} className="font-bold text-white hover:text-white hover:bg-[#0097eb]">
                                                                        {column.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                                                    </TableHead>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {paginatedData.map((item: DataItem, index: number) => (
                                                                <TableRow key={index}>
                                                                    {orderedColumns.map((column) => (
                                                                        <TableCell key={`${index}-${column}`}>
                                                                            {formatValue(item[column])}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>

                                                    {totalPages > 1 && (
                                                        <div className="flex justify-between items-center mt-4">
                                                            <p className="text-sm text-gray-600">
                                                                Page {currentPage} of {totalPages}
                                                            </p>
                                                            <div className="space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => changePage(Math.max(currentPage - 1, 1))}
                                                                    disabled={currentPage === 1}
                                                                >
                                                                    Previous
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
                                                                    disabled={currentPage === totalPages}
                                                                >
                                                                    Next
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
});
