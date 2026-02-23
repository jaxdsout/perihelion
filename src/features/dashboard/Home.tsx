import { useAuthStore } from "@/features/auth/store";
import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
import { BarGraph, DonutGraph } from "./components/Graphs";
import Tasks from "./components/Tasks";
import { UpcomingMoveIns } from "./components/Upcoming";
import "./dashboard.css";
import { useDashboardStore } from "./store";

export default function DashboardHome() {
  const { upcoming, loadDashboard } = useDashboardStore();
  const barRef = useRef<HTMLCanvasElement>(null);
  const donutRef = useRef<HTMLCanvasElement>(null);
  const barChart = useRef<Chart | null>(null);
  const donutChart = useRef<Chart | null>(null);

  const { user } = useAuthStore.getState();
  console.log("user", user)

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    BarGraph({ chartRef: barRef, chartInstance: barChart, upcoming });
  }, [upcoming]);

  useEffect(() => {
    DonutGraph({ chartRef: donutRef, chartInstance: donutChart, upcoming });
  }, [upcoming]);

  return (
    <div className="dashHome">
      <div className="dashPanel tasks">
        <div className="dashPanelHeader">
          <h3>Tasks</h3>
        </div>
        <div className="dashPanelBody">
          <Tasks />
        </div>
      </div>

      <div className="dashPanel charts">
        <div className="dashPanelHeader">
          <h3>Upcoming Move-Ins</h3>
        </div>
        <div className="dashPanelBody">
          <UpcomingMoveIns />
        </div>

        <div className="chartsRow">
          <div className="chartBox">
            <h4>Monthly Commission</h4>
            <div className="chartCanvas">
              <canvas ref={barRef} />
            </div>
          </div>
          <div className="chartBox">
            <h4>Deal Status</h4>
            <div className="chartCanvas">
              {upcoming.length === 0 ? (
                <p className="emptyState">No data yet.</p>
              ) : (
                <canvas ref={donutRef} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
