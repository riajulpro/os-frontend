'use client'
import { useGetEarningQuery } from '@/redux/features/sell/sell.api';
import { useState } from 'react';

// Define the types for your data
type MonthData = {
    month: string;
    revenue: number;
    netIncome: number;
};

type YearData = {
    year: number;
    totalRevenue: number;
    totalNetIncome: number;
    months: MonthData[];
};

const EarningPage = () => {
    const { data: yearlyData } = useGetEarningQuery(undefined);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-3">Yearly Earnings</h2>
            <div className="mb-4">
                <label htmlFor="year-select" className="block text-gray-700 mb-2">Select Year:</label>
                <select
                    id="year-select"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                    onChange={handleYearChange}
                    value={selectedYear !== null ? selectedYear : ''}
                >
                    <option value="" disabled>Select a year</option>
                    {yearlyData?.data.map((yearData: YearData) => (
                        <option key={yearData.year} value={yearData.year}>
                            {yearData.year}
                        </option>
                    ))}
                </select>
            </div>

            {yearlyData?.data
                .filter((yearData: YearData) => selectedYear === null || yearData.year === selectedYear)
                .map((yearData: YearData) => (
                    <div key={yearData.year} className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h2 className="text-xl font-semibold mb-2">{yearData.year} Earnings</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold">${yearData.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Total Net Income</p>
                                <p className="text-2xl font-bold">${yearData.totalNetIncome.toLocaleString()}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">Monthly Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {yearData.months.map((monthData: MonthData) => (
                                <div key={monthData.month} className="bg-white p-4 rounded-lg shadow-md">
                                    <p className="text-gray-600">{monthData.month}</p>
                                    <p className="text-xl font-semibold">${monthData.revenue.toLocaleString()}</p>
                                    <p className="text-gray-600">Net Income: ${monthData.netIncome.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

        </div>
    );
};

export default EarningPage;
