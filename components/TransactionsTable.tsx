import React from 'react'

const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
    if (transactions.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600">No transactions available for this account.</p>
            </div>
        )
    }

    return (
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
                    {transactions.map((t) => {
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
    )
}

export default TransactionsTable
