// Event Listener untuk Form Kalkulator
document.getElementById("calculator-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Ambil Input dari Form
  const sales = document.getElementById("sales").value.split(",").map(Number);
  const costPercentage = parseFloat(document.getElementById("costPercentage").value) / 100;
  const fixedCost = parseFloat(document.getElementById("fixedCost").value);
  const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
  const discountRate = parseFloat(document.getElementById("discountRate").value) / 100;
  const investment = parseFloat(document.getElementById("investment").value);

  // Variabel Awal untuk Kalkulasi
  let npv = 0;
  let totalCashFlow = 0;
  let cumulativeCashFlow = 0;
  let paybackPeriod = -1;

  // Kalkulasi NPV, Payback Period, dan Cash Flow
  sales.forEach((sale, i) => {
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

  // Kalkulasi IRR, ARR, dan PI
  const irr = calculateIRR(sales, investment);
  const arr = (totalCashFlow / sales.length) / investment * 100;
  const pi = npv / investment;

  // Tampilkan Hasil di Halaman
  document.getElementById("npv").textContent = `NPV: Rp ${npv.toFixed(2)}`;
  document.getElementById("irr").textContent = `IRR: ${irr.toFixed(2)}%`;
  document.getElementById("arr").textContent = `ARR: ${arr.toFixed(2)}%`;
  document.getElementById("pp").textContent = `Payback Period (PP): ${paybackPeriod} years`;
  document.getElementById("pi").textContent = `Profitability Index (PI): ${pi.toFixed(2)}`;

  document.getElementById("results").classList.remove("hidden");
});

// Fungsi untuk Menghitung IRR
function calculateIRR(sales, investment) {
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
}

// Tambahkan Nama Kelompok
const teamMembers = [
  "LUKAS NEROTUMI LENA 91124009",
  "MARTHEN PRIMAGALIH M 91124010",
  "MOHAMAD FAUZAN AKMAL PRATAMA 91124012",
  "MUHAMMAD ASRORI 91124013",
  "OKTA PURNAMA 91124015",
  "WILDAN FIRDAUS 91124070"
];

// Buat Elemen untuk Nama Kelompok
const teamContainer = document.createElement("div");
teamContainer.classList.add("bg-white", "p-6", "rounded", "shadow-md", "mt-5");

const teamTitle = document.createElement("h2");
teamTitle.classList.add("text-xl", "font-bold", "mb-4", "text-center");
teamTitle.textContent = "Kelompok:";
teamContainer.appendChild(teamTitle);

const teamList = document.createElement("ul");
teamList.classList.add("list-disc", "ml-5");
teamMembers.forEach(member => {
  const listItem = document.createElement("li");
  listItem.classList.add("text-gray-700", "mb-2");
  listItem.textContent = member;
  teamList.appendChild(listItem);
});

teamContainer.appendChild(teamList);

// Sisipkan Elemen Nama Kelompok Setelah Container Utama
document.body.insertBefore(teamContainer, document.querySelector(".container").nextSibling);
