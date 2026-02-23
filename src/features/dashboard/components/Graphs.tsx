import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { RefObject } from "react";
import type { UpcomingDeal } from "../store";

Chart.register(BarController, DoughnutController, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

interface GraphProps {
  chartRef: RefObject<HTMLCanvasElement | null>;
  chartInstance: RefObject<Chart | null>;
  upcoming: UpcomingDeal[];
}

export function DonutGraph({ chartRef, chartInstance, upcoming }: GraphProps) {
  if (!chartRef.current) return;
  const paid = upcoming.filter((d) => parseFloat(d.commission) > 0).length;
  const pending = upcoming.length - paid;

  if (chartInstance.current) chartInstance.current.destroy();
  if (upcoming.length === 0) return;

  chartInstance.current = new Chart(chartRef.current, {
    type: "doughnut",
    data: {
      labels: ["Paid", "Pending"],
      datasets: [
        {
          data: [paid, pending],
          backgroundColor: ["rgba(74,222,128,0.7)", "rgba(255,255,255,0.12)"],
          borderColor: ["rgba(74,222,128,0.9)", "rgba(255,255,255,0.2)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#666", font: { size: 11 } },
        },
      },
      cutout: "65%",
    },
  });
  return () => { chartInstance.current?.destroy(); };
}

export function BarGraph({ chartRef, chartInstance, upcoming }: GraphProps) {
  if (!chartRef.current) return;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthly = Array(12).fill(0);
  upcoming.forEach((d) => {
    const m = new Date(d.move_date).getMonth();
    monthly[m] += parseFloat(d.commission || "0");
  });

  if (chartInstance.current) chartInstance.current.destroy();
  chartInstance.current = new Chart(chartRef.current, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Commission ($)",
          data: monthly,
          backgroundColor: "rgba(255,255,255,0.12)",
          borderColor: "rgba(255,255,255,0.35)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: "#1a1a1a" }, ticks: { color: "#666" } },
        y: { grid: { color: "#1a1a1a" }, ticks: { color: "#666" } },
      },
    },
  });
  return () => { chartInstance.current?.destroy(); };
}