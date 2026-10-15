// import { useEffect, useState } from "react";
// import { Row, Col, Card, Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
// import {
//   ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
//   BarChart, Bar, PieChart, Pie, Cell,
// } from "recharts";
// import { getAnalytics } from "../../api/aiApi";

// const STATUS_COLORS = { PENDING: "#ffc107", CONFIRMED: "#198754", DONE: "#0dcaf0", CANCELLED: "#dc3545" };
// const SENTIMENT_COLORS = { positive: "#198754", neutral: "#6c757d", negative: "#dc3545" };

// const Kpi = ({ label, value, sub, color = "#212529" }) => (
//   <Card className="shadow-sm border-0 h-100">
//     <Card.Body>
//       <small className="text-muted">{label}</small>
//       <h3 className="mb-0" style={{ color }}>{value}</h3>
//       {sub && <small className="text-muted">{sub}</small>}
//     </Card.Body>
//   </Card>
// );

// const PieCard = ({ title, data, nameKey, colors }) => {
//   const shown = data.filter((d) => d.count > 0);
//   return (
//     <Card className="shadow-sm border-0 h-100">
//       <Card.Body>
//         <h6 className="mb-3">{title}</h6>
//         {shown.length === 0 ? (
//           <p className="text-muted">No data yet.</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={240}>
//             <PieChart>
//               <Pie data={shown} dataKey="count" nameKey={nameKey} innerRadius={50} outerRadius={85}
//                    label={(e) => `${e[nameKey]} (${e.count})`}>
//                 {shown.map((d) => (
//                   <Cell key={d[nameKey]} fill={colors[d[nameKey]] || "#adb5bd"} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default function AdminAnalytics() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const load = () => {
//     setLoading(true);
//     setError(null);
//     getAnalytics()
//       .then(setData)
//       .catch((e) => setError(e?.response?.data?.message || "Could not load analytics."))
//       .finally(() => setLoading(false));
//   };

//   useEffect(load, []);

//   if (loading) {
//     return (
//       <div className="text-center my-4">
//         <Spinner animation="border" size="sm" /> <span className="ms-2">Loading analytics...</span>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <Alert variant="warning" className="mb-4">
//         {error} <Button variant="link" size="sm" onClick={load}>Retry</Button>
//       </Alert>
//     );
//   }

//   const { kpis, status_breakdown, demand_by_category, bookings_per_month, sentiment_split, top_providers, forecast } = data;

//   // line chart data: actual months + dashed forecast point
//   const chartData = bookings_per_month.map((m) => ({ month: m.month, bookings: m.bookings }));
//   if (forecast) {
//     if (chartData.length) chartData[chartData.length - 1].forecast = chartData[chartData.length - 1].bookings;
//     chartData.push({ month: forecast.next_month, forecast: forecast.predicted });
//   }

//   return (
//     <div className="mb-5">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="mb-0">📊 Analytics</h3>
//         <Button size="sm" variant="outline-secondary" onClick={load}>Refresh</Button>
//       </div>

//       {/* KPIs */}
//       <Row className="g-3 mb-4">
//         <Col md={4} lg={2}><Kpi label="Total bookings" value={kpis.total_bookings} /></Col>
//         <Col md={4} lg={2}><Kpi label="Completed" value={kpis.completed} sub={`${kpis.completion_rate}%`} color="#198754" /></Col>
//         <Col md={4} lg={2}><Kpi label="Cancellation rate" value={`${kpis.cancellation_rate}%`} sub={`${kpis.cancelled} cancelled`} color="#dc3545" /></Col>
//         <Col md={4} lg={2}><Kpi label="Revenue (done)" value={`$${kpis.revenue}`} /></Col>
//         <Col md={4} lg={2}><Kpi label="Avg rating" value={kpis.avg_rating ?? "-"} sub={`${kpis.total_reviews} reviews`} color="#fd7e14" /></Col>
//         <Col md={4} lg={2}><Kpi label="Positive reviews" value={kpis.positive_pct != null ? `${kpis.positive_pct}%` : "-"} color="#198754" /></Col>
//       </Row>

//       {/* Trend + category */}
//       <Row className="g-3 mb-4">
//         <Col lg={7}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Body>
//               <h6 className="mb-3">Bookings per month</h6>
//               {chartData.length === 0 ? (
//                 <p className="text-muted">No booking dates yet.</p>
//               ) : (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#6c5ce7" strokeWidth={2} />
//                     <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#fd7e14" strokeWidth={2} strokeDasharray="6 4" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//               {forecast ? (
//                 <div className="mt-2">
//                   🔮 <strong>{forecast.next_month}</strong>: about <strong>{forecast.predicted}</strong> bookings
//                   {" "}<Badge bg={forecast.trend === "up" ? "success" : forecast.trend === "down" ? "danger" : "secondary"}>
//                     trend {forecast.trend}
//                   </Badge>
//                   {" "}<Badge bg="light" text="dark">{forecast.confidence} confidence</Badge>
//                   <div><small className="text-muted">{forecast.method} ({forecast.months_used} months). {forecast.note}</small></div>
//                 </div>
//               ) : (
//                 <small className="text-muted">Forecast needs at least 2 months of data.</small>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col lg={5}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Body>
//               <h6 className="mb-3">Demand by category</h6>
//               {demand_by_category.length === 0 ? (
//                 <p className="text-muted">No data yet.</p>
//               ) : (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={demand_by_category}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="category" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Bar dataKey="count" name="Bookings" fill="#0d6efd" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Status + sentiment + top providers */}
//       <Row className="g-3">
//         <Col lg={4}><PieCard title="Booking status" data={status_breakdown} nameKey="status" colors={STATUS_COLORS} /></Col>
//         <Col lg={4}><PieCard title="Review sentiment" data={sentiment_split} nameKey="sentiment" colors={SENTIMENT_COLORS} /></Col>
//         <Col lg={4}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Body>
//               <h6 className="mb-3">Top providers</h6>
//               {top_providers.length === 0 ? (
//                 <p className="text-muted">No data yet.</p>
//               ) : (
//                 <Table size="sm" className="mb-0">
//                   <thead>
//                     <tr><th>Provider</th><th>Bookings</th><th>Done</th><th>Rating</th></tr>
//                   </thead>
//                   <tbody>
//                     {top_providers.map((p) => (
//                       <tr key={p.provider}>
//                         <td>{p.provider}</td>
//                         <td>{p.bookings}</td>
//                         <td>{p.completed}</td>
//                         <td>{p.avg_rating != null ? `⭐ ${p.avg_rating}` : "-"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { Row, Col, Card, Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
// import {
//   ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
//   BarChart, Bar, PieChart, Pie, Cell,
// } from "recharts";
// import { getAnalytics } from "../../api/aiApi";

// const STATUS_COLORS = { PENDING: "#ffc107", CONFIRMED: "#198754", DONE: "#0dcaf0", CANCELLED: "#dc3545" };
// const SENTIMENT_COLORS = { positive: "#198754", neutral: "#6c757d", negative: "#dc3545" };

// const Kpi = ({ label, value, sub, color = "#212529" }) => (
//   <Card className="shadow-sm border-0 h-100">
//     <Card.Body>
//       <small className="text-muted">{label}</small>
//       <h3 className="mb-0" style={{ color }}>{value}</h3>
//       {sub && <small className="text-muted">{sub}</small>}
//     </Card.Body>
//   </Card>
// );

// const PieCard = ({ title, data, nameKey, colors }) => {
//   const shown = data.filter((d) => d.count > 0);
//   return (
//     <Card className="shadow-sm border-0 h-100">
//       <Card.Body>
//         <h6 className="mb-3">{title}</h6>
//         {shown.length === 0 ? (
//           <p className="text-muted">No data yet.</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={240}>
//             <PieChart>
//               <Pie data={shown} dataKey="count" nameKey={nameKey} innerRadius={50} outerRadius={85}
//                    label={(e) => `${e[nameKey]} (${e.count})`}>
//                 {shown.map((d) => (
//                   <Cell key={d[nameKey]} fill={colors[d[nameKey]] || "#adb5bd"} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default function AdminAnalytics() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const load = () => {
//     setLoading(true);
//     setError(null);
//     getAnalytics()
//       .then(setData)
//       .catch((e) => setError(e?.response?.data?.message || "Could not load analytics."))
//       .finally(() => setLoading(false));
//   };

//   useEffect(load, []);

//   if (loading) {
//     return (
//       <div className="text-center my-4">
//         <Spinner animation="border" size="sm" /> <span className="ms-2">Loading analytics...</span>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <Alert variant="warning" className="mb-4">
//         {error} <Button variant="link" size="sm" onClick={load}>Retry</Button>
//       </Alert>
//     );
//   }

//   const { kpis, status_breakdown, demand_by_category, bookings_per_month, sentiment_split, top_providers, forecast } = data;

//   // line chart data: actual months + dashed forecast point
//   const chartData = bookings_per_month.map((m) => ({ month: m.month, bookings: m.bookings }));
//   if (forecast) {
//     if (chartData.length) chartData[chartData.length - 1].forecast = chartData[chartData.length - 1].bookings;
//     chartData.push({ month: forecast.next_month, forecast: forecast.predicted });
//   }

//   return (
//     <div className="mb-5">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h6 className="am-section mb-0">Analytics</h6>
//         <Button size="sm" variant="outline-secondary" onClick={load}>Refresh</Button>
//       </div>

//       {/* KPIs */}
//       <Row className="g-3 mb-4">
//         <Col md={4} lg={2}><Kpi label="Total bookings" value={kpis.total_bookings} /></Col>
//         <Col md={4} lg={2}><Kpi label="Completed" value={kpis.completed} sub={`${kpis.completion_rate}%`} color="#198754" /></Col>
//         <Col md={4} lg={2}><Kpi label="Cancellation rate" value={`${kpis.cancellation_rate}%`} sub={`${kpis.cancelled} cancelled`} color="#dc3545" /></Col>
//         <Col md={4} lg={2}><Kpi label="Revenue (done)" value={`$${kpis.revenue}`} /></Col>
//         <Col md={4} lg={2}><Kpi label="Avg rating" value={kpis.avg_rating ?? "-"} sub={`${kpis.total_reviews} reviews`} color="#fd7e14" /></Col>
//         <Col md={4} lg={2}><Kpi label="Positive reviews" value={kpis.positive_pct != null ? `${kpis.positive_pct}%` : "-"} color="#198754" /></Col>
//       </Row>

//       {/* Trend + category */}
//       <Row className="g-3 mb-4">
//         <Col lg={7}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Body>
//               <h6 className="mb-3">Bookings per month</h6>
//               {chartData.length === 0 ? (
//                 <p className="text-muted">No booking dates yet.</p>
//               ) : (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#4f46e5" strokeWidth={2} />
//                     <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#fd7e14" strokeWidth={2} strokeDasharray="6 4" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//               {forecast ? (
//                 <div className="mt-2">
//                   Forecast <strong>{forecast.next_month}</strong>: about <strong>{forecast.predicted}</strong> bookings
//                   {" "}<Badge bg={forecast.trend === "up" ? "success" : forecast.trend === "down" ? "danger" : "secondary"}>
//                     trend {forecast.trend}
//                   </Badge>
//                   {" "}<Badge bg="light" text="dark">{forecast.confidence} confidence</Badge>
//                   <div><small className="text-muted">{forecast.method} ({forecast.months_used} months). {forecast.note}</small></div>
//                 </div>
//               ) : (
//                 <small className="text-muted">Forecast needs at least 2 months of data.</small>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col lg={5}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Body>
//               <h6 className="mb-3">Demand by category</h6>
//               {demand_by_category.length === 0 ? (
//                 <p className="text-muted">No data yet.</p>
//               ) : (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={demand_by_category}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="category" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Bar dataKey="count" name="Bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Status + sentiment + top providers */}
//       <Row className="g-3">
//         <Col lg={4}><PieCard title="Booking status" data={status_breakdown} nameKey="status" colors={STATUS_COLORS} /></Col>
//         <Col lg={4}><PieCard title="Review sentiment" data={sentiment_split} nameKey="sentiment" colors={SENTIMENT_COLORS} /></Col>
//         <Col lg={4}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Body>
//               <h6 className="mb-3">Top providers</h6>
//               {top_providers.length === 0 ? (
//                 <p className="text-muted">No data yet.</p>
//               ) : (
//                 <Table size="sm" className="mb-0">
//                   <thead>
//                     <tr><th>Provider</th><th>Bookings</th><th>Done</th><th>Rating</th></tr>
//                   </thead>
//                   <tbody>
//                     {top_providers.map((p) => (
//                       <tr key={p.provider}>
//                         <td>{p.provider}</td>
//                         <td>{p.bookings}</td>
//                         <td>{p.completed}</td>
//                         <td>{p.avg_rating != null ? `⭐ ${p.avg_rating}` : "-"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";
import { getAnalytics } from "../../api/aiApi";

const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#0ea5e9", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];
const STATUS_COLORS = { PENDING: "#f59e0b", CONFIRMED: "#10b981", DONE: "#6366f1", CANCELLED: "#ef4444" };
const SENTIMENT_COLORS = { positive: "#10b981", neutral: "#9ca3af", negative: "#ef4444" };

const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase();
const tick = { fontSize: 12, fill: "#6b7280" };
const tip = { borderRadius: 10, border: "1px solid #eceef5", fontSize: 13 };

const colorFor = (name) => {
  let h = 0;
  for (const c of String(name || "?")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};
const initials = (name) =>
  String(name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const Avatar = ({ name, size = 34 }) => (
  <span className="ad-avatar" style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.38 }}>
    {initials(name)}
  </span>
);

const Donut = ({ data, nameKey, colors }) => {
  const total = data.reduce((a, d) => a + d.count, 0);
  if (!total) return <p className="ad-empty-sm">No data yet.</p>;
  return (
    <div>
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie data={data.filter((d) => d.count > 0)} dataKey="count" nameKey={nameKey}
               innerRadius={52} outerRadius={76} paddingAngle={3} stroke="none">
            {data.filter((d) => d.count > 0).map((d) => (
              <Cell key={d[nameKey]} fill={colors[d[nameKey]] || "#cbd5e1"} />
            ))}
          </Pie>
          <Tooltip contentStyle={tip} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="ad-legend">
        {data.map((d) => (
          <li key={d[nameKey]}>
            <span><i className="ad-dot" style={{ background: colors[d[nameKey]] || "#cbd5e1" }} />{cap(d[nameKey])}</span>
            <b>{d.count} <small>({Math.round((100 * d.count) / total)}%)</small></b>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    getAnalytics()
      .then(setData)
      .catch((e) => setError(e?.response?.data?.message || "Could not load analytics."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <p className="ad-empty-sm">Loading analytics...</p>;
  if (error) {
    return (
      <div className="ad-warn">
        <span>{error}</span>
        <button className="ad-btn-ghost" onClick={load}>Retry</button>
      </div>
    );
  }

  const { kpis, status_breakdown, demand_by_category, bookings_per_month, sentiment_split, top_providers, forecast } = data;

  const chartData = bookings_per_month.map((m) => ({ month: m.month, bookings: m.bookings }));
  if (forecast) {
    if (chartData.length) chartData[chartData.length - 1].forecast = chartData[chartData.length - 1].bookings;
    chartData.push({ month: forecast.next_month, forecast: forecast.predicted });
  }

  const kpiItems = [
    { label: "Total bookings", value: kpis.total_bookings, sub: `${kpis.completed} completed`, c: "#6366f1" },
    { label: "Revenue", value: `$${Number(kpis.revenue || 0).toLocaleString()}`, sub: "from completed jobs", c: "#10b981" },
    { label: "Completion rate", value: `${kpis.completion_rate}%`, sub: "of all bookings", c: "#0ea5e9" },
    { label: "Cancellation rate", value: `${kpis.cancellation_rate}%`, sub: `${kpis.cancelled} cancelled`, c: "#ef4444" },
    { label: "Average rating", value: kpis.avg_rating ?? "-", sub: `${kpis.total_reviews} reviews`, c: "#f59e0b" },
    { label: "Positive reviews", value: kpis.positive_pct != null ? `${kpis.positive_pct}%` : "-", sub: "AI sentiment", c: "#8b5cf6" },
  ];

  const maxBookings = Math.max(1, ...top_providers.map((p) => p.bookings));

  return (
    <div>
      <div className="ad-an-head">
        <h2>Analytics</h2>
        <button className="ad-btn-ghost" onClick={load}>Refresh</button>
      </div>

      <div className="ad-kpis">
        {kpiItems.map((k) => (
          <div key={k.label} className="ad-card ad-kpi" style={{ "--c": k.c }}>
            <div className="ad-kpi-label">{k.label}</div>
            <div className="ad-kpi-value">{k.value}</div>
            <div className="ad-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="ad-row cols-2-1">
        <div className="ad-card">
          <div className="ad-card-head"><h3 className="ad-card-title">Bookings per month</h3></div>
          <div className="ad-card-body">
            {chartData.length === 0 ? (
              <p className="ad-empty-sm">No booking dates yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={tick} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={tick} />
                  <Tooltip contentStyle={tip} />
                  <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#6366f1" strokeWidth={2.5} fill="url(#adArea)" />
                  <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeWidth={2.5}
                        strokeDasharray="6 4" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
            {forecast ? (
              <div className="ad-forecast">
                <strong>Forecast {forecast.next_month}:</strong>
                <span>about <b>{forecast.predicted}</b> bookings</span>
                <span className={`ad-badge ${forecast.trend}`}>trend {forecast.trend}</span>
                <span className="ad-badge neutral">{forecast.confidence} confidence</span>
                <small>{forecast.method} ({forecast.months_used} months). {forecast.note}</small>
              </div>
            ) : (
              <small className="ad-sub">Forecast needs at least 2 months of data.</small>
            )}
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-card-head"><h3 className="ad-card-title">Demand by category</h3></div>
          <div className="ad-card-body">
            {demand_by_category.length === 0 ? (
              <p className="ad-empty-sm">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={demand_by_category} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f6" />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tick={tick} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={tick} />
                  <Tooltip contentStyle={tip} cursor={{ fill: "#f5f6fb" }} />
                  <Bar dataKey="count" name="Bookings" radius={[6, 6, 0, 0]}>
                    {demand_by_category.map((d, i) => (
                      <Cell key={d.category} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="ad-row cols-3">
        <div className="ad-card">
          <div className="ad-card-head"><h3 className="ad-card-title">Booking status</h3></div>
          <div className="ad-card-body"><Donut data={status_breakdown} nameKey="status" colors={STATUS_COLORS} /></div>
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3 className="ad-card-title">Review sentiment</h3></div>
          <div className="ad-card-body"><Donut data={sentiment_split} nameKey="sentiment" colors={SENTIMENT_COLORS} /></div>
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3 className="ad-card-title">Top providers</h3></div>
          <div className="ad-card-body">
            {top_providers.length === 0 ? (
              <p className="ad-empty-sm">No data yet.</p>
            ) : (
              <ul className="ad-rank">
                {top_providers.map((p) => (
                  <li key={p.provider}>
                    <Avatar name={p.provider} size={32} />
                    <div className="ad-rank-main">
                      <strong>{p.provider}</strong>
                      <span className="ad-sub">{p.bookings} bookings · {p.completed} done</span>
                      <div className="ad-meter"><span style={{ width: `${(100 * p.bookings) / maxBookings}%` }} /></div>
                    </div>
                    <span className="ad-rating">{p.avg_rating != null ? `★ ${p.avg_rating}` : "-"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}