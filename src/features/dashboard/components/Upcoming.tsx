import { useDashboardStore } from "../store";

export function UpcomingMoveIns() {
  const { upcoming } = useDashboardStore();

  return (
    <>
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
    </>
  )
}