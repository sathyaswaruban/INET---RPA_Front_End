"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

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

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const ITEMS_PER_PAGE = 15;

const HistoryTableWithFilters = () => {
  const today = formatDate(new Date());
  const [data, setData] = useState<History[]>([]);
  const [filtered, setFiltered] = useState<History[]>([]);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/api/fetch_user_history");
        if (res.data.success) {
          const allData = res.data.data;
          const todayStr = formatDate(new Date());

          const todayData = allData.filter((item: History) => {
            const recordDate = new Date(item.createdAt).toISOString().slice(0, 10); // ✅ FIXED
            return recordDate === todayStr;
          });

          setData(allData);
          setFiltered(todayData);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    fetchHistory();
  }, []);

  const handleFilter = () => {
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
  };
  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedToDate = e.target.value;
    setToDate(selectedToDate);
    const todayStr = formatDate(new Date());


    // Validation
    if (fromDate && selectedToDate < fromDate) {
      toast.error('❌ To Date cannot be earlier than From Date');
      setToDate(todayStr);

    }

  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFromDate = e.target.value;
    const todayStr = formatDate(new Date());

    setFromDate(selectedFromDate);

    // Optional: validate toDate again
    if (toDate && toDate < selectedFromDate) {
      toast.error('❌ To Date cannot be earlier than From Date');
      setFromDate(todayStr);
    }

  };


  const handleClear = () => {
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
  };

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">User Task History</h2>


      <div className="bg-white shadow rounded-lg p-4 mb-6 justify-content grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-bold">From Date</label>
          <input
            type="date"
            onChange={handleFromDateChange}
            value={fromDate}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold">Search</label>
          <input
            type="text"
            placeholder="Search by Name, Service, Status"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 w-full"
          >
            Clear
          </button>
        </div>
      </div>


      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full bg-white text-sm">
          <thead className="text-white text-left bg-[#0097eb]">
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
                <td colSpan={9} className="text-center px-4 py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((entry, index) => (
                <tr key={entry.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="px-4 py-2">{entry.UserName}</td>
                  <td className="px-4 py-2">{entry.ServiceName}</td>
                  <td className="px-4 py-2">{entry.FromDate.slice(0, 10)}</td>
                  <td className="px-4 py-2">{entry.ToDate.slice(0, 10)}</td>
                  <td className="px-4 py-2 truncate max-w-[120px]">{entry.UploadedFileName}</td>
                  <td className="px-4 py-2 truncate max-w-[160px]">{entry.ResponseMessage}</td>
                  <td className={`px-4 py-2 font-semibold ${entry.ResponseStatus === "Success" ? "text-green-600" : "text-red-500"}`}>
                    {entry.ResponseStatus}
                  </td>
                  <td className="px-4 py-2">{entry.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="bg-gray-200 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTableWithFilters;
