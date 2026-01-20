'use client';

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import Pagination from "@/components/ui/pagination"

interface TransactionsTableProps {
    transactions: Transaction[];
    rowsPerPage?: number;
    enableSearch?: boolean;
    enablePagination?: boolean;
}

const TransactionsTable = ({
    transactions,
    rowsPerPage = 10,
    enableSearch = false,
    enablePagination = false
}: TransactionsTableProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    // Filter transactions based on search term
    const filteredTransactions = transactions.filter((t) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            t.name.toLowerCase().includes(searchLower) ||
            t.paymentChannel.toLowerCase().includes(searchLower) ||
            t.category.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

    // Slice transactions for pagination
    const currentTransactions = enablePagination
        ? filteredTransactions.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        )
        : filteredTransactions;

    const handleExport = () => {
        const headers = ["Transaction", "Amount", "Status", "Date", "Channel", "Category"];
        const csvContent = [
            headers.join(","),
            ...filteredTransactions.map(t => [
                t.name,
                t.amount,
                t.pending ? 'Pending' : 'Success',
                t.date,
                t.paymentChannel,
                t.category
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600">No transactions available for this account.</p>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                {enableSearch && (
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                        />
                    </div>
                )}

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition w-fit ml-auto"
                >
                    Export CSV
                </button>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Transaction</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 max-md:hidden">Channel</th>
                            <th className="px-6 py-3 max-md:hidden">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map((t) => {
                            const isDebit = t.type === 'debit';
                            const amountClass = isDebit ? 'text-red-600' : 'text-green-600';
                            const amountSign = isDebit ? '-' : '+';

                            return (
                                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {t.name}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${amountClass}`}>
                                        {amountSign}₹{Math.abs(t.amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.pending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {t.pending ? 'Pending' : 'Success'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{t.date}</td>
                                    <td className="px-6 py-4 capitalize max-md:hidden">{t.paymentChannel.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 max-md:hidden">
                                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                            {t.category}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {enablePagination && totalPages > 1 && (
                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    )
}

export default TransactionsTable
