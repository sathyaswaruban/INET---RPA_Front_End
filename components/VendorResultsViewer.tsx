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
import { FileSpreadsheet } from "lucide-react";
import { saveAs } from 'file-saver';

interface DataItem {
    [key: string]: any;
}

interface VendorResultsViewerProps {
    responseData: any;
}

export const VendorResultsViewer = memo(({ responseData }: VendorResultsViewerProps) => {
    const localData = responseData;
    const Statement_count = localData?.data?.statement_count;
    const Ledger_count = localData?.data?.ledger_count;
    const Total_matched_count = localData?.data?.matched_trans_count
    const Total_failed_count = localData?.data?.failed_trans_count
    const Ledger_credit_count = localData?.data?.ledger_credit_count
    const otherSections = { ...localData.data };
    const message = localData?.data?.message || " "
    const dataSections = [
        { key: "not_in_ledger", label: "Not in Ledger" },
        // { key: "matching_refunds", label: "Matching Refunds" },
        { key: "mismatch_statement_refunds", label: "Mismatch Statement Refunds" },
        { key: "mismatch_ledger_refunds", label: "Mismatch Ledger Refunds" },
        { key: "not_in_statement", label: "Not in Statement" },
        { key: "amount_mismatch", label: "Ledger & Statement Amount Mismatch" },
        { key: "credit_transactions_ledger", label: "Credit Transactions in Ledger" },
    ];


    const activeSections = dataSections.filter(section => {
        const sectionData = otherSections[section.key];
        return Array.isArray(sectionData) && sectionData.length > 0;
    });


    const service_name = localData?.service_name || " "
    let orderedColumns: string[] = [];
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    let matchedSection: { key: string; label: string }[] = [];

    if (service_name == "AEPS") {
        matchedSection = [
            { key: "matching_trans", label: "Matched Transactions" },
        ]
    }
    else {
        matchedSection = [
            { key: "matching_trans", label: "Matched Transactions" },
            { key: "matching_refunds", label: "Matching Refunds" },
        ];
    }


    const activeMatchedSections = matchedSection.filter(section => {
        const sectionData = otherSections[section.key];
        return Array.isArray(sectionData) && sectionData.length > 0;
    });

    if (service_name == "AEPS") {
        orderedColumns = [
            "SETTLED_ID",
            "COMMISSION_SNO",
            "SERIALNUMBER",
            "ACKNO",
            "AMOUNT_STATEMENT",
            "COMMISSION_STATEMENT",
            "AMOUNT_LEDGER",
            "UTR",
            "TYPE",
            "STATUS",
            "DATE",
            "SUM_AMOUNT",
        ];
    }
    else if (service_name == "MATM") {
        orderedColumns = [
            "BCID", "AMOUNT_STATEMENT", "AMOUNT_LEDGER", "RRN",
            "DATE",
        ]
    }
    else if (service_name == "BBPS") {
        orderedColumns = [
            "TRANS_REF_ID", "AMOUNT_LEDGER", "AMOUNT_STATEMENT", "DATE"
        ];
    }
    else {
        orderedColumns = [
            "TXNID", "REFUND_TXNID", "REFID", "TYPE", "AMOUNT", "COMM", "TDS", "DATE"
        ];
    }

    // const exportToExcel = (data: DataItem[], fileName: string) => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //     XLSX.writeFile(workbook, `${fileName}.xlsx`);
    // };

    const exportMatchedTabsToExcel = () => {
        const workbook = XLSX.utils.book_new();

        activeMatchedSections.forEach((section) => {
            const data = otherSections[section.key] || [];
            if (data.length > 0) {
                const worksheet = XLSX.utils.json_to_sheet(data, { header: orderedColumns });
                XLSX.utils.book_append_sheet(workbook, worksheet, section.label || section.key);
            }
        });

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `VendorLedger_Matched_result_${service_name}_${formattedDate}.xlsx`);
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
        saveAs(blob, `VendorLedger_detailed_result_${service_name}_${formattedDate}.xlsx`);
    };

    const formatValue = (value: any) => {
        if (value === null || value === undefined || value === "") return "N/A";
        if (typeof value === "number" && isNaN(value)) return "N/A";
        return String(value);
    };

    const [paginationState, setPaginationState] = useState<{ [key: string]: number }>({});
    const itemsPerPage = 20;

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto px-2 md:px-0">
            <Card className="shadow-lg rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
                <CardHeader className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-2">
                    {/* Column 1 */}
                    <div className="col-span-1 flex flex-col gap-5">
                        <CardTitle className="text-[var(--primary)] text-center text-base bg-[var(--muted)] px-3 py-1 rounded-lg shadow-sm">
                            Statement Count: <span className="ml-1">{Statement_count}</span>
                        </CardTitle>
                        <CardTitle className="text-green-600 text-base mt-3 text-center bg-green-100 dark:bg-red-900/40 px-3 py-1 rounded-lg shadow-sm">
                            Total Matched: <span className="ml-1">{Total_matched_count}</span>
                        </CardTitle>

                    </div>

                    <div className="col-span-1 flex flex-col gap-5">
                        <CardTitle className="text-orange-600 text-base text-center bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-lg shadow-sm">
                            Ledger Count: <span className="ml-1">{Ledger_count}</span>
                        </CardTitle>
                        <CardTitle className="text-blue-600 text-base mt-3 text-center bg-blue-100 dark:bg-red-900/40 px-3 py-1 rounded-lg shadow-sm">
                            Total Ledger Credit: <span className="ml-1">{Ledger_credit_count}</span>
                        </CardTitle>
                    </div>
                    <div className="col-span-1 flex flex-col gap-5">
                        <CardTitle className="text-red-600 text-base text-center bg-red-100 dark:bg-red-900/40 px-3 py-1 rounded-lg shadow-sm">
                            Total Failed: <span className="ml-1">{Total_failed_count}</span>
                        </CardTitle>
                        {activeMatchedSections.length > 0 && (
                            <Button
                                onClick={exportMatchedTabsToExcel}
                                variant="outline"
                                className="border-blue-400 mt-3 text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition rounded-lg shadow-sm"
                            >
                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-blue-800">Export Matched Data</span>
                            </Button>
                        )}
                    </div>
                </CardHeader>
            </Card>
            <Card className="shadow-xl rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="font-bold text-2xl ml-5 text-[var(--primary)] tracking-tight">Detailed Results</CardTitle>
                    {activeSections.length > 0 && (
                        <Button
                            onClick={exportAllTabsToExcel}
                            variant="outline"
                            className="flex items-center mr-5 gap-2 border-[var(--primary)] hover:bg-[var(--muted)] transition rounded-lg shadow-sm"
                        >
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-[var(--primary)]">Export All Tabs</span>
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="pt-0">
                    {activeSections.length === 0 ? (
                        <div className="text-center p-8 text-[var(--muted-foreground)] text-lg font-medium">
                            <p>{message}</p>
                        </div>
                    ) : (
                        <Tabs defaultValue={activeSections[0]?.key || ''} className="w-full">
                            <div className="overflow-x-auto pb-2">
                                <TabsList className="flex w-full justify-start bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--secondary)] rounded-lg p-1 shadow-md">
                                    {activeSections.map((section) => (
                                        <TabsTrigger
                                            key={section.key}
                                            value={section.key}
                                            className="text-[var(--primary-foreground)] px-4 py-2 rounded-md font-semibold hover:bg-[var(--primary)]/80 data-[state=active]:bg-[var(--card)] data-[state=active]:text-[var(--primary)] transition-colors shadow-sm"
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
                                    <TabsContent key={section.key} value={section.key} className="pt-6">
                                        <Card className="rounded-lg shadow-md border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="font-bold text-lg text-[var(--primary)]">{section.label}</CardTitle>
                                                <span className="font-bold text-[var(--foreground)] bg-[var(--muted)] px-2 py-1 rounded-md shadow-sm">Total: {data.length}</span>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-inner">
                                                    <Table>
                                                        <TableHeader className="bg-gradient-to-r from-[var(--primary)] from-100% to-[var(--primary)]/80 to-80%">
                                                            <TableRow>
                                                                {orderedColumns.map((column) => (
                                                                    <TableHead
                                                                        key={column}
                                                                        className="font-bold text-[var(--primary-foreground)] text-sm uppercase tracking-wide px-3 py-2 whitespace-nowrap"
                                                                    >
                                                                        {column.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                                                    </TableHead>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {paginatedData.map((item: DataItem, index: number) => (
                                                                <TableRow
                                                                    key={index}
                                                                    className="hover:bg-[var(--muted)] transition"
                                                                >
                                                                    {orderedColumns.map((column) => (
                                                                        <TableCell
                                                                            key={`${index}-${column}`}
                                                                            className="px-3 py-2 text-[var(--card-foreground)] text-sm whitespace-nowrap"
                                                                        >
                                                                            {formatValue(item[column])}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>

                                                    {totalPages > 1 && (
                                                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-2 px-2">
                                                            <p className="text-sm text-[var(--muted-foreground)]">
                                                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                                                            </p>
                                                            <div className="flex gap-2 mb-2">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => changePage(Math.max(currentPage - 1, 1))}
                                                                    disabled={currentPage === 1}
                                                                    className={`rounded-lg px-4 py-1 font-semibold transition ${currentPage === 1
                                                                        ? "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] cursor-not-allowed"
                                                                        : "hover:bg-[var(--muted)] hover:text-[var(--primary)] border-[var(--primary)]"
                                                                        }`}
                                                                >
                                                                    &lt;&lt;
                                                                </Button>

                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
                                                                    disabled={currentPage === totalPages}
                                                                    className={`rounded-lg px-4 py-1 font-semibold transition ${currentPage === totalPages
                                                                        ? "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] cursor-not-allowed"
                                                                        : "hover:bg-[var(--muted)] hover:text-[var(--primary)] border-[var(--primary)]"
                                                                        }`}
                                                                >
                                                                    &gt;&gt;
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