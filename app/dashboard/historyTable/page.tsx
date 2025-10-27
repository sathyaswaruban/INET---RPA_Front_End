"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Loader from "../loader/page";

// User and History types
interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

type History = {
  id: number;
  uid: number;
  UserName: string;
  ServiceName: string;
  FromDate: string;
  ToDate: string;
  UploadedFileName: string;
  ResponseMessage: string;
  ResponseStatus: string;
  createdAt: string;
};

// Utility for formatting date to YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const ITEMS_PER_PAGE = 15;

const HistoryTableWithFilters = () => {
  // State declarations
  const today = formatDate(new Date());
  const [data, setData] = useState<History[]>([]);
  const [filtered, setFiltered] = useState<History[]>([]);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const router = useRouter();

  // Fetch user info
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

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/fetch_user_history");
        if (res.data.success) {
          const allData = res.data.data;
          const todayStr = formatDate(new Date());
          const todayData = allData.filter((item: History) => {
            const recordDate = new Date(item.createdAt).toISOString().slice(0, 10);
            return recordDate === todayStr;
          });
          setData(allData);
          setFiltered(todayData);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Handlers
  const handleFilter = useCallback(() => {
    setIsFiltering(true);
    const filteredData = data.filter((item: History) => {
      const itemDate = item.createdAt.slice(0, 10);
      const inDateRange = itemDate >= fromDate && itemDate <= toDate;
      const textMatch =
        item.UserName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ServiceName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ResponseStatus.toLowerCase().includes(searchText.toLowerCase());
      return inDateRange && (searchText === "" || textMatch);
    });
    setFiltered(filteredData);
    setCurrentPage(1);
    setIsFiltering(false);
  }, [data, fromDate, toDate, searchText]);

  const handleToDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedToDate = e.target.value;
    setToDate(selectedToDate);
    const todayStr = formatDate(new Date());
    if (fromDate && selectedToDate < fromDate) {
      toast.error('To Date cannot be earlier than From Date.', {
        position: "top-center",
        duration: 2000,
      });
      setToDate(todayStr);
    }
  }, [fromDate]);

  const handleFromDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFromDate = e.target.value;
    const todayStr = formatDate(new Date());
    setFromDate(selectedFromDate);
    if (toDate && toDate < selectedFromDate) {
      toast.error('To Date cannot be earlier than From Date.', {
        position: "top-center",
        duration: 2000,
      });
      setFromDate(todayStr);
    }
  }, [toDate]);

  const handleClear = useCallback(() => {
    const todayStr = formatDate(new Date());
    const todayData = data.filter((item: History) => {
      const recordDate = new Date(item.createdAt).toISOString().slice(0, 10);
      return recordDate === todayStr;
    });
    setFromDate(todayStr);
    setToDate(todayStr);
    setSearchText("");
    setFiltered(todayData);
    setCurrentPage(1);
  }, [data]);

  // Pagination logic
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
       <div className="flex items-start mb-8">
                <h1 className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary-foreground)]">
                    History Table
                </h1>
            </div>
      <h2 className="text-2xl font-bold mb-4 text-center" tabIndex={0}>User Task History</h2>
      <Card className="mb-6 mt-0 pt-0 shadow-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader className="card-header rounded-t-2xl px-6 py-4">
          <CardTitle className="text-xl font-bold text-[var(--primary-foreground)]">Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 items-end"
            onSubmit={e => { e.preventDefault(); handleFilter(); }}
            aria-label="Filter form"
          >
            <div>
              <label htmlFor="from-date" className="block text-sm font-bold mb-1 text-[var(--primary)]">From Date</label>
              <input
                id="from-date"
                type="date"
                onChange={handleFromDateChange}
                value={fromDate}
                className="border border-[var(--border)] rounded px-3 py-2 w-full focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input)] text-[var(--foreground)]"
                aria-label="From Date"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="block text-sm font-bold mb-1 text-[var(--primary)]">To Date</label>
              <input
                id="to-date"
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                className="border border-[var(--border)] rounded px-3 py-2 w-full focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input)] text-[var(--foreground)]"
                aria-label="To Date"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-bold mb-1 text-[var(--primary)]">Search</label>
              <input
                id="search"
                type="text"
                placeholder="Search by Name, Service, Status"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="border border-[var(--border)] rounded px-3 py-2 w-full focus:ring-2 focus:ring-[var(--primary)] bg-[var(--input)] text-[var(--foreground)]"
                aria-label="Search"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                onClick={handleFilter}
                className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] text-[var(--primary-foreground)] cursor-pointer px-4 py-2 rounded-lg hover:from-[var(--primary)] hover:to-[var(--secondary)] w-full font-bold transition focus:ring-2 focus:ring-blue-400"
                aria-label="Search"
                disabled={isFiltering}
              >
                {isFiltering ? <span className="loader mr-2" /> : null}Search
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="border border-[var(--primary)] dark:text-[var(--primary-foreground)] dark:border-[var(--primary-foreground)] cursor-pointer text-[var(--primary)] px-4 py-2 rounded-lg hover:bg-[var(--muted)] w-full font-bold transition focus:ring-2 focus:ring-blue-400"
                aria-label="Clear"
              >
                Clear
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="overflow-x-auto shadow-xl border border-[var(--border)] rounded-2xl bg-[var(--card)] text-[var(--card-foreground)]">
        <table className="min-w-full text-sm" aria-label="User Task History Table">
          <thead className="text-[var(--primary-foreground)] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center px-4 py-4 text-muted-foreground">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((entry, index) => (
                <tr key={entry.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
                  <td className="px-4 py-2">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="px-4 py-2">{entry.UserName}</td>
                  <td className="px-4 py-2">{entry.ServiceName}</td>
                  <td className="px-4 py-2">{entry.FromDate.slice(0, 10)}</td>
                  <td className="px-4 py-2">{entry.ToDate.slice(0, 10)}</td>
                  <td className="px-4 py-2 truncate max-w-[120px]" title={entry.UploadedFileName}>{entry.UploadedFileName}</td>
                  <td className="px-4 py-2 truncate max-w-[160px]" title={entry.ResponseMessage}>{entry.ResponseMessage}</td>
                  <td className={`px-4 py-2 font-semibold ${entry.ResponseStatus === "Success" ? "text-green-600" : "text-red-500"}`}>{entry.ResponseStatus}</td>
                  <td className="px-4 py-2">{entry.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
          {/* Summary row */}
          <tfoot>
            <tr>
              <td colSpan={9} className="text-right px-4 py-2 text-xs text-[var(--muted-foreground)]">
                Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
        <span className="text-sm text-[var(--muted-foreground)]">
          Page {currentPage} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-[var(--muted)] text-[var(--primary)] px-4 py-1 rounded-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold text-xl transition"
            aria-label="Previous Page"
          >
            &laquo;
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="bg-[var(--muted)] text-[var(--primary)] px-4 py-1 rounded-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold text-xl transition"
            aria-label="Next Page"
          >
            &raquo;
          </button>

        </div>
      </div>
    </div>
  );
};

export default HistoryTableWithFilters;
