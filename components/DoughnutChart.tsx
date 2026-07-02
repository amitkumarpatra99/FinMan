"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    accounts?: Account[];
    labels?: string[];
    data?: number[];
}

const DoughnutChart = ({ accounts, labels, data: customData }: DoughnutChartProps) => {
    const accountNames = accounts ? accounts.map((a) => a.name) : (labels || []);
    const balances = accounts ? accounts.map((a) => a.currentBalance) : (customData || []);

    const data = {
        datasets: [
            {
                label: accounts ? 'Balance (₹)' : 'Spent (₹)',
                data: balances,
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa']
            }
        ],
        labels: accountNames
    }

    return <Doughnut
        data={data}
        options={{
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }}
    />
}

export default DoughnutChart
