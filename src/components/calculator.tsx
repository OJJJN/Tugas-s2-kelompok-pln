import React, { useState } from "react";

const Calculator: React.FC = () => {
  const [results, setResults] = useState({
    npv: 0,
    irr: 0,
    arr: 0,
    pp: 0,
    pi: 0,
  });

  const calculate = (event: React.FormEvent) => {
    event.preventDefault();

    const salesInput = (document.getElementById("sales") as HTMLInputElement).value.split(",").map(Number);
    const costPercentage = parseFloat((document.getElementById("costPercentage") as HTMLInputElement).value) / 100;
    const fixedCost = parseFloat((document.getElementById("fixedCost") as HTMLInputElement).value);
    const taxRate = parseFloat((document.getElementById("taxRate") as HTMLInputElement).value) / 100;
    const discountRate = parseFloat((document.getElementById("discountRate") as HTMLInputElement).value) / 100;
    const investment = parseFloat((document.getElementById("investment") as HTMLInputElement).value);

    let npv = 0;
    let totalCashFlow = 0;
    let cumulativeCashFlow = 0;
    let paybackPeriod = -1;

    salesInput.forEach((sale, i) => {
      const cost = sale * costPercentage + fixedCost;
      const profit = sale - cost;
      const tax = profit * taxRate;
      const netProfit = profit - tax;
      const cashFlow = netProfit;
      const discountedCashFlow = cashFlow / Math.pow(1 + discountRate, i + 1);

      npv += discountedCashFlow;
      totalCashFlow += cashFlow;
      cumulativeCashFlow += cashFlow;

      if (cumulativeCashFlow >= investment && paybackPeriod === -1) {
        paybackPeriod = i + 1;
      }
    });

    const irr = calculateIRR(salesInput, investment);
    const arr = (totalCashFlow / salesInput.length) / investment * 100;
    const pi = npv / investment;

    setResults({ npv, irr, arr, pp: paybackPeriod, pi });
  };

  const calculateIRR = (sales: number[], investment: number) => {
    let rate = 0.1;
    let increment = 0.001;
    let npv = 0;
    let iterations = 10000;

    while (iterations-- > 0) {
      npv = sales.reduce((sum, sale, i) => {
        return sum + sale / Math.pow(1 + rate, i + 1);
      }, -investment);

      if (Math.abs(npv) < 0.01) break;
      rate += npv > 0 ? increment : -increment;
    }

    return rate * 100;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-5 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">Investment Feasibility Calculator</h1>
        <form onSubmit={calculate} className="space-y-4">
          <div>
            <label className="block text-gray-700">Sales Projection (comma-separated):</label>
            <input type="text" id="sales" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Variable Cost Percentage (%):</label>
            <input type="number" id="costPercentage" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Fixed Cost (Rp):</label>
            <input type="number" id="fixedCost" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Tax Rate (%):</label>
            <input type="number" id="taxRate" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Discount Rate (%):</label>
            <input type="number" id="discountRate" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Initial Investment (Rp):</label>
            <input type="number" id="investment" className="w-full p-2 border rounded" required />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Calculate</button>
        </form>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Results:</h2>
          <p>NPV: Rp {results.npv.toFixed(2)}</p>
          <p>IRR: {results.irr.toFixed(2)}%</p>
          <p>ARR: {results.arr.toFixed(2)}%</p>
          <p>Payback Period: {results.pp} years</p>
          <p>Profitability Index: {results.pi.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
