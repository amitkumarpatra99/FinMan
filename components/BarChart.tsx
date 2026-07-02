"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
        },
    },
};

const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface BarChartProps {
    spendingData?: number[];
    incomeData?: number[];
    labels?: string[];
}

const BarChart = ({ 
    spendingData = [1200, 1900, 300, 500, 200, 300, 1500], 
    incomeData = [2500, 2500, 2500, 2600, 2500, 2500, 3000], 
    labels = defaultLabels.slice(0, 7)
}: BarChartProps) => {
    
    const data = {
        labels,
        datasets: [
            {
                label: 'Spending (₹)',
                data: spendingData,
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
            {
                label: 'Income (₹)',
                data: incomeData,
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
            }
        ],
    };

    return <Bar options={options} data={data} />;
}

export default BarChart;
