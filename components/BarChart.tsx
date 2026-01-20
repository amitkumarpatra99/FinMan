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
            display: true,
            text: 'Monthly Spending',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Spending',
            data: [1200, 1900, 300, 500, 200, 300, 1500],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Income',
            data: [2500, 2500, 2500, 2600, 2500, 2500, 3000],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
    ],
};

const BarChart = () => {
    return <Bar options={options} data={data} />;
}

export default BarChart;
