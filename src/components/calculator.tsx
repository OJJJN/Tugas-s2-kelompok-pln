import React, { useState } from "react";

const Calculator: React.FC = () => {
  const [results, setResults] = useState({
    npv: 0,
    irr: 0,
    arr: 0,
    pp: 0,
    pi: 0,
  });

  const [cashFlowDetails, setCashFlowDetails] = useState<
    { year: number; netProfit: number; depreciation: number; cashFlow: number }[]
  >([]);

  const calculate = (event: React.FormEvent) => {
    event.preventDefault();

    const salesInput = (document.getElementById("sales") as HTMLInputElement).value
      .split(",")
      .map(Number);
    const costPercentage = parseFloat(
      (document.getElementById("costPercentage") as HTMLInputElement).value
    ) / 100;
    const fixedCost = parseFloat(
      (document.getElementById("fixedCost") as HTMLInputElement).value
    );
    const taxRate = parseFloat(
      (document.getElementById("taxRate") as HTMLInputElement).value
    ) / 100;
    const discountRate = parseFloat(
      (document.getElementById("discountRate") as HTMLInputElement).value
    ) / 100;
    const investment = parseFloat(
      (document.getElementById("investment") as HTMLInputElement).value
    );
    const economicLife = parseInt(
      (document.getElementById("economicLife") as HTMLInputElement).value
    );

    let npv = 0;
    let totalCashFlow = 0;
    let cumulativeCashFlow = 0;
    let paybackPeriod = -1;

    const cashFlows = salesInput.map((sale, i) => {
      const cost = sale * costPercentage + fixedCost;
      const profit = sale - cost;
      const tax = profit * taxRate;
      const netProfit = profit - tax;
      const depreciation = fixedCost / economicLife; // Straight-line depreciation
      const cashFlow = netProfit + depreciation;
      const discountedCashFlow = cashFlow / Math.pow(1 + discountRate, i + 1);

      npv += discountedCashFlow;
      totalCashFlow += cashFlow;
      cumulativeCashFlow += cashFlow;

      if (cumulativeCashFlow >= investment && paybackPeriod === -1) {
        paybackPeriod = i + 1;
      }

      return cashFlow;
    });

    const cashFlowDetails = salesInput.map((sale, i) => {
      const cost = sale * costPercentage + fixedCost;
      const profit = sale - cost;
      const tax = profit * taxRate;
      const netProfit = profit - tax;
      const depreciation = fixedCost / economicLife;
      const cashFlow = netProfit + depreciation;

      return {
        year: i + 1,
        netProfit,
        depreciation,
        cashFlow,
      };
    });

    cashFlows.unshift(-investment); // Add initial investment as cash outflow

    const irr = calculateIRR(cashFlows);
    const arr = (totalCashFlow / salesInput.length) / investment * 100;
    const pi = npv / investment;

    setCashFlowDetails(cashFlowDetails);
    setResults({ npv, irr, arr, pp: paybackPeriod, pi });
  };

  const calculateIRR = (cashFlows: number[]) => {
    let rate = 0.1;
    let increment = 0.001;
    let npv = 0;
    let iterations = 10000;

    while (iterations-- > 0) {
      npv = cashFlows.reduce((sum, cashFlow, i) => {
        return sum + cashFlow / Math.pow(1 + rate, i);
      }, 0);

      if (Math.abs(npv) < 0.01) break;
      rate += npv > 0 ? increment : -increment;
    }

    return rate * 100;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-5 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-5 text-center">
          Investment Feasibility Calculator
        </h1>
        <h2 className="text-lg font-bold mb-4">Kelompok:</h2>
        <ul className="list-disc ml-5">
          <li>LUKAS NEROTUMI LENA 91124009</li>
          <li>MARTHEN PRIMAGALIH M 91124010</li>
          <li>MOHAMAD FAUZAN AKMAL PRATAMA 91124012</li>
          <li>MUHAMMAD ASRORI 91124013</li>
          <li>OKTA PURNAMA 91124015</li>
          <li>WILDAN FIRDAUS 91124070</li>
        </ul>
        <form onSubmit={calculate} className="space-y-4">
          {/* Form inputs here */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Calculate
          </button>
        </form>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Cash Flow Details:</h2>
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            {/* Table headers and rows */}
          </table>
        </div>
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
