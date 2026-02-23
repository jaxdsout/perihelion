import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
import "../dashboard.css";
import { useDashboardStore } from "../store";
import { BarGraph, DonutGraph } from "./Graphs";
import Tasks from "./Tasks";

export default function DashboardHome() {
  const { upcoming, loadDashboard } = useDashboardStore();
  const barRef = useRef<HTMLCanvasElement>(null);
  const donutRef = useRef<HTMLCanvasElement>(null);
  const barChart = useRef<Chart | null>(null);
  const donutChart = useRef<Chart | null>(null);

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
          {upcoming.length === 0 ? (
            <p className="emptyState">No upcoming deals.</p>
          ) : (
            <table className="upcomingTable">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Property</th>
                  <th>Move Date</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((d) => (
                  <tr key={d.id}>
                    <td>{d.client_name}</td>
                    <td>{d.prop_name}</td>
                    <td>{d.move_date}</td>
                    <td className="upcomingCommission">${d.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
